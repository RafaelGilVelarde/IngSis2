'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        this.belongsTo(models.Usuario,{
          foreignKey:'UsuarioID',
          allowNull: false,
          targetKey: 'id'
        })
    }
  }
  Calificacion.init({
    Calificador: DataTypes.STRING,
    Calificacion: DataTypes.INTEGER,
    Comentario: DataTypes.STRING,
    UsuarioID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Calificacion',
  });
  return Calificacion;
};