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
    }
  }
  Usuario.init({
    Nombre: DataTypes.STRING,
    Correo: DataTypes.STRING,
    Contraseña: DataTypes.STRING,
    Tipo: DataTypes.STRING,
    UsID: DataTypes.INTEGER,
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