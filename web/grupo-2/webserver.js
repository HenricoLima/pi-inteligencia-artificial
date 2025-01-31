const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser');
const dotenv = require('dotenv')
const router = express.Router()
const axios = require('axios')


const path = __dirname + '/views/';

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var corsOptions = {
  origin: 'https://kit.fontawesome.com/e2a2c1e4a6.js',
  optionsSuccesStatus: 200
}

app.use(cors(corsOptions))

router.use(function (req,res,next){
  console.log('/' + req.method);
  next();
})

router.get('/', function (req,res){
  res.sendFile(path + '/index.html');
})

app.use(express.static('views'));

app.use('/',router);

const port = 8082;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});

