# scraping_api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import base64
import time

API_KEY    = "8qec503vl9dqonvo1zjzfyh70rlc72rr"
API_SECRET = "TTn4aIW0aRXq"

TOKEN_URL   = "https://api.idealista.com/oauth/token"
SEARCH_URL  = "https://api.idealista.com/3.5/es/search"
GEOCODE_URL = "https://nominatim.openstreetmap.org/search"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

class SearchRequest(BaseModel):
    zona: str
    precio_maximo: int

def obtener_token() -> str:
    creds = f"{API_KEY}:{API_SECRET}".encode()
    auth = base64.b64encode(creds).decode()
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
        params={"q": zona, "format": "json", "limit": 1, "accept-language": "es"},
        headers={"User-Agent": "AlquilIA/1.0"}
    )
    resp.raise_for_status()
    arr = resp.json()
    if not arr:
        raise Exception(f"No coords para '{zona}'")
    lat, lon = arr[0]["lat"], arr[0]["lon"]
    return f"{lat},{lon}"

@app.post("/buscar-viviendas")
def buscar_viviendas(body: SearchRequest):
    # 1. Geocoding
    center = geocode(body.zona)
    time.sleep(1)
    # 2. Token
    token = obtener_token()

    # 3. Llamada a Idealista
    headers = {"Authorization": f"Bearer {token}"}
    form_data = {
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
    resp = requests.post(SEARCH_URL, headers=headers, data=form_data)
    if resp.status_code != 200:
        # error genérico
        return {"error": resp.json().get("message", "Error de Idealista")}

    # 4. Parsear respuesta
    elementos = resp.json().get("elementList", [])

    # 5. Construir lista con campos nuevos
    resultado = []
    for el in elementos:
        resultado.append({
            "titulo":     el.get("title", "–"),
            "precio":     f"{el.get('price', '–')}€",
            "zona":       el.get("address", "–"),
            "enlace":     f"https://www.idealista.com/inmueble/{el.get('propertyCode')}/",
            "imagen":     el.get("thumbnail"),               # URL miniatura
            "metros":     el.get("size", "–"),                # m²
            "habitaciones": el.get("rooms", "–"),
            "banos":      el.get("bathrooms", "–"),
            "terraza":    el.get("terrace", False),           # booleano
            "lat":        el.get("latitude"),
            "lon":        el.get("longitude"),
        })
    return resultado
