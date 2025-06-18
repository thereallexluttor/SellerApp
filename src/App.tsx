import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="transition-all duration-300 ml-16">
        <Dashboard />
      </div>
    </div>
  )
}

export default App 