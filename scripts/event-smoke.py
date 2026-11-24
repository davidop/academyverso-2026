#!/usr/bin/env python3
"""Read-only event preflight: public endpoints only, no credentials or mutations."""
import json
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE = "https://davidop.github.io/academyverso-2026/"
API = "https://academyverso-api.david-oliva-paredes.workers.dev/"
HEADERS = {"User-Agent": "AcademyVerso-Event-Preflight/1.0", "Accept": "application/json,text/html"}
CHECKS = [
    ("portal", BASE + "sesion.html", ["GitHub Mobile", "Grand Terraforming Agents"]),
    ("galaxia", BASE, ["travel-to-world", "grand-terraforming-agents"]),
    ("presentación", BASE + "presentation/", ["AcademyVerso"]),
]

def get(url):
    last_error = None
    for attempt in range(4):
        try:
            with urlopen(Request(url, headers=HEADERS), timeout=18) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}")
                return response.read(800_000).decode("utf-8", errors="replace")
        except (HTTPError, URLError, TimeoutError, RuntimeError) as error:
            last_error = error
            if attempt < 3:
                time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"{url}: {last_error}") from last_error

def main():
    failures = []
    for label, url, expected in CHECKS:
        try:
            content = get(url)
            for fragment in expected:
                if fragment not in content:
                    raise AssertionError(f"Falta {fragment!r} en HTML")
            print(f"PASS {label}: HTML y referencias esenciales")
        except Exception as error:
            failures.append(f"{label}: {error}")
            print(f"FAIL {label}: {error}")

    try:
        health = json.loads(get(API + "api/health"))
        for key in ("ok", "database_connected", "create_enabled"):
            if health.get(key) is not True:
                raise AssertionError(f"health.{key} no es true")
        print("PASS health: Worker/D1 y creación activados")
    except Exception as error:
        failures.append(f"health: {error}")
        print(f"FAIL health: {error}")

    try:
        payload = json.loads(get(API + "api/objects"))
        objects = payload.get("objects")
        if not isinstance(objects, list):
            raise AssertionError("El campo objects no es una lista")
        existing = {int(obj.get("issue_number", -1)) for obj in objects}
        missing = {10, 11} - existing
        if missing:
            raise AssertionError(f"No constan los objetos de ensayo: {sorted(missing)}")
        print(f"PASS objects: {len(objects)} objetos; ensayo #10 y #11 presentes")
    except Exception as error:
        failures.append(f"objects: {error}")
        print(f"FAIL objects: {error}")

    if failures:
        print("\nNO-GO técnico (validar incidencias antes de la sesión):")
        for failure in failures:
            print("- " + failure)
        raise SystemExit(1)
    print("\nGO técnico de endpoints. Quedan pendientes pruebas físicas, móvil, QR y agentes.")

if __name__ == "__main__":
    main()
