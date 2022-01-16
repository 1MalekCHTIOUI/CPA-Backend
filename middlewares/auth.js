const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if(!token)
      res.status(401).json({msg: "No Authorization"})
  try {
      const decoded = jwt.verify(token, 'jwt_secret')
      req.user = decoded;
      next();
  }catch(e) {
      res.status(400).json({ msg: "token is not valid" });
  }
};