module.exports = app => {
  const albums = require("../controllers/album.controller.js");

  var router = require("express").Router();

  // Obtener todos los álbumes
  router.get("/", albums.getAllAlbums);

  // Obtener un álbum por ID con sus canciones
  router.get("/:albumId", albums.getAlbumById);

  app.use('/api/albums', router);
};
