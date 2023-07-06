var express = require('express');
var router = express.Router();
const { executeQuery } = require('../db')

router.get('/init/db', async function (req, res) {
  let initQuery = `
  CREATE DATABASE garage_db;
  `;
  await this.executeQuery(initQuery);
  return;
});

router.get('/init/grants', async function (req, res) {
  let initQuery = `CREATE USER username;
  GRANT ALL PRIVILEGES ON DATABASE garage_db TO username;
`;

  await this.executeQuery(initQuery);
  return;
});


router.get('/init/tables', async function (req, res) {
  let query =
`
DROP TABLE IF EXISTS formulaire;
  CREATE TABLE public.formulaire (
    id SERIAL,
    nom varchar(50) NULL,
    prenom varchar(50) NULL,
    email varchar(100) NULL,
    telephone varchar(15) NULL,
    message text NULL,
    service_id int4 NULL,
    date_creation date NULL,
    CONSTRAINT formulaire_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ;
  
  DROP TABLE IF EXISTS horaire;
  CREATE TABLE public.horaire (
    id SERIAL,
    jour varchar(255) NULL,
    horaire varchar(255) NULL,
    date_creation date NULL,
    CONSTRAINT horaire_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ;
  INSERT INTO horaire (jour, horaire) VALUES ('lundi', '09:00 - 06:00'), ('mardi', '09:00 - 06:00'), ('mercredi', '09:00 - 06:00'), ('jeudi', '09:00 - 06:00'), ('vendredi', '09:00 - 06:00'), ('samedi', '09:00 - 06:00'), ('dimanche', 'Closed');
  
  DROP TABLE IF EXISTS profiles;
  CREATE TABLE public.profiles (
    id SERIAL,
    "name" varchar(10) NULL
  )
  WITH (
    OIDS=FALSE
  );
  INSERT INTO profiles (name) values ('admin'),('employe');
  
  DROP TABLE IF EXISTS service_type;
  CREATE TABLE public.service_type (
    id SERIAL,
    service_type varchar(10) NULL,
    CONSTRAINT service_type_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ;
  INSERT INTO service_type (service_type) VALUES ('service'), ('car');
  
  DROP TABLE IF EXISTS services;
  CREATE TABLE public.services (
    id SERIAL,
    nom varchar(50) NULL,
    model varchar(50) NULL,
    prix float8 NULL,
    service_type_id int4 NULL,
    caracteristiques text NULL,
    annee int4 NULL,
    km float8 NULL,
    occasion bool NULL,
    date_creation date NULL,
    picture varchar(50) NULL,
    CONSTRAINT services_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ;
  
  DROP TABLE IF EXISTS temoignage;
  CREATE TABLE public.temoignage (
    id SERIAL,
    nom varchar(255) NULL,
    message varchar(255) NULL,
    note text NULL,
    approved bool NULL DEFAULT false,
    date_creation date NULL,
    CONSTRAINT temoignage_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ;
  
  DROP TABLE IF EXISTS users;
  CREATE TABLE public.users (
    id SERIAL,
    nom varchar(50) NULL,
    prenom varchar(50) NULL,
    email varchar(100) NULL,
    "password" varchar(50) NULL,
    profile_id int4 NULL,
    date_creation date NULL,
    date_modification date NULL,
    telephone varchar(15) NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
  )
  WITH (
    OIDS=FALSE
  ) ; 
  INSERT INTO users (nom, prenom, email, password, profile_id, date_creation, date_modification)
  SELECT 'Vicent', 'Parrot', 'vincent@parrot.com', 'changeme', profiles.id, NOW(), NOW() FROM profiles WHERE name='admin'; 
 `

  const result = await executeQuery(query);
  if (result) {
    res.status(200).json(result.rows)
    return;
  }
});


module.exports = router;
