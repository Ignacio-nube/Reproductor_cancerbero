const express = require("express");
const bodyParser = require("body-parser"); // Aunque no se use explícitamente para POST/PUT aquí, es una buena práctica incluirlo.
const path = require("path");

const app = express();

// Servir archivos estáticos
// __dirname es /app/music-player-backend
// Las carpetas img y music están en /app/
app.use('/api/img', express.static(path.join(__dirname, '../img')));
app.use('/api/music', express.static(path.join(__dirname, '../music')));

// parse requests of content-type - application/json
app.use(bodyParser.json()); // Para futuras expansiones si se añaden endpoints POST/PUT

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); // Para futuras expansiones

// Ruta simple de bienvenida
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Music Player API." });
});

// Incluir rutas de álbumes
require("./src/routes/album.routes.js")(app);

// Incluir rutas de canciones
require("./src/routes/song.routes.js")(app);

// Configurar puerto y escuchar peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log("To run the server: node server.js");
  console.log("Make sure your MySQL database 'music_player_db' is created and accessible with the credentials in src/config/db.config.js.");
  console.log("The required tables are 'albums' and 'songs'.");
});
