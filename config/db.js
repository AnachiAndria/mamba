const { Sequelize } = require('sequelize');

// Connexion à la base de données MySQL
const sequelize = new Sequelize('suivi_cours', 'kely', 'k', {
    host: 'localhost',
    dialect: 'mysql'  // Remplace 'postgres' par 'mysql'
});

module.exports = sequelize;
