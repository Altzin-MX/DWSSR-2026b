// Importando un admin de rutas
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Imports para crear Dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Creando la variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    // Directorio Raiz de los archivos fuente del front-end
    root: 'src'
})