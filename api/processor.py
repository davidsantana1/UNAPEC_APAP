from datetime import datetime
from utils import RNC_UNAPEC, NO_CUENTA_UNAPEC


def crear_encabezado(data):
    fecha_proceso = datetime.today().strftime("%Y-%m-%d")
    return {
        "rnc": RNC_UNAPEC,
        "fecha_proceso": fecha_proceso,
        "cantidad_empleados": data["cantidad_de_empleados"],
        "no_cuenta": NO_CUENTA_UNAPEC,
        "codigo_banco": data["codigo_del_banco"],
        "referencia_pago": data["referencia_del_pago"],
        "monto_total": data["total_de_monto"],
    }


def crear_detalle(data):
    return {
        "cedula_empleado": data["cedula_empleado"],
        "cuenta_empleado": data["cuenta_empleado"],
        "monto_a_pagar": data["monto_a_pagar"],
        "tipo_de_cuenta": (
            "Cuenta Corriente" if data["tipo_de_cuenta"] == "C" else "Cuenta de Ahorros"
        ),
        "codigo_banco_destino": data["codigo_banco_destino"],
    }
