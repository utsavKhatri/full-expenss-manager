const jwt = require('jsonwebtoken');

module.exports = async (req, res, proceed) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // check it admin or not
    const adminData = await User.findOne({ id: decoded.id });
    if (adminData.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    return proceed();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
