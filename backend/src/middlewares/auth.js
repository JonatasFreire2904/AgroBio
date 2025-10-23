// src/middlewares/auth.js
function authMiddleware(req, res, next) {
  // Verificar se o usuário está logado na sessão
  if (req.session && req.session.user) {
    req.user = req.session.user; // terá id, email, role, name, city, state
    next();
  } else {
    res.status(401).json({ error: 'Não autorizado - faça login primeiro' });
  }
}

module.exports = authMiddleware;
