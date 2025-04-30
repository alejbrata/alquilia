# scraping_api.py
import os
import time
import base64
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Config Idealista ---
API_KEY    = "8qec503vl9dqonvo1zjzfyh70rlc72rr"
API_SECRET = "TTn4aIW0aRXq"
TOKEN_URL   = "https://api.idealista.com/oauth/token"
SEARCH_URL  = "https://api.idealista.com/3.5/es/search"
GEOCODE_URL = "https://nominatim.openstreetmap.org/search"

# --- Config Hugging Face ---
HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if not HF_TOKEN:
    raise RuntimeError("❌ Define HUGGINGFACEHUB_API_TOKEN en tus variables de entorno")

# Modelo hardcodeado, ya no necesitas definirlo externamente
HF_MODEL = "bigscience/bloom-1b7"

HF_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    zona: str
    precio_maximo: int

class InformeRequest(BaseModel):
    titulo: str
    precio: str
    zona: str
    enlace: str
    imagen: str | None = None
    metros: str | int
    habitaciones: str | int
    banos: str | int
    terraza: bool

def obtener_token() -> str:
    auth = base64.b64encode(f"{API_KEY}:{API_SECRET}".encode()).decode()
    resp = requests.post(
        TOKEN_URL,
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={"grant_type": "client_credentials", "scope": "read"}
    )
    resp.raise_for_status()
    return resp.json()["access_token"]

def geocode(zona: str) -> str:
    resp = requests.get(
        GEOCODE_URL,
        params={"q": zona, "format": "json", "limit": 1},
        headers={"User-Agent": "AlquilIA/1.0"}
    )
    resp.raise_for_status()
    datos = resp.json()
    if not datos:
        raise HTTPException(404, detail=f"No encontramos coords para '{zona}'")
    return f"{datos[0]['lat']},{datos[0]['lon']}"

@app.post("/buscar-viviendas")
def buscar_viviendas(body: SearchRequest):
    # Geocoding
    center = geocode(body.zona)
    time.sleep(1)  # respetar rate limit de Nominatim

    # Token Idealista
    token = obtener_token()

    # Llamada a Idealista
    headers = {"Authorization": f"Bearer {token}"}
    form = {
        "operation":    "rent",
        "propertyType": "homes",
        "center":       center,
        "distance":     "1000",
        "maxPrice":     str(body.precio_maximo),
        "numPage":      "1",
        "maxItems":     "10",
        "order":        "price",
        "sort":         "desc",
        "locale":       "es"
    }
    resp = requests.post(SEARCH_URL, headers=headers, data=form)
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, resp.json().get("message","Error Idealista"))

    # Parseo
    salida = []
    for el in resp.json().get("elementList", []):
        salida.append({
            "titulo":       el.get("title", "–"),
            "precio":       f"{el.get('price','–')}€",
            "zona":         el.get("address","–"),
            "enlace":       f"https://www.idealista.com/inmueble/{el.get('propertyCode')}/",
            "imagen":       el.get("thumbnail"),
            "metros":       el.get("size","–"),
            "habitaciones": el.get("rooms","–"),
            "banos":        el.get("bathrooms","–"),
            "terraza":      el.get("terrace", False),
            "lat":          el.get("latitude"),
            "lon":          el.get("longitude"),
        })
    return salida

@app.post("/generar-informe")
def generar_informe(req: InformeRequest):
    # Construir prompt
    prompt = (
        "Informe de vivienda para inquilino en español:\n"
        f"- Título: {req.titulo}\n"
        f"- Precio: {req.precio}\n"
        f"- Zona: {req.zona}\n"
        f"- Metros²: {req.metros}\n"
        f"- Habitaciones: {req.habitaciones}\n"
        f"- Baños: {req.banos}\n"
        f"- Terraza: {'Sí' if req.terraza else 'No'}\n"
        f"- Enlace: {req.enlace}\n\n"
        "Por favor, aconseja al inquilino si el precio es adecuado para la zona, "
        "duración típica del anuncio, recomendaciones y conclusiones breves."
    )

    # Llamada a HF Inference API
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": prompt, 
        "options": {"wait_for_model": True},
        "parameters": {"max_new_tokens": 256, "temperature": 0.2}
    }
    resp = requests.post(HF_URL, headers=headers, json=payload)
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        # Si da error de cola o espera, devolvemos el código y mensaje
        raise HTTPException(resp.status_code, f"HF Inference Error: {resp.text}")

    # La respuesta suele ser lista con dict {"generated_text": "..."}
    data = resp.json()
    text = data[0].get("generated_text", "").strip()
    return {"informe": text}
