import { createContext, useContext, useState, ReactNode } from 'react'

export interface OrderItem {
  id: string
  name: string
  category: string
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  table: number
  guests: number
  items: OrderItem[]
  status: 'new' | 'in-preparation' | 'ready'
  timestamp: string
  waiter?: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  getOrdersByStatus: (status: Order['status']) => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

interface OrderProviderProps {
  children: ReactNode
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = (orderData: Omit<Order, 'id' | 'status' | 'timestamp'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'new',
      timestamp: new Date().toISOString()
    }
    
    setOrders(prev => [...prev, newOrder])
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status)
  }

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrdersByStatus
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
} 