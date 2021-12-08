const Sequelize = require('sequelize');

const FilmModel = require('./models/films');
const UserModel = require('./models/users');

const sequelize = new Sequelize('filmbd', 'manbago', 'rostro', {
    host: 'localhost',
    dialect: 'mysql',
});

const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

//sequelize.sync({ force: true })
sequelize.sync()
.then(() => {
    console.log('Database & tables created!');
});

module.exports = {
    Film,
    User,
};