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
router.post('/servicos', createServico);
router.get('/servicos', getAllServicos);
router.get('/servicos/:id', getServicoById);
router.put('/servicos/:id', updateServico);
router.delete('/servicos/:id', deleteServico);

module.exports = router;
