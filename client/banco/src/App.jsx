import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function BancoNominaTable() {
  const [nomina, setNomina] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchNomina = async () => {
    try {
      const res = await axios.get('http://localhost:8000/nomina')
      setNomina(res.data)
    } catch (error) {
      console.error('Error al obtener la nómina:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNomina()
  }, [])

  if (loading) return <p className="text-center mt-10">Cargando...</p>

  if (!nomina)
    return (
      <p className="text-center mt-10 text-red-500">
        No hay datos disponibles.
      </p>
    )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resumen de Nómina</h1>

      <div className="mb-8 border border-gray-300 rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Encabezado</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>
            <strong>Cantidad de empleados:</strong>{' '}
            {nomina.encabezado.cantidad_empleados}
          </li>
          <li>
            <strong>Código del banco:</strong> {nomina.encabezado.codigo_banco}
          </li>
          <li>
            <strong>Referencia del pago:</strong>{' '}
            {nomina.encabezado.referencia_pago}
          </li>
          <li>
            <strong>Total del monto:</strong> RD$
            {Number(nomina.encabezado.monto_total).toLocaleString()}
          </li>
          <li>
            <strong>RNC: </strong>
            {Number(nomina.encabezado.rnc)}
          </li>
          <li>
            <strong>Fecha del proceso: </strong>
            {nomina.encabezado.fecha_proceso}
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Detalles</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Cédula</th>
              <th className="border p-2">Cuenta</th>
              <th className="border p-2">Monto</th>
              <th className="border p-2">Tipo de cuenta</th>
              <th className="border p-2">Banco destino</th>
            </tr>
          </thead>
          <tbody>
            {nomina.detalles.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.cedula_empleado}</td>
                <td className="border p-2">{item.cuenta_empleado}</td>
                <td className="border p-2">
                  RD${Number(item.monto_a_pagar).toLocaleString()}
                </td>
                <td className="border p-2">
                  {item.tipo_de_cuenta === 'Cuenta Corriente'
                    ? 'Corriente'
                    : 'Ahorros'}
                </td>
                <td className="border p-2">{item.codigo_banco_destino}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
