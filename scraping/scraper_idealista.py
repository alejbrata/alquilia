import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

# 1. Configurar la URL de búsqueda
# Ejemplo: alquileres en Madrid ciudad
url = "https://www.idealista.com/alquiler-viviendas/madrid-madrid/"

# 2. Crear cabeceras falsas para simular que somos un navegador
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/123.0.0.0 Safari/537.36",
    "Accept-Language": "es-ES,es;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Connection": "keep-alive",
}


# 3. Hacer la petición
response = requests.get(url, headers=headers)

# 4. Comprobar que la respuesta es correcta
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 5. Buscar los anuncios
    anuncios = soup.find_all('article', class_="item")

    print(f"Encontrados {len(anuncios)} anuncios.\n")
    
    for anuncio in anuncios[:5]:  # Solo los 5 primeros para empezar
        titulo_tag = anuncio.find('a', class_="item-link")
        precio_tag = anuncio.find('span', class_="item-price")

        if titulo_tag and precio_tag:
            titulo = titulo_tag.get_text(strip=True)
            precio = precio_tag.get_text(strip=True)
            enlace = "https://www.idealista.com" + titulo_tag['href']

            print(f"Título: {titulo}")
            print(f"Precio: {precio}")
            print(f"Enlace: {enlace}")
            print("-" * 40)
else:
    print("Error al acceder a Idealista:", response.status_code)
