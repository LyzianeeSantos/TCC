const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const agendamentoRoutes = require('../src/routes/agendamentoRoutes'); // ajuste se necessário
const authRoutes = require('../src/routes/usuarioRoutes'); // rota do login, ajuste se necessário

const app = express();
app.use(bodyParser.json());

// Registra as rotas de autenticação e agendamento
app.use('/usuarios', authRoutes);
app.use('/agendamentos', agendamentoRoutes);

let token;
let agendamentoId;
const clienteId = 3; // Certifique-se que exista no DB
const servicoId = 1;

// Gera o token antes dos testes
beforeAll(async () => {
  const loginResponse = await request(app)
    .post('/usuarios/login') 
    .send({
      email: 'lyzi@example.com', 
      senha: 'senha123',
    });

  token = loginResponse.body.token;
});

describe('Testes das rotas de Agendamento', () => {
  test('Deve criar um novo agendamento', async () => {
    const response = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: new Date(),
        hora: '10:00',
        status: 'pendente',
        clienteId,
        servicoId,
        localizacao: 'Unidade 1',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    agendamentoId = response.body.id;
  });

  test('Deve listar todos os agendamentos', async () => {
    const response = await request(app)
      .get('/agendamentos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Deve buscar agendamento por ID', async () => {
    const response = await request(app)
      .get(`/agendamentos/${agendamentoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(agendamentoId);
  });

  test('Deve atualizar um agendamento', async () => {
    const response = await request(app)
      .put(`/agendamentos/${agendamentoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmado' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('confirmado');
  });

  test('Deve excluir um agendamento', async () => {
    const response = await request(app)
      .delete(`/agendamentos/${agendamentoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Agendamento excluído');
  });
});
