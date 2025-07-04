import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import {
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  AlertTriangleIcon,
  SettingsIcon
} from './icons'
import './animations.css'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<'frontman' | 'kitchen' | 'admin' | null>(null)
  
  const { login, isLoading } = useAuth()
  const { t, getFontSizeClass } = useConfig()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    const success = await login(username, password)
    if (!success) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  const handleRoleQuickSelect = (role: 'frontman' | 'kitchen' | 'admin') => {
    setSelectedRole(role)
    if (role === 'frontman') {
      setUsername('mesero')
      setPassword('123')
    } else if (role === 'kitchen') {
      setUsername('cocina')
      setPassword('123')
    } else if (role === 'admin') {
      setUsername('admin')
      setPassword('admin123')
    }
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 ${getFontSizeClass()}`}
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInSlide">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso al Sistema</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Quick Role Selection */}
        <div className="mb-6 animate-slideInUp" style={{ animationDelay: '200ms' }}>
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Acceso rápido por puesto:</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRoleQuickSelect('frontman')}
              className={`p-4 rounded border-2 transition-all duration-300 ${
                selectedRole === 'frontman'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded flex items-center justify-center">
                  <UserIcon size={16} className="text-blue-600" />
                </div>
                <div className="font-medium text-sm">Mesero/Frontman</div>
                <div className="text-xs text-gray-500 mt-1">Tomar órdenes</div>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleQuickSelect('kitchen')}
              className={`p-4 rounded border-2 transition-all duration-300 ${
                selectedRole === 'kitchen'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded flex items-center justify-center">
                  <img src="./cocina.png" alt="Chef" width={16} height={16} />
                </div>
                <div className="font-medium text-sm">Cocina</div>
                <div className="text-xs text-gray-500 mt-1">Gestionar órdenes</div>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleQuickSelect('admin')}
              className={`p-4 rounded border-2 transition-all duration-300 ${
                selectedRole === 'admin'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded flex items-center justify-center">
                  <SettingsIcon size={16} className="text-purple-600" />
                </div>
                <div className="font-medium text-sm">Administrador</div>
                <div className="text-xs text-gray-500 mt-1">Panel de control</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded shadow-xl border border-gray-200 p-8 animate-slideInUp" style={{ animationDelay: '300ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={20} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  placeholder=""
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  placeholder=""
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center space-x-2 animate-shake">
                <AlertTriangleIcon size={20} className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <LogInIcon size={20} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-600 mb-2">Usuarios de prueba:</p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-medium text-blue-700">Mesero/Frontman</p>
                  <p>Usuario: <span className="font-mono">mesero</span></p>
                  <p>Contraseña: <span className="font-mono">123</span></p>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <p className="font-medium text-orange-700">Cocina</p>
                  <p>Usuario: <span className="font-mono">cocina</span></p>
                  <p>Contraseña: <span className="font-mono">123</span></p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="font-medium text-purple-700">Administrador</p>
                  <p>Usuario: <span className="font-mono">admin</span></p>
                  <p>Contraseña: <span className="font-mono">admin123</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 