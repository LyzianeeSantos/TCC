const express = require('express');
const router = express.Router();
const {
  registrar,
  login,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente
} = require('../controllers/usuarioController');

// Registro e login
router.post('/registrar', registrar);
router.post('/login', login);

// Rotas de cliente
router.get('/clientes', getAllClientes);
router.get('/clientes/:id', getClienteById);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

module.exports = router;
