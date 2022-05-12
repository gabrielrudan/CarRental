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


/**Mongo */
const MongoClient = require('mongodb').MongoClient
const connctionString = 'mongodb+srv://leh-torres:sweetland@cluster0.uhidp.mongodb.net/car-rental-db?retryWrites=true&w=majority'

MongoClient.connect(connctionString, {
  useUnifiedTopology: true})
    .then(client => {
      console.log('Conexao Estabelecida')
      const db = client.db('car-rental-db')
      const frasesCollection = db.collection('frases')

      app.get('/', (req, res) => {
        res.render('index');
      })
      
      app.get('/show', (req, res)=>{
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
      
      app.get('/sign-in', (req, res) => {
        res.render('login_usuario', {title: 'Página de login', pagina:'Página de login'});
      })
      
      app.get('/sign-up', (req, res) => {
        res.render('cadastrar_usuario',{title: 'Página de Cadastrar', pagina:'Página de Cadastrar'});
      })
      
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      })


    })
    .catch(error => console.error(error))




