var express = require('express');
var router = express.Router();
const { executeQuery, getCheckPasswordQuery, getUserByEmailQuery, getInsertEmployeQuery, getUpdateUserQuery, getUpdatePasswordQuery, getUsersQuery } = require('../db')
const { authenticateToken, generateAccessToken, authenticateAdminToken } = require('../auth/jwt');
const { validateEmail, validateTelephone, extractParamsFromObject } = require('../utils.js');

router.post('/login', async function (req, res) {
  let { email, password } = extractParamsFromObject(req.body, 'email', 'password');

  const query = getCheckPasswordQuery(email, password);
  const result = await executeQuery(query);
  if (result.rows.length === 0) {
    res.status(401).json("Username or password are incorrect");
    return;
  }

  const user = result.rows[0];
  const token = generateAccessToken(email, user.profile);

  res.status(200).json({ token })

});

router.get('/list', authenticateToken, async function (req, res, next) {
  const result = await executeQuery(getUsersQuery);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

router.post('/edit_password', async function (req, res) {
  let { id, password, old_password } = extractParamsFromObject(req.body, 'id', 'password', 'old_password');

  query = getUpdatePasswordQuery(old_password, password, id);

  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});


router.post('/add', authenticateAdminToken, async function (req, res) {
  let { nom, prenom, phone, email, password } = extractParamsFromObject(req.body, 'nom', 'prenom', 'phone', 'email', 'password');
  if (!nom || !prenom || !phone || !email || !password) {
    res.status(400).json("Missing params");
    return;
  }
  if (!validateEmail(email)) {
    res.status(400).json("Email not valid");
    return;
  }
  if (!validateTelephone(phone)) {
    res.status(400).json("telephone not valid");
    return;
  }


  let query = getInsertEmployeQuery(nom, prenom, phone, email, password);

  if (await isDuplicateEmail(email)) {
    res.status(400).json("Email already exists");
    return;
  }


  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});


async function isDuplicateEmail(email) {
  const res = await executeQuery(getUserByEmailQuery(email));
  return res.rows.length > 0;
}

router.post('/edit', authenticateAdminToken, async function (req, res) {
  let { id, nom, prenom, email } = extractParamsFromObject(req.body, 'id', 'nom', 'prenom', 'email');
  let query = getUpdateUserQuery(nom, prenom, email, id);

  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});


module.exports = router;
