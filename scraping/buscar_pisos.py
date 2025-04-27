import requests
from bs4 import BeautifulSoup

def buscar_pisos(zona, precio_maximo):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    # Adaptar la zona a formato idealista en URL
    zona_url = zona.lower().replace(" ", "-")

    # URL de búsqueda básica
    url = f"https://www.idealista.com/venta-viviendas/{zona_url}/"

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Error al acceder a Idealista: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    anuncios = soup.find_all('article', class_='item')

    resultados = []

    for anuncio in anuncios:
        titulo = anuncio.find('a', class_='item-link')
        precio = anuncio.find('span', class_='item-price')

        if titulo and precio:
            precio_num = int(''.join(filter(str.isdigit, precio.text)))

            if precio_num <= int(precio_maximo):
                resultados.append({
                    "titulo": titulo.text.strip(),
                    "precio": precio_num,
                    "link": "https://www.idealista.com" + titulo['href']
                })

    print(f"\n🏠 Resultados para zona '{zona}' y precio máximo {precio_maximo}€:\n")
    for r in resultados:
        print(f"🏡 {r['titulo']} - {r['precio']}€\n🔗 {r['link']}\n")

# Ejemplo de uso:
if __name__ == "__main__":
    zona_input = input("Introduce la zona a buscar: ")
    precio_input = input("Introduce el precio máximo: ")
    buscar_pisos(zona_input, precio_input)
