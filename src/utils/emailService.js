require('dotenv').config()
const nodemailer = require('nodemailer')
console.log('[ENV TEST]', process.env.EMAIL_USER, process.env.EMAIL_PASS ? 'Senha OK' : 'Sem senha')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function enviarEmail(destinatario, assunto, mensagemHtml) {
  try {
    await transporter.sendMail({
      from: `"Alcione Depiladora" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      html: mensagemHtml
    })
    console.log(`📧 E-mail enviado com sucesso para ${destinatario}`)
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err)
  }
}

module.exports = { enviarEmail }
