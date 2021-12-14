const router = require("express").Router();

const { Doc } = require("../../db");
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

  const data = await Doc.findAndCountAll({
    order: [["id", "DESC"]],
    atributes: [
        "id",
        "title",
        "description",
        "imagen",
        "numchapters",
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
    totalDocs: data.count,
    thisPage: page,
  });
});

router.post("/", async (req, res) => {
  const doc = await Doc.create(req.body);
  res.json(doc);
});

router.put("/:docId", async (req, res) => {
  await Doc.update(req.body, {
    where: { id: req.params.docId },
  });
  res.json({ success: "se ha modificado" });
});

router.delete("/:docId", async (req, res) => {
  await Doc.destroy({
    where: { id: req.params.docId },
  });
  res.json({ success: "se ha eliminado" });
});

router.get("/search", async (req, res) => {
  let { term } = req.query;
  //term = term.toLowerCase();

  const data = await Doc.findAndCountAll({
    atributes: [
      "id",
      "title",
      "description",
      "imagen",
      "numchapters",
      "format",
      "torrent",
      "episodios",
      "urlWeb",
    ],
    where: { title: { [Op.like]: `%${term}%` } },
  });

  res.send({
    content: data.rows,
    totalDocs: data.count,
  });
});

router.get("/:docId", async (req, res) => {
  console.log(req.params.docId);
  const doc = await Doc.findByPk(req.params.docId);
  console.log(doc);
  res.send(doc);
});

module.exports = router;
