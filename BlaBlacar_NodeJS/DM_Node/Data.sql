  \c Easycar;


drop table Course;
drop table Chauffeur;
drop table Client;
drop table Vehicule;
drop table Users;

CREATE TABLE Vehicule (
id_car SERIAL PRIMARY KEY,
type VARCHAR(30) NOT NULL,
modele VARCHAR(30) NOT NULL,
matricule VARCHAR(6) NOT NULL,
dispo BOOLEAN DEFAULT true
);


CREATE TABLE Users(
id_users SERIAL PRIMARY KEY,
prenom VARCHAR(30) NOT NULL,
nom VARCHAR(30) NOT NULL,
email VARCHAR(30),
login VARCHAR(30) NOT NULL,
password VARCHAR(30) NOT NULL,
statut BOOLEAN DEFAULT true
);

/*
true = client
false = chauffeur
*/

CREATE TABLE Chauffeur (
voiture INTEGER references Vehicule(id_car),
libre BOOLEAN DEFAULT true
)INHERITS(Users);

CREATE TABLE Client(
)INHERITS(Users);


CREATE TABLE Course (
id_course SERIAL PRIMARY KEY,
prix INTEGER NOT NULL,
adresse_depart  VARCHAR(30) NOT NULL,
adresse_arrivé VARCHAR(30) NOT NULL,
date_debut_course TIMESTAMP,
date_fin_course TIMESTAMP DEFAULT NULL,
etat VARCHAR(30) DEFAULT 'en attente',
categorie VARCHAR(30) NOT NULL,
id_chauffeur INTEGER UNIQUE NOT NULL,
id_client INTEGER NOT NULL
);


INSERT INTO Vehicule(type,modele,matricule) VALUES ('super','Audi R8', 'A5ZF6Z');
INSERT INTO Vehicule(type,modele,matricule) VALUES ('ultra','BMV I8', 'BFMGP7');
INSERT INTO Vehicule(type,modele,matricule) VALUES ('ex','Renault Laguna', 'AP78SQ');
INSERT INTO Vehicule(type,modele,matricule) VALUES ('super','Citroen C6', 'KQP96Q');
