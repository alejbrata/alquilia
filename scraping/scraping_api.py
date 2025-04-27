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
    print(f"Zona={body.zona!r}, Precio≤{body.precio_maximo}")
    center = geocode(body.zona); time.sleep(1)
    token  = obtener_token()

    headers = {"Authorization": f"Bearer {token}"}
    form_data = {
        "operation":    "rent",                  # obligatorio
        "propertyType": "homes",                 # obligatorio
        "center":       center,                  # "lat,lon"
        "distance":     "1000",
        "maxPrice":     str(body.precio_maximo),
        "numPage":      "1",
        "maxItems":     "10",
        "order":        "price",                 # <-- campo por el que ordenas
        "sort":         "desc",                  # <-- dirección
        "locale":       "es"
    }

    resp = requests.post(SEARCH_URL, headers=headers, data=form_data)
    print("Idealista status:", resp.status_code, resp.text[:300])
    if resp.status_code != 200:
        return {"error": resp.json().get("message")}

    elementos = resp.json().get("elementList", [])
    return [
        {
            "titulo": el.get("title","–"),
            "precio": f"{el.get('price','–')}€",
            "zona":   el.get("address","–"),
            "enlace": f"https://www.idealista.com/inmueble/{el.get('propertyCode')}/"
        }
        for el in elementos
    ]
