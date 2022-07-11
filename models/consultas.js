'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static Crear(nom,asu,desc){
      this.create({
        Usuario:nom,
        Asunto:asu,
        Descripcion:desc
      })
    }
  }
  Consultas.init({
    Usuario: DataTypes.STRING,
    Asunto: DataTypes.STRING,
    Descripcion: DataTypes.STRING,
    Respuesta: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Consultas',
  });
  return Consultas;
};