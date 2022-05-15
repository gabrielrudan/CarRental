const path = require('path');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', './view');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieSession({
  name: 'session',
  // keys: ['c293x8b6234z82n938246bc2938x4zb234'],
  secret: 'c293x8b6234z82n938246bc2938x4zb234',
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(bodyParser.json())

/**Mongo */
const MongoClient = require('mongodb').MongoClient
const connctionString = 'mongodb+srv://leh-torres:sweetland@cluster0.uhidp.mongodb.net/car-rental-db?retryWrites=true&w=majority'

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

      app.get('/', (req, res) => {
        db.collection('cars').find().toArray()
          .then(results => {
            res.render('index', {carros: results});
          })
          .catch(error => console.error(error))
      })
      
      /*app.get('/show', (req, res)=>{
        db.collection('frases').find().toArray()
          .then(results => {
            res.render('show', {frases: results})
          })
          .catch(error => console.error(error))
          
      })
      
      app.post('/show', (req, res) => {
          frasesCollection.insertOne(req.body)
          .then(result => {
            console.log(result)
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

      app.put('/show', (req, res) => {
        console.log('app.put')
        frasesCollection.findOneAndUpdate(
          {nome: 'Yoda'},
          {
            $set:{
              nome: req.body.name,
              frase: req.body.quote
            }
          },
          {
            upsert: true
          }
        )
          .then(result => {
            console.log(result)
          })
          .catch(error => console.error(error))
      })*/
      
      app.get('/sign-in', (req, res) => {
        res.render('login_usuario', {title: 'Página de login', pagina:'Página de login'});
      })
      
      app.get('/sign-up', (req, res) => {
        res.render('cadastrar_usuario',{title: 'Página de Cadastrar', pagina:'Página de Cadastrar'});
      })

      app.post('/cadastrar-usuario', (req, res) => {
        /**Pra fazer funcionar os campos que vão ser salvos no banco tem que ter o atributo name */
        usuariosCollection.insertOne(req.body)
        .then(results => {
          console.log(results)
          res.redirect('/')
        })
        .catch(error => console.error(error))
      })
      
     // app.listen(port, () => {
     //   console.log(`Example app listening on port ${port}`);
     // })

      app.get('/loja', (req, res) => {
        db.collection('cars').find().toArray()
          .then(results => {
            res.render('loja_usuario',{title: 'Página da Loja', pagina:'Página da Loja', carros: results});
          })
          .catch(error => console.error(error))
      })

    })
    .catch(error => console.error(error))

app.get('/loja-alugar', (req, res) => {
  res.render('menu_alugar',{title: 'Página de Alugar', pagina:'Página de Alugar'});
})

app.get('/loja-aluguel', (req, res) => {
  res.render('menu_alugueis',{title: 'Página de Alugar', pagina:'Página de Alugar'});
})

app.get('/loja-conta', (req, res) => {
  res.render('menu_conta',{title: 'Página de Alugar', pagina:'Página de Alugar'});
})

app.get('/admin-loja', (req, res) => {
  res.render('admin_loja',{title: 'Página da Loja do Admin', pagina:'Página da Loja do Admin'});
})

app.get('/admin-aluguel', (req, res) => {
  res.render('admin_alugueis',{title: 'Página de Aluguéis do Admin', pagina:'Página de Aluguéis do Admin'});
})

app.get('/admin-usuario', (req, res) => {
  res.render('admin_usuarios',{title: 'Página de Usuários do Admin', pagina:'Página de Usuários do Admin'});
})

app.get('/admin-add-carro', (req, res) => {
  res.render('cadastrar_carro',{title: 'Página de Cadastrar Carro do Admin', pagina:'Página de Cadastrar Carro do Admin'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
