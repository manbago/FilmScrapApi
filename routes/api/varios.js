const router = require("express").Router();

const { Vario } = require("../../db");
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

  const data = await Vario.findAndCountAll({
    order: [["id", "DESC"]],
    atributes: [
      "id",
      "title",
      "description",
      "imagen",
      "size",
      "fecha",
      "torrent",
      "urlWeb",
    ],
    limit: size,
    offset: page * size,
  });

  res.send({
    content: data.rows,
    totalPages: Math.ceil(data.count / size),
    totalVarios: data.count,
    thisPage: page,
  });
});

router.post("/", async (req, res) => {
  const varios = await Vario.create(req.body);
  res.json(varios);
});

router.put("/:varioId", async (req, res) => {
  await Vario.update(req.body, {
    where: { id: req.params.varioId },
  });
  res.json({ success: "se ha modificado" });
});

router.delete("/:varioId", async (req, res) => {
  await Vario.destroy({
    where: { id: req.params.varioId },
  });
  res.json({ success: "se ha eliminado" });
});

router.get("/search", async (req, res) => {
  let { term } = req.query;
  //term = term.toLowerCase();

  const data = await Vario.findAndCountAll({
    atributes: [
        "id",
        "title",
        "description",
        "imagen",
        "size",
        "fecha",
        "torrent",
        "urlWeb",
      ],
    where: { title: { [Op.like]: `%${term}%` } },
  });

  res.send({
    content: data.rows,
    totalVarios: data.count,
  });
});

router.get("/:varioId", async (req, res) => {
  console.log(req.params.variosId);
  const vario = await Vario.findByPk(req.params.varioId);
  console.log(vario);
  res.send(vario);
});

module.exports = router;
