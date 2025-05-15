const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agedamentoController');
const { autenticar, isAdmin } = require('../middlewares/auth');

// Rotas CRUD para Agendamentos
router.get('/', autenticar, isAdmin, agendamentoController.getAllAgendamentos);
router.get('/:id', autenticar, agendamentoController.getAgendamentoById);
router.post('/', autenticar, agendamentoController.createAgendamento);
router.put('/:id', autenticar, agendamentoController.updateAgendamento);
router.delete('/:id', autenticar, isAdmin, agendamentoController.deleteAgendamento);


module.exports = router;
