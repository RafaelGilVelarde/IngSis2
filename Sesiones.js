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
                // req.session.username=Usuario.Nombre
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
            }else {
                console.log("Contraseña o Usuario incorrecto")
            }
        }
    })

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
    }
})
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
                Freelancer: req.session.username,
    })    
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (Usuario.Correo==req.session.Correo){ 
            Usuario.update(
                {
                    'Trabajos':Sequelize.fn('array_append', Sequelize.col('Trabajos'), titulo),
                }
            );
            res.redirect('/Solicitantes')
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
                    'Solicitantes':Sequelize.fn('array_append', Sequelize.col('Solicitantes'), req.session.username),
                }
            );
        }
        if(req.session.username==Usuario.Nombre){
            Usuario.update(
                {
                    'Solicitudes':Sequelize.fn('array_append', Sequelize.col('Solicitudes'), titulo),
                }
            ); 
        }
    })
                
    res.redirect('/Main')
})
app.get('/Solicitantes',async(req,res)=>{
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.username==Usuario.Nombre){
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
            Nombre: req.session.username
        }
    });

    const Pen=Usuario.Pendientes
    const Sol=Usuario.Solicitantes
    const Con=await db.Usuario.findOne({
        Nombre: Sol[ind]
    })

    const Soli=Con.Solicitudes
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
    for(let i=0;i<Soli.length;i++){
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
            /*let cont=Usuario.Solicitantes.length
            let Pen=Usuario.Pendientes
            let So=Usuario.Solicitantes
            for(let i=0;i<cont;i++){
                if(Usuario.Solicitantes[i]==Sol && Usuario.Pendientes[i]==Trab){
                    console.log(Usuario.Solicitantes[i]+": "+i)
                    console.log(Usuario.Pendientes[i]+": "+i)
                    Pen.splice(i,1)
                    So.splice(i,1)
                    console.log(So[i]+":Splice "+i)
                    console.log(Pen[i]+":Splice "+i)
                }
            }            
            console.log(Pen)
            console.log(So)  
            Usuario.Pendientes=Pen
            Usuario.Solicitantes=So
            await Usuario.save()*/
        
            /*
            Usuario.Solicitantes.forEach((Solic)=>{   
                    i++             
                    if(Solic==Sol){
                        Usuario.Pendientes.forEach(async(tr)=>{  
                            if(tr=Trab){
                                console.log("I: "+i)

                                const Pend=Usuario.Pendientes.filter(Pen=>Usuario.Pendientes.indexOf(Pen)!=i)
                                Usuario.Pendientes=Pend
                                const Soli=Usuario.Solicitudes.filter(Soli=>Usuario.Solicitudes.indexOf(Soli)!=i)
                                Usuario.Solicitudes=Soli
                                if(Sel=="Aceptar"){
                                    Usuario.update(
                                        {
                                            'Conexiones':Sequelize.fn('array_append', Sequelize.col('Conexiones'),Sol),
                                            'Aceptados':Sequelize.fn('array_append', Sequelize.col('Aceptados'), Trab),
                                        })
                                }
                                await Usuario.save()
                                
                                
                                Usuario.update(
                                {
                                    'Solicitantes':Sequelize.fn('array_remove', Sequelize.col('Solicitantes'), Usuario.Solicitantes[2]),
                                    'Pendientes':Sequelize.fn('array_remove', Sequelize.col('Pendientes'), tr)
                                },{'where':{'id': i-1}})
                        
                            }
                         })
                    }
            })
            */
            /*
            Usuario.Pendientes.forEach((Trabajo)=>{
                try{
                    i++
                    Usuario.Solicitantes.forEach((Solicitante)=>{
                        if(Sol==Solicitante && Trab==Trabajo){
                            Aux.forEach((aux)=>{
                                if(aux.Nombre==Sol && aux.Trabajo==Trab){
                                    debug.log("Aux")
                                    if(Sel=="Aceptar"){
                                        aux.update(
                                            {
                                                'Conexiones':Sequelize.fn('array_append', Sequelize.col('Conexiones'), Usuario.Nombre)
                                            })                                        
                                    }
                                    aux.update(
                                        {
                                            'Solicitudes':Sequelize.fn('array_remove', Sequelize.col('Solicitudes'), Trabajo)
                                        },{'where':{'id': i-1}})
                                }
                            })
                            if(Sel=="Aceptar"){
                                Usuario.update(
                                    {
                                        'Conexiones':Sequelize.fn('array_append', Sequelize.col('Conexiones'), Trabajo),
                                        'Aceptados':Sequelize.fn('array_append', Sequelize.col('Aceptados'), Solicitante),
                                    })
                            }
                            console.log("agrsdvc")
                            Usuario.update(
                                {
                                    'Solicitantes':Sequelize.fn('array_remove', Sequelize.col('Solicitantes'), Solicitante),
                                    'Pendientes':Sequelize.fn('array_remove', Sequelize.col('Pendientes'), Solicitante)
                                },{'where':{'d': i-1}})
                        }
                    })
                }
                catch(err){
                    console.log(err)
                }
                
            })*/


    res.redirect('/Solicitantes')    
})
app.get('/Solicitudes',async(req,res)=>{
    const Contar= await db.Usuario.findAll();
    const Trab=await db.Trabajo.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.username==Usuario.Nombre){
            res.render('Solicitudes', {
                Solicitudes: Usuario.Solicitudes,
                Freelancer:Trab
            })
        }
    })    
})
app.get('/Conexiones',async(req,res)=>{
    const Contar= await db.Usuario.findAll();
    Contar.forEach( (Usuario) => {
        if (req.session.usuario==Usuario.Nombre){
            res.render('Conexiones', {
                Conexiones: Usuario.Conexiones
            })
        }
    })    
})

app.get('/Chat',(req,res)=>{
    res.render('Chat')
})
app.get('/',(req,res)=>{
    res.render('Ingresar')
})


app.listen(PORT, () => {
	console.log(`Se ha inicializado el servidor en el puerto ${PORT}`)
})