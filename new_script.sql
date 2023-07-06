CREATE TABLE public.formulaire (
	id int4 NOT NULL DEFAULT nextval('formulaire_id_seq'::regclass),
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

CREATE TABLE public.horaire (
	id int4 NOT NULL DEFAULT nextval('horaire_id_seq'::regclass),
	jour varchar(255) NULL,
	horaire varchar(255) NULL,
	date_creation date NULL,
	CONSTRAINT horaire_pkey PRIMARY KEY (id)
)
WITH (
	OIDS=FALSE
) ;

CREATE TABLE public.profiles (
	id int4 NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
	"name" varchar(10) NULL
)
WITH (
	OIDS=FALSE
) ;

CREATE TABLE public.service_type (
	id int4 NOT NULL DEFAULT nextval('service_type_id_seq'::regclass),
	service_type varchar(10) NULL,
	CONSTRAINT service_type_pkey PRIMARY KEY (id)
)
WITH (
	OIDS=FALSE
) ;

CREATE TABLE public.services (
	id int4 NOT NULL DEFAULT nextval('services_id_seq'::regclass),
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

CREATE TABLE public.temoignage (
	id int4 NOT NULL DEFAULT nextval('temoignage_id_seq'::regclass),
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

CREATE TABLE public.users (
	id int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
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
