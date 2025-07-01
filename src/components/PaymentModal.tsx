import { useState } from 'react'
import { useConfig } from '../contexts/ConfigContext'

interface OrderItem {
  name: string
  quantity: number
  price: number
  notes?: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  tableData: {
    number: number
    orderTotal?: number
    orderDetails?: OrderItem[]
    timeOccupied: string
    guests: number
  }
  onProcessPayment: (method: string) => void
}

const PaymentMethods = [
  {
    id: 'qr',
    name: 'Pago QR',
    icon: <img src="/src/public/qr-code.png" alt="QR" className="w-12 h-12" />,
    description: 'Pago con QR'
  },
  {
    id: 'card',
    name: 'Tarjeta',
    icon: <img src="/src/public/credit-cards.png" alt="Tarjeta" className="w-12 h-12" />,
    description: 'Débito o Crédito'
  },
  {
    id: 'cash',
    name: 'Efectivo',
    icon: <img src="/src/public/money.png" alt="Efectivo" className="w-12 h-12" />,
    description: 'Pago en efectivo'
  }
]

export function PaymentModal({ isOpen, onClose, tableData, onProcessPayment }: PaymentModalProps) {
  const { t, formatCurrency } = useConfig()
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    if (!selectedMethod) return
    
    setIsProcessing(true)
    // Aquí iría la lógica real de procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulación de proceso
    onProcessPayment(selectedMethod)
    setIsProcessing(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Procesar Pago - Mesa {tableData.number}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Tiempo ocupado: {tableData.timeOccupied} • {tableData.guests} personas
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h3>
            <div className="space-y-2">
              {(tableData.orderDetails || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-600 font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total a Pagar</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(tableData.orderTotal || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Método de Pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PaymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-md border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12">{method.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{method.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className={`px-6 py-2 rounded-md font-medium text-white transition-all ${
                !selectedMethod || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando...</span>
                </span>
              ) : (
                'Procesar Pago'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 