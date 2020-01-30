var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var Pool = require('pg').Pool;
var server = express();
server.listen(8080);
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static('public'));



var config = {
  host: "localhost",
  user: "akli",
  password: "2503",
  database: "Easycar"
};


var con = new Pool(config);


server.use(
  session({
  secret: 'User',
  resave: false,
  saveUninitialized: false,
  })
);

var sess;


server.get('/', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    res.render('home.ejs');
  }
});



server.get('/inscription_statut', function (req, res) {

  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    res.render('inscription_statut.ejs');
  }
});

server.post('/statut', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    var sql_voiture_dispo = "SELECT * FROM vehicule WHERE dispo ='true'";
    con.query(sql_voiture_dispo, function(err ,result){
      if(err){throw err;}
	     if(req.body.role == "Client"){
         res.redirect('/inscription_client');
       }
       else if(req.body.role == "Chauffeur" ){
         if(result.rows.length > 0){
           res.redirect('/inscription_chauffeur');
         }
         else{
           res.render('no_car.ejs');
         }
       }
       else{
         res.setHeader('Content-Type', 'text/html');
         res.write('<p> Veuillez choisir un statut  </p> <br> <a href="/inscription_statut"> Recommencer </a>');
         res.end()
       }
     });
   }
});





server.get('/inscription_client', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
	   res.render('inscription_client.ejs');
  }
});

server.post('/new_client', function(req, res){
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    var existe_deja = "SELECT * FROM Users where login= ($1)";
    con.query(existe_deja,[req.body.pseudo], function(err, result){
      if(err){throw err;}

      if(result.rows.length == 0){
        if(req.body.pseudo != ""){
          var ajoute_client = "INSERT INTO Client (prenom, nom, email, login, password,statut) VALUES ($1, $2, $3, $4, $5,'true') RETURNING *";
          con.query(ajoute_client,[req.body.prenom, req.body.nom, req.body.email, req.body.pseudo, req.body.mot_de_passe], function(err, result){
            if(err){throw err;}
            res.render("connexion.ejs");
          });
        }
        else{
          res.setHeader('Content-Type', 'text/html');
          res.write('<p> Vous devez obligatoirement remplir le champs pseudo </p>  <br> <a href="/inscription_client"> Recommencer </a>');
          res.end();
        }
      }
      else{
        res.render('existe_deja.ejs');
      }
    });
  }
});




server.get('/inscription_chauffeur', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    var sql_voiture_dispo = "SELECT * FROM Vehicule WHERE dispo ='true' ";
    con.query(sql_voiture_dispo, function(err ,result){
      if(err){throw err;}
      res.render('inscription_chauffeur.ejs', {voitures_dispo:result.rows});
	   });
   }
});

server.post('/new_chauffeur', function(req, res){
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    var existe_deja = "SELECT * FROM Users where login= ($1)";
    con.query(existe_deja,[req.body.pseudo], function(err, result){
      if(err){throw err;}
      if(result.rows.length == 0){
        if(req.body.pseudo != ""){
          var ajoute_chauffeur = "INSERT INTO Chauffeur (prenom,nom,email,login,password,statut,voiture) VALUES ($1, $2, $3, $4, $5,'false',$6) RETURNING *";
          con.query(ajoute_chauffeur,[req.body.prenom, req.body.nom, req.body.email, req.body.pseudo, req.body.mot_de_passe, req.body.vehicule], function(err, result){
            if(err){throw err;}
            res.render("connexion.ejs");
          });
          var voiture_prise = "UPDATE Vehicule SET dispo ='false' WHERE id_car = ($1)";
          con.query(voiture_prise,[req.body.vehicule] , function(err ,result){
            if(err){throw err;}
          });
        }
        else{
          res.setHeader('Content-Type', 'text/html');
          res.write('<p> Vous devez obligatoirement remplir le champs pseudo </p>  <br> <a href="/inscription_client"> Recommencer </a>');
          res.end();
        }
      }
      else{
        console.log(result.rows.length);
        res.render('existe_deja.ejs');
      }
    });
  }
});




server.get('/connexion', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut == 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    res.render('connexion.ejs');
  }
});

server.post('/login', function (req, res) {
  s = req.session;
  if(s.id_users){
    if(s.statut = 'true'){
      res.render('profil_client.ejs', {login:s.login});
    }
    else{
      res.render('profil_chauffeur.ejs', {login:s.login});
    }
  }
  else{
    var existe_deja = "SELECT * FROM Users where login= ($1)";
    con.query(existe_deja,[req.body.pseudo], function(err, result){
      if(err){throw err;}
      if(result.rows.length != 0){
          if(result.rows[0].password == req.body.mot_de_passe){
            if(result.rows[0].statut === true){
              s.id_users = result.rows[0].id_users;
              s.prenom =result.rows[0].prenom;
              s.nom=result.rows[0].nom;
              s.email=result.rows[0].email;
              s.login=result.rows[0].login;
              s.password=result.rows[0].password;
              s.statut='true';
              res.render('profil_client.ejs', {login:s.login});
            }
            else{
              var existe_deja = "SELECT * FROM Chauffeur where login= ($1)";
              con.query(existe_deja,[req.body.pseudo], function(err, result){
                if(err){throw err;}
                s.id_users = result.rows[0].id_users;
                s.prenom = result.rows[0].prenom;
                s.nom = result.rows[0].nom;
                s.email = result.rows[0].email;
                s.login = result.rows[0].login;
                s.password =result.rows[0].password;
                s.statut = 'false';
                s.voiture = result.rows[0].voiture;
                s.libre =  result.rows[0].libre;
                s.course= null;
                res.render('profil_chauffeur.ejs', {login:s.login});
              });
            }
          }
          else{
            res.setHeader('Content-Type', 'text/html');
            res.write('<p> Mauvais mot de passe </p>  <br> <a href="/connexion"> Recommencer </a>');
            res.end();
          }
        }
        else{
          res.setHeader('Content-Type', 'text/html');
          res.write('<p> Cet utilisateur n\'existe pas  </p> <br> <a href="/connexion"> Recommencer </a> <br>Si vous\'avez pas de compte, <a href="/inscription_statut"> Inscrivez-vous </a>' );
          res.end();
        }
      });
    }
});

server.get('/profil_client' ,function(req,res){
  s = req.session;
  if(s.id_users){
    res.render('profil_client.ejs', {login:s.login});
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});


server.get('/profil_chauffeur' ,function(req,res){
  s = req.session;
  if(s.id_users){
    res.render('profil_chauffeur.ejs', {login:s.login});
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});



server.get('/type_reservation' ,function(req,res){
  s = req.session;
  if(s.id_users){
    res.render('type_reservation.ejs');
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});

server.post('/reserver' , function(req,res){
  s =req.session;
  if(s.id_users){
    var cout;
    var chauffeur_pris;
    if(req.body.categorie == 'ex'){
      cout = 10;
    }
    else if(req.body.categorie == 'super'){
      cout = 15;
    }
    else{
      cout = 20;
    }
    if(req.body.type == 'immediate'){
      var existe_chauffeur = "SELECT * FROM Chauffeur,Vehicule WHERE Chauffeur.voiture = Vehicule.id_car AND Chauffeur.libre ='true' AND Vehicule.type =($1)";
      con.query(existe_chauffeur, [req.body.categorie], function(err, result){
        if(err){throw err;}

        if(result.rows.length > 0){
          var chauffeur_pris = result.rows[0].id_users;
          console.log(result.rows[0].id_chauffeur);
          console.log(result.rows);
          var reserve_course = "INSERT INTO Course (adresse_depart,adresse_arrivé,date_debut_course,prix,categorie,id_client,id_chauffeur) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4,$5,$6) RETURNING *";
          con.query(reserve_course,[req.body.adresse_depart, req.body.adresse_arrivé, cout, req.body.categorie, s.id_users,chauffeur_pris], function(err, result){
            if(err){throw err;}
            res.setHeader('Content-Type', 'text/html');
            res.write('<p> Course enregistree </p> <br> <a href="/profil_client">Revenir au profil</a>');
            res.end();
          });
        }
        else{
          res.setHeader('Content-Type', 'text/html');
          res.write('<p> Pas de chauffeur disponible pour cette categorie </p> <br> <a href="/profil_client">Revenir au profil</a>');
          res.end();
        }
      });

    }
    else{
      var existe_chauffeur = "SELECT * FROM Chauffeur,Vehicule WHERE Chauffeur.voiture = Vehicule.id_car AND Chauffeur.libre ='true' AND Vehicule.type =($1)";
      con.query(existe_chauffeur, [req.body.categorie], function(err, result){
        if(err){throw err;}

        if(result.rows.length > 0){
          console.log(result.rows[0].id_chauffeur);
          console.log(result.rows);
          chauffeur_pris = result.rows[0].id_users;
          var reserve_course = "INSERT INTO Course (adresse_depart,adresse_arrivé,date_debut_course,prix,categorie,id_client,id_chauffeur) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *";
          con.query(reserve_course,[req.body.adresse_depart, req.body.adresse_arrivé,req.body.date_debut_course, cout, req.body.categorie, s.id_users,chauffeur_pris], function(err, result){
            if(err){throw err;}
            res.setHeader('Content-Type', 'text/html');
            res.write('<p> Course enregistree</p> <br> <a href="/profil_client">Revenir au profil</a>');
            res.end();
          });
        }
        else{
          res.setHeader('Content-Type', 'text/html');
          res.write('<p> Pas de chauffeur disponible pour cette categorie </p> <br> <a href="/profil_client">Revenir au profil</a>');
          res.end();
        }
      });
    }
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});




server.get('/gestion',  function(req,res){
  s = req.session;
  if(s.id_users){
	   var course_dispo = "SELECT * FROM Chauffeur,Vehicule,Course WHERE Course.etat = 'en attente' AND Vehicule.id_car = ($1)";
	   con.query(course_dispo,[s.voiture], function(err ,result){
	     if(err){throw err;}
	      res.render('gestion.ejs', {course_dispo:result.rows , libre:s.libre}  );
     });
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});

server.post('/action_chauffeur' , function(req, res){
  s = req.session;
  if(s.id_users){
    if(req.body.course_begin){
      var course_selectionnée = "UPDATE Course SET etat = 'en cours'  WHERE id_chauffeur = ($1) AND id_course = ($2) ";
      con.query(course_selectionnée,[s.id_users,req.body.course_begin], function(err ,result){
 	      if(err){throw err;}
      });
      var chauffeur_plus_disponible = "UPDATE Chauffeur SET libre = 'false' WHERE id_users = ($1)";
      con.query(chauffeur_plus_disponible,[s.id_users], function(err ,result){
 	     if(err){throw err;}
       s.libre = false;
       s.course = req.body.course_begin;
       res.setHeader('Content-Type', 'text/html');
       res.write('<p> course selectionnee , bonne chance </p> <br> <a href="/profil_chauffeur">Revenir au profil</a>');
       res.end();
      });
    }
    else {
      if(req.body.course_end){
      var course_terminée = "UPDATE Course SET etat ='finie'  WHERE id_chauffeur = ($1) AND id_course = ($2)";
      con.query(course_terminée,[s.id_users,s.course], function(err ,result){
 	     if(err){throw err;}
      });
      var course_terminée = "UPDATE Course SET date_fin_course = CURRENT_TIMESTAMP  WHERE id_chauffeur = ($1) AND id_course = ($2)";
      con.query(course_terminée,[s.id_users,s.course], function(err ,result){
 	     if(err){throw err;}
      });
      var chauffeur_redisponible = "UPDATE Chauffeur SET libre ='true' WHERE id_users = ($1)";
      con.query(chauffeur_redisponible,[s.id_users], function(err ,result){
 	     if(err){throw err;}
       s.libre = true;
       s.course = null;
       res.setHeader('Content-Type', 'text/html');
       res.write('<p> course terminee , bon travail </p> <br> <a href="/profil_chauffeur">Revenir au profil</a>');
       res.end();
      });
    }
      else{
        res.setHeader('Content-Type', 'text/html');
        res.write('<p> Pas de course pour le moment , reposez-vous </p> <br> <a href="/profil_chauffeur">Revenir au profil</a>');
        res.end();
      }
    }
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});


server.get('/historique',  function(req,res){
  s = req.session;
  if(s.id_users){
	   var course_dispo = "SELECT * FROM Course WHERE Course.id_chauffeur = ($1) AND Course.etat ='finie' ";
	   con.query(course_dispo,[s.id_users], function(err ,result){
		    if(err){throw err;}
        res.render('historique.ejs', {course_dispo:result.rows});
	   });
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});



server.get('/deconnexion', function (req, res) {
  s = req.session;
  if(s.id_users){
  req.session.destroy(function(err) {
    if(err) throw err;
    console.log('session détruite');
    res.redirect('/');
  });
  }
  else{
    console.log("accès refusé");
    res.redirect('/');
  }
});
