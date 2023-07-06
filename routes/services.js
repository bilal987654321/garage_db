var express = require('express');
var router = express.Router();
const { executeQuery, getInsertCarQuery, getInsertServiceQuery, getDeleteServiceQuery, getUpdateQuery, getServicesListQuery, getCarsListQuery } = require('../db')
const { authenticateToken, authenticateAdminToken } = require('../auth/jwt');
const { move } = require('../utils.js');

router.get('/list', async function (req, res, next) {

  let { service_type, order_by, order, occasion, prixRange, anneeRange, mileageRange } = req.query;

  if (order_by == undefined || !['nom', 'prix', 'anne', 'km'].includes(order_by))
    order_by = 'nom';
  if (order == undefined || !['asc', 'desc'].includes(order))
    order = "asc";
  if (occasion == undefined || !["0", "1"].includes(occasion))
    occasion = 0;

  if(prixRange == undefined){
    prixRange = 99999;
  }

  if(anneeRange == undefined){
    anneeRange = 99999;
  }

  if(mileageRange == undefined)
  {
    mileageRange = 999999999;
  }

  let query = getCarsListQuery(order_by, order, true, prixRange, mileageRange, anneeRange);

  if (service_type == 'service') {
    query = getServicesListQuery(order_by, order);
  }

  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

router.post('/add_service', authenticateAdminToken, async function (req, res) {
  const { nom, model, prix, caracteristiques, annee, km, occasion } = req.body;

  let query = getInsertServiceQuery(nom, model, prix, caracteristiques, annee, km, occasion);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

const fs = require('fs')
const ejs = require('ejs')
router.post('/add_car', async function (req, res) {
  const { nom, model, prix, caracteristiques, annee, km } = req.body;

  const file = req.files.picture.file;
  const file_name = req.body.name + req.files.picture.filename;
  move(file, './public/uploads/' + req.body.name + req.files.picture.filename)

  console.log("Upload success");
  let query = getInsertCarQuery(nom, model, prix, caracteristiques, file_name, annee, km, true);
  const result = await executeQuery(query);
  if (result) {
    res.redirect('/carsadmin');
  }

});


router.post('/edit', authenticateAdminToken, async function (req, res) {
  const { id, nom, model, prix, caracteristiques, annee, km, occasion } = req.body;

  const query = getUpdateQuery(nom, model, prix, caracteristiques, annee, km, occasion, id);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});

router.post('/delete_service', authenticateAdminToken, async function (req, res) {
  const { id } = req.body;

  const query = getDeleteServiceQuery(id);
  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});
router.post('/edit_services', authenticateToken, async function (req, res) {
  const services = req.body;
  let insertQueries = [];
  let deleteQueries = [];
  let ids = [];
  services.forEach(element => {
    let query = getInsertServiceQuery(element.nom, element.prix);
    insertQueries.push(query);
    if (element.id) {
      ids.push(element.id);
      deleteQueries.push(getDeleteServiceQuery(element.id));
    }
  });

  const insertQuery = insertQueries.join(';');
  const deleteQuery = deleteQueries.join(';');

  if (deleteQueries.length > 0)
    await executeQuery(deleteQuery);

  const result1 = await executeQuery(insertQuery);
  if (result1) {
    res.status(200).json(result1.rows)
    return;
  }
});


const stringToBoolean = (stringValue) => {
  return (stringValue == "1" || stringValue == 1);
}

module.exports = router;
