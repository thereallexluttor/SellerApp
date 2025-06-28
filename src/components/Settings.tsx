import { useState, useEffect } from 'react'
import { useConfig } from '../contexts/ConfigContext'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import {
  CheckIcon,
  SettingsIcon
} from './icons'

// Componente para el ícono de vista previa personalizado
const PreviewIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/mesa.png" 
    alt="Vista Previa" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de paleta personalizado
const PaletteIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/Trending_Up.png" 
    alt="Personalización" 
    width={size} 
    height={size} 
    className={className}
  />
)

export function Settings() {
  const [isLoading, setIsLoading] = useState(true)
  const [showSavedNotification, setShowSavedNotification] = useState(false)

  const { 
    language, 
    currency, 
    fontSize,
    tempLanguage,
    tempCurrency, 
    tempFontSize,
    setTempLanguage, 
    setTempCurrency, 
    setTempFontSize,
    saveChanges,
    hasUnsavedChanges,
    t, 
    formatCurrency,
    getFontSizeClass,
    convertFromUSD,
    exchangeRates,
    ratesLoading,
    ratesError
  } = useConfig()

  useEffect(() => {
    // Simulate loading with shorter delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleSaveSettings = () => {
    saveChanges()
    setShowSavedNotification(true)
    setTimeout(() => {
      setShowSavedNotification(false)
    }, 3000)
  }

  const languageOptions = [
    { value: 'es', label: t('spanish'), flag: '🇪🇸' },
    { value: 'en', label: t('english'), flag: '🇺🇸' },
    { value: 'de', label: t('german'), flag: '🇩🇪' }
  ]

  const currencyOptions = [
    { value: 'EUR', label: t('euro'), symbol: '€' },
    { value: 'USD', label: t('dollar'), symbol: '$' },
    { value: 'COP', label: t('colombianPeso'), symbol: '$' }
  ]

  // Función para formatear moneda con configuración temporal usando el contexto
  const formatTempCurrency = (usdAmount: number) => {
    const symbol = currencyOptions.find(c => c.value === tempCurrency)?.symbol || '€'
    const currencyCode = tempCurrency.toLowerCase()
    const rate = exchangeRates[currencyCode] || 1
    const convertedAmount = usdAmount * rate
    
    return new Intl.NumberFormat(tempLanguage === 'es' ? 'es-ES' : tempLanguage === 'en' ? 'en-US' : 'de-DE', {
      style: 'decimal',
      minimumFractionDigits: tempCurrency === 'COP' ? 0 : 2,
      maximumFractionDigits: tempCurrency === 'COP' ? 0 : 2
    }).format(convertedAmount) + ' ' + symbol
  }

  return (
    <div 
      className={`h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`} 
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-6">
        
        {/* Saved Notification */}
        {showSavedNotification && (
          <div className="fixed top-4 right-4 z-50 animate-slideInUp">
            <div className="bg-green-500 text-white px-6 py-4 rounded shadow-lg flex items-center space-x-3">
              <CheckIcon size={24} />
              <div>
                <span className="font-bold">{t('settingsSaved')}</span>
                <p className="text-sm opacity-90">{t('appliedToApp')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Rates Loading/Error Notification */}
        {(ratesLoading || ratesError) && (
          <div className="fixed top-4 left-4 z-50 animate-slideInUp">
            <div className={`${ratesError ? 'bg-yellow-500' : 'bg-blue-500'} text-white px-6 py-4 rounded shadow-lg flex items-center space-x-3`}>
              {ratesLoading && (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {ratesError && <span>⚠️</span>}
              <div>
                <span className="font-bold">
                  {ratesLoading ? 'Cargando tasas de cambio...' : 'Usando tasas de fallback'}
                </span>
                {ratesError && (
                  <p className="text-sm opacity-90">Las conversiones son aproximadas</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header - Homogeneizado con otras páginas */}
        <div className="mb-8 animate-fadeInSlide">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            {t('settingsTitle')}
          </h1>
          <p className="text-gray-600 font-medium">
            {t('settingsSubtitle')} • {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : 'de-DE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Main Layout: Configuration + Preview */}
        <div className="flex gap-8 max-w-7xl mx-auto">
          
          {/* Configuration Panel */}
          <div className="flex-1 max-w-3xl">
            <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '200ms' }}>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <PaletteIcon size={20} className="text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{t('customization')}</h3>
                    <p className="text-sm text-gray-600 mt-1">{t('customizeAppAppearance')}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-10">
                
                {/* Language Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                    {t('language')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTempLanguage(option.value as any)}
                        className={`w-full p-4 rounded border-2 transition-all duration-200 flex items-center justify-between text-left ${
                          tempLanguage === option.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-3xl mr-4">{option.flag}</span>
                          <div>
                            <span className="font-semibold text-black">{option.label}</span>
                            <span className="text-sm text-black opacity-70 block">{option.value.toUpperCase()}</span>
                          </div>
                        </div>
                        {tempLanguage === option.value && (
                          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckIcon size={14} className="text-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                    {t('currency')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currencyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTempCurrency(option.value as any)}
                        className={`w-full p-4 rounded border-2 transition-all duration-200 flex items-center justify-between text-left ${
                          tempCurrency === option.value
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-black mr-4 w-8 text-center">{option.symbol}</span>
                          <div>
                            <span className="font-semibold text-black">{option.label}</span>
                            <span className="text-sm text-black opacity-70 block break-all leading-tight">
                              {formatTempCurrency(29.99)}
                            </span>
                            {!ratesLoading && exchangeRates[option.value.toLowerCase()] && (
                              <span className="text-xs text-gray-500 block break-all leading-tight">
                                1 USD = {exchangeRates[option.value.toLowerCase()].toFixed(option.value === 'COP' ? 0 : 4)} {option.symbol}
                              </span>
                            )}
                          </div>
                        </div>
                        {tempCurrency === option.value && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckIcon size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exchange Rate Info */}
                {!ratesLoading && Object.keys(exchangeRates).length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600">🔄</span>
                      <h5 className="font-semibold text-blue-900 text-sm">
                        {tempLanguage === 'es' ? 'Tasas de Cambio Actuales' : 
                         tempLanguage === 'en' ? 'Current Exchange Rates' : 
                         'Aktuelle Wechselkurse'}
                      </h5>
                    </div>
                    <p className="text-blue-700 text-xs mb-3">
                      {tempLanguage === 'es' ? 'Los precios se convierten automáticamente desde USD' : 
                       tempLanguage === 'en' ? 'Prices are automatically converted from USD' : 
                       'Preise werden automatisch von USD umgerechnet'}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="font-semibold text-gray-800">EUR</div>
                        <div className="text-gray-600 break-all">{exchangeRates.eur?.toFixed(4) || '0.85'}</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="font-semibold text-gray-800">USD</div>
                        <div className="text-gray-600">1.0000</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="font-semibold text-gray-800">COP</div>
                        <div className="text-gray-600 break-all">{exchangeRates.cop?.toFixed(0) || '4200'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons Section */}
                <div className="pt-8 border-t border-gray-100 space-y-4">
                  {/* Changes Summary Bar - Only show when there are changes */}
                  {hasUnsavedChanges() && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded p-4 animate-slideInUp">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <div>
                            <h5 className="font-semibold text-blue-900 text-sm">{t('pendingChanges')}</h5>
                            <p className="text-blue-700 text-xs">{t('changesWillBeApplied')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {[
                              tempLanguage !== language && t('language'),
                              tempCurrency !== currency && t('currency')
                            ].filter(Boolean).length} {t('changes')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {/* Reset Button - Only show when there are changes */}
                    {hasUnsavedChanges() && (
                      <button
                        onClick={() => {
                          setTempLanguage(language)
                          setTempCurrency(currency)
                          setTempFontSize(fontSize)
                        }}
                        className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded font-semibold transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{t('reset')}</span>
                      </button>
                    )}

                    {/* Apply Button */}
                    <button
                      onClick={handleSaveSettings}
                      disabled={!hasUnsavedChanges()}
                      className={`${hasUnsavedChanges() ? 'flex-1' : 'w-full'} py-4 px-8 rounded font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden ${
                        hasUnsavedChanges() 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl active:scale-[0.98] transform hover:-translate-y-1' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {/* Shimmer effect when enabled */}
                      {hasUnsavedChanges() && (
                        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      )}
                      <CheckIcon size={24} />
                      <span>{hasUnsavedChanges() ? t('saveSettings') : t('noChangesToSave')}</span>
                    </button>
                  </div>

                  {/* Help Text */}
                  {!hasUnsavedChanges() && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {t('makeChangesToEnable')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="w-96 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '400ms' }}>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <PreviewIcon size={18} className="text-green-600 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{t('livePreview')}</h3>
                      <p className="text-xs text-gray-600 mt-1">{t('seeChangesBeforeApply')}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-6 space-y-6 transition-all duration-300 ${getFontSizeClass()}`}>
                  {/* Preview Header */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {tempLanguage === 'es' ? 'Panel de Control' : 
                       tempLanguage === 'en' ? 'Dashboard' : 
                       'Armaturenbrett'}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {tempLanguage === 'es' ? 'Vista general del restaurante' : 
                       tempLanguage === 'en' ? 'Restaurant overview' : 
                       'Restaurantübersicht'}
                    </p>
                  </div>

                  {/* Sample Cards */}
                  <div className="space-y-4">
                    {/* Revenue Card */}
                    <div className="bg-green-50 border border-green-100 rounded p-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-800 mb-1">
                          {tempLanguage === 'es' ? 'Ingresos de Hoy' : 
                           tempLanguage === 'en' ? 'Today\'s Revenue' : 
                           'Heutige Einnahmen'}
                        </h5>
                        <p className="text-2xl font-bold text-green-600 break-all leading-tight">
                          {formatTempCurrency(1247.50)}
                        </p>
                        <p className="text-xs text-green-700 opacity-75">
                          {tempLanguage === 'es' ? 'Convertido desde $1,247.50 USD' : 
                           tempLanguage === 'en' ? 'Converted from $1,247.50 USD' : 
                           'Umgerechnet von $1,247.50 USD'}
                        </p>
                      </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded p-4">
                      <div>
                        <h5 className="text-sm font-medium text-blue-800 mb-1">
                          {tempLanguage === 'es' ? 'Órdenes Activas' : 
                           tempLanguage === 'en' ? 'Active Orders' : 
                           'Aktive Bestellungen'}
                        </h5>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                      </div>
                    </div>

                    {/* Menu Item Sample */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">
                          {tempLanguage === 'es' ? 'Paella Valenciana' : 
                           tempLanguage === 'en' ? 'Valencian Paella' : 
                           'Valencianische Paella'}
                        </h5>
                        <p className="text-gray-600 text-sm mb-2">
                          {tempLanguage === 'es' ? 'Arroz tradicional con mariscos' : 
                           tempLanguage === 'en' ? 'Traditional rice with seafood' : 
                           'Traditioneller Reis mit Meeresfrüchten'}
                        </p>
                        <p className="font-bold text-blue-600 break-all leading-tight">
                          {formatTempCurrency(28.90)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tempLanguage === 'es' ? 'Precio base: $28.90 USD' : 
                           tempLanguage === 'en' ? 'Base price: $28.90 USD' : 
                           'Basispreis: $28.90 USD'}
                        </p>
                      </div>
                    </div>

                    {/* Button Example */}
                    <div className="bg-white border border-gray-200 rounded p-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          {tempLanguage === 'es' ? 'Ejemplo de Botón' : 
                           tempLanguage === 'en' ? 'Button Example' : 
                           'Button-Beispiel'}
                        </h5>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors">
                          {tempLanguage === 'es' ? 'Confirmar Pedido' : 
                           tempLanguage === 'en' ? 'Confirm Order' : 
                           'Bestellung Bestätigen'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Changes Summary */}
                  {hasUnsavedChanges() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <div className="text-sm">
                        <h5 className="font-medium text-yellow-800 mb-2">{t('pendingChanges')}</h5>
                        <ul className="space-y-1 text-yellow-700">
                          {tempLanguage !== language && (
                            <li>• {t('language')}: {languageOptions.find(l => l.value === tempLanguage)?.label}</li>
                          )}
                          {tempCurrency !== currency && (
                            <li>• {t('currency')}: {currencyOptions.find(c => c.value === tempCurrency)?.label}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}