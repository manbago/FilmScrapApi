module.exports = (sequelize, type) => {
    return sequelize.define(
      "documentales",
      {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: type.STRING,
          allowNull: false,
        },
        type: {
          type: type.STRING,
          allowNull: true,
        },
        description: {
          type: type.STRING,
          allowNull: false,
        },
        imagen: {
          type: type.STRING,
          allowNull: true,
        },
        numEpisodios: {
          type: type.STRING,
          allowNull: true,
        },
        format: {
          type: type.STRING,
          primaryKey: true,
        },
        torrent: {
          type: type.STRING,
          allowNull: true,
        },
        urlWeb: {
          type: type.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    );
  };
  