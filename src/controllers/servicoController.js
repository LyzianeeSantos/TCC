const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServico = async (req, res) => {
  try {
    const { nome, descricao, preco, duracaoMin } = req.body;
    const novoServico = await prisma.servico.create({
      data: { nome, descricao, preco: parseFloat(preco), duracaoMin },
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
    const { nome, descricao, preco, duracaoMin } = req.body;

    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (descricao !== undefined) data.descricao = descricao;

    if (preco !== undefined) {
      const parsedPreco = parseFloat(preco);
      if (Number.isNaN(parsedPreco)) return res.status(400).json({ error: 'preco inválido' });
      data.preco = parsedPreco;
    }

    if (duracaoMin !== undefined) {
      const parsedDuracao = parseInt(duracaoMin, 10);
      if (Number.isNaN(parsedDuracao)) return res.status(400).json({ error: 'duracaoMin inválida' });
      data.duracaoMin = parsedDuracao;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const atualizado = await prisma.servico.update({
      where: { id: parseInt(id, 10) },
      data,
    });

    res.json(atualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar serviço', details: error.message });
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
