const router = require("express").Router();
// const middleware = require("./middlewares");
const apiFilmsRouter = require("./api/films");
const apiUsersRouter = require("./api/users");
const apiSeriesRouter = require("./api/series");
const apiDocsRouter = require("./api/documentales");
const apiVariosRouter = require("./api/varios");

// Evitar tokens en test
//router.use("/films", middleware.checkToken, apiFilmsRouter);
router.use("/films", apiFilmsRouter);

router.use("/users", apiUsersRouter);

router.use("/series", apiSeriesRouter);

router.use("/documentales", apiDocsRouter);

router.use("/varios", apiVariosRouter);

module.exports = router;
