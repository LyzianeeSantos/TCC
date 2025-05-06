const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rotas CRUD para Agendamentos
router.get('/', agendamentoController.listarTodos);
router.get('/:id', agendamentoController.buscarPorId);
router.post('/', agendamentoController.criar);
router.put('/:id', agendamentoController.atualizar);
router.delete('/:id', agendamentoController.deletar);

module.exports = router;
