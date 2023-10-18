const jwt = require('jsonwebtoken');

module.exports = async (req, res, proceed) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    return proceed();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
