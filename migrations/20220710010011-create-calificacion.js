'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Calificacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Calificador: {
        type: Sequelize.STRING
      },
      Calificacion: {
        type: Sequelize.INTEGER
      },
      Comentario: {
        type: Sequelize.STRING
      },
      UsuarioID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id',
          as: 'UsuarioID'
        }
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
    await queryInterface.dropTable('Calificacions');
  }
};