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

# --- Config Dolly (HuggingFace Inference API) ---
HF_TOKEN = os.getenv("HF_HUB_TOKEN")
HF_URL   = "https://api-inference.huggingface.co/models/distilgpt2"
if not HF_TOKEN:
    raise RuntimeError("Define la variable HF_HUB_TOKEN con tu token de Hugging Face")

app = FastAPI()
# ¡Esto debe ir justo después de instanciar `app`!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # permite peticiones desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, PUT, DELETE…
    allow_headers=["*"],            # Content-Type, Authorization…
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
    r = requests.post(
        TOKEN_URL,
        headers={
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={"grant_type": "client_credentials", "scope": "read"}
    )
    r.raise_for_status()
    return r.json()["access_token"]

def geocode(zona: str) -> str:
    r = requests.get(
        GEOCODE_URL,
        params={"q": zona, "format": "json", "limit": 1},
        headers={"User-Agent": "AlquilIA/1.0"}
    )
    r.raise_for_status()
    arr = r.json()
    if not arr:
        raise HTTPException(404, detail=f"No encontramos coords para '{zona}'")
    return f"{arr[0]['lat']},{arr[0]['lon']}"

@app.post("/buscar-viviendas")
def buscar_viviendas(body: SearchRequest):
    # 1) Geocode
    center = geocode(body.zona)
    time.sleep(1)
    # 2) Token Idealista
    token = obtener_token()
    # 3) Llamada Idealista
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
    r = requests.post(SEARCH_URL, headers=headers, data=form)
    if r.status_code != 200:
        raise HTTPException(r.status_code, r.json().get("message","Error Idealista"))
    # 4) Parseo y enriquecimiento
    out = []
    for el in r.json().get("elementList", []):
        out.append({
            "titulo":      el.get("title","–"),
            "precio":      f"{el.get('price','–')}€",
            "zona":        el.get("address","–"),
            "enlace":      f"https://www.idealista.com/inmueble/{el.get('propertyCode')}/",
            "imagen":      el.get("thumbnail"),                
            "metros":      el.get("size","–"),
            "habitaciones":el.get("rooms","–"),
            "banos":       el.get("bathrooms","–"),
            "terraza":     el.get("terrace", False),
            "lat":         el.get("latitude"),
            "lon":         el.get("longitude"),
        })
    return out

@app.post("/generar-informe")
def generar_informe(req: InformeRequest):
    # 5) Montar prompt
    prompt = (
        f"Informe de vivienda para inquilino en español:\n"
        f"- Título: {req.titulo}\n"
        f"- Precio: {req.precio}\n"
        f"- Zona: {req.zona}\n"
        f"- Metros²: {req.metros}\n"
        f"- Habitaciones: {req.habitaciones}\n"
        f"- Baños: {req.banos}\n"
        f"- Terraza: {'Sí' if req.terraza else 'No'}\n"
        f"- Enlace: {req.enlace}\n\n"
        "Por favor, aconseja al inquilino si el precio es adecuado para la zona, "
        "duración habitual del anuncio, recomendaciones y conclusiones breves."
    )
    # Llamada a HF Inference API
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": 256}}
    r = requests.post(HF_URL, headers=headers, json=payload)
    r.raise_for_status()
    text = r.json()[0]["generated_text"]
    return {"informe": text}
