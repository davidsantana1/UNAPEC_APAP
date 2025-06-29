from fastapi import FastAPI
from models import NominaInput
from storage import leer_json, guardar_json
from processor import crear_encabezado, crear_detalle

app = FastAPI()


@app.get("/nomina")
def obtener_nomina():
    data = leer_json()
    if not data:
        return {"mensaje": "No hay nómina registrada."}
    return data


@app.post("/nomina")
def agregar_nomina(payload: NominaInput):
    encabezado = crear_encabezado(payload.encabezado.dict())
    detalles = [crear_detalle(det.dict()) for det in payload.detalles]
    data = {"encabezado": encabezado, "detalles": detalles}
    guardar_json(data)
    return {"mensaje": "Nómina guardada exitosamente"}
