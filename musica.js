document.addEventListener('DOMContentLoaded', () => {
    const mediaPlayer = document.getElementById('media-player');
    const mediaScreen = document.getElementById('media-screen');
    const fileInput = document.getElementById('file-input');
    const btnCargar = document.getElementById('btn-cargar');
    const btnPlay = document.getElementById('btn-play');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const playlistEl = document.getElementById('playlist');
    const trackTitle = document.getElementById('track-title');
    const trackStatus = document.getElementById('track-status');

    let playlist = []; // { file, name, url, isVideo, played }
    let currentIndex = -1;

    // -----------------------------------------------------------------
    // FUNCIÓN: Pantalla completa (Fullscreen) para vídeos MP4
    // -----------------------------------------------------------------
    function toggleFullScreen() {
        if (currentIndex === -1 || !playlist[currentIndex].isVideo) return;

        if (!document.fullscreenElement) {
            if (mediaPlayer.requestFullscreen) {
                mediaPlayer.requestFullscreen();
            } else if (mediaPlayer.webkitRequestFullscreen) { /* Safari */
                mediaPlayer.webkitRequestFullscreen();
            } else if (mediaPlayer.msRequestFullscreen) { /* IE11 / Edge antiguo */
                mediaPlayer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Asignar doble clic al reproductor de vídeo para ir a Fullscreen
    mediaPlayer.addEventListener('dblclick', toggleFullScreen);

    // -----------------------------------------------------------------
    // LÓGICA DE CARGA Y PLAYLIST
    // -----------------------------------------------------------------

    // 1. Cargar archivos
    btnCargar.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4');
            playlist.push({
                file: file,
                name: file.name,
                url: URL.createObjectURL(file),
                isVideo: isVideo,
                played: false
            });
        });

        renderPlaylist();

        if (currentIndex === -1 && playlist.length > 0) {
            loadTrack(0);
        }
    });

    // 2. Renderizar Playlist
    function renderPlaylist() {
        playlistEl.innerHTML = '';

        if (playlist.length === 0) {
            playlistEl.innerHTML = '<li class="playlist-empty">La lista está vacía</li>';
            return;
        }

        playlist.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            
            if (index === currentIndex) li.classList.add('active');
            if (item.played) li.classList.add('played');

            const nameSpan = document.createElement('span');
            const icon = item.isVideo ? '🎬 ' : '🎵 ';
            nameSpan.textContent = `${icon}${index + 1}. ${item.name}`;
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            nameSpan.style.whiteSpace = 'nowrap';

            const statusSpan = document.createElement('span');
            if (index === currentIndex && !mediaPlayer.paused) {
                statusSpan.textContent = '▶ Reproduciendo';
            } else if (item.played) {
                statusSpan.textContent = '✔ Visto';
            } else {
                statusSpan.textContent = '⏳ En espera';
            }

            li.appendChild(nameSpan);
            li.appendChild(statusSpan);

            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });

            playlistEl.appendChild(li);
        });
    }

    // 3. Cargar pista o vídeo seleccionado
    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentIndex = index;
        const currentItem = playlist[currentIndex];

        mediaPlayer.src = currentItem.url;

        if (currentItem.isVideo) {
            mediaScreen.classList.add('show-video');
            trackStatus.textContent = 'Doble clic en el vídeo para Pantalla Completa';
        } else {
            mediaScreen.classList.remove('show-video');
            trackStatus.textContent = 'Listo para reproducir';
        }

        trackTitle.textContent = currentItem.name;
        renderPlaylist();
    }

    // 4. Reproducir
    function playTrack() {
        if (currentIndex === -1) return;
        mediaPlayer.play().then(() => {
            btnPlay.textContent = '⏸️ Pausa';
            if (!playlist[currentIndex].isVideo) {
                trackStatus.textContent = 'Reproduciendo...';
            }
            renderPlaylist();
        }).catch(err => {
            console.error("Error de reproducción:", err);
        });
    }

    // 5. Pausar
    function pauseTrack() {
        mediaPlayer.pause();
        btnPlay.textContent = '▶️ Play';
        trackStatus.textContent = 'Pausado';
        renderPlaylist();
    }

    // 6. Botón Play / Pausa
    btnPlay.addEventListener('click', () => {
        if (currentIndex === -1) {
            alert('Carga al menos un archivo primero.');
            return;
        }
        if (mediaPlayer.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    });

    // 7. Botón Siguiente
    btnSiguiente.addEventListener('click', () => {
        if (playlist.length === 0) return;
        
        if (currentIndex !== -1) {
            playlist[currentIndex].played = true;
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex >= playlist.length) {
            nextIndex = 0;
        }
        loadTrack(nextIndex);
        playTrack();
    });

    // 8. Evento: Al terminar la reproducción
    mediaPlayer.addEventListener('ended', () => {
        if (currentIndex !== -1) {
            playlist[currentIndex].played = true;
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
            loadTrack(nextIndex);
            playTrack();
        } else {
            pauseTrack();
            trackStatus.textContent = 'Fin de la lista';
            renderPlaylist();
        }
    });
});