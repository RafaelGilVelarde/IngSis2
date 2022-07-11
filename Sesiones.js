const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./models')
const { Sequelize } = require('./models')
const app= express()
app.use(express.static('assets'))
app.set('view engine', 'ejs') 
const PORT = 5555
const http = require('http');
//const socketio = require('socket.io');

app.use(session({
	secret: 'FreelanceCliente',
	resave: false,
	saveUninitialized: false
}))
//mensaje
app.use((req, res, next) =>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
//views y assets
app.set('view engine', 'ejs')
app.use(express.static('assets'))


app.get('/Create',(req,res)=>{
    res.render('Crear')
    
})
app.post('/Create',async (req,res)=>{
    let cantcorreo=0
    const nom=req.body.usuario_nombre
    const corr=req.body.usuario_correo
    const cont=req.body.usuario_contraseña
    const tipo=req.body.usuario_tipo
    const pregunta=req.body.usuario_pregunta
    const respuesta=req.body.usuario_respuesta
    const celular=req.body.usuario_celular
    let count=0
    try{
        const Contar= await db.Usuario.findAll()
    Contar.forEach( (Usuario) => {
        if (Usuario.Correo==corr){
            cantcorreo++
        }
        count++
    })
    //const Count=count
    if(tipo!=""){
        if (cantcorreo==0){
            await db.Usuario.create({
                Correo: corr,
                Contraseña: cont,
                Nombre: nom,
                Tipo: tipo,
                Pregunta: pregunta,
                Respuesta: respuesta,
                Celular:celular
                //UsID:Count
            })    
            res.redirect('/Login')
        }
            else{
                console.log("Ya existe este correo")
            }
    }
    else{
        console.log("Falta el tipo")
    }
    }
    catch(err){
        console.log(err)
    }
    

})

app.get('/Login',(req,res)=>{
    res.render('Ingresar')
})
app.post('/Login',async(req,res)=>{
    req.session.destroy()
    const corr = req.body.usuario_correo
    const cont = req.body.usuario_contraseña
    const existe = null;
    const valido = null;

    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (Usuario.Correo==corr){
            if (Usuario.Contraseña==cont) {
                // Login correcto
                // req.session.usuario = Usuario;
                // req.session.usuario.Nombre=Usuario.Nombre
                // req.session.UsID=Usuario.UsID
                // req.session.usuario_correo = Usuario.Correo
                // req.session.usuario_tipo = Usuario.Tipo
                req.session.usuario = Usuario;
                if(req.session.usuario.Tipo=='Freelancer'){
                    res.redirect('/Main')
                }
                else{
                    res.redirect('/Main_cliente')    
                }
            }
            
            else {
                console.log("Contraseña o Usuario incorrecto")
                req.session.message = {
                    type: 'danger',
                    intro: 'ERROR',
                    message: ' - Contraseña o Usuario incorrecto'
                }
                res.redirect('/Login')
            }
        }
        else{
            req.session.message = {
                type: 'danger',
                intro: 'ERROR',
                message: ' - Ingresa los datos correctamente.'
            }
            res.redirect('/Login')
        }
    })

})
app.get('/Recuperar/:Fase',(req,res)=>{
    const fase=req.params.Fase
    if(fase==0){
        req.session.destroy()
        res.render('Recuperar Contraseña',{
            Fase: fase,
        })
    }
    else{
        res.render('Recuperar Contraseña',{
            Fase: fase,
            Pregunta: req.session.pregunta,
        })
    }
    console.log(fase)

})
app.post('/Recuperar/:Fase',async(req,res)=>{
    if(req.params.Fase==0){
        const Usuario=await db.Usuario.findOne({
            where:{
                Correo:req.body.usuario_correo
            }
        })
        if(Usuario!=null){
            req.session.correo=Usuario.Correo
            req.session.pregunta=Usuario.Pregunta
            res.redirect('/Recuperar/1')
        }
        else{
            console.log(Usuario)
            req.session.message = {
                type: 'danger',
                intro: 'ERROR',
                message: ' - No existe esta cuenta'
            }
            res.redirect('/Recuperar/0')
        }
    }
    else{
        const Usuario=await db.Usuario.findOne({
            where:{
                Correo:req.session.correo
            }
        })
        Usuario.RecuperarContraseña(req,res)
    }
})
app.get('/Trabajos',async(req,res)=>{
    if(req.session.usuario==null){
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Freelancer"){
        res.redirect('/Main')
    }
    else{
        const usuario = req.session.usuario;
    const trabajos = await db.Trabajo.findAll({
        order : [
            ['id', 'DESC']
        ]
    });    
    res.render('Visualizar Trabajos', {
        trabajo : trabajos,
        usuario: usuario
    })
    }
    

})
app.get('/Main',(req,res)=>{
    if(req.session.usuario==null){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No has iniciado sesion'
        }
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Cliente"){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No tienes permisos suficientes'
        }
        res.redirect('/Main_cliente')
    }
    else{
    usuario = req.session.usuario
    res.render('Main',{usuario: usuario})
    }
})
app.post('/Main',async(req,res)=>{
    let Sel= req.body.sel
    console.log(Sel)
    switch (Sel){
        case "1":
            res.redirect('/Trabajos')
            break;
        case "2":
            res.redirect('/Solicitantes')
            break;
        case "3":
            res.redirect('/CrearTrabajos')
            break
        case "4":
            res.redirect('/Conexiones')
            break
        case "5":
            res.redirect('/Solicitudes')
            break
        case "6":
            req.session.destroy()
            res.redirect('/Login')
            break;
        case "7":
            res.redirect('/Consultas')
            break;
        case "8":
            console.log('AAA')
            res.redirect('/Calificar')
            break;
    }
})
app.get('/CerrarSesion',(req,res)=>{
    req.session.message = {
        type: 'success',
        intro: 'DONE',
        message: ' - Has cerrado sesion satisfactoriamente.'
    }
    req.session.usuario=null;
    res.redirect('/Login')
}

)
app.get('/Main_Cliente',(req,res)=>{
    if(req.session.usuario==null){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No has iniciado sesion'
        }
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Freelancer"){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No tienes permisos suficientes'
        }
        res.redirect('/Main')
    }
    else{
    usuario = req.session.usuario;
    res.render('Main_Cliente',{usuario: usuario})
    }
})
app.post('/Main_Cliente',async(req,res)=>{
    let Sel= req.body.sel
    console.log(Sel)
    switch (Sel){
        case "1":
            res.redirect('/Trabajos')
            break;
        case "2":
            res.redirect('/Solicitantes')
            break;
        case "3":
            res.redirect('/CrearTrabajos')
            break;
        case "4":
            res.redirect('/Conexiones')
            break;
        case "5":
            res.redirect('/Solicitudes')
            break;
        case "6":
            req.session.destroy()
            res.redirect('/Login')
            break;
        case "7":
            res.redirect('/Consultas')
            break;
        case "8":
            console.log('AAA')
            res.redirect('/Calificar')
            break;
    }
})
app.get('/CrearTrabajos',(req,res)=>{
    if(req.session.usuario==null){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No has iniciado sesion'
        }
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Cliente"){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No tienes permisos suficientes'
        }
        res.redirect('/Main_cliente')
    }
    else{
    res.render('Crear Trabajos')
    }
})
app.post('/CrearTrabajos',async (req,res)=>{
    const titulo=req.body.trabajo_nombre
    const desc=req.body.trabajo_descripcion
    await db.Trabajo.create({
                Titulo: titulo,
                Descripcion: desc,
                Freelancer: req.session.usuario.Nombre,
    })    
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (Usuario.Correo==req.session.Correo){ 
            Usuario.update(
                {
                    'Trabajos':Sequelize.fn('array_append', Sequelize.col('Trabajos'), titulo),
                }
            );
            res.redirect('/Main')
        }
    })
})
app.get('/Solicitar/:nom/:titulo',async(req,res)=>{
    const nom = req.params.nom
    const titulo=req.params.titulo
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (nom==Usuario.Nombre){ 
            Usuario.update(
                {
                    'Pendientes':Sequelize.fn('array_append', Sequelize.col('Pendientes'), titulo),
                    'Solicitantes':Sequelize.fn('array_append', Sequelize.col('Solicitantes'), req.session.usuario.Nombre),
                }
            );
        }
        if(req.session.usuario.Nombre==Usuario.Nombre){
            Usuario.update(
                {
                    'Solicitudes':Sequelize.fn('array_append', Sequelize.col('Solicitudes'), titulo),
                }
            ); 
        }
    })
                
    res.redirect('/Main_cliente')
})
app.get('/Solicitantes',async(req,res)=>{
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.usuario.Nombre==Usuario.Nombre){
            res.render('Solicitantes', {
                Trabajos: Usuario.Pendientes,
                Solicitantes: Usuario.Solicitantes
            })
        }
    })    
})
app.get('/Solicitantes/:index/:Seleccion',async(req,res)=>{
    const ind = req.params.index
    const Sel=req.params.Seleccion
    const Contar= await db.Usuario.findAll();
    console.log(Sel)
    const Usuario=await db.Usuario.findOne({
        where:{
            Nombre: req.session.usuario.Nombre
        }
    });

    const Pen=Usuario.Pendientes
    const Sol=Usuario.Solicitantes
    const Con=await db.Usuario.findOne({
        Nombre: Sol[ind]
    })

    const Soli=Con.Solicitudes
    const SoliCont=Soli.length
    if(Sel=="Aceptar"){
        await Usuario.update(
            {
                'Conexiones':Sequelize.fn('array_append', Sequelize.col('Conexiones'),Sol[ind]),
                'Aceptados':Sequelize.fn('array_append', Sequelize.col('Aceptados'), Pen[ind])
            })
        await Con.update({
            'Conexiones':Sequelize.fn('array_append', Sequelize.col('Conexiones'), Usuario.Nombre)
        })
    }
    for(let i=0;i<SoliCont;i++){
        if(Soli[i]==Pen[ind]){
            Soli.splice(ind,1)
        }
    }

            Pen.splice(ind,1)

            Sol.splice(ind,1)
            console.log("SpliceP: "+Pen)
            console.log("SpliceS: "+Sol)


            await Usuario.update({
                'Pendientes':Pen,
                'Solicitantes':Sol
            }
            );
            await Con.update({
                'Solicitudes':Soli
            })
            await Usuario.save();
            console.log("P: "+Usuario.Pendientes)
            console.log("S: : "+Usuario.Solicitantes)          
    res.redirect('/Solicitantes')    
})
app.get('/Solicitudes',async(req,res)=>{
    if(req.session.usuario==null){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No has iniciado sesion'
        }
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Freelancer"){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No tienes permisos suficientes'
        }
        res.redirect('/Main')
    }
    else{
    const Contar= await db.Usuario.findAll();
    const Trab=await db.Trabajo.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.usuario.Nombre==Usuario.Nombre){
            res.render('Solicitudes', {
                Solicitudes: Usuario.Solicitudes,
                Freelancer:Trab
            })
        }
    })  
}  
})
app.get('/Conexiones',async(req,res)=>{
    if(req.session.usuario==null){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No has iniciado sesion'
        }
        res.redirect('/Login')

    }
    else if(req.session.usuario!=null && req.session.usuario.Tipo=="Cliente"){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' - No tienes permisos suficientes'
        }
        res.redirect('/Main_cliente')
    }
    else{
    console.log("Conexiones")
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.usuario.Nombre==Usuario.Nombre){
            res.render('Conexiones', {
                Conexiones: Usuario.Conexiones,
                Tipo: Usuario.Tipo
            })
        }
    })    
}
})
app.get('/Consultas',async(req,res)=>{
    const Consultas=await db.Consultas.findAll({
        order : [
            ['id', 'DESC']
        ]
    });
    res.render('Consultas',{
        consulta:Consultas,
        Tipo:req.session.usuario.Tipo
    })
})
app.get('/CrearConsulta',(req,res)=>{
    res.render('Crear Consultas')
})
app.post('/CrearConsulta',async(req,res)=>{
    const asunto=req.body.consulta_asunto
    const desc=req.body.consulta_descripcion
    await db.Consultas.Crear(req.session.usuario.Nombre,asunto,desc)
    if(req.session.usuario.Tipo=='Freelancer'){
        res.redirect('/Main')
    }
    else{
        res.redirect('/Main_cliente')    
    }})
app.get('/Consultas/:id',async(req,res)=>{
    res.render('Responder',{
        id: req.params.id
    })
})
app.post('/Consultas/:id',async(req,res)=>{
    const respuesta=req.body.consulta_respuesta
    const id=req.params.id
    const Cons=await db.Consultas.findOne({
        where:{
            id:id
        }
    })
    Cons.update({
        Respuesta:respuesta
    })
    res.redirect('/Consultas')
})
app.get('/Calificar',async(req,res)=>{
    console.log(req.session.usuario)
    const Usuario=await db.Usuario.findAll({
        order : [
            ['id', 'DESC']
        ]
    });
    res.render('Calificar',{
        ses: req.session.usuario.id,
        usuario:Usuario,
        Tipo: req.session.usuario.Tipo
    })
})
app.post('/Calificar',async(req,res)=>{
    const Usuario=await db.Usuario.findAll()

    Usuario.forEach(async(usuario)=>{
        usuario.calificar(req,db)
    })
    if(req.session.usuario.Tipo=='Freelancer'){
        res.redirect('/Main')
    }
    else{
        res.redirect('/Main_cliente')    
    }    
})
app.get('/Calificaciones/:UsID',async(req,res)=>{
    const UsID=req.params.UsID
    const Calificacion=await db.Calificacion.findAll()
    const Usuarios=await db.Usuario.findOne({
        where: {
            id: UsID
        }
    })
    res.render('Calificaciones',{
        calificacion: Calificacion,
        ID: UsID,
        Nombre: Usuarios.Nombre
    })
})
app.get('/Chat',(req,res)=>{
    res.render('Chat')
})
app.get('/',(req,res)=>{
    res.redirect('/Login')
})


app.listen(PORT, () => {
	console.log(`Se ha inicializado el servidor en el puerto ${PORT}`)
})