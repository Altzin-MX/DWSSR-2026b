// Importar Express
import express from 'express';

// Crear el router
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

// Exportar el router
export default router;
