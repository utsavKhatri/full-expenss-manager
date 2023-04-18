const jwt = require('jsonwebtoken');

/**
 * This is a middleware function.
 * @param {token} req
 * @return procced
 * @rejects {Error}
 */
module.exports = async (req, res, proceed) => {
  try {
    if (!req.headers.authorization) {
      return res.status(404).json({
        message: 'headers missing',
      });
    }
    const token = req.headers.authorization.split(' ')[1]; // Extracting the token from the headers
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded.id === null) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    req.user = decoded;
    return proceed();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};