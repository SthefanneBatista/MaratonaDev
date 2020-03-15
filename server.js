//configurando servidor
const express = require("express")
const server = express()

//configurar servidor para apresentar arquivos extras
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})



//configurar apresentação
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")
    
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    //pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if ( name == "" || email === "" || blood === ""){
        return res.send("Todos os campos são obrigatórios")
    }
    
    //clica duas vezes, ctrl d

    //coloca valores dentro do array
   // donors.push({
     //   name: name,
       // blood: blood,
    //})

   // coloco valores dentro do banco de dados
    const query = `
    INSERT INTO donors("name", "email", "blood")
    VALUE ($1, $2, $3)
    `
    const values = [name, email, blood]

   db.query(query, name, values, function(err){
    
    // fluxo de erro
    if(err) return res.send("erro no banco de dados")
   
    //fluxo ideal
    return res.redirect("/")
})
})

//npm install nunjucks -- usar funcoes dentro do html

//ligar e porta do servidor
server.listen(3000)


//instalar postgres, desmarcar opcao
//pgAdmin
//poe no googl postbird, username: postgres, coloca a senha que escolheu
//create database
//clica em query
//clica no botao verde, cria tabela
//criar coluna: name: name / type: text
//criar coluna: email: email / type: text
//criar coluna: blood: blood / type: text

//Ir para a query: Inserir dados
//INSERT INTO "donors" ("name", "email", "blood")
//VALUES ('')

//Buscar os dados
//SELECT * 
//FROM "donors";

//CONECTAR BANCO DE DADOS: 
//npm install pg