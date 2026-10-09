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