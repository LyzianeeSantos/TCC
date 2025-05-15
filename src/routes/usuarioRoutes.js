const express = require('express');
const router = express.Router();
const { registrar, login, recuperarSenha, redefinirSenha } = require('../controllers/usuarioController');


router.post('/registrar', registrar);
router.post('/login', login);
router.post('/recuperar-senha', recuperarSenha);
router.post('/redefinir-senha', redefinirSenha);


module.exports = router;
