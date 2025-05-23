const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const novo = await prisma.cliente.create({ data: { nome, email, telefone } });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

const getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

const getClienteById = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

const updateCliente = async (req, res) => {
  try {
    const cliente = await prisma.cliente.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    await prisma.cliente.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Cliente excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
};

module.exports = {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
