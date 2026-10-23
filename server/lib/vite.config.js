// Importando un admin de rutas
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
// Importando tailwindcss
import tailwindcss from '@tailwindcss/vite'

// Imports para crear Dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Creando la variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    // Directorio raíz de los archivos fuente del frontend
    root: 'src',

    // Configuración de plugins
    plugins: [
        tailwindcss()
    ],

    // Configuración del servidor de desarrollo
    server: {
        // Puerto de escucha
        port: 5173,

        // Evita cambiar automáticamente de puerto
        strictPort: true
    },

    // Configuración del build
    build: {
        // Directorio de salida para producción
        outDir: '../dist',

        // Limpiar el directorio de producción antes de compilar
        emptyOutDir: true,

        // Generar manifiesto para el servidor
        manifest: true,

        // Opciones de empaquetado
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/main.js')
            }
        }
    },

    // Desactivar el directorio público
    publicDir: false
})