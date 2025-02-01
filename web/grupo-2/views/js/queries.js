const protocolo = 'http://'
const baseURL = 'localhost:3002'

function cadastrarEvento() {
    //pega os inputs que contém os valores que o usuário digitou
    let nomeInput = document.querySelector('#nomeInput')
    let descricaoInput = document.querySelector('#descricaoInput')
    let dataInicioInput = document.querySelector('#dataInicioInput')
    let dataFimInput = document.querySelector('#dataFimInput')
    let horarioInicioInput = document.querySelector('#horarioInicioInput')
    let horarioFimInput = document.querySelector('#horarioFimInput')
    let valorInput = document.querySelector('#valorInput')
    let urlIngressoInput = document.querySelector('#urlIngressoInput')
    let ruaInput = document.querySelector('#ruaInput')
    let numeroInput = document.querySelector('#numeroInput')
    let bairroInput = document.querySelector('#bairroInput')
    let estadoInput = document.querySelector('#estadoInput')
    let cidadeInput = document.querySelector('#cidadeInput')
    let cepInput = document.querySelector('#cepInput')
    let complementoInput = document.querySelector('#complementoInput')
    let categoriaInput = document.querySelector('#categoriaInput')

    //pega os valores digitados pelo usuário
    let nome = nomeInput.value
    let descricao = descricaoInput.value
    let dataInicio = dataInicioInput.value
    let dataFim = dataFimInput.value
    let horarioInicio = horarioInicioInput.value
    let horarioFim = horarioFimInput.value

    let ingresso = {
        valor: valorInput.value,
        urlIngresso: urlIngressoInput.value
    }

    let endereco = {
        rua: ruaInput.value,
        numero: numeroInput.value,
        bairro: bairroInput.value,
        estado: estadoInput.value,
        cidade: cidadeInput.value,
        cep: cepInput.value,
        complemento: complementoInput.value
    }

    let categoria = {
        nome: categoriaInput.value,
        descricao: ""
    }

    if (!nome || !descricao || !dataInicio || !horarioInicio || !horarioFim || !endereco.bairro || !endereco.cep || !endereco.estado || !endereco.cidade || !endereco.numero || !endereco.rua){
        alert("Preencha os campos obrigatórios!")
        return 
    }

    const usuario = JSON.parse(localStorage.getItem("Usuario"))
    console.log(usuario._id)
    if(!usuario){
        alert("Faça login antes de cadastrar um evento!")
        return
    }

        //limpa os campos que o usuário digitou

        console.log(eventos)
        const divAlerta = document.getElementById('alert-evento')
        divAlerta.classList.add('alert-success')
        divAlerta.style.display = "block"
        divAlerta.innerHTML = "Evento cadastrado com sucesso!"
}

async function buscarEventos() {
    try {
        const eventosEndpoint = '/eventos';
        const URLCompleta = `${protocolo}${baseURL}${eventosEndpoint}`;
        
        const response = await axios.get(URLCompleta);
        const eventos = response.data;

        const eventosContainer = document.querySelector('#eventos-list-2');

        // Criando apenas um `.row` para evitar múltiplas criações
        const row = document.createElement('div');
        row.classList.add('row', 'eventos-carousel-3');
        eventosContainer.appendChild(row);

        eventos.forEach(evento => {
            evento.dataInicio = formatarData(evento.dataInicio);
            evento.dataFim = formatarData(evento.dataFim);
            addHtml(evento, row);
        });

    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
    }
}

// Função para formatar datas corretamente (de "YYYY-MM-DD" para "DD/MM")
function formatarData(dataISO) {
    if (!dataISO) return "";  // Verifica se a data é válida
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}`;
}

function addHtml(evento, row) {
    const eventoHtml = document.createElement('div');
    eventoHtml.classList.add('col-sm-4', 'evento-card');
    eventoHtml.dataset.eventoId = evento._id;
    eventoHtml.dataset.eventoNome = evento.nome;

    eventoHtml.innerHTML = `
        <div class="card">
            <img src="img/capa-evento.png" class="card-img-top" alt="Imagem do evento">
            <div class="card-body">
                <h5 class="card-title">${evento.nome}</h5>
                <h6 class="card-subtitle">${evento.dataInicio} - ${evento.horarioInicio}</h6>
                <p class="card-text">${evento.descricao}</p>
                <div class="categories">
                    <span class="card-link">${evento.categoria?.nome || "Sem categoria"}</span>
                </div>
            </div>
        </div>
    `;

    eventoHtml.addEventListener('click', () => {
        window.location.href = `evento.html?id=${evento._id}`;
    });

    row.appendChild(eventoHtml);
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", buscarEventos);

/*
async function buscarEventos(){
    const eventosEndpoint = '/eventos'
    const URLCompleta = `${protocolo}${baseURL}${eventosEndpoint}`
    const eventos = (await axios.get(URLCompleta)).data

    eventos.forEach(evento => {
        let dataInicio = evento.dataInicio 
        let dataInicioSeparada = dataInicio.split('-')
        dataInicio = `${dataInicioSeparada[2]}/${dataInicioSeparada[1]}`
        evento.dataInicio = dataInicio

        let dataFim = evento.dataFim
        let dataFimSeparada = dataInicio.split('-')
        dataFim = `${dataFimSeparada[2]}/${dataFimSeparada[1]}`
        evento.dataFim = dataFim

        addHtml(evento)
    })
}

function addHtml(evento){
    const eventoHtml = document.createElement('div')
    eventoHtml.classList.add('col-sm-4','evento-card')
    eventoHtml.dataset.eventoId = evento._id
    eventoHtml.dataset.eventoNome = evento.nome

    eventoHtml.innerHTML = `
        <div class="card">
            <img src="img/capa-evento.png" class="card-img-top" alt="Imagem do evento">
            <div class="card-body">
                <h5 class="card-title">${evento.nome}</h5>
                <h6 class="card-subtitle">${evento.dataInicio} - ${evento.horarioInicio}</h6>
                <p class="card-text">${evento.descricao}</p>
                <div class="categories">
                    <span class="card-link">${evento.categoria.nome}</span>
                </div>
            </div>
        </div>
    `
    eventoHtml.addEventListener('click', () => {
        window.location.href = `evento.html?id=${evento._id}`
    })

    const eventos = document.querySelector('#eventos-list-2')
    const row = document.createElement('div')
    row.classList.add('row')
    row.classList.add('eventos-carousel-3')
    eventos.appendChild(row)

    row.appendChild(eventoHtml)
}
*/
async function carregarEvento(id){
    const meses = ["jan","fev","mar","abr","maio","jun","jul","ago","set","out","nov","dez"]

    const eventosEndpoint = `/evento/${id}`
    const URLCompletaEvento = `${protocolo}${baseURL}${eventosEndpoint}`
    const evento = (await axios.get(URLCompletaEvento))
    .then((data, err)=>{
        if(err){
            console.log(err);
        }
        let retorno = [];
        //console.log(data.data)
        let newdata = data.data;
        newdata.forEach(function(image) {
            var item = {
                name: image.name,
                desc: image.desc,
                img: {
                    data: image.img.data,
                    contentType: image.img.contentType
                }
            }
            console.log(item)
            retorno.push(item);
        });
        console.log(retorno)
        res.render('imagepage',{items: retorno})
    });


    const titulo = document.querySelector('.event-title')
    titulo.innerHTML = evento.nome

    const descricao = document.querySelector('.event-description-text')
    descricao.innerHTML = evento.descricao

    const descricao1 = document.querySelector('.event-description-text1')
    descricao1.innerHTML = evento.descricao

    const ingresso = document.querySelector('.ticket-value')
    if(evento.ingresso.valor){
        ingresso.innerHTML = "R$" + evento.ingresso.valor + ",00"
    }else if(evento.ingresso.valor == 0){
        ingresso.innerHTML = "GRÁTIS"
    }

    const datahora = document.querySelector('.event-date-time')
    let dataInicio = evento.dataInicio 
    let dataInicioSeparada = dataInicio.split('-')
    dataInicio = `${dataInicioSeparada[2]} de ${meses[parseInt(dataInicioSeparada[1]-1)]}. de ${dataInicioSeparada[0]}`
    
    evento.dataInicio = dataInicio

    datahora.innerHTML = evento.dataInicio + " | " + evento.horarioInicio + " às " + evento.horarioFim

    const local = document.querySelector('.event-location')
    local.innerHTML = evento.endereco.rua + ", " + evento.endereco.numero + " - " +evento.endereco.bairro + " - " + evento.endereco.estado

    const categoria = document.querySelector('.event-categories a')
    categoria.innerHTML = evento.categoria

    const usuarioEndpoint = `/usuario/${evento.usuarioId}`
    const URLCompletaUsuario = `${protocolo}${baseURL}${usuarioEndpoint}`
    const usuario = (await axios.get(URLCompletaUsuario)).data
    console.log(usuario)
    const organizador = document.querySelector('.organizer-name')
    organizador.innerHTML = usuario.nome

    const telefone = document.querySelector('.telefone')
    telefone.innerHTML = usuario.telefone
    
}

async function cadastrarUsuario() {
    let nomeInput = document.querySelector('#nomeCadastroInput')
    let nomeUsuarioInput = document.querySelector('#usuarioCadastroInput')
    let emailInput = document.querySelector('#emailCadastroInput')
    let senhaInput = document.querySelector('#senhaCadastroInput')
    let telefoneInput = document.querySelector('#telefoneCadastroInput')
    let cpfInput = document.querySelector('#cpfCadastroInput')

    let nome = nomeInput.value
    let nomeUsuario = nomeUsuarioInput.value
    let email = emailInput.value
    let senha = senhaInput.value
    let telefone = telefoneInput.value
    let cpf = cpfInput.value

    if (!nome || !nomeUsuario || !email || !senha || !telefone || !cpf){
        exibirAlerta("Preencha todos os campos!", 'alert-danger', 'alert-cadastro')
        return
    }

    // Validação do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      exibirAlerta("CPF inválido! Use o formato 000.000.000-00.", 'alert-danger', 'alert-cadastro');
      return;
    }
      // Validação do e-mail
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        exibirAlerta("E-mail inválido!", 'alert-danger', 'alert-cadastro');
        return;
      }


      // Validação do telefone
      const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/;
      if (!telefoneRegex.test(telefone)) {
        exibirAlerta("Telefone inválido! Use o formato (00) 00000-0000.", 'alert-danger', 'alert-cadastro');
        return;
      }

      // Validação da senha (mínimo 8 caracteres, ao menos 1 letra e 1 número)
      const senhaRegex = /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      if (!senhaRegex.test(senha)) {
        exibirAlerta("Senha inválida!", 'alert-danger', 'alert-cadastro');
        return;
      }

    try {
        const cadastroEndpoint = '/cadastro'
        const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`

        try {
            const usuarioCpf = (await axios.get(`${protocolo}${baseURL}/usuario-cpf/${cpf}`)).data
            if (usuarioCpf[0].cpf){
                exibirAlerta('CPF já cadastrado!', 'alert-danger', 'alert-cadastro')
                return
            }
        } catch {}

        try {
            const usuarioEmail = (await axios.get(`${protocolo}${baseURL}/usuario-email/${email}`)).data
            console.log (usuarioEmail[0].email)
            if (usuarioEmail[0].email){
                exibirAlerta('Email já cadastrado', 'alert-danger', 'alert-cadastro')
                return
            }
        } catch {}

        try {
            const usuarioNomeUsuario = (await axios.get(`${protocolo}${baseURL}/usuario-nome-usuario/${nomeUsuario}`)).data
            console.log (usuarioNomeUsuario[0].nomeUsuario)
            if (usuarioNomeUsuario[0].nomeUsuario){
                exibirAlerta('Esse nome já está em uso, tente outro', 'alert-danger', 'alert-cadastro')
                return
            }
        } catch {}

        const usuario = (await axios.post(URLCompleta, {
                    nome,
                    nomeUsuario,
                    email,
                    senha,
                    telefone,
                    cpf
                }
            )
        ).data

        nomeInput.value = ""
        nomeUsuarioInput.value = ""
        senhaInput.value = ""
        emailInput.value = ""
        cpfInput.value = ""
        telefoneInput.value = ""

        console.log(usuario)

        const divAlerta = document.getElementById('alert-cadastro')
        divAlerta.classList.remove('alert-danger')
        divAlerta.classList.add('alert-success')
        divAlerta.style.display = "block"
        divAlerta.innerHTML = "Usuário cadastrado com sucesso!"
        console.log(divAlerta)
    }
    catch (error) {
        exibirAlerta('Ocorreu um erro ao cadastrar usuário', 'alert-danger', 'alert-cadastro')
        console.log(error)
    }
}

const fazerLogin = async () => {
    let emailLoginInput = document.querySelector('#emailLoginInput')
    let senhaLoginInput = document.querySelector('#senhaLoginInput')

    let email = emailLoginInput.value
    let senha = senhaLoginInput.value

    if (!email || !senha){
        exibirAlerta("Preencha todos os campos!", 'alert-danger', 'alert-login')
        return
    }

    try {
        const loginEndpoint = '/login'
        const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
        const resposta = (await axios.post(URLCompleta, {
                    email: email,
                    senha: senha
                }
            )   
        ).data
        console.log(resposta.usuario)
        localStorage.setItem("Usuario",JSON.stringify(resposta.usuario))
        console.log(localStorage.getItem("Usuario"))

        emailLoginInput.value=""
        senhaLoginInput.value=""
        window.location.href = "index.html"
        alert("Bem-vindo!")

        console.log(divAlerta)
    }catch (error) {
        exibirAlerta(error.response.data.mensagem, 'alert-danger', 'alert-login')
    }
}

function exibirAlerta(alerta, classe, div){
    let divAlerta = document.getElementById(div)
    divAlerta.style.display = "block"
    divAlerta.classList.add(classe)
    divAlerta.innerHTML = alerta
}