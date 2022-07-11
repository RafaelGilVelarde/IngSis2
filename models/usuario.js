'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        this.hasMany(models.Calificacion,{
        foreignKey:'UsuarioID',
        allowNull: false,
        sourceKey:'id'
      })
    }
    async calificar(req,db){
      let modificar=0
      const cal=await db.Calificacion.findOne({
        where:{
          Calificador:req.session.usuario.Nombre,
          UsuarioID:this.id
        }
      })
      if(cal!=null){
        modificar=1
      }
      console.log("mod: "+modificar)      
      if(req.body[this.id]!=null && req.body[this.id]<=10 && req.body[this.id]>=0){
        try{
          if(modificar==0){
            const Cal=await db.Calificacion.create({
                Calificacion:req.body[this.id],
                Comentario: req.body[this.id+" comentario"],
                Calificador:req.session.usuario.Nombre,
            })
            this.addCalificacion(Cal)
          }
          else{
            await cal.update({
              Calificacion:req.body[this.id],
              Comentario: req.body[this.id+" comentario"],
            })
          }
        }
        catch(err){
            console.log(err)
        }
    }
    }

    RecuperarContraseña(req,res){
      if(this.Respuesta==req.body.usuario_respuesta){
        console.log("a")
        req.session.message = {
            type: 'success',
            intro: 'CONTRASEÑA:',
            message: ' '+this.Contraseña
        }
        res.redirect('/Login')
    }
    else{
        console.log("b")
        req.session.message = {
            type: 'danger',
            intro: 'ERROR',
            message: ' Respuesta Incorrecta'
        }
        res.redirect('/Recuperar/1')
    }
    }
  }
  Usuario.init({
    Nombre: DataTypes.STRING,
    Correo: DataTypes.STRING,
    Contraseña: DataTypes.STRING,
    Tipo: DataTypes.STRING,
    UsID: DataTypes.INTEGER,
    Pregunta: DataTypes.STRING,
    Respuesta: DataTypes.STRING,
    Celular: DataTypes.INTEGER,
    Conexiones: DataTypes.ARRAY(DataTypes.STRING),
    Pendientes: DataTypes.ARRAY(DataTypes.STRING),
    Solicitantes: DataTypes.ARRAY(DataTypes.STRING),
    Aceptados: DataTypes.ARRAY(DataTypes.STRING),
    Trabajos: DataTypes.ARRAY(DataTypes.STRING),
    Solicitudes: DataTypes.ARRAY(DataTypes.STRING),

  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};