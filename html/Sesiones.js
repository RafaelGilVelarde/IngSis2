const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./dao/models')
app.use(express.static('assets'))
app.set('view engine', 'ejs') 
const PORT = 5000
const app= express()

app.use(express.static('assets'))
app.use(session({
	secret: 'FreelanceCliente',
	resave: false,
	saveUninitialized: false
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(route)

app.set('view engine', 'ejs')


app.get('/Create',(req,res)=>{
    if (cont==0){
        print("Sin Clientes")
    }
    else{
    res.render('Crear')
    }
})
app.post('/Create',async (req,res)=>{
    const cantcorreo=0
    const nom=req.body.usuario_nombre
    const corr=req.body.usuario_correo
    const cont=req.body.usuario_contraseña
    const tipo=req.body.usuario_tipo
    
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (Usuario.Correo==corr){
            cantcorreo++
        }
    })
    if(tipo!=""){
        if (cantcorreo==0){
            await db.empleado.create({
                Correo: corr,
                Contraseña: cont,
                Nombre: nom,
                Tipo: tipo
            })    
            res.redirect('/Logout')}
            else{
                print("Ya existe este correo")
            }
    }
    else{
        print("Falta el tipo")
    }

})

app.get('/Login',(req,res)=>{
    res.render('Ingresar')
})
app.post('/Login',async(req,res)=>{
    const corr = req.body.usuario_correo
    const cont = req.body.usuario_contraseña

    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (Usuario.usuario_correo==corr){
            if (Usuario.usuario_contraseña==cont) {
                // Login correcto
                req.session.username = corr // guardando variable en sesion
                res.redirect('/Logout')
            }else {
                print("Contraseña o Usuario incorrecto")
            }
        }
    })

})
app.get('/Logout',(req,res)=>{
    res.render('Cerrar Sesion')
})
app.post('/Logout',async(req,res)=>{
    req.session.destroy()
    res.redirect('/Login')
})