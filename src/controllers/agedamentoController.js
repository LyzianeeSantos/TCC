const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAgendamento = async (req, res) => {
  try {
    const { data, hora, status, clienteId, servicoId } = req.body;

    const novo = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        hora,
        status,
        clienteId,
        servicoId,
      },
    });

    res.status(201).json(novo);
  } catch (err) {
    console.error('[ERRO PRISMA]', err);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};

const getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: { cliente: true, servico: true },
    });
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

const getAgendamentoById = async (req, res) => {
  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { cliente: true, servico: true },
    });
    if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
};

const updateAgendamento = async (req, res) => {
  try {
    const agendamento = await prisma.agendamento.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

const deleteAgendamento = async (req, res) => {
  try {
    await prisma.agendamento.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Agendamento excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
};

module.exports = {
  createAgendamento,
  getAllAgendamentos,
  getAgendamentoById,
  updateAgendamento,
  deleteAgendamento,
};
