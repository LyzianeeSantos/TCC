const pool = require('../config/database');

const Cliente = {
  listarTodos: async () => {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
    return result.rows;
  },

  buscarPorId: async (id) => {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  },

  criar: async ({ nome, email, telefone }) => {
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );
    return result.rows[0];
  },

  atualizar: async (id, { nome, email, telefone }) => {
    const result = await pool.query(
      'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *',
      [nome, email, telefone, id]
    );
    return result.rows[0];
  },

  deletar: async (id) => {
    await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
    return { message: 'Cliente removido com sucesso' };
  }
};

module.exports = Cliente;
