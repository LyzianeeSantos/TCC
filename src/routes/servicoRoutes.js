const express = require('express');
const router = express.Router();
const {
  createServico,
  getAllServicos,
  getServicoById,
  updateServico,
  deleteServico,
} = require('../controllers/servicoController');

// Rotas
router.get('/', getAllServicos);
router.post('/', createServico);
router.get('/:id', getServicoById);
router.put('/:id', updateServico);
router.delete('/:id', deleteServico);

module.exports = router;
