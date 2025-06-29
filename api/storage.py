import json
import os

ARCHIVO_JSON = "data/nomina.json"


def leer_json():
    if not os.path.exists(ARCHIVO_JSON):
        return None
    with open(ARCHIVO_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_json(data):
    with open(ARCHIVO_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
