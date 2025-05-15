const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarEmail = require('../utils/emailService');
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'segredo123';

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
                tipo: tipo || 'cliente', // default para cliente
            },
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message });
    }
};

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
    try {
        const { email } = req.body;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '15m' });

        // ✅ Definir o link de recuperação com base na URL do frontend
        const link = `http://localhost:3000/redefinir-senha?token=${token}`; // Altere conforme seu front

        await enviarEmail(email, 'Redefinição de Senha', `
            <p>Olá,</p>
            <p>Clique no link abaixo para redefinir sua senha. Ele expira em 15 minutos:</p>
            <a href="${link}">${link}</a>
        `);

        res.json({ message: 'Link de redefinição enviado para o e-mail com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao enviar instruções.', details: err.message });
    }
};

const redefinirSenha = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;

        const payload = jwt.verify(token, SECRET);
        const hash = await bcrypt.hash(novaSenha, 10);

        await prisma.usuario.update({
            where: { id: payload.id },
            data: { senha: hash },
        });

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
};


module.exports = { registrar, login, recuperarSenha, redefinirSenha };
