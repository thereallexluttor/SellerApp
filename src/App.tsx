import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { TakeOrder } from './components/TakeOrder'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'take-order':
        return <TakeOrder />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {/* Main Content */}
      <div className="transition-all duration-300 ml-16">
        {renderCurrentPage()}
      </div>
    </div>
  )
}

export default App 