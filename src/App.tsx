import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { TakeOrder } from './components/TakeOrder'
import { PaymentHistory } from './components/PaymentHistory'
import './components/animations.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousPage, setPreviousPage] = useState('')

  // Handle page navigation with smooth transitions
  const handlePageNavigation = (newPage: string) => {
    if (newPage === currentPage) return

    // Start transition
    setIsTransitioning(true)
    setPreviousPage(currentPage)

    // Short delay to allow exit animation
    setTimeout(() => {
      setCurrentPage(newPage)
      
      // End transition after enter animation completes
      setTimeout(() => {
        setIsTransitioning(false)
        setPreviousPage('')
      }, 400)
    }, 100)
  }

  const renderCurrentPage = () => {
    const pageContent = (() => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />
        case 'take-order':
          return <TakeOrder />
        case 'payment-history':
          return <PaymentHistory />
        default:
          return <Dashboard />
      }
    })()

    return (
      <div 
        key={currentPage}
        className={`page-content ${
          isTransitioning ? 'page-loading' : 'page-enter'
        }`}
      >
        {pageContent}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar 
        onNavigate={handlePageNavigation} 
        currentPage={currentPage} 
      />
      
      {/* Main Content with Transition Container */}
      <div className="transition-all duration-300 ml-16">
        <div className="page-transition-container main-content-transition">
          {renderCurrentPage()}
        </div>
      </div>
      
      {/* Optional: Loading overlay during transitions */}
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-4 right-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600 font-medium">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 