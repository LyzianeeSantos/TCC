const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo123';

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  
  const token = authHeader.split(' ')[1]; // Pega apenas o token depois de "Bearer"
  

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao administrador' });
  }
  next();
};

module.exports = { autenticar, isAdmin };
