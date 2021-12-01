module.exports = (sequelize, type) => {
    return sequelize.define('film', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: type.STRING,
            allowNull: false
        },
        description: {
            type: type.STRING,
            allowNull: false
        },
        releaseYear: {
            type: type.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}

// module.exports = (sequelize, type) => {
//     return sequelize.define('film', {
//         id: {
//             type: type.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         title: {
//             type: type.STRING,
//             allowNull: false
//         },
//         description: {
//             type: type.STRING,
//             allowNull: false
//         },
//         imagen: {
//             type: type.STRING,
//             allowNull: false
//         },
//         releaseYear: {
//             type: type.STRING,
//             allowNull: false
//         },
//         playersFilm: {
//             type: type.STRING,
//             allowNull: false
//         },
//         format: {
//             type: type.STRING,
//             allowNull: false
//         },
//         size: {
//             type: type.STRING,
//             allowNull: false
//         },
//         torrent: {
//             type: type.STRING,
//             allowNull: false
//         },
//         urlWeb: {
//             type: type.STRING,
//             allowNull: false
//         }
//     }, {
//         timestamps: false
//     })
// }


            
            //let año = document.querySelector('.d-inline-block p').innerText;

            
            
            