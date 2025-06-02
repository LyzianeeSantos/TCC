const express = require('express');
const router = express.Router();
const {
    criarAvaliacao,
    listarAvaliacoes,
    getAvaliacaoPorId,
    atualizarAvaliacao,
    excluirAvaliacao,
} = require('../controllers/avaliacaoController');

// Rotas
router.post('/', criarAvaliacao);           // Criar nova avaliação
router.get('/', listarAvaliacoes);          // Listar todas as avaliações
router.get('/:id', getAvaliacaoPorId);      // Buscar uma avaliação por ID
router.put('/:id', atualizarAvaliacao);     // Atualizar uma avaliação
router.delete('/:id', excluirAvaliacao);    // Excluir uma avaliação

module.exports = router;
