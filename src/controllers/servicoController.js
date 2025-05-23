const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServico = async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    const novoServico = await prisma.servico.create({
      data: { nome, descricao, preco: parseFloat(preco) },
    });
    res.status(201).json(novoServico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço', details: error.message });
  }
};

const getAllServicos = async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

const getServicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(id) },
    });
    if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
};

const updateServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;
    const atualizado = await prisma.servico.update({
      where: { id: parseInt(id) },
      data: { nome, descricao, preco: parseFloat(preco) },
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

const deleteServico = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.servico.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar serviço' });
  }
};

module.exports = {
  createServico,
  getAllServicos,
  getServicoById,
  updateServico,
  deleteServico,
};
