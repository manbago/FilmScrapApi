module.exports = (sequelize, type) => {
  return sequelize.define(
    "films",
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
      description: {
        type: type.STRING,
        allowNull: false,
      },
      imagen: {
        type: type.STRING,
        allowNull: true,
      },
      releaseYear: {
        type: type.STRING,
        allowNull: true,
      },
      playersFilm: {
        type: type.STRING,
        allowNull: true,
      },
      format: {
        type: type.STRING,
        allowNull: true,
      },
      size: {
        type: type.STRING,
        allowNull: true,
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
