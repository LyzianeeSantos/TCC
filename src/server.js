// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rotas
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/agendamentos', agendamentoRoutes);
app.use('/servicos', servicoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/avaliacoes', avaliacaoRoutes)

// Rota raiz
app.get('/', (req, res) => {
  res.send('API de Agendamento Ativa');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
