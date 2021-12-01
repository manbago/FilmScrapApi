const Sequelize = require('sequelize');

const FilmModel = require('./models/films');
const UserModel = require('./models/users');

const sequelize = new Sequelize('filmBD', 'manbago', 'rostro', {
    host: 'localhost',
    dialect: 'mysql',
});

const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: true })
.then(() => {
    console.log('Database & tables created!');
});

module.exports = {
    Film,
    User,
};