const dbConnection = require('../config/db.connection');

// Obtener todos los álbumes
exports.getAllAlbums = (req, res) => {
  dbConnection.query('SELECT id, name, artist_name, year, cover_art_vida_path, cover_art_muerte_path, description FROM albums', (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err.stack);
      res.status(500).send({
        message: 'Error retrieving albums'
      });
      return;
    }
    res.json(results);
  });
};

// Obtener un álbum por ID con sus canciones
exports.getAlbumById = (req, res) => {
  const albumId = req.params.albumId;
  const query = `
    SELECT 
      a.id as album_id, a.name as album_name, a.artist_name as album_artist, a.year as album_year, 
      a.cover_art_vida_path, a.cover_art_muerte_path, a.description,
      s.id as song_id, s.title as song_title, s.artist_name as song_artist, s.album_id as song_album_id, 
      s.genre as song_genre, s.duration as song_duration, s.file_path as song_file_path, 
      s.track_number as song_track_number, s.year as song_year
    FROM albums a
    LEFT JOIN songs s ON a.id = s.album_id
    WHERE a.id = ?
  `;

  dbConnection.query(query, [albumId], (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err.stack);
      res.status(500).send({
        message: 'Error retrieving album with id ' + albumId
      });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({
        message: 'Album not found with id ' + albumId
      });
      return;
    }

    // Formatear la respuesta para agrupar canciones bajo el álbum
    const albumDetails = {
      id: results[0].album_id,
      name: results[0].album_name,
      artist_name: results[0].album_artist,
      year: results[0].album_year,
      cover_art_vida_path: results[0].cover_art_vida_path,
      cover_art_muerte_path: results[0].cover_art_muerte_path,
      description: results[0].description,
      songs: []
    };

    results.forEach(row => {
      if (row.song_id) { // Si hay canciones asociadas
        albumDetails.songs.push({
          id: row.song_id,
          title: row.song_title,
          artist_name: row.song_artist,
          album_id: row.song_album_id,
          genre: row.song_genre,
          duration: row.song_duration,
          file_path: row.song_file_path,
          track_number: row.song_track_number,
          year: row.song_year
        });
      }
    });
    res.json(albumDetails);
  });
};
