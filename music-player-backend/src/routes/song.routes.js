module.exports = app => {
  const songs = require("../controllers/song.controller.js");

  var router = require("express").Router();

  // Obtener una canción por ID
  router.get("/:songId", songs.getSongById);

  app.use('/api/songs', router);
};
