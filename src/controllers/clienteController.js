const Cliente = require('../models/clienteModel');

module.exports = {
  listarTodos: async (req, res) => {
    try {
      const clientes = await Cliente.listarTodos();
      res.json(clientes);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar clientes' });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const cliente = await Cliente.buscarPorId(req.params.id);
      if (cliente) res.json(cliente);
      else res.status(404).json({ erro: 'Cliente não encontrado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar cliente' });
    }
  },

  criar: async (req, res) => {
    try {
      const novoCliente = await Cliente.criar(req.body);
      res.status(201).json(novoCliente);
    } catch (err) {
      res.status(400).json({ erro: 'Erro ao criar cliente' });
    }
  },

  atualizar: async (req, res) => {
    try {
      const clienteAtualizado = await Cliente.atualizar(req.params.id, req.body);
      if (clienteAtualizado) res.json(clienteAtualizado);
      else res.status(404).json({ erro: 'Cliente não encontrado' });
    } catch (err) {
      res.status(400).json({ erro: 'Erro ao atualizar cliente' });
    }
  },

  deletar: async (req, res) => {
    try {
      await Cliente.deletar(req.params.id);
      res.json({ mensagem: 'Cliente deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao deletar cliente' });
    }
  }
};
