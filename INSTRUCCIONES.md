# Instrucciones para Configurar y Ejecutar la Aplicación Music Player

Esta guía te ayudará a configurar y ejecutar la aplicación completa del reproductor de música, incluyendo el backend y el frontend.

## Prerrequisitos

*   Node.js y npm instalados.
*   Servidor MySQL instalado y en funcionamiento.
*   Un cliente MySQL (como MySQL Workbench, phpMyAdmin, o la línea de comandos `mysql`) para ejecutar scripts SQL.
*   `curl` para probar los endpoints del backend (opcional, pero recomendado para verificar la API).

## 1. Configuración de la Base de Datos MySQL

### a. Crear la Base de Datos
Conéctate a tu servidor MySQL y ejecuta el siguiente comando para crear la base de datos:
```sql
CREATE DATABASE music_player_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Si ya existe, puedes omitir este paso o usar un nombre diferente y ajustar la configuración del backend más adelante.

### b. Crear las Tablas
Una vez creada la base de datos, necesitas crear las tablas `albums` y `songs`. Ejecuta los siguientes comandos SQL en tu cliente MySQL, asegurándote de estar conectado a la base de datos `music_player_db`:

```sql
USE music_player_db;

CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    year INT,
    cover_art_vida_path VARCHAR(255),
    cover_art_muerte_path VARCHAR(255),
    description TEXT
);

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_id INT,
    genre VARCHAR(100),
    duration INT, -- en segundos
    file_path VARCHAR(255),
    track_number INT,
    year INT,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE -- Opcional: ON DELETE CASCADE
);
```

### c. Cargar Datos de Ejemplo
El archivo `sample_data.sql` (ubicado en la raíz del proyecto) contiene datos de ejemplo para las tablas `albums` y `songs`. Ejecuta este script en tu cliente MySQL conectado a `music_player_db`:

Desde la línea de comandos (navega a la raíz del proyecto donde está `sample_data.sql`):
```bash
mysql -u tu_usuario -p music_player_db < sample_data.sql
```
Reemplaza `tu_usuario` con tu nombre de usuario de MySQL. Se te pedirá la contraseña.

Alternativamente, puedes copiar y pegar el contenido de `sample_data.sql` en la ventana de consulta de tu cliente MySQL gráfico y ejecutarlo.

## 2. Configuración del Backend

### a. Clonar el Repositorio (si aplica)
Si aún no lo has hecho, clona el repositorio del proyecto a tu máquina local.

### b. Instalar Dependencias
Navega a la carpeta `music-player-backend` en tu terminal:
```bash
cd path/to/your_project/music-player-backend
```
Luego, instala las dependencias de Node.js:
```bash
npm install
```

### c. Configurar Credenciales de la Base de Datos
Edita el archivo `music-player-backend/src/config/db.config.js`. Reemplaza los valores de `USER` y `PASSWORD` con tus credenciales de MySQL:

```javascript
module.exports = {
  HOST: "localhost", // O la IP de tu servidor MySQL si es remoto
  USER: "tu_usuario_mysql", // Reemplaza con tu usuario de MySQL
  PASSWORD: "tu_contraseña_mysql", // Reemplaza con tu contraseña de MySQL
  DB: "music_player_db" // El nombre de la base de datos que creaste
};
```

### d. Servir Archivos Estáticos (Imágenes y Música)
Para que el frontend pueda cargar las carátulas y las canciones, el backend necesita servir las carpetas `img` y `music`. Asumiendo que tienes carpetas `img/covers/` y `music/album_X/` en la raíz del proyecto (junto a `index.html`), y que el backend está en `music-player-backend/`, necesitarás copiar o mover estas carpetas (`img` y `music`) dentro de la carpeta `music-player-backend` para que el backend pueda servirlas.

Luego, asegúrate de que el archivo `music-player-backend/server.js` incluya la configuración para servir archivos estáticos. Si no está, puedes añadir estas líneas antes de `app.listen()`:
```javascript
const express = require("express"); // Asegúrate de que express esté importado

// ... (otras configuraciones de app)

// Servir archivos estáticos para imágenes y música
// Estas rutas asumen que las carpetas 'img' y 'music' están en la raíz del proyecto backend
app.use('/img', express.static('img'));
app.use('/music', express.static('music'));

// ... (app.listen)
```
**Nota:** Las rutas en `sample_data.sql` (ej. `/img/covers/...`, `/music/muerte/...`) asumen que el backend sirve estos directorios desde su raíz. El frontend construye las URLs completas como `http://localhost:3000/api/img/covers/...` o `http://localhost:3000/api/music/...`.
Si el backend sirve los archivos desde la raíz (ej. `http://localhost:3000/img/...`), las rutas en la base de datos y la lógica del frontend (`API_BASE_URL` en `app.js`) deben ser consistentes.
El `app.js` actual usa `API_BASE_URL` (`http://localhost:3000/api`) para prefijar las rutas de las canciones y carátulas. Si el backend sirve los archivos desde `API_BASE_URL` (ej. `app.use('/api/img', express.static('img'));`), entonces las rutas en la BD son correctas.
Si el backend sirve los archivos desde la raíz del servidor (ej. `app.use('/img', express.static('img'));`), entonces el `API_BASE_URL` en `app.js` no debería usarse para construir estas URLs, o las rutas en la BD deberían ser relativas a la raíz del servidor.

Para la configuración actual del `app.js` del frontend, que usa `${API_BASE_URL}${album.cover_art_vida_path}`, el `server.js` del backend debería tener rutas como:
```javascript
// en server.js
app.use('/api/img', express.static('img'));
app.use('/api/music', express.static('music'));
```
Y las carpetas `img` y `music` deben estar en la raíz del proyecto `music-player-backend`. Las rutas en `sample_data.sql` ya tienen el prefijo `/img/` y `/music/`, por lo que esto es consistente.

### e. Iniciar el Servidor Backend
Desde la carpeta `music-player-backend`, ejecuta:
```bash
node server.js
```
Deberías ver un mensaje como `Server is running on port 3000.` y `Successfully connected to the database.`.

## 3. Ejecutar el Frontend

### a. Abrir `index.html`
Navega a la carpeta raíz del proyecto (donde se encuentra `index.html`).
Puedes abrir `index.html` directamente en tu navegador web:
*   Haz doble clic en el archivo `index.html`.
*   O arrastra y suelta `index.html` en una ventana del navegador.
*   O usa la opción "Abrir archivo" de tu navegador.

No se requiere un servidor web dedicado para el frontend, ya que no utiliza módulos ES6 que requieran un servidor para `file:///` y las llamadas a la API del backend se hacen a `http://localhost:3000`.

### b. Verificar la Conexión con el Backend
Abre las herramientas de desarrollador de tu navegador (usualmente F12) y revisa la consola. No deberías ver errores relacionados con la carga de álbumes si el backend está funcionando y la base de datos está configurada correctamente. Los álbumes deberían aparecer en la barra lateral.

## 4. Probar Endpoints del Backend con `curl` (Opcional)

Abre una nueva terminal (mientras el backend sigue en ejecución).

### a. Obtener todos los álbumes:
```bash
curl -X GET http://localhost:3000/api/albums
```

### b. Obtener un álbum específico por ID:
Reemplaza `:albumId` con un ID válido de tu base de datos (ej. 1, 2, o 3 según `sample_data.sql`).

ID Válido (ej. 1):
```bash
curl -X GET http://localhost:3000/api/albums/1
```
ID Inválido (ej. 999):
```bash
curl -X GET http://localhost:3000/api/albums/999
```

### c. Obtener una canción específica por ID:
Reemplaza `:songId` con un ID válido. Los IDs de las canciones son secuenciales a partir de 1 según `sample_data.sql`.

ID Válido (ej. 1):
```bash
curl -X GET http://localhost:3000/api/songs/1
```
ID Inválido (ej. 9999):
```bash
curl -X GET http://localhost:3000/api/songs/9999
```

Revisa las respuestas JSON en tu terminal. Para IDs válidos, deberías ver los datos correspondientes. Para IDs inválidos, deberías ver mensajes de error como `{"message":"Album not found with id 999"}` o `{"message":"Song not found with id 9999"}` y un código de estado 404.

---

¡Con esto deberías tener la aplicación funcionando! Si encuentras problemas, revisa los mensajes de error en la consola del backend y del navegador. Asegúrate de que las credenciales de la base de datos sean correctas y que el servidor MySQL esté accesible.
