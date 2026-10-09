// Importar Express
import express from 'express';

// Crear el router
const router = express.Router();

let counter = 0;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express',
    counter
  });
});

// Exportar el router
export default router;
