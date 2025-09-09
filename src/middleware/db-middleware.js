const dbConnect = require('../../mongodb.js');

const connectDBMiddleware = async (req, res, next) => {
  try {
    await dbConnect();
    next(); 
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed.' });
  }
};

module.exports = connectDBMiddleware;