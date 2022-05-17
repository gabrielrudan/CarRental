const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const user = "";
const cookieSession = require('cookie-session')
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongodb');
var sessionUser, sessionAdm;
const oneDay = 1000 * 60 * 60 * 24;

app.set('view engine', 'ejs');
app.set('views', './view');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieSession({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}))



app.use(bodyParser.json())
/**Mongo */
const MongoClient = require('mongodb').MongoClient
const connctionString = 'mongodb+srv://leh-torres:sweetland@cluster0.uhidp.mongodb.net/car-rental-db?retryWrites=true&w=majority'

// const redirectHome = (req,res,next) =>{
//   if(req.session.userId){
//     res.render('index');
//   }else{
//     next();
//   }
// }

MongoClient.connect(connctionString, {
  useUnifiedTopology: true})
    .then(client => {
      console.log('Conexao Estabelecida')
      const db = client.db('car-rental-db')
      const frasesCollection = db.collection('frases')

      const usuariosCollection = db.collection('usuarios')
      const adminsCollection = db.collection('admins')
      const carsCollection = db.collection('cars')
      const alugueisCollection = db.collection('alugueis')

      var idUser;

      /**Sessão */
      const redirectLogin = (req,res,next) =>{
        sessionUser = req.session;
        if(!sessionUser.userId){
          res.render('login_usuario_alert', {alerta: "Falha no login, logar novamente!"});
        }else{
          next();
        }
      }

      const redirectLoginAdm = (req,res,next) =>{
        sessionAdm = req.session;
        if(!sessionAdm.userIdAdm){
          res.render('login_usuario_alert', {alerta: "Falha no login, logar novamente!"});
        }else{
          next();
        }
      }

      const redirectHomeUsu = (req,res,next) =>{
        sessionUser = req.session;
        if(sessionUser.userId){
          carsCollection.find().toArray()
          .then(results => {
            res.render('loja_usuario',{title: 'Página da Loja', pagina:'Página da Loja', carros: results});
          })
          .catch(error => console.error(error))
        }else{
          next();
        }
      }

      app.get('/', (req, res) => {
        db.collection('cars').find().toArray()
          .then(results => {
            // const { user } = res.locals;
            res.render('index', {carros: results});
          })
          .catch(error => console.error(error))
      })
            
      app.get('/sign-in',redirectHomeUsu, (req, res) => {
        res.render('login_usuario', {title: 'Página de login', pagina:'Página de login'});
      })
      
      app.get('/sign-up', (req, res) => {
        res.render('cadastrar_usuario',{title: 'Página de Cadastrar', pagina:'Página de Cadastrar'});
      })

      app.post('/segin-in',redirectHomeUsu, (req, res) => {
        let cont = 0;
        usuariosCollection.find().toArray()
          .then(results => {
            for(let i = 0; i<results.length; i++){
              if(req.body.email == results[i].email_user && req.body.senha == results[i].senha_user){
                cont = 1;
                sessionUser = req.session;
                sessionUser.userId = req.body.email;
                idUser = results[i]._id;
                console.log(req.session)
                res.redirect('loja_usuario');
              }
            }
            if(cont == 0){
              adminsCollection.find().toArray()
              .then(results => {
                for(let i = 0; i<results.length; i++){
                  if(req.body.email == results[i].email_user && req.body.senha == results[i].senha_user){
                    cont = 1;
                    sessionAdm = req.session;
                    sessionAdm.userIdAdm = req.body.email;
                    console.log(req.session)
                    res.redirect('admin-loja');
                  }
                }
                if(cont == 0){
                  res.render('login_usuario_alert', {alerta: "Usuário inválido"});
                }
              })
            }
          })
          .catch(error => console.error(error))
      })

      app.get('/logout', (req,res) =>{
        req.session = null;
        console.log(req.session);
        res.redirect('/');
      })

      app.get('/loja_usuario',redirectLogin, (req, res, next) => {
        console.log(req.session);
          carsCollection.find().toArray()
          .then(results => {
            res.render('loja_usuario', {carros: results});
          })
          .catch(error => console.error(error))
      })

      app.post('/cadastrar-usuario', (req, res) => {
        /**Pra fazer funcionar os campos que vão ser salvos no banco tem que ter o atributo name */
        let cont2 = 0;
        usuariosCollection.find().toArray()
          .then(results => {
            for(let i = 0; i<results.length; i++){
              if(req.body.email_user == results[i].email_user ){
                cont2 = 1;
                res.render('cadastrar_usuario _alert', {alerta: 'Email já cadastrado!'});
              }
            }
          })
          .catch(error => console.error(error))
        if(cont2 == 0){
        usuariosCollection.insertOne(req.body)
        .then(results => {
          console.log(results)
          res.redirect('/')
        })
        .catch(error => console.error(error))
        }
      })

      app.post('/cadastrar-aluguel', (req, res) => {
        /**Pra fazer funcionar os campos que vão ser salvos no banco tem que ter o atributo name */
        let cont2 = 0,valor;
        alugueisCollection.find().toArray()
          .then(results => {
            for(let i = 0; i<results.length; i++){
              if(req.body.data_inicio == results[i].data_inicio ){
                cont2 = 1;
                res.render('menu-alugar',{alerta: 'Data inválida'})
              }
            }
          })
          .catch(error => console.error(error))
        valor = req.body.data_final - req.body.data_inicio;
        if(cont2 == 0){
        alugueisCollection.insertOne(req.body)
        .then(results => {
          console.log(results)
          res.redirect('/loja-aluguel');
        })
        .catch(error => console.error(error))
        }
      })

      app.get('/loja', (req, res) => {
        db.collection('cars').find().toArray()
          .then(results => {
            res.render('loja_usuario',{title: 'Página da Loja', pagina:'Página da Loja', carros: results});
          })
          .catch(error => console.error(error))
      })

      app.get('/loja-alugar',redirectLogin, (req, res) => {
        carsCollection.find().toArray()
        .then(results => {
        for(let i=0 ; i<results.length; i++){
          if(req.query.cod == results[i]._id){
            res.render('menu_alugar',{idUser: idUser,idCarro: results[i]._id,marca: results[i].marca, nome: results[i].nome, cor: results[i].cor, diaria: results[i].diaria});
          }
        }
        })
      })

      app.get('/admin-loja',redirectLoginAdm, (req, res) => {
        carsCollection.find().toArray()
        .then(results => {
          res.render('admin_loja',{title: 'Página da Loja do Admin', pagina:'Página da Loja do Admin', carros: results});
        })
        .catch(error => console.error(error))
      })

      app.get('/loja-aluguel',redirectLogin, (req, res) => {
        var elementos = new Array;
        console.log(idUser);
        alugueisCollection.find().toArray()
        .then(results => {
          for(let i=0; i<results.length; i++){
            if(idUser == results[i].idUser){
              console.log(results[i])
              elementos.push(results[i]);
            }
          }
        })
        res.render('menu_alugueis',{elementos: elementos, cont: 1});
      })

      app.get('/loja-conta', (req, res) => {
        usuariosCollection.find().toArray()
        .then(results => {
          for(let i = 0; i < results.length; i++){
            if(req.session.userId == results[i].email_user){
              res.render('menu_conta',{title: 'Página de Alugar', pagina:'Página de Alugar', usuario: results[i]});
            }
          }
        })
        .catch(error => console.error(error))
      })

      app.post('/loja-conta-update', (req, res) => {
        usuariosCollection.find().toArray()
        .then(results => {
          for(let i = 0; i < results.length; i++){
            if(req.session.userId == results[i].email_user){
              var id_usuario = results[i]._id 
            }
          }

          usuariosCollection.updateOne({_id: ObjectId(id_usuario)}, {
            $set: {
              nome_user: req.body.novo_nome,
              data_nascimento_user: req.body.nova_data,
              genero_user: req.body.novo_genero,
              telefone_user: req.body.novo_telefone,
              email_user: req.body.novo_email
            }
          })
          res.redirect('/loja-conta')
        })
        .catch(error => console.error(error))
      })

      app.post('/loja-conta-update-senha', (req, res) => {
        var senha_atual = req.body.senha_atual
        var nova_senha = req.body.nova_senha
        var conf_nova_senha = req.body.conf_nova_senha

        usuariosCollection.find().toArray()
        .then(results => {
          for(let i = 0; i < results.length; i++){
            if(req.session.userId == results[i].email_user){
              var id_usuario = results[i]._id
              var senha_atual_usuario = results[i].senha_user
            }
          }

          if(senha_atual == senha_atual_usuario){
            if((nova_senha != senha_atual) && (nova_senha == conf_nova_senha)){
              usuariosCollection.updateOne({_id: ObjectId(id_usuario)}, {
                $set:{
                  senha_user: conf_nova_senha
                }
                  
              })
            }
          }
          res.redirect('/loja-conta')
        })
        .catch(error => console.error(error))
      })


      app.get('/admin-aluguel', (req, res) => {
        var alugueis = {};
        var cont;
        alugueisCollection.find().toArray()
        .then(results => {
          for(let i=0; i<results.length; i++){
            if(results[i].aprovacao == false){
              alugueis[cont++] = results[i];
            }
          }
        })
        res.render('admin_alugueis',{alugueis: alugueis});
      })

      app.get('/admin-usuario', (req, res) => {
        res.render('admin_usuarios',{title: 'Página de Usuários do Admin', pagina:'Página de Usuários do Admin'});
      })

      app.get('/admin-add-carro', (req, res) => {
        res.render('cadastrar_carro',{title: 'Página de Cadastrar Carro do Admin', pagina:'Página de Cadastrar Carro do Admin'});
      })

      app.post('/cadastrar-carro', (req, res) => {
        carsCollection.insertOne(req.body)
        .then(results => {
          console.log(results)
          res.redirect('/admin-loja')
        })
        .catch(error => console.error(error))
      })

      app.get('/admin-delete-carro', (req, res) => {
        //deletar carro
      })

      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      })

    })
    .catch(error => console.error(error))

      
      

