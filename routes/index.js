var express = require('express');
var router = express.Router();
const { executeQuery, getUpdateHoraireQuery, getListHoraireQuery, getDeleteHoraireQuery, getInsertHoraireQuery } = require('../db')
const { authenticateToken, authenticateAdminToken } = require('../auth/jwt');
const fs = require('fs');
var path = require('path');
let ejs = require('ejs')

let results = {};
router.get('/login', function(req, res, next) {
  fs.readFile(__dirname+'/../views/login.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/mainadmin', function(req, res, next) {
  fs.readFile(__dirname+'/../views/mainadmin.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/mainemployees', function(req, res, next) {
  fs.readFile(__dirname+'/../views/mainemployees.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/employees', function(req, res, next) {
  fs.readFile(__dirname+'/../views/employees.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/reviews', function(req, res, next) {
  fs.readFile(__dirname+'/../views/reviews.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/servicesadmin', function(req, res, next) {
  fs.readFile(__dirname+'/../views/servicesadmin.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/carsadmin', function(req, res, next) {
  fs.readFile(__dirname+'/../views/carsadmin.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/main', function(req, res, next) {
  fs.readFile(__dirname+'/../views/main.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/carsforsale', function(req, res, next) {
  fs.readFile(__dirname+'/../views/carsforsale.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/Review', function(req, res, next) {
  fs.readFile(__dirname+'/../views/Review.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/formulaire', function(req, res, next) {
  fs.readFile(__dirname+'/../views/formulaire.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});
router.get('/scheduleadmin', function(req, res, next) {
  fs.readFile(__dirname+'/../views/scheduleadmin.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/aboutus', function(req, res, next) {
  fs.readFile(__dirname+'/../views/aboutus.html',  'utf-8', (err, html) => {
    res.send(ejs.render(html, JSON.stringify(results)))
  })
});

router.get('/sale2.jpg', function(req, res, next) {
  fs.readFile(__dirname+'/../views/sale2.jpg', (err, html) => {
    res.send(html)
  })
});

router.get('/logo2.jpg', function(req, res, next) {
  fs.readFile(__dirname+'/../views/logo2.jpg', (err, html) => {
    res.send(html)
  })
});

router.get('/img', function(req, res, next) {
  const name = req.query.name;
  res.sendFile(path.resolve(__dirname+'/../public/uploads/'+name));
});

router.get('/horaire', async function(req, res, next) {
 const query = getListHoraireQuery();
  const result = await executeQuery(query);
  if(result){
    res.status(200).json(result.rows)
    return;
  }
});

router.post('/edit_horaire', authenticateAdminToken, async function(req, res) {
  const services  = req.body;
  let insertQueries = [];
  let deleteQueries = [];
  let ids = [];
  services.forEach(element => {
    let query = getInsertHoraireQuery(element.jour, element.horaire);
    insertQueries.push(query);
    if(element.jour){
      ids.push(element.jour);
      deleteQueries.push(getDeleteHoraireQuery(element.jour));
    }
  });

  const insertQuery = insertQueries.join(';');
  const deleteQuery = deleteQueries.join(';');

  if(deleteQueries.length > 0)
    await executeQuery(deleteQuery);

  const result1 = await executeQuery(insertQuery);
  if(result1){
    res.status(200).json(result1.rows)
    return;
  }
});


module.exports = router;
