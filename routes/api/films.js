const router = require('express').Router();

const { Film } = require("../../db");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




router.get("/", async (req, res) => {

    const pageAsNumber = parseInt(req.query.page);
    const sizeAsNumber = parseInt(req.query.size);

    let page=0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber>0) {
        page = pageAsNumber;
    }

     let size=10;
    if (sizeAsNumber > 0 && sizeAsNumber < 100){
        console.log("sizeAsNumber", sizeAsNumber);
        size = sizeAsNumber;
    }

      const data = await Film.findAndCountAll({ 
        atributes: ['id', 'title', 'description', 'imagen', 'releaseYear', 'playersFilm', 'format', 'size', 'torrent','urlWeb'],
        limit: size,
        offset: page * size
       })

    //res.status(200).json(data)
    res.send({
        content: data.rows,
        totalPages: Math.ceil(data.count / size),
        totalFilms: data.count,
        thisPage: page
    })
    
  });


// router.get("/", async (req, res) => {
//     console.log(req.usuarioId);
//     const films = await Film.findAll({limit:10, offset:0})
//     res.json(films);
// });



router.post("/", async (req, res) => {

    const film = await Film.create(req.body);
    res.json(film);

});

router.put("/:filmId", async(req, res) => {
    await Film.update(req.body, {
        where: { id: req.params.filmId }
    });
    res.json({ success: "se ha modificado" })
});

router.delete("/:filmId", async(req, res) => {
    await Film.destroy({
        where: { id: req.params.filmId }
    });
    res.json({ success: "se ha eliminado" });
});  

router.get("/search", async (req, res) => {
    let { term } = req.query;

    term = term.toLowerCase();

    Film.findAll({
        where: { title: { [Op.like]: `%${term}%` } } })
        .then(films => res.send(films))
        .catch(error => res.send(error));

});

module.exports = router;