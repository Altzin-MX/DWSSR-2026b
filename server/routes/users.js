// Importar Express
import express from 'express';

// Crear router
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<h1 style="color:red">LISTA DE AMIGAS</h1>');
});

// Exportar router
export default router;