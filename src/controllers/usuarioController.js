const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const { enviarEmail } = require('../utils/emailService');

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

const recuperarSenha = async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(404).json({ error: 'E-mail não cadastrado.' })

    // Gera token temporário
    const token = crypto.randomBytes(20).toString('hex')
    const expiracao = new Date(Date.now() + 3600000) // 1 hora

    await prisma.usuario.update({
      where: { email },
      data: { resetToken: token, resetTokenExpira: expiracao }
    })

    const resetLink = `http://localhost:3000/redefinir-senha.html?token=${token}`

    const mensagem = `
      <h2>Olá ${usuario.nome},</h2>
      <p>Você solicitou a redefinição da sua senha.</p>
      <p>Clique no link abaixo para redefinir:</p>
      <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      <p>⚠️ O link expira em 1 hora.</p>
      <p>Atenciosamente,<br><b>Equipe Alcione - Depiladora</b></p>
    `

    await enviarEmail(email, 'Recuperação de Senha - Alcione Depiladora', mensagem)

    res.json({ message: 'E-mail de recuperação enviado com sucesso!' })
  } catch (err) {
    console.error('Erro ao enviar e-mail de recuperação:', err)
    res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação.' })
  }
}

const redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body;

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpira: {
          gt: new Date()
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: hash,
        resetToken: null,
        resetTokenExpira: null
      }
    });

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: 'Erro ao redefinir senha.' });
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
  recuperarSenha,
  redefinirSenha,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
