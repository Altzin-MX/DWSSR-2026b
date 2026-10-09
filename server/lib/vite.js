// Importar módulos necesarios
import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createDebug from 'debug';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import hbs from 'hbs';

// Biblioteca File Stream
import fs from 'node:fs';

// Biblioteca de rutas
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/**
 * Helper para Handlebars que genera las etiquetas de Vite.
 *
 * EN DESARROLLO: conecta al servidor de desarrollo de Vite.
 * EN PRODUCCIÓN: utiliza los archivos compilados de Vite.
 */
export function viteAssets() {
  // Obtener el modo de ejecución
  const isDev = process.env.NODE_ENV !== 'production';

  // URL del servidor de desarrollo de Vite
  const viteDevServer =
    process.env.VITE_DEV_SERVER || 'http://localhost:5173';

  // Si estamos en desarrollo
  if (isDev) {
    return `
      <script type="module" src="${viteDevServer}/@vite/client"></script>
      <script type="module" src="${viteDevServer}/main.js"></script>
    `;
  }

  // Ruta del manifest generado por Vite
  const manifestPath = path.join(
    __dirname,
    '..',
    '..',
    'dist',
    '.vite',
    'manifest.json'
  );

  // Comprobar si existe el manifest
  if (!fs.existsSync(manifestPath)) {
    console.warn("Vite manifest no encontrado. Ejecuta 'npm run build'.");
    return '';
  }

  // Leer y convertir el manifest a JSON
  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf-8')
  );

  // Obtener el punto de entrada del frontend
  const mainEntry = manifest['main.js'];

  if (!mainEntry) {
    console.warn(
      'El archivo main.js no está disponible en el manifest de Vite.'
    );
    return '';
  }

  let tags = '';

  // Generar las etiquetas CSS
  if (mainEntry.css) {
    mainEntry.css.forEach((cssFile) => {
      tags += `<link rel="stylesheet" href="/${cssFile}">\n`;
    });
  }

  // Generar la etiqueta JavaScript
  tags += `<script type="module" src="/${mainEntry.file}"></script>`;

  return tags;
}

/**
 * Registrar el helper de Handlebars
 */
export function registerViteHelper(hbs) {
  hbs.registerHelper('viteAssets', () => {
    return new hbs.SafeString(viteAssets());
  });
}

// Importar las rutas de la aplicación
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// Importar el helper de Vite
import { registerViteHelper } from './lib/vite.js';

// Configurar Debug
const debug = createDebug('dwssr-2026b:server');

// Obtener las rutas del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Crear la aplicación Express
debug('🔨 Creando backend');

const app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar el helper de Vite
registerViteHelper(hbs);

// Configurar los middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Servir archivos estáticos generados por Vite en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Servir archivos estáticos públicos
debug('🔨 Configurando archivos estáticos');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas
debug('🛣️ Registrando rutas');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejar rutas no encontradas (404)
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador general de errores
app.use((err, req, res, next) => {
  res.locals.message = err.message;

  // Mostrar detalles del error solamente en desarrollo
  res.locals.error =
    req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.render('error');
});

// Exportar la aplicación para server/bin/www.js
export default app;