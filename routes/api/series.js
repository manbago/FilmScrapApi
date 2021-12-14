const router = require("express").Router();

const { Serie } = require("../../db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const cors = require("cors");
router.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  })
);

router.get("/", async (req, res) => {
  const pageAsNumber = parseInt(req.query.page);
  const sizeAsNumber = parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 24;
  if (sizeAsNumber > 0 && sizeAsNumber < 100) {
    console.log("sizeAsNumber", sizeAsNumber);
    size = sizeAsNumber;
  }

  const data = await Serie.findAndCountAll({
    order: [["id", "DESC"]],
    atributes: [
      "id",
      "title",
      "description",
      "imagen",
      "numchapters",
      "releaseYear",
      "format",
      "torrent",
      "episodios",
      "urlWeb",
    ],
    limit: size,
    offset: page * size,
  });

  res.send({
    content: data.rows,
    totalPages: Math.ceil(data.count / size),
    totalFilms: data.count,
    thisPage: page,
  });
});

router.post("/", async (req, res) => {
  const film = await Serie.create(req.body);
  res.json(film);
});

router.put("/:serieId", async (req, res) => {
  await Serie.update(req.body, {
    where: { id: req.params.serieId },
  });
  res.json({ success: "se ha modificado" });
});

router.delete("/:serieId", async (req, res) => {
  await Serie.destroy({
    where: { id: req.params.filmId },
  });
  res.json({ success: "se ha eliminado" });
});

router.get("/search", async (req, res) => {
  let { term } = req.query;
  //term = term.toLowerCase();

  const data = await Serie.findAndCountAll({
    atributes: [
        "id",
        "title",
        "description",
        "imagen",
        "numchapters",
        "releaseYear",
        "format",
        "torrent",
        "episodios",
        "urlWeb",
      ],
    where: { title: { [Op.like]: `%${term}%` } },
  });

  res.send({
    content: data.rows,
    totalSeries: data.count,
  });
});

router.get("/:serieId", async (req, res) => {
  console.log(req.params.serieId);
  const serie = await Serie.findByPk(req.params.serieId);
  console.log(serie);
  res.send(serie);
});

module.exports = router;
