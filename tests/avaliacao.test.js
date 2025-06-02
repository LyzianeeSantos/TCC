const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const avaliacaoRoutes = require('../src/routes/avaliacaoRoutes');

// Simula a aplicação
const app = express();
app.use(bodyParser.json());
app.use('/avaliacoes', avaliacaoRoutes);

describe('Testes das rotas de Avaliação', () => {
  let novaAvaliacaoId;

  it('Deve criar uma nova avaliação', async () => {
    const response = await request(app).post('/avaliacoes').send({
      nota: 5,
      comentario: 'Excelente serviço!',
      usuarioId: 1 // id de usuário válido no banco
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    novaAvaliacaoId = response.body.id;
  });

  it('Deve listar todas as avaliações', async () => {
    const response = await request(app).get('/avaliacoes');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve buscar avaliação por ID', async () => {
    const response = await request(app).get(`/avaliacoes/${novaAvaliacaoId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', novaAvaliacaoId);
  });

  it('Deve atualizar uma avaliação', async () => {
    const response = await request(app).put(`/avaliacoes/${novaAvaliacaoId}`).send({
      nota: 4,
      comentario: 'Serviço bom, mas pode melhorar.'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.nota).toBe(4);
  });

  it('Deve excluir uma avaliação', async () => {
    const response = await request(app).delete(`/avaliacoes/${novaAvaliacaoId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Avaliação excluída com sucesso!');
  });
});
