const jwt = require('jsonwebtoken');

const JWT_SECRET = "Pratik@$7809"
exports.isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {      
      if (err) {
        return res.status(401).json({ message: "jwt expired" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};