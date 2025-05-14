const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agedamentoController');

// Rotas CRUD para Agendamentos
router.get('/', agendamentoController.getAllAgendamentos);
router.get('/:id', agendamentoController.getAgendamentoById);
router.post('/', agendamentoController.createAgendamento);
router.put('/:id', agendamentoController.updateAgendamento);
router.delete('/:id', agendamentoController.deleteAgendamento);

module.exports = router;
