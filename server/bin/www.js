#!/usr/bin/env node

/**
 * Module dependencies.
 */

// Importar la aplicación Express
import app from '../app.js';

// Importar Debug
import createDebug from 'debug';

// Importar módulo HTTP de Node.js
import http from 'node:http';

// Crear el objeto Debug
const debug = createDebug('dwssr-2026b:server');

/**
 * Obtener el puerto desde las variables de entorno
 * y configurarlo en Express.
 */

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

/**
 * Crear el servidor HTTP.
 */

const server = http.createServer(app);

/**
 * Escuchar en el puerto indicado
 * en todas las interfaces de red.
 */

server.listen(port);

server.on('error', onError);

server.on('listening', onListening);

/**
 * Normalizar el puerto.
 *
 * Puede devolver:
 * - Un número
 * - Un nombre de pipe
 * - false
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // Named pipe
    return val;
  }

  if (port >= 0) {
    // Número de puerto
    return port;
  }

  return false;
}

/**
 * Manejador del evento "error" del servidor HTTP.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

  // Manejar errores específicos del servidor
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
}

/**
 * Manejador del evento "listening" del servidor HTTP.
 */

function onListening() {
  const addr = server.address();

  const bind =
    typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;

  debug(`💻 Listening on ${bind}`);

  console.log(`🚀 Servidor ejecutándose en http://localhost:${addr.port}`);
}
