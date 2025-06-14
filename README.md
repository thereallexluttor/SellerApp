# Restaurant Seller App

Una aplicación de escritorio en blanco lista para empezar a desarrollar, construida con el stack moderno:

- ⚡️ **Vite** - Build tool súper rápido
- ⚛️ **React 18** - Librería UI moderna
- 🔷 **TypeScript** - Tipado estático
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 🖥️ **Electron** - Aplicación de escritorio multiplataforma

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd restaurant-seller-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```
   Esto iniciará tanto el servidor de Vite como la aplicación Electron.

## 📜 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run dev:vite` - Solo ejecuta el servidor de Vite
- `npm run dev:electron` - Solo ejecuta Electron
- `npm run build` - Construye la aplicación para producción
- `npm run dist` - Crea el ejecutable de la aplicación
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run lint:fix` - Corrige automáticamente los errores de ESLint

## 🏗️ Estructura del Proyecto

```
restaurant-seller-app/
├── electron/                 # Código de Electron
│   ├── main.ts              # Proceso principal de Electron
│   ├── preload.ts           # Script de preload
│   └── tsconfig.json        # Config TypeScript para Electron
├── src/                     # Código fuente de React
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── dist/                    # Build de Vite (generado)
├── dist-electron/           # Build de Electron (generado)
├── release/                 # Ejecutables (generado)
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
├── postcss.config.js        # Configuración de PostCSS
├── tsconfig.json            # Configuración de TypeScript
└── .eslintrc.cjs           # Configuración de ESLint
```

## 🛠️ Configuración de Desarrollo

### Electron

La aplicación está configurada con:
- Proceso principal seguro con `contextIsolation` habilitado
- Preload script para comunicación segura entre procesos
- Auto-reload en desarrollo
- DevTools habilitado en desarrollo

### React + TypeScript

- Configuración estricta de TypeScript
- ESLint con reglas recomendadas
- Hot Module Replacement (HMR) con Vite

### Tailwind CSS

- Configuración optimizada para React
- PostCSS con autoprefixer
- Clases utility-first listas para usar

## 📦 Creación de Ejecutables

Para crear un ejecutable de la aplicación:

```bash
npm run dist
```

Esto generará los ejecutables en la carpeta `release/`:
- **Windows**: archivo `.exe`
- **macOS**: archivo `.dmg`
- **Linux**: archivo `.AppImage`

## 🎨 Personalización

### Cambiar el nombre de la aplicación

1. Actualizar `name` y `productName` en `package.json`
2. Actualizar el título en `index.html`
3. Actualizar el `appId` en la configuración de `electron-builder`

### Agregar nuevas dependencias

```bash
npm install <package-name>
```

### Configurar comunicación Electron

Para agregar IPC (Inter-Process Communication):

1. Agregar métodos en `electron/preload.ts`
2. Usar en React a través de `window.electronAPI`

## 🔧 Solución de Problemas

### La aplicación no se abre

- Verificar que el puerto 5173 esté disponible
- Comprobar que todas las dependencias estén instaladas

### Errores de compilación TypeScript

- Ejecutar `npm run lint:fix` para corregir errores automáticamente
- Verificar que todos los archivos `.ts`/`.tsx` estén bien tipados

## 📝 Notas de Desarrollo

- La aplicación está configurada para desarrollo con hot-reload
- Los cambios en React se reflejan inmediatamente
- Los cambios en Electron requieren reiniciar la aplicación
- Las herramientas de desarrollador están habilitadas en modo desarrollo

## 🚀 ¡Listo para Cocinar!

Tu aplicación está completamente configurada y lista para el desarrollo. ¡Comienza a agregar tus funcionalidades y crea algo increíble!

---

**Tecnologías utilizadas:**
- Vite 5.x
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x
- Electron 28.x
