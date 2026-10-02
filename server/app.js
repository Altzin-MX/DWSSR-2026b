
// Importar la función para manejar errores HTTP
import createError from 'http-errors';

// Importar el framework Express
import express from 'express';

// Importar el módulo para trabajar con rutas y directorios
import path from 'node:path';

// Importar el módulo para manejar cookies
import cookieParser from 'cookie-parser';

// Importar el módulo para generar registros de peticiones
import logger from 'morgan';

// Importar funciones para obtener la ruta del archivo actual
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Obtener la ruta del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar las rutas de la aplicación
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Crear la aplicación Express
const app = express();

// Configurar el directorio de las vistas
app.set('views', path.join(__dirname, 'views'));

// Configurar el motor de plantillas
app.set('view engine', 'hbs');

// Configurar middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configurar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas de la aplicación
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejar las rutas que no existen (error 404)
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador general de errores
app.use((err, req, res, next) => {
  // Configurar el mensaje del error
  res.locals.message = err.message;

  // Mostrar detalles únicamente en desarrollo
  res.locals.error =
    req.app.get('env') === 'development' ? err : {};

  // Establecer el código de estado HTTP
  res.status(err.status || 500);

  // Mostrar la vista de error
  res.render('error');
});

// Exportar la aplicación Express
export default app;
