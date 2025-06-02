const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'segredo123';

// Registrar novo usuário (cliente ou admin)
const registrar = async (req, res) => {
  try {
    const { nome, email, telefone, senha, tipo } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: hash,
        tipo: tipo || 'cliente', // padrão para cliente
      },
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, SECRET, { expiresIn: '2h' });

    res.json({ token, tipo: usuario.tipo, nome: usuario.nome });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login', details: err.message });
  }
};

// Buscar todos os usuários do tipo cliente
const getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.usuario.findMany({
      where: { tipo: 'cliente' },
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

// Buscar cliente por ID
const getClienteById = async (req, res) => {
  try {
    const cliente = await prisma.usuario.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!cliente || cliente.tipo !== 'cliente') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

// Atualizar cliente
const updateCliente = async (req, res) => {
  try {
    const cliente = await prisma.usuario.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

// Excluir cliente
const deleteCliente = async (req, res) => {
  try {
    await prisma.usuario.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Cliente excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
};

module.exports = {
  registrar,
  login,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
