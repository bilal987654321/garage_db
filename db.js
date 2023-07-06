const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'dawn-surf-635.internal',
  database: 'postgres',
  password: 'tmweNIOxBPMIx4m',
  port: 5432,
})

module.exports.getDatabasePool = async () => {
  if (!pool) await startDatabasePool();
  return pool;
}

// convert function as promise

async function executeQuery(params) {
    return new Promise((resolve, reject) => {
        pool.query(params, function (error, result, fields) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

// Services
function getInsertCarQuery(nom, model, prix, caracteristiques, picture, annee, km, occasion){
  return "INSERT INTO services (nom, model, prix, caracteristiques, picture, annee, km, occasion, service_type_id, date_creation) SELECT '"+nom+"', '"+model+"', "+prix+", '"+caracteristiques+"',  '"+picture+"', "+annee+", "+km+", "+occasion+", service_type.id, NOW() FROM service_type where service_type.service_type='car';";
}

function getInsertServiceQuery(nom, prix){
  return "INSERT INTO services (nom, prix, occasion, service_type_id, date_creation) SELECT '"+nom+"', "+prix+", false,service_type.id, NOW() FROM service_type where service_type.service_type='service';";
}

function getDeleteServiceQuery(id){
  return "DELETE FROM services WHERE id = "+id;
}

function getUpdateQuery(nom, model, prix, caracteristiques, annee, km, occasion, id){
  return "UPDATE services set nom = '"+nom+"', model = '"+model+"', prix = "+prix+", caracteristiques = '"+caracteristiques+"', annee = "+annee+", km = "+km+", occasion = "+occasion+" WHERE id="+id;
}

function getServicesListQuery(order_by, order){
  return "SELECT services.id, nom, prix, occasion, service_type.service_type, services.date_creation FROM services INNER JOIN service_type on service_type.id = services.service_type_id and service_type.service_type ='service' ORDER BY "+order_by+" "+order+"";
}
function getCarsListQuery(order_by, order, occasion, priceRange, mileageRange, yearRange){
  return "SELECT services.id, nom, model, picture, prix, caracteristiques, annee, km, occasion, service_type.service_type, services.date_creation FROM services INNER JOIN service_type on service_type.id = services.service_type_id and service_type.service_type ='car' and services.occasion="+occasion+" AND services.km <= "+mileageRange+"  AND services.prix <= "+priceRange+"  AND services.annee <= "+yearRange+" ORDER BY "+order_by+" "+order+"";
}

// Users
function getUsersQuery(){
  return 'select users.id, nom, prenom, email, password, profiles.name as profile, date_creation from public.users INNER JOIN profiles on profiles.id = users.profile_id';
}
function getCheckPasswordQuery(email, password){
  return "SELECT nom, prenom, email, password, profiles.name as profile, date_creation FROM users INNER JOIN profiles on profiles.id=users.profile_id WHERE email = '"+email+"' and password='"+password+"'";
}

function getUserByEmailQuery(email){
  return "SELECT nom FROM public.users WHERE email = '"+email+"'";
}

function getInsertEmployeQuery(nom, prenom, telephone, email, password){
  return "INSERT INTO public.users (nom, prenom, email, telephone, password, profile_id, date_creation, date_modification) SELECT '"+nom+"', '"+prenom+"', '"+email+"',  '"+telephone+"', '"+password+"', profiles.id, NOW(), NOW() FROM profiles where profiles.name='employe'";
}
function getUpdateUserQuery(nom, prenom, email, id){
  return  "UPDATE users set nom = '"+nom+"', prenom = '"+prenom+"', email = '"+email+"' WHERE id="+id;
}

function getUpdatePasswordQuery(oldPassword, newPassword, id){
  return "UPDATE users set password = '"+newPassword+"' WHERE id="+id+ " AND password = '"+oldPassword+"'";
}

// Formulaire
function getInsertFormulaireQuery(nom, prenom, email, telephone, message){
  return "INSERT INTO formulaire (nom, prenom, email, telephone, message, date_creation) VALUES ('"+nom+"', '"+prenom+"', '"+email+"', '"+telephone+"', '"+message+"', NOW())";
}

function getListFormulaireQuery(){
  return `SELECT formulaire."id", formulaire."nom", formulaire."prenom", formulaire."email",  formulaire."telephone", formulaire."message", services."id" AS service_id, services."nom" AS service, formulaire."date_creation" FROM "public"."formulaire" LEFT JOIN services ON services.id = formulaire.service_id`
}

// Horaire
function getUpdateHoraireQuery(jour, horaire){
  return "UPDATE horaire set horaire = '"+horaire+"' WHERE jour="+jour;
}
function getDeleteHoraireQuery(jour){
  return "DELETE FROM horaire WHERE jour='"+jour+"'";
}
function getInsertHoraireQuery(jour, horaire){
  return "INSERT INTO horaire (jour, horaire) VALUES('"+jour+"', '"+horaire+"')";
}

// Horaire
function getListHoraireQuery(jour, horaire){
  return "SELECT * FROM horaire";
}

// Temoignage

function getInsertTemoignageQuery(nom, message, note){
  return "INSERT INTO temoignage (nom, message, note, date_creation) VALUES ('"+nom+"', '"+message+"', '"+note+"', NOW())";
}
function getApproveTemoignageQuery(id){
  return "UPDATE temoignage SET approved=true WHERE id = "+id+"";
} 

function getRejectTemoignageQuery(id){
  return "DELETE FROM temoignage WHERE id = "+id+"";
} 
function getListTemoignageQuery(approved){
  return `SELECT "id", "nom", "message", "note", "approved", "date_creation" FROM "public"."temoignage" WHERE approved=`+approved;
}


module.exports = {
  pool, executeQuery, 
  // services
  getInsertCarQuery, getDeleteServiceQuery, getInsertServiceQuery, getUpdateQuery, getServicesListQuery, getCarsListQuery,
  // users
  getCheckPasswordQuery, getUserByEmailQuery, getInsertEmployeQuery, getUpdateUserQuery, getUpdatePasswordQuery, getUsersQuery,
  // formulaire
  getInsertFormulaireQuery, getListFormulaireQuery,
  // temoignage
  getInsertTemoignageQuery, getApproveTemoignageQuery,getRejectTemoignageQuery, getListTemoignageQuery,
  // horaire
  getUpdateHoraireQuery, getListHoraireQuery, getDeleteHoraireQuery, getInsertHoraireQuery
}