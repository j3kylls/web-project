// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) return res.status(403).json({ error: 'Access denied. No token provided.' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log('[AUTH] Missing Authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('[AUTH] Bearer token missing');
    return res.status(401).json({ error: 'Malformed token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('[AUTH] Invalid token:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = decoded.id;
    console.log('[AUTH] Token verified, user ID:', decoded.id);
    next();
  });
};

module.exports = verifyToken;
