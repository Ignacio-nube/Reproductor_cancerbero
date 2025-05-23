const dbConnection = require('../config/db.connection');

// Obtener una canción por ID
exports.getSongById = (req, res) => {
  const songId = req.params.songId;
  dbConnection.query('SELECT id, title, artist_name, album_id, genre, duration, file_path, track_number, year FROM songs WHERE id = ?', [songId], (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err.stack);
      res.status(500).send({
        message: 'Error retrieving song with id ' + songId
      });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({
        message: 'Song not found with id ' + songId
      });
      return;
    }
    res.json(results[0]);
  });
};
