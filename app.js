document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const albumListDiv = document.getElementById('album-list');
    const albumCoverArtImg = document.getElementById('album-cover-art');
    const albumTitleH1 = document.getElementById('album-title');
    const albumArtistP = document.getElementById('album-artist');
    const albumYearP = document.getElementById('album-year');

    const audioPlayer = document.getElementById('cancion');
    const songSource = audioPlayer.querySelector('source');
    const songTitleH2 = document.getElementById('song-title');
    const songArtistDetailP = document.getElementById('song-artist-detail');
    const progressBar = document.getElementById('progreso');
    
    const prevButton = document.getElementById('prev-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const playPauseIcon = document.getElementById('iconoControl');
    const nextButton = document.getElementById('next-button');
    const songListUl = document.getElementById('song-list');

    const API_BASE_URL = 'http://localhost:3000/api'; // Asume que el backend corre en el puerto 3000

    let currentAlbum = null;
    let currentSongs = [];
    let currentSongIndex = 0;

    // --- Cargar y Mostrar Álbumes ---
    async function fetchAlbums() {
        try {
            const response = await fetch(`${API_BASE_URL}/albums`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const albums = await response.json();
            displayAlbums(albums);
        } catch (error) {
            console.error("Error fetching albums:", error);
            albumListDiv.innerHTML = '<p>Error al cargar álbumes.</p>';
        }
    }

    function displayAlbums(albums) {
        albumListDiv.innerHTML = ''; // Limpiar lista existente
        albums.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('album-item');
            albumElement.innerHTML = `
                <img src="${API_BASE_URL}${album.cover_art_vida_path}" alt="${album.name}" class="album-item-cover">
                <p>${album.name}</p>
            `;
            albumElement.addEventListener('click', () => selectAlbum(album.id));
            albumListDiv.appendChild(albumElement);
        });
    }

    // --- Manejar Selección de Álbum ---
    async function selectAlbum(albumId) {
        try {
            const response = await fetch(`${API_BASE_URL}/albums/${albumId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const albumData = await response.json();
            currentAlbum = albumData;
            currentSongs = albumData.songs || []; // Asegurarse de que songs sea un array
            currentSongIndex = 0;
            updateAlbumInfoUI();
            displaySongs();
            if (currentSongs.length > 0) {
                loadSong(currentSongIndex);
            } else {
                // No hay canciones, limpiar info de canción y audio
                songTitleH2.textContent = 'Canción';
                songArtistDetailP.textContent = 'Artista';
                songSource.src = '';
                audioPlayer.load(); // Recargar audio para aplicar el source vacío
                albumCoverArtImg.src = currentAlbum.cover_art_vida_path ? `${API_BASE_URL}${currentAlbum.cover_art_vida_path}` : 'img/default-cover.png';
            }
        } catch (error) {
            console.error(`Error fetching album ${albumId}:`, error);
        }
    }

    function updateAlbumInfoUI() {
        if (currentAlbum) {
            albumTitleH1.textContent = currentAlbum.name;
            albumArtistP.textContent = currentAlbum.artist_name;
            albumYearP.textContent = currentAlbum.year;
            albumCoverArtImg.src = currentAlbum.cover_art_vida_path ? `${API_BASE_URL}${currentAlbum.cover_art_vida_path}` : 'img/default-cover.png';
        }
    }

    function displaySongs() {
        songListUl.innerHTML = '';
        if (currentSongs && currentSongs.length > 0) {
            currentSongs.forEach((song, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${song.track_number}. ${song.title}`;
                listItem.classList.add('song-playlist-item');
                if (index === currentSongIndex) {
                    listItem.classList.add('active');
                }
                listItem.addEventListener('click', () => {
                    currentSongIndex = index;
                    loadSong(currentSongIndex);
                    playSong();
                });
                songListUl.appendChild(listItem);
            });
        } else {
            songListUl.innerHTML = '<li>No hay canciones en este álbum.</li>';
        }
    }

    // --- Reproducción de Canciones ---
    function loadSong(songIndex) {
        if (currentSongs && currentSongs.length > 0 && songIndex >= 0 && songIndex < currentSongs.length) {
            const song = currentSongs[songIndex];
            songSource.src = `${API_BASE_URL}${song.file_path}`; // Asume que file_path es relativo a la API_BASE_URL
            audioPlayer.load(); // Carga el nuevo source
            songTitleH2.textContent = song.title;
            songArtistDetailP.textContent = song.artist_name;

            // Actualizar la clase activa en la lista de canciones
            const songItems = songListUl.querySelectorAll('li');
            songItems.forEach((item, index) => {
                if (index === songIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    function playSong() {
        audioPlayer.play().catch(error => console.error("Error playing song:", error));
        playPauseIcon.classList.remove('bi-play');
        playPauseIcon.classList.add('bi-pause');
    }

    function pauseSong() {
        audioPlayer.pause();
        playPauseIcon.classList.remove('bi-pause');
        playPauseIcon.classList.add('bi-play');
    }

    function playPauseToggle() {
        if (audioPlayer.paused) {
            if (songSource.src && songSource.src !== window.location.href) { // Verifica si hay una canción cargada
                 playSong();
            } else if (currentSongs.length > 0) { // Si no hay src pero hay canciones, carga la primera
                loadSong(currentSongIndex);
                playSong();
            }
        } else {
            pauseSong();
        }
    }

    function nextSong() {
        if (currentSongs.length > 0) {
            currentSongIndex = (currentSongIndex + 1) % currentSongs.length;
            loadSong(currentSongIndex);
            playSong();
        }
    }

    function prevSong() {
        if (currentSongs.length > 0) {
            currentSongIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
            loadSong(currentSongIndex);
            playSong();
        }
    }

    // --- Event Listeners para Controles ---
    playPauseButton.addEventListener('click', playPauseToggle);
    nextButton.addEventListener('click', nextSong);
    prevButton.addEventListener('click', prevSong);

    audioPlayer.addEventListener('ended', nextSong); // Reproducir siguiente canción al terminar la actual

    audioPlayer.addEventListener('loadedmetadata', () => {
        progressBar.max = audioPlayer.duration;
    });

    audioPlayer.addEventListener('timeupdate', () => {
        progressBar.value = audioPlayer.currentTime;
    });

    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value;
    });
    
    // Inicializar
    fetchAlbums();

    // --- Lógica del Tema ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeToggleIcon = themeToggleButton.querySelector('i');
    const body = document.body;

    function applyTheme(theme) {
        body.classList.remove('theme-vida', 'theme-muerte');
        body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);

        if (theme === 'vida') {
            themeToggleIcon.classList.remove('bi-moon-stars-fill');
            themeToggleIcon.classList.add('bi-sun-fill');
        } else {
            themeToggleIcon.classList.remove('bi-sun-fill');
            themeToggleIcon.classList.add('bi-moon-stars-fill');
        }

        // Actualizar carátula del álbum si hay uno seleccionado
        if (currentAlbum) {
            updateAlbumCoverArtForTheme(theme);
        }
    }
    
    function updateAlbumCoverArtForTheme(theme) {
        if (currentAlbum) {
            const coverPath = theme === 'vida' ? currentAlbum.cover_art_vida_path : currentAlbum.cover_art_muerte_path;
            albumCoverArtImg.src = coverPath ? `${API_BASE_URL}${coverPath}` : 'img/default-cover.png';
        }
    }

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'vida';
        const newTheme = currentTheme === 'vida' ? 'muerte' : 'vida';
        applyTheme(newTheme);
    });

    // Aplicar tema guardado al cargar la página
    const savedTheme = localStorage.getItem('theme') || 'vida'; // 'vida' como default
    applyTheme(savedTheme);

    // Modificar selectAlbum para actualizar la carátula según el tema actual
    const originalSelectAlbum = selectAlbum;
    selectAlbum = async function(albumId) {
        await originalSelectAlbum.call(this, albumId); // Llama a la función original
        const currentTheme = localStorage.getItem('theme') || 'vida';
        updateAlbumCoverArtForTheme(currentTheme); // Actualiza la carátula después de cargar el álbum
    }
});
