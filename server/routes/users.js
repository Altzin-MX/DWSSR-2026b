// Importar Express
import express from 'express';

// Crear el router
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Exportar el router
export default router;
