const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const {
  registrar,
  login,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} = require('../src/controllers/usuarioController');

const app = express();
app.use(bodyParser.json());

// Rotas simuladas para testes
app.post('/usuarios/registrar', registrar);
app.post('/usuarios/login', login);
app.get('/usuarios/clientes', getAllClientes);
app.get('/usuarios/clientes/:id', getClienteById);
app.put('/usuarios/clientes/:id', updateCliente);
app.delete('/usuarios/clientes/:id', deleteCliente);

let clienteId;
let token;

describe('Testes das rotas de Usuários', () => {
  const userData = {
    nome: 'Teste Usuário',
    email: 'teste@example.com',
    telefone: '123456789',
    senha: 'senha123',
    tipo: 'cliente',
  };

  test('Registrar usuário', async () => {
    const response = await request(app)
      .post('/usuarios/registrar')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Usuário cadastrado com sucesso!');
  });

  test('Login usuário', async () => {
    const response = await request(app)
      .post('/usuarios/login')
      .send({ email: userData.email, senha: userData.senha });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.tipo).toBe('cliente');
    token = response.body.token;
  });

  test('Buscar todos os clientes', async () => {
    const response = await request(app).get('/usuarios/clientes');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Pega um cliente para os próximos testes
    const cliente = response.body.find(c => c.email === userData.email);
    expect(cliente).toBeDefined();
    clienteId = cliente.id;
  });

  test('Buscar cliente por ID', async () => {
    const response = await request(app).get(`/usuarios/clientes/${clienteId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', clienteId);
  });

  test('Atualizar cliente', async () => {
    const response = await request(app)
      .put(`/usuarios/clientes/${clienteId}`)
      .send({ telefone: '987654321' });

    expect(response.statusCode).toBe(200);
    expect(response.body.telefone).toBe('987654321');
  });

  test('Excluir cliente', async () => {
    const response = await request(app).delete(`/usuarios/clientes/${clienteId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cliente excluído');
  });

  test('Buscar cliente excluído deve retornar 404', async () => {
    const response = await request(app).get(`/usuarios/clientes/${clienteId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Cliente não encontrado');
  });
});
