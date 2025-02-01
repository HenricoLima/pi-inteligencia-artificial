const express = require('express')
const axios = require('axios')
const FormData = require('form-data');
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config();
app.set("view engine", "ejs");

const port = 3002
dotenv.config()
//const uri = process.env.grupo2.MONGODB_URL
const uri = 'mongodb://root:senha@mongo:27017/'
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

async function conectarAoMongo() {
    console.log(process.env);
    await mongoose.connect(uri, {})
}

app.listen(port, () => {
    try {
        conectarAoMongo()
        console.log(`Servidor rodando na port ${port}`)
    } catch (error) {
        console.log("Erro", error)
    }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 100MB file size limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
  }


/*Schemas*/
const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

/*const Categoria = new mongoose.Schema({ 
    nome: String,
    descricao: String
})*/

const usuarioSchema = new mongoose.Schema({
    nomeUsuario: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    logo_url: {
        type: String
    }
})

usuarioSchema.plugin(uniqueValidator)
const Usuario = new mongoose.model('Usuario', usuarioSchema)

const ImageSchema = new mongoose.Schema({
    eventoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Eventos'  
    },
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
const Image = new mongoose.model('images', ImageSchema)

const Evento = new mongoose.model('Evento', mongoose.Schema({
    nome: String,
    descricao: String,
    usuario: String,
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'  
    },
    dataInicio: String,
    dataFim: String,
    horarioInicio: String,
    horarioFim: String,
    ingresso: {
        valor: Number,
        urlIngresso: String
    },
    endereco: {
        rua: String,
        numero: Number,
        bairro: String,
        estado: String,
        cep: String,
        complemento: String
    },
    categoria: String,
    local: {
        type: PointSchema,
        // required: true,
        index: '2dsphere'
    },
    dataCriacao: Date
}))

/*Requisições*/
app.get('/eventos', async(req, res) => {
    const eventos = await Evento.find().sort({ data: -1 }).limit(9)
    res.status(201).json(eventos)
})

/*app.get('/imagem-evento/:id', async(req, res) => {
    try {
        let retorno = []
        //console.log(data.data)
        await Image.find({eventoId: req.params.id}).then((data, err)=>{
            if(err){
                console.log(err);
            }
            data.forEach(function(image) {
                var item = {
                    name: image.name,
                    desc: image.desc,
                    img: {
                        data: image.img.data.toString('base64'),
                        contentType: image.img.contentType
                    }
                }
                retorno.push(item)
            })
        })
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(retorno))
    } catch (error){
        console.log(error)
    }
});*/

app.get('/evento/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        const evento = await Evento.findById(req.params.id)
        if (!evento) {
            return res.status(404).send("Evento não encontrado");
        }
        try {
            let retorno = []
            //console.log(data.data)
            await Image.find({eventoId: req.params.id}).then((data, err)=>{
                if(err){
                    console.log(err);
                }
                data.forEach(function(image) {
                    var item = {
                        name: image.name,
                        desc: image.desc,
                        img: {
                            data: image.img.data.toString('base64'),
                            contentType: image.img.contentType
                        }
                    }
                    console.log(item)
                    retorno.push(item)
                })
            })
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(retorno))
        } catch (error){
            console.log(error)
        }
    } catch (error){
        res.status(500).send(error)
    }
})

app.get('/usuario/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        const usuario = await Usuario.findById(req.params.id)
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

app.get('/usuario-cpf/:cpf', async(req, res) => {
    console.log(req.params.cpf)
    try {
        const usuario = await Usuario.find({cpf: `${req.params.cpf}`})
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

app.get('/usuario-nome-usuario/:nome', async(req, res) => {
    console.log(req.params.nome)
    try {
        const usuario = await Usuario.find({nomeUsuario: `${req.params.nome}`})
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

app.get('/usuario-email/:email', async(req, res) => {
    console.log(req.params.email)
    try {
        const usuario = await Usuario.find({email: `${req.params.email}`})
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

  app.get('/', (req, res) => {
    Image.find({})
    .then((data, err)=>{
        if(err){
            console.log(err);
        }
        let retorno = [];
        data.forEach(function(image) {
            var item = {
                name: image.name,
                desc: image.desc,
                img: {
                    data: image.img.data.toString('base64'),
                    contentType: image.img.contentType
                }
            }
            retorno.push(item)
        })
        //console.log(JSON.stringify(retorno))
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(retorno))
//        res.render('imagepage',{items: data})
    })
});

app.post('/', async(req, res) => {
    upload(req, res, (err) => { 
        if (err) {
            res.send(err);
        }
        else {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
            }
        
        salvaArquivo(req,res);
        res.redirect('http://localhost:8002/')
        }

    }) 
});
async function salvaEvento(req) {
    try {

        const { usuario, nome, descricao, dataInicio, dataFim, horarioInicio, horarioFim, valor, urlIngresso, rua, numero, bairro, estado, cidade, cep, complemento, select } = req.body;
        console.log(select)
        const ingresso = { valor, urlIngresso };
        const endereco = { rua, numero, bairro, estado, cidade, cep, complemento };

        const evento = new Evento({
            usuario,
            nome,
            descricao,
            dataInicio,
            dataFim,
            horarioInicio,
            horarioFim,
            ingresso,
            endereco,
            categoria: select
        });
        console.log(evento.categoria)

        return await evento.save();
    } catch (erro) {
        console.error("Erro ao salvar evento:", erro);
        throw erro;
    }
}

async function salvaArquivo(req,res) {
    const caminhoImagem = path.join(__dirname + '/uploads/' + req.file.filename)

    const descImagem = await sendImageToAPI(caminhoImagem)
    const eventoSalvo = await salvaEvento(req)
    console.log("Evento salvo---" + eventoSalvo + "---evento salvo")
        
    const idEvento = eventoSalvo.id
    var obj = {
        eventoId: idEvento+"",
        desc: descImagem,
        img: {
            data: fs.readFileSync(caminhoImagem),
            contentType: 'image/png'
        }
    }
    
    Image.create(obj)
    .then ((result) => {
    }).catch((err) => {{

        res.send(err)}
    });
}

async function sendImageToAPI(imagePath) {
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(imagePath)); // Lê a imagem do disco
    try {
        console.log("conectando a API de imagem")
        const result = await axios.post('http://backend-image:9001/imagens', formData, {
            headers: formData.getHeaders() // Define os cabeçalhos necessários para multipart/form-data
            
        },);
        const highestPrediction = Object.entries(result.data).reduce((max, entry) => {
            const [label, confidence] = entry;
            return confidence > max.confidence ? { label, confidence } : max;
        }, { label: null, confidence: -Infinity });
        const response = highestPrediction.label
        console.log(response)
        return response;
    } catch(error) {
        console.log(error)
    }
}

app.post('/cadastro', async(req, res) => {
    try {
        const nome = req.body.nome
        const nomeUsuario = req.body.nomeUsuario
        const email = req.body.email
        const senha = req.body.senha
        const telefone = req.body.telefone
        const cpf = req.body.cpf
        
        const cryptografada = await bcrypt.hash(senha, 10)
        const usuario = new Usuario({
            nome: nome,
            nomeUsuario: nomeUsuario,
            email: email,
            senha: cryptografada,
            telefone: telefone,
            cpf: cpf
        })

        const usuarioSalvo = await usuario.save()
        res.status(201).json(usuarioSalvo)

    }catch(error){
        console.log(error)
        res.status(409).send("Erro ao cadastrar usuário")
    }
})

app.post('/login', async(req, res) => {
    try{
        const email = req.body.email
        const senha = req.body.senha

        const usuario = await Usuario.findOne({
            email: email
        })

        if(!usuario){
            return res.status(401).json({ mensagem: "Email inválido" })
        }

        const verificacaoSenha = await bcrypt.compare(senha, usuario.senha)
        if(!verificacaoSenha){
            return res.status(401).json({ mensagem: "Senha inválida" })        
        }

        const token = jwt.sign({ email: email },
            'chave-secreta', { expiresIn: '1h'}
        )
        res.status(200).json({ token: token, usuario: usuario })
        
    }catch(error){
        console.log(error)
        res.status(409).send("Erro ao fazer login")
    }
})