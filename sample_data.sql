-- Insertar datos de ejemplo para la tabla albums
INSERT INTO `albums` (`name`, `artist_name`, `year`, `cover_art_vida_path`, `cover_art_muerte_path`, `description`) VALUES
('Muerte', 'Canserbero', 2012, '/img/covers/muerte_vida.jpg', '/img/covers/muerte_muerte.jpg', 'Segundo álbum de estudio de Canserbero, explorando temas de muerte, violencia y crítica social.'),
('Vida', 'Canserbero', 2010, '/img/covers/vida_vida.jpg', '/img/covers/vida_muerte.jpg', 'Primer álbum de estudio de Canserbero, enfocado en reflexiones sobre la vida, la superación y la conciencia social.'),
('Apa y Can', 'Apache & Canserbero', 2013, '/img/covers/apaycan_vida.jpg', '/img/covers/apaycan_muerte.jpg', 'Álbum colaborativo entre Apache y Canserbero, mostrando una fusión de estilos y líricas potentes.');

-- Asumimos que los IDs generados para los álbumes son 1, 2 y 3 respectivamente.
-- Si tus IDs son diferentes (ej. UUIDs o empiezan en otro número), ajusta los album_id abajo.

-- Insertar datos de ejemplo para la tabla songs

-- Canciones para el álbum 'Muerte' (album_id = 1)
INSERT INTO `songs` (`title`, `artist_name`, `album_id`, `genre`, `duration`, `file_path`, `track_number`, `year`) VALUES
('C\'est la mort', 'Canserbero', 1, 'Rap Hardcore', 230, '/music/muerte/01_cest_la_mort.mp3', 1, 2012),
('Es Épico', 'Canserbero', 1, 'Rap Hardcore', 361, '/music/muerte/02_es_epico.mp3', 2, 2012),
('Ser Vero', 'Canserbero', 1, 'Rap Conciencia', 228, '/music/muerte/03_ser_vero.mp3', 3, 2012),
('En el Valle de las Sombras', 'Canserbero', 1, 'Rap Hardcore', 335, '/music/muerte/04_en_el_valle_de_las_sombras.mp3', 4, 2012);

-- Canciones para el álbum 'Vida' (album_id = 2)
INSERT INTO `songs` (`title`, `artist_name`, `album_id`, `genre`, `duration`, `file_path`, `track_number`, `year`) VALUES
('Prólogo', 'Canserbero', 2, 'Rap Conciencia', 120, '/music/vida/01_prologo.mp3', 1, 2010),
('Vida', 'Canserbero', 2, 'Rap Conciencia', 245, '/music/vida/02_vida.mp3', 2, 2010),
('Pensando en Ti', 'Canserbero', 2, 'Rap Romántico', 285, '/music/vida/03_pensando_en_ti.mp3', 3, 2010),
('¿Y la felicidad qué?', 'Canserbero', 2, 'Rap Conciencia', 270, '/music/vida/04_y_la_felicidad_que.mp3', 4, 2010);

-- Canciones para el álbum 'Apa y Can' (album_id = 3)
INSERT INTO `songs` (`title`, `artist_name`, `album_id`, `genre`, `duration`, `file_path`, `track_number`, `year`) VALUES
('Ready', 'Apache & Canserbero', 3, 'Rap', 210, '/music/apaycan/01_ready.mp3', 1, 2013),
('Stop', 'Apache & Canserbero', 3, 'Rap', 240, '/music/apaycan/02_stop.mp3', 2, 2013),
('Uno Por Ellas', 'Apache & Canserbero', 3, 'Rap', 275, '/music/apaycan/03_uno_por_ellas.mp3', 3, 2013);

-- Nota: Los valores de duration son ejemplos en segundos.
-- Las rutas de file_path y cover_art_vida_path/cover_art_muerte_path son ejemplos y deben coincidir
-- con la estructura de archivos que el backend/frontend esperará si se implementa la carga de archivos reales.
-- Para este ejercicio, son solo datos de ejemplo.
-- El backend actual sirve archivos estáticos desde la raíz del proyecto, por lo que estas rutas
-- podrían necesitar un prefijo como '/api' o ser manejadas de forma diferente si se sirven directamente
-- desde el frontend vs. el backend. Por ahora, se asume que el backend las sirve directamente.
-- El frontend actualmente prefija las rutas con API_BASE_URL, así que estas rutas deben ser relativas
-- a lo que el backend considera su raíz para servir archivos estáticos. Si el backend sirve 'img' y 'music'
-- desde su raíz, entonces estas rutas son correctas.
-- Por ejemplo, si API_BASE_URL es 'http://localhost:3000/api', y una canción es '/music/muerte/01_cest_la_mort.mp3',
-- el frontend la solicitará como 'http://localhost:3000/api/music/muerte/01_cest_la_mort.mp3'.
-- Esto implica que el backend debe tener una ruta para servir archivos estáticos desde '/music' y '/img'.
-- El `server.js` actual no tiene un `app.use(express.static(...))` configurado para estas carpetas.
-- Esto deberá añadirse al backend `server.js` para que las rutas funcionen como están.
-- Por ejemplo:
-- app.use('/img', express.static('img'));
-- app.use('/music', express.static('music'));
-- Y las carpetas 'img/covers' y 'music/albumX' deben existir en la raíz del proyecto backend.
-- O, si se sirven desde el frontend, las rutas en la BD no deberían tener el prefijo '/api'.
-- Para la prueba con curl, solo la existencia de los datos en la BD es crucial, no el servicio de archivos.
-- Para el frontend, el servicio de archivos es crucial.
-- Los datos de descripción de los álbumes han sido simplificados.
-- Se asume que la tabla `albums` tiene un campo `id` autoincremental.
-- Se asume que la tabla `songs` tiene un campo `id` autoincremental.

-- Re-confirmar la estructura de las tablas si es necesario:
-- CREATE TABLE albums (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     artist_name VARCHAR(255) NOT NULL,
--     year INT,
--     cover_art_vida_path VARCHAR(255),
--     cover_art_muerte_path VARCHAR(255),
--     description TEXT
-- );
-- CREATE TABLE songs (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     artist_name VARCHAR(255) NOT NULL,
--     album_id INT,
--     genre VARCHAR(100),
--     duration INT, -- en segundos
--     file_path VARCHAR(255),
--     track_number INT,
--     year INT,
--     FOREIGN KEY (album_id) REFERENCES albums(id)
-- );
