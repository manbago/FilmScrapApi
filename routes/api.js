const router = require("express").Router();
const middleware = require("./middlewares");
const apiFilmsRouter = require("./api/films");
const apiUsersRouter = require("./api/users");

// Evitar tokens en test
//router.use("/films", middleware.checkToken, apiFilmsRouter);
router.use("/films", apiFilmsRouter);

router.use("/users", apiUsersRouter);

module.exports = router;
