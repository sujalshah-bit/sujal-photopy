const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decodedToken = jwt.verify(token, secretKey);
      req.userId = decodedToken.userId;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Middleware to authenticate the user using JWT
exports.authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // console.log(token);
  if (!token) return res.status(401).json({ message: 'Authentication token required' });

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded:');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(`Authorization Error ${err}`)
    res.status(401).json({ message: 'Invalid token' });
  }
};
