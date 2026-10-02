// Función para manejar errores en la aplicación
import createError from 'http-errors';

// Importar el framework Express
import express from 'express';

// Importar módulos para manejar rutas
import path from 'node:path';

// Importar módulo para manejar cookies
import cookieParser from 'cookie-parser';

// Importar módulo para generar logs
import logger from 'morgan';

// Importar biblioteca Debug
import createDebug from 'debug';

// Importar funciones para crear __dirname
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Crear objeto Debug
const debug = createDebug('dwssr-2026b:server');

// Crear __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar las rutas de la aplicación
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Crear la aplicación Express
debug('🔨 Creando backend');

const app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configurar middlewares de la aplicación
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurar la carpeta de archivos estáticos
debug('🔨 Creando servidor de Archivos Estáticos');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas de la aplicación
debug('🛣️ Registrando rutas');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturar errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador general de errores
app.use((err, req, res, next) => {
  // Mostrar el mensaje del error
  res.locals.message = err.message;

  // Mostrar información detallada solamente en desarrollo
  res.locals.error =
    req.app.get('env') === 'development'
      ? err
      : {};

  // Establecer código de estado HTTP
  res.status(err.status || 500);

  // Renderizar la vista de error
  res.render('error');
});

// Exportar la aplicación
export default app;
