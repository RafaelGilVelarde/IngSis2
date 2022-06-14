'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nombre: {
        type: Sequelize.STRING
      },
      Correo: {
        type: Sequelize.STRING
      },
      Contraseña: {
        type: Sequelize.STRING
      },
      Tipo: {
        type: Sequelize.STRING
      },
      Conexiones: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      Pendientes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      Trabajos: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      Aceptados: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      Solicitantes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      Solicitudes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },

      UsID: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuarios');
  }
};