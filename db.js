const Sequelize = require('sequelize');

const FilmModel = require('./models/films');
const UserModel = require('./models/users');
const SerieModel = require('./models/series');
// const ChapterModel = require('./models/chapters');

const sequelize = new Sequelize('filmbd', 'manbago', 'rostro', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000
      }
});

const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Serie = SerieModel(sequelize, Sequelize);
// const Chapter = ChapterModel(sequelize, Sequelize);

//sequelize.sync({ force: true })
sequelize.sync()
.then(() => {
    console.log('Database & tables created!');
});

// Here we can connect countries and cities base on country code
// Serie.hasMany(Chapter, { as: 'chapters' });
// // City.belongsTo(Country, {foreignKey: 'countryCode', targetKey: 'isoCode'});

// Chapter.belongsTo(Serie, {
//     foreignKey: "serieId",
//     as: "serie",
//   });
  

module.exports = {
    Film,
    User,
    Serie,
};


//Create and Save new Comments

// exports.createChapter = (serielId, chapter) => {
//     return Chapter.create({
//         chapter: chapter.td_chapter,
//         fecha: chapter.td_date,
//         torrent: chapter.td_url,
//         serieId: serielId,
//     })
//       .then((comment) => {
//         console.log(">> Created chapter: " + JSON.stringify(chapter, null, 4));
//         return comment;
//       })
//       .catch((err) => {
//         console.log(">> Error while creating chapter: ", err);
//       });
//   };
  
//   //Get the comments for a given tutorial
  
//   exports.findTutorialById = (tutorialId) => {
//     return Tutorial.findByPk(tutorialId, { include: ["comments"] })
//       .then((tutorial) => {
//         return tutorial;
//       })
//       .catch((err) => {
//         console.log(">> Error while finding tutorial: ", err);
//       });
//   };
  
//   //Get the comments for a given comment id
  
//   exports.findCommentById = (id) => {
//     return Comment.findByPk(id, { include: ["tutorial"] })
//       .then((comment) => {
//         return comment;
//       })
//       .catch((err) => {
//         console.log(">> Error while finding comment: ", err);
//       });
//   };
  
//   //Get all Tutorials include comments
  
//   exports.findAll = () => {
//     return Tutorial.findAll({
//       include: ["comments"],
//     }).then((tutorials) => {
//       return tutorials;
//     });
//   };