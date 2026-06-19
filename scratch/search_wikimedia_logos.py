import urllib.request
import json
import urllib.parse

queries = [
    "Spintek logo",
    "Value tools logo",
    "BPI logo",
    "Pasio logo",
    "Zilax logo",
    "Vika logo",
    "Banco Products logo"
]

print("Searching Wikimedia Commons API...")
for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&format=json"
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            results = data.get("query", {}).get("search", [])
            print(f"Query: '{q}' -> Found {len(results)} results")
            for r in results[:2]:
                print(f"  - Title: {r['title']}")
    except Exception as e:
        print(f"Error searching '{q}': {e}")
