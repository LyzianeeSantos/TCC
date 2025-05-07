const { Agendamento } = require('../models/Agendamento');

module.exports = {
  async listarTodos(req, res) {
    try {
      const agendamentos = await Agendamento.findAll();
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const agendamento = await Agendamento.findByPk(req.params.id);
      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento não encontrado.' });
      }
      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar agendamento.' });
    }
  },

  async criar(req, res) {
    try {
      const { clienteId, servico, data, hora } = req.body;
      const novoAgendamento = await Agendamento.create({ clienteId, servico, data, hora });
      res.status(201).json(novoAgendamento);
    } catch (error) {
      res.status(400).json({ erro: 'Erro ao criar agendamento.' });
    }
  },

  async atualizar(req, res) {
    try {
      const { clienteId, servico, data, hora } = req.body;
      const agendamento = await Agendamento.findByPk(req.params.id);
      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento não encontrado.' });
      }
      await agendamento.update({ clienteId, servico, data, hora });
      res.json(agendamento);
    } catch (error) {
      res.status(400).json({ erro: 'Erro ao atualizar agendamento.' });
    }
  },

  async deletar(req, res) {
    try {
      const agendamento = await Agendamento.findByPk(req.params.id);
      if (!agendamento) {
        return res.status(404).json({ erro: 'Agendamento não encontrado.' });
      }
      await agendamento.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar agendamento.' });
    }
  },
};
