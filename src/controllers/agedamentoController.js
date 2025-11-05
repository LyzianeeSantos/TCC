const { enviarEmail } = require('../utils/emailService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createAgendamento = async (req, res) => {
  try {
    const { dataHora, status, clienteId, servicoId, localizacao } = req.body

    if (!localizacao || (localizacao !== 'Unidade 1' && localizacao !== 'Unidade 2')) {
      return res.status(400).json({ error: 'Localização inválida. Escolha entre "Unidade 1" ou "Unidade 2"' })
    }

    const dataHoraObj = new Date(dataHora);

    if (dataHoraObj < new Date()) {
      return res.status(400).json({ error: 'Não é possível agendar em data/hora já passadas' })
    }

    const existe = await prisma.agendamento.findFirst({
      where: { dataHora: dataHoraObj, localizacao }
    })

    if (existe) {
      return res.status(400).json({ error: 'Este horário já está agendado' })
    }

    const novo = await prisma.agendamento.create({
      data: {
        dataHora: dataHoraObj,
        status,
        clienteId,
        servicoId,
        localizacao
      },
      include: { cliente: true, servico: true }
    })

    if (novo.cliente?.email) {
      const assunto = 'Confirmação de Agendamento - Alcione Depiladora'
      const mensagem = `
      <h2>Olá ${novo.cliente.nome},</h2>
      <p>Seu agendamento foi <b>confirmado com sucesso!</b> ✨</p>
      <p>
        <b>Serviço:</b> ${novo.servico?.nome || 'Serviço selecionado'} <br>
        <b>Local:</b> ${novo.localizacao} <br>
        <b>Data:</b> ${new Date(novo.dataHora).toLocaleDateString('pt-BR')} <br>
        <b>Horário:</b> ${new Date(novo.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p>💖 Agradecemos a sua preferência!</p>
      <p>Atenciosamente,<br><b>Equipe Alcione - Depiladora</b></p>
      `

      try {
        console.log(`[INFO] Enviando e-mail de confirmação para ${novo.cliente.email}...`)
        const enviado = await enviarEmail(novo.cliente.email, assunto, mensagem)

        if (enviado)
          console.log(`📧 E-mail enviado com sucesso para ${novo.cliente.email}`)
        else
          console.warn(`⚠️ Falha ao enviar e-mail para ${novo.cliente.email}`)
      } catch (erroEmail) {
        console.error('❌ Erro ao enviar e-mail:', erroEmail)
      }
    } else {
      console.warn('⚠️ Cliente sem e-mail cadastrado — e-mail não enviado.')
    }

    res.status(201).json(novo)
  } catch (err) {
    console.error('[ERRO PRISMA]', err)
    res.status(500).json({ error: 'Erro ao criar agendamento' })
  }
}

const getAllAgendamentos = async (req, res) => {
  try {
    const { data } = req.query

    const where = {}

    if (data) {
      const inicio = new Date(data)
      const fim = new Date(data)
      inicio.setUTCHours(0, 0, 0, 0)
      fim.setUTCHours(23, 59, 59, 999)
      where.dataHora = { gte: inicio, lte: fim }
    }

    // Busca todos os agendamentos do dia, independente da unidade
    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: { cliente: true, servico: true },
    })

    res.json(agendamentos)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' })
  }
}


const getAgendamentoById = async (req, res) => {
  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { cliente: true, servico: true },
    })
    if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' })
    res.json(agendamento)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agendamento' })
  }
}

const updateAgendamento = async (req, res) => {
  try {
    const agendamento = await prisma.agendamento.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    })
    res.json(agendamento)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento' })
  }
}

const deleteAgendamento = async (req, res) => {
  try {
    await prisma.agendamento.delete({
      where: { id: parseInt(req.params.id) },
    })
    res.json({ message: 'Agendamento excluído' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir agendamento' })
  }
}

module.exports = {
  createAgendamento,
  getAllAgendamentos,
  getAgendamentoById,
  updateAgendamento,
  deleteAgendamento,
}
