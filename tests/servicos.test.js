const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const {
  createServico,
  getAllServicos,
  getServicoById,
  updateServico,
  deleteServico,
} = require('../src/controllers/servicoController');

const app = express();
app.use(bodyParser.json());

// Rotas simuladas
app.post('/servicos', createServico);
app.get('/servicos', getAllServicos);
app.get('/servicos/:id', getServicoById);
app.put('/servicos/:id', updateServico);
app.delete('/servicos/:id', deleteServico);

let servicoId;

describe('Testes das rotas de Serviço', () => {
  test('Deve criar um novo serviço', async () => {
    const response = await request(app)
      .post('/servicos')
      .send({
        nome: 'Teste Serviço',
        descricao: 'Descrição do serviço teste',
        preco: 150.50,
        duracaoMin: 60,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('Teste Serviço');
    servicoId = response.body.id;
  });

  test('Deve listar todos os serviços', async () => {
    const response = await request(app).get('/servicos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Deve buscar serviço por ID', async () => {
    const response = await request(app).get(`/servicos/${servicoId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', servicoId);
  });

  test('Deve atualizar o serviço', async () => {
    const response = await request(app)
      .put(`/servicos/${servicoId}`)
      .send({
        nome: 'Serviço Atualizado',
        descricao: 'Descrição atualizada',
        preco: 200.00,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.nome).toBe('Serviço Atualizado');
    expect(response.body.preco).toBe(200);
  });

  test('Deve deletar o serviço', async () => {
    const response = await request(app).delete(`/servicos/${servicoId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Serviço excluído com sucesso');
  });

  test('Deve retornar 404 ao buscar serviço deletado', async () => {
    const response = await request(app).get(`/servicos/${servicoId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Serviço não encontrado');
  });
});
