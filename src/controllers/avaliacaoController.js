const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar avaliação
const criarAvaliacao = async (req, res) => {
  try {
    const { usuarioId, nota, comentario } = req.body;

    const avaliacao = await prisma.avaliacao.create({
      data: {
        nota,
        comentario,
        usuario: { connect: { id: usuarioId } }
      },
    });

    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar avaliação', details: error.message });
  }
};

// Buscar todas as avaliações
const listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        usuario: {
          select: { id: true, nome: true }
        }
      }
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações', details: error.message });
  }
};

// Buscar uma avaliação por ID
const getAvaliacaoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true }
        }
      }
    });

    if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliação', details: error.message });
  }
};

// Atualizar uma avaliação
const atualizarAvaliacao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nota, comentario } = req.body;

    const avaliacao = await prisma.avaliacao.update({
      where: { id },
      data: { nota, comentario }
    });

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar avaliação', details: error.message });
  }
};

// Excluir uma avaliação
const excluirAvaliacao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.avaliacao.delete({ where: { id } });

    res.json({ message: 'Avaliação excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir avaliação', details: error.message });
  }
};

module.exports = {
  criarAvaliacao,
  listarAvaliacoes,
  getAvaliacaoPorId,
  atualizarAvaliacao,
  excluirAvaliacao,
};
