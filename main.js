const express = require('express')
const app = express()
const port = 3000
const path = require('path');
//const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');
app.set('views', './view');
app.use(express.static(path.join(__dirname, '/public')));
/*app.use(cookieSession({
  name: 'session',
  // keys: ['c293x8b6234z82n938246bc2938x4zb234'],
  secret: 'c293x8b6234z82n938246bc2938x4zb234',
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))*/



app.get('/', (req, res) => {
  res.render('index');
})

app.get('/sign-in', (req, res) => {
  res.render('login_usuario', {title: 'Página de login', pagina:'Página de login'});
})

app.get('/sign-up', (req, res) => {
  res.render('cadastrar_usuario',{title: 'Página de Cadastrar', pagina:'Página de Cadastrar'});
})

app.get('/loja', (req, res) => {
  res.render('loja_usuario',{title: 'Página da Loja', pagina:'Página da Loja'});
})

app.get('/loja-alugar', (req, res) => {
  res.render('menu_alugar',{title: 'Página de Alugar', pagina:'Página de Alugar'});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
