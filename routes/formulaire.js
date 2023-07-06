var express = require('express');
var router = express.Router();
const { executeQuery, getInsertFormulaireQuery, getListFormulaireQuery } = require('../db')
const { authenticateToken } = require('../auth/jwt');
const { validateEmail } = require('../utils.js');
const { extractParamsFromObject } = require('../utils.js');

 

router.get('/list', authenticateToken, async function(req, res, next) {

  let query = getListFormulaireQuery();

  const result = await executeQuery(query);
  if(result){
    // return results to client
    res.status(200).json(result.rows);
    return;
  }
});

router.post('/add',  async function(req, res) {
  let { nom, prenom, email, telephone, message } = req.body;
  
  if(!nom || !prenom || !email || !telephone || !message){
    res.status(400).json("Missing params"); 
    return;
  }
  if(!validateEmail(email)){
    res.status(400).json("Email not valid");
    return;
  }
  

  let query = getInsertFormulaireQuery(nom, prenom, email, telephone, message);
  
  const result = await executeQuery(query);
  if(result){
    res.status(200).json(result.rows)
    return;
  }
});

 


 
module.exports = router;
