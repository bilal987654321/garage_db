var express = require('express');
var router = express.Router();
const { executeQuery, getInsertTemoignageQuery, getApproveTemoignageQuery, getRejectTemoignageQuery, getListTemoignageQuery } = require('../db')
const { authenticateToken } = require('../auth/jwt');
const { extractParamsFromObject } = require('../utils');

router.get('/list/pending', authenticateToken, async function (req, res, next) {

  let query = getListTemoignageQuery(false);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

router.get('/list/approved', async function (req, res, next) {

  let query = getListTemoignageQuery(true);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});


router.post('/add', async function (req, res) {
  let { nom, message, note } = extractParamsFromObject(req.body, 'nom','message','note');

  if (!nom || !message || !note) {
    res.status(400).json({});
    return;
  }
  else {


    let query = getInsertTemoignageQuery(nom, message, note);
    const result = await executeQuery(query);
    if (result) {
      res.status(200).json(result.rows)
      return;
    }

  }
});

router.post('/approve', authenticateToken, async function (req, res) {
  let id = extractParamsFromObject(req.body, 'id');

  let query = getApproveTemoignageQuery(id);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

router.post('/reject', authenticateToken, async function (req, res) {
  let id = extractParamsFromObject(req.body, 'id');

  let query = getRejectTemoignageQuery(id);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

module.exports = router;
