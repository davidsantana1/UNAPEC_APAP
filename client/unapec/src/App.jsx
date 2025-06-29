import { useEffect, useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

export default function App() {
  const [_, setNomina] = useState(null)
  const [formData, setFormData] = useState({
    encabezado: {
      cantidad_de_empleados: 1,
      codigo_del_banco: '',
      referencia_del_pago: '',
      total_de_monto: 0,
    },
    detalles: [
      {
        cedula_empleado: '',
        cuenta_empleado: '',
        monto_a_pagar: 0,
        tipo_de_cuenta: 'C',
        codigo_banco_destino: '',
      },
    ],
  })

  const fetchNomina = async () => {
    try {
      const res = await axios.get('http://localhost:8000/nomina')
      setNomina(res.data)
    } catch (error) {
      console.error('Error al obtener nómina:', error)
    }
  }

  useEffect(() => {
    fetchNomina()
  }, [])

  useEffect(() => {
    const total = formData.detalles.reduce(
      (acc, emp) => acc + Number(emp.monto_a_pagar || 0),
      0
    )
    setFormData((prev) => ({
      ...prev,
      encabezado: {
        ...prev.encabezado,
        total_de_monto: total,
      },
    }))
  }, [formData.detalles])

  const handleInputChange = (e, section, index = 0) => {
    const { name, value } = e.target
    if (section === 'encabezado') {
      setFormData({
        ...formData,
        encabezado: {
          ...formData.encabezado,
          [name]: name === 'cantidad_de_empleados' ? Number(value) : value,
        },
      })
    } else if (section === 'detalle') {
      const newDetalles = [...formData.detalles]
      newDetalles[index] = {
        ...newDetalles[index],
        [name]: name === 'monto_a_pagar' ? Number(value) : value,
      }
      setFormData({ ...formData, detalles: newDetalles })
    }
  }

  const handleEmpleadoCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10)
    if (isNaN(newCount) || newCount < 1) return

    const current = formData.detalles.length
    let nuevosDetalles = [...formData.detalles]

    if (newCount > current) {
      for (let i = 0; i < newCount - current; i++) {
        nuevosDetalles.push({
          cedula_empleado: '',
          cuenta_empleado: '',
          monto_a_pagar: 0,
          tipo_de_cuenta: 'C',
          codigo_banco_destino: '',
        })
      }
    } else if (newCount < current) {
      nuevosDetalles = nuevosDetalles.slice(0, newCount)
    }

    setFormData({
      ...formData,
      encabezado: {
        ...formData.encabezado,
        cantidad_de_empleados: newCount,
      },
      detalles: nuevosDetalles,
    })
  }

  const addEmpleado = () => {
    const nuevosDetalles = [
      ...formData.detalles,
      {
        cedula_empleado: '',
        cuenta_empleado: '',
        monto_a_pagar: 0,
        tipo_de_cuenta: 'C',
        codigo_banco_destino: '',
      },
    ]

    setFormData({
      ...formData,
      encabezado: {
        ...formData.encabezado,
        cantidad_de_empleados: nuevosDetalles.length,
      },
      detalles: nuevosDetalles,
    })
  }

  const removeEmpleado = (index) => {
    const newDetalles = [...formData.detalles]
    newDetalles.splice(index, 1)
    setFormData({
      ...formData,
      detalles: newDetalles,
      encabezado: {
        ...formData.encabezado,
        cantidad_de_empleados: newDetalles.length,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/nomina', formData)
      toast.success('Nómina enviada con éxito')
      fetchNomina()
      setFormData({
        encabezado: {
          cantidad_de_empleados: 1,
          codigo_del_banco: '',
          referencia_del_pago: '',
          total_de_monto: 0,
        },
        detalles: [
          {
            cedula_empleado: '',
            cuenta_empleado: '',
            monto_a_pagar: 0,
            tipo_de_cuenta: 'C',
            codigo_banco_destino: '',
          },
        ],
      })
    } catch (error) {
      toast.error('Error al enviar nómina')
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Nómina UNAPEC</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="text-lg font-semibold px-2">Encabezado</legend>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block mb-1 font-medium">
                Cantidad de empleados
              </label>
              <input
                type="number"
                name="cantidad_de_empleados"
                value={formData.encabezado.cantidad_de_empleados}
                onChange={handleEmpleadoCountChange}
                required
                min={1}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Código del banco</label>
              <input
                type="text"
                name="codigo_del_banco"
                value={formData.encabezado.codigo_del_banco}
                onChange={(e) => handleInputChange(e, 'encabezado')}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Referencia del pago
              </label>
              <input
                type="text"
                name="referencia_del_pago"
                value={formData.encabezado.referencia_del_pago}
                onChange={(e) => handleInputChange(e, 'encabezado')}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Total de monto</label>
              <input
                type="number"
                name="total_de_monto"
                value={formData.encabezado.total_de_monto}
                disabled
                className="border cursor-not-allowed p-2 rounded w-full bg-gray-100 text-gray-600"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="text-lg font-semibold px-2">Empleados</legend>
          {formData.detalles.map((empleado, idx) => (
            <div key={idx} className="border p-4 mb-4 rounded relative">
              <h3 className="text-lg font-bold mb-3">Empleado #{idx + 1}</h3>
              {formData.detalles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmpleado(idx)}
                  className="absolute cursor-pointer top-0 right-2 hover:text-red-600 text-red-500 text-2xl"
                >
                  &times;
                </button>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Cédula</label>
                  <input
                    type="text"
                    name="cedula_empleado"
                    value={empleado.cedula_empleado}
                    onChange={(e) => handleInputChange(e, 'detalle', idx)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Cuenta</label>
                  <input
                    type="text"
                    name="cuenta_empleado"
                    value={empleado.cuenta_empleado}
                    onChange={(e) => handleInputChange(e, 'detalle', idx)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Monto</label>
                  <input
                    type="number"
                    name="monto_a_pagar"
                    value={empleado.monto_a_pagar}
                    onChange={(e) => handleInputChange(e, 'detalle', idx)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Tipo de cuenta</label>
                  <select
                    name="tipo_de_cuenta"
                    value={empleado.tipo_de_cuenta}
                    onChange={(e) => handleInputChange(e, 'detalle', idx)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="C">Corriente</option>
                    <option value="A">Ahorros</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Banco destino</label>
                  <input
                    type="text"
                    name="codigo_banco_destino"
                    value={empleado.codigo_banco_destino}
                    onChange={(e) => handleInputChange(e, 'detalle', idx)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEmpleado}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Agregar empleado
          </button>
        </fieldset>

        <button
          type="submit"
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold"
        >
          Enviar Nómina
        </button>
      </form>
    </div>
  )
}
