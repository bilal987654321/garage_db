const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
// TODO remove
// process.env.TOKEN_SECRET;
const secret = 'deef1ab18d25a77ac4720c49135cde2e087a1984a0a75cd3a1046670b028c84eeb115b515381d8792d2fe2b5c9a400f64c120daa06a90c408cd1b54542fa47d40fcdbf92461c80a277a4da6b6e65550b32fc62d197b26b741895130c6699fc30243500393bfd03e1b904fee3c5bd961c504f805a0bbeb1a0b76fe246f19b8ee0c33d77895223daae2766a16b85ee1e9aee0796451038b909e3527b9bd9be2147f3096dafe4e7929a787bdb3ffb922a589a421687904807a01a4de6fd1d0388d950b17ed0ae3b88473e6050972064142135045eb42c83bb2af54defe651d20236af79deb9aa2f0f92ac81d2f1fb49db9991f1db752a35a4aaa62e31508efae5c2';


function generateAccessToken(email, profile) {
    return jwt.sign({ email, profile }, secret, { expiresIn: '14440s' });
}
  
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, secret, (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      req.user = user

  
      next()
    })
}
function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, secret, (err, user) => {

    if (err || user.profile != 'admin') return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports = {
  generateAccessToken, authenticateToken, authenticateAdminToken
}