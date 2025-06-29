from pydantic import BaseModel, constr
from typing import List, Annotated


class EncabezadoInput(BaseModel):
    cantidad_de_empleados: int
    codigo_del_banco: Annotated[str, constr(min_length=3, max_length=5)]
    referencia_del_pago: Annotated[str, constr(max_length=15)]
    total_de_monto: int


class DetalleInput(BaseModel):
    cedula_empleado: Annotated[str, constr(min_length=11, max_length=11)]
    cuenta_empleado: Annotated[str, constr(min_length=8, max_length=20)]
    monto_a_pagar: int
    tipo_de_cuenta: Annotated[str, constr(pattern="^(C|A)$")]
    codigo_banco_destino: str


class NominaInput(BaseModel):
    encabezado: EncabezadoInput
    detalles: List[DetalleInput]
