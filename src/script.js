export function initMusicPlayer() {
    const mainContent = document.getElementById("main-content");
    const merged = document.getElementById("merged-symbol");
    const playerPopup = document.getElementById("music-player-popup");
    const popupCover = document.getElementById("popup-cover");
    const popupSongName = document.getElementById("popup-song-name");
    const bottomBarWrapper = document.getElementById("bottom-bar-wrapper");
    const bottomBar = document.getElementById("bottom-bar");
    const trackNameEl = document.getElementById("track-name");
    const trackArtistEl = document.getElementById("track-artist");
    const btnPrev = document.getElementById("btn-prev");
    const btnPlayPause = document.getElementById("btn-playpause");
    const btnNext = document.getElementById("btn-next");
    const btnRewind = document.getElementById("btn-rewind");
    const btnForward = document.getElementById("btn-forward");
    const rewindLabel = document.getElementById("rewind-label");
    const forwardLabel = document.getElementById("forward-label");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const bottomBarCover = document.getElementById("bottom-bar-cover");
    const btnShuffle = document.getElementById("btn-shuffle");
    const btnQueue = document.getElementById("btn-queue");
    const queueContainer = document.getElementById("queue-container");
    const queueList = document.getElementById("queue-list");
    const btnVolume = document.getElementById("btn-volume");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeTooltip = document.getElementById("volume-tooltip");
    const btnLyrics = document.getElementById("btn-lyrics");
    const btnAllSongs = document.getElementById("btn-all-songs");
    const btnSettings = document.getElementById("btn-settings");
    const btnAddSongHeader = document.getElementById("btn-add-song-header");
    const lyricsPanel = document.getElementById("lyrics-panel");
    const allSongsPanel = document.getElementById("all-songs-panel");
    const settingsPanel = document.getElementById("settings-panel");
    const allSongsList = document.getElementById("all-songs-list");
    const inputSeekSeconds = document.getElementById("input-seek-seconds");
    const inputMaxVolume = document.getElementById("input-max-volume");
    
    const editInputYt = document.getElementById("edit-input-yt");
    const btnSettingsYt = document.getElementById("btn-settings-yt-download");
    const inputSettingsYt = document.getElementById("settings-yt-link");
    const inputSettingsYtName = document.getElementById("settings-yt-name");
    const statusSettingsYt = document.getElementById("settings-yt-status");
    const ytDownloadPopup = document.getElementById("yt-download-popup");
    const ytDownloadPopupTitle = document.getElementById("yt-download-popup-title");
    const ytDownloadPopupMessage = document.getElementById("yt-download-popup-message");
    const ytDownloadProgressFill = document.getElementById("yt-download-progress-fill");
    const ytDownloadProgressLabel = document.getElementById("yt-download-progress-label");

    const btnPlayAllSongs = document.getElementById("btn-play-all-songs");
    const btnPlayPlaylist = document.getElementById("btn-play-playlist");

    const sidebarShell = document.querySelector(".sidebar-shell");
    const sidebarTrigger = document.querySelector(".sidebar-trigger");
    const btnHome = document.getElementById("btn-home");
    const btnCreatePlaylist = document.getElementById("btn-create-playlist");
    const sidebarPlaylists = document.getElementById("sidebar-playlists");
    
    const modalOverlay = document.getElementById("modal-overlay");
    const addToPlModal = document.getElementById("add-to-pl-modal");
    const btnCloseAddPl = document.getElementById("btn-close-add-pl");
    const addToPlList = document.getElementById("add-to-pl-list");
    const btnEditPlaylist = document.getElementById("btn-edit-playlist");
    const btnAddToPlaylistBar = document.getElementById("btn-add-to-playlist-bar");
    const bottomBarActionMenu = document.getElementById("bottom-bar-action-menu");
    
    const editSongPanel = document.getElementById("edit-song-panel");
    const editSongDisplayCover = document.getElementById("edit-song-display-cover");
    const editInputName = document.getElementById("edit-input-name");
    const editInputArtist = document.getElementById("edit-input-artist");
    const editInputColor = document.getElementById("edit-input-color");
    const editInputMp3 = document.getElementById("edit-input-mp3");
    const editInputFileName = document.getElementById("edit-input-file-name");
    const editInputLyrics = document.getElementById("edit-input-lyrics");
    const btnSaveEditedSong = document.getElementById("btn-save-edited-song");
    const btnCancelEditedSong = document.getElementById("btn-cancel-edited-song");
    const btnDeleteSong = document.getElementById("btn-delete-song");
    const songImageEditWrapper = document.getElementById("song-image-edit-wrapper");
    const editSongPhoto = document.getElementById("edit-song-photo");

    const editPlaylistPanel = document.getElementById("edit-playlist-panel");
    const editPlDisplayCover = document.getElementById("edit-pl-display-cover");
    const editPlPhoto = document.getElementById("edit-pl-photo");
    const plImageEditWrapper = document.getElementById("pl-image-edit-wrapper");
    const editPlName = document.getElementById("edit-pl-name");
    const editPlDesc = document.getElementById("edit-pl-desc");
    const btnSaveEditedPl = document.getElementById("btn-save-edited-pl");
    const btnCancelEditedPl = document.getElementById("btn-cancel-edited-pl");
    const btnDeletePl = document.getElementById("btn-delete-pl");

    const plViewPanel = document.getElementById("pl-view-panel");
    const plViewPhoto = document.getElementById("pl-view-photo");
    const plViewName = document.getElementById("pl-view-name");
    const plViewDesc = document.getElementById("pl-view-desc");
    const plViewTracks = document.getElementById("pl-view-tracks");
    
    const loadingSpinner = document.getElementById("loading-spinner");
    const inlineSpinner = document.getElementById("inline-spinner");
    const perroGif = document.getElementById("perro-gif");

    if (!mainContent || !bottomBarWrapper || !btnPlayPause) return () => {};

    let popupTimeout = null;
    let isQueueOpen = false;
    let isShuffle = false;
    let currentVolume = 1;
    let maxVolume = Math.min(10, Math.max(1, Number(localStorage.getItem('maxVolume')) || 2));
    if (inputMaxVolume) inputMaxVolume.value = String(Math.round(maxVolume * 100));
    if (volumeSlider) volumeSlider.max = String(maxVolume);
    let customQueue = []; 
    let activeQueueTracks = [];
    let unplayedIndices = [];
    let playbackHistory = [];
    
    let isLyricsMode = false;
    let isAllSongsMode = false;
    let isPlaylistViewMode = false;
    let isEditSongMode = false;
    let isEditPlaylistMode = false;
    let isSettingsMode = false;

    let seekSeconds = 5;
    
    let editingPlaylistId = null;
    let activePlaylistId = null;
    let trackToAddIndex = null;
    let editingTrackIndex = null;
    let playlistEditorPreviousView = null;
    
    let autoSpinTimer = null; 
    let svgRot = 0;
    let spinAf;
    let isAutoSpinning = false;
    const mergedSvg = merged.querySelector('svg');

    let playlist = [];
    let userPlaylists = [];
    let songsRenderToken = 0;

    function getSequentialQueueIndices() {
        const currentPosition = activeQueueTracks.findIndex(track => playlist.indexOf(track) === currentTrackIndex);
        if (currentPosition === -1) return [];
        return activeQueueTracks
            .slice(currentPosition + 1)
            .map(track => playlist.indexOf(track))
            .filter(index => index !== -1);
    }

    function buildShuffleQueue() {
        const indices = activeQueueTracks
            .map(track => playlist.indexOf(track))
            .filter(index => index !== -1 && index !== currentTrackIndex);

        for (let index = indices.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [indices[index], indices[randomIndex]] = [indices[randomIndex], indices[index]];
        }

        return indices;
    }

    function resetPlaybackHistory() {
        playbackHistory = [];
        unplayedIndices = isShuffle ? buildShuffleQueue() : [];
    }
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    async function fetchJsonWithRetry(url, options = {}, attempts = 5) {
        let lastError;
        for (let attempt = 0; attempt < attempts; attempt += 1) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`API respondió con ${response.status}`);
                return await response.json();
            } catch (error) {
                lastError = error;
                if (attempt < attempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
        }
        throw lastError;
    }

    function getContrastTextColor(hexColor) {
        if (!hexColor) return '#ffffff';
        let hex = hexColor.replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 8) hex = hex.slice(0, 6);
        if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff';

        const channels = [0, 2, 4].map(offset => parseInt(hex.substring(offset, offset + 2), 16));
        if (channels.some(channel => Number.isNaN(channel))) return '#ffffff';

        const luminance = channels.reduce((total, channel, index) => {
            const normalized = channel / 255;
            const linear = normalized <= 0.03928
                ? normalized / 12.92
                : ((normalized + 0.055) / 1.055) ** 2.4;
            return total + linear * [0.2126, 0.7152, 0.0722][index];
        }, 0);

        const contrastWithWhite = (1.05) / (luminance + 0.05);
        const contrastWithBlack = (luminance + 0.05) / 0.05;
        return contrastWithBlack >= contrastWithWhite ? '#000000' : '#ffffff';
    }

    function getPlaylistCover(pl) {
        if (pl && pl.photo && pl.photo !== '' && pl.photo !== '/img/vinculo.png') {
            return pl.photo;
        }
        return '';
    }

    function getSongCover(track) {
        const cover = track?.cover || '';
        return cover && cover !== '/img/vinculo.png' ? cover : '';
    }

    function createImageMarkup(src, className = '', alt = '') {
        if (src) {
            return `<img src="${src}" loading="lazy" decoding="async" draggable="false" class="no-drag ${className}" alt="${alt}">`;
        }
        return `<div class="no-image-placeholder ${className}" aria-label="Sin imagen">SIN IMG</div>`;
    }

    async function savePlaylistsToDB(plData) {
        try {
            await fetch(`${API_URL}/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plData)
            });
        } catch (e) {
            console.error(e);
        }
    }

    async function loadPlaylists() {
        try {
            userPlaylists = await fetchJsonWithRetry(`${API_URL}/playlists`);
            renderSidebarPlaylists();
        } catch (e) {
            console.warn(e);
        }
    }

    function isValidYoutubeLink(value) {
        if (!value || typeof value !== 'string') return false;
        try {
            const url = new URL(value.trim());
            const host = url.hostname.replace(/^www\./, '').toLowerCase();
            return host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be';
        } catch {
            return false;
        }
    }

    let ytDownloadProgressTimer = null;
    let ytLongWaitTimer = null;

    function isSlowYoutubeStatusMessage(message = '') {
        return /(tardó demasiado|tardó|sigue en curso|procesando|demora|demor|espere|puede tardar)/i.test(message);
    }

    function showYoutubeLinkStatus(message, isError = false) {
        const safeMessage = message || 'No se pudo procesar el enlace de YouTube.';
        if (statusSettingsYt) {
            statusSettingsYt.style.display = 'block';
            statusSettingsYt.textContent = safeMessage;
            statusSettingsYt.style.color = isError ? '#ff4d4d' : '#1db954';
        }
        if (isError && !isSlowYoutubeStatusMessage(safeMessage)) {
            alert(safeMessage);
        }
    }

    function updateYtDownloadPopup({ title = 'Descargando canción', message = 'Preparando audio...', percent = 0, isError = false, visible = true }) {
        if (!ytDownloadPopup || !ytDownloadPopupTitle || !ytDownloadPopupMessage || !ytDownloadProgressFill || !ytDownloadProgressLabel) return;

        ytDownloadPopupTitle.textContent = title;
        ytDownloadPopupMessage.textContent = message;
        ytDownloadProgressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        ytDownloadProgressLabel.textContent = `${Math.round(percent)}%`;
        ytDownloadPopup.classList.toggle('error', isError);
        ytDownloadPopup.classList.toggle('active', visible);
    }

    function startYtDownloadProgress(title = 'Descargando canción') {
        if (ytDownloadProgressTimer) clearInterval(ytDownloadProgressTimer);
        if (ytLongWaitTimer) clearTimeout(ytLongWaitTimer);

        let current = 8;
        updateYtDownloadPopup({ title, message: 'Conectando con YouTube...', percent: current, visible: true, isError: false });

        ytDownloadProgressTimer = setInterval(() => {
            current = Math.min(current + Math.random() * 8 + 3, 90);
            const progressText = current < 25
                ? 'Solicitando audio a YouTube...'
                : current < 55
                    ? 'Descargando audio...'
                    : current < 85
                        ? 'Convirtiendo a MP3...'
                        : 'Guardando el MP3 localmente...';
            updateYtDownloadPopup({ title, message: progressText, percent: current, visible: true, isError: false });
        }, 800);

        ytLongWaitTimer = setTimeout(() => {
            showYoutubeLinkStatus('La descarga sigue en curso. Esto puede tardar unos segundos más...', false);
        }, 15000);
    }

    function stopYtDownloadProgress({ success = false, message = 'Descarga finalizada', error = false } = {}) {
        if (ytDownloadProgressTimer) {
            clearInterval(ytDownloadProgressTimer);
            ytDownloadProgressTimer = null;
        }
        if (ytLongWaitTimer) {
            clearTimeout(ytLongWaitTimer);
            ytLongWaitTimer = null;
        }

        if (!ytDownloadPopup) return;
        if (success) {
            updateYtDownloadPopup({ title: 'Canción añadida', message, percent: 100, visible: true, isError: false });
            setTimeout(() => updateYtDownloadPopup({ visible: false }), 1200);
        } else {
            updateYtDownloadPopup({ title: error ? 'No se pudo descargar' : 'Descarga detenida', message, percent: 100, visible: true, isError: true });
            setTimeout(() => updateYtDownloadPopup({ visible: false }), 2500);
        }
    }

    async function fetchMusicData() {
        if (inlineSpinner) inlineSpinner.style.display = 'block';
        if (perroGif) perroGif.style.display = 'none';

        try {
            const data = await fetchJsonWithRetry(`${API_URL}/songs`);
            playlist = data.songs || [];
        } catch (e) {
            console.warn(e);
            playlist = [];
        } finally {
            if (inlineSpinner) inlineSpinner.style.display = 'none';
            if (perroGif) perroGif.style.display = 'block';
        }
        
        activeQueueTracks = [...playlist];
        resetPlaybackHistory();
        renderAllSongs();
        if(playlist.length > 0 && !audio.src) {
            loadAndPlayTrack(0);
            audio.pause();
        }

        loadPlaylists().catch(e => console.warn(e));
    }

    fetchMusicData();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.song-actions-wrapper')) {
            document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.all-songs-item, .playlist-track-row, .queue-item').forEach(el => el.style.zIndex = '1');
        }
        if (sidebarShell && sidebarShell.classList.contains('open') && !e.target.closest('.sidebar-shell')) {
            sidebarShell.classList.remove('open');
        }
    });

    if (sidebarTrigger) {
        sidebarTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarShell.classList.toggle('open');
        });
    }

    const closeSidebar = () => {
        if (sidebarShell && sidebarShell.classList.contains('open')) {
            sidebarShell.classList.remove('open');
        }
    };

    if (btnHome) {
        btnHome.addEventListener('click', () => {
            isAllSongsMode = false;
            isLyricsMode = false;
            isPlaylistViewMode = false;
            isEditSongMode = false;
            isEditPlaylistMode = false;
            isSettingsMode = false;
            updateBackgroundAndViews();
            closeSidebar();
        });
    }

    const startSpin = () => {
        if (isAutoSpinning) return;
        isAutoSpinning = true;
        mergedSvg.style.transition = 'none';
        const doSpin = () => {
            svgRot += 0.15; 
            mergedSvg.style.transform = `rotate(${svgRot}deg)`;
            spinAf = requestAnimationFrame(doSpin);
        };
        doSpin();
    };

    const stopSpin = () => {
        if (!isAutoSpinning) return;
        isAutoSpinning = false;
        cancelAnimationFrame(spinAf);
        const remainder = svgRot % 360;
        let targetRot = svgRot - remainder;
        if (remainder > 180) targetRot += 360; 
        mergedSvg.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        mergedSvg.style.transform = `rotate(${targetRot}deg)`;
        setTimeout(() => {
            if (!isAutoSpinning) {
                mergedSvg.style.transition = 'none';
                svgRot = 0;
                mergedSvg.style.transform = `rotate(0deg)`;
            }
        }, 450);
    };

    const resetAutoSpin = () => {
        if (autoSpinTimer) clearTimeout(autoSpinTimer);
        stopSpin();
        autoSpinTimer = setTimeout(() => startSpin(), 10000);
    };

    let currentTrackIndex = 0;
    let currentTrackSource = 'regular';
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = currentVolume;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    const compressor = audioCtx.createDynamicsCompressor();

    compressor.threshold.setValueAtTime(-16, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(4, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(gainNode);
    gainNode.connect(compressor);
    compressor.connect(audioCtx.destination);   
    gainNode.gain.value = currentVolume;

    const unlockAudio = () => {
        if (audioCtx.state === 'suspended') { audioCtx.resume(); }
        document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);

    function hideAllModals() {
        modalOverlay.classList.remove('active');
        addToPlModal.classList.remove('active');
    }

    function createSongContextMenuHtml(i, isSongsTab = false) {
        const editBtnHtml = isSongsTab ? `<button class="action-edit" data-index="${i}">Editar canción</button>` : '';
        const copyBtnHtml = isSongsTab ? `<button class="action-copy" data-index="${i}">Copiar nombre y artista</button>` : '';
        return `
            <div class="song-actions-wrapper" style="display:flex; gap:8px; align-items:center;">
                <button class="song-actions-btn" data-index="${i}" type="button" style="background:transparent; border:none; cursor:pointer; color: white; font-size: 1.4rem; padding: 0 5px;" title="Opciones">
                    ⋮
                </button>
                <div class="song-actions-menu">
                    ${copyBtnHtml}
                    <button class="action-add-queue" data-index="${i}">Añadir a cola</button>
                    <button class="action-add-pl" data-index="${i}">Añadir a playlist</button>
                    ${editBtnHtml}
                </div>
            </div>
        `;
    }

    function positionSongActionsMenu(menu, wrapper) {
        menu.classList.remove('opens-up');
        menu.classList.add('show');

        const wrapperRect = wrapper.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const playerTop = bottomBarWrapper?.getBoundingClientRect().top ?? window.innerHeight;
        const bottomLimit = Math.min(playerTop, window.innerHeight) - 8;
        const hasRoomBelow = wrapperRect.bottom + menuRect.height <= bottomLimit;
        const hasRoomAbove = wrapperRect.top - menuRect.height >= 8;

        if (!hasRoomBelow && hasRoomAbove) {
            menu.classList.add('opens-up');
        }
    }

    function addTrackToQueue(trackIndex) {
        const track = playlist[trackIndex];
        if (!track) return;
        customQueue.push(track);
        renderQueue();
    }

    function setupClickDragGuard(element, onInteraction) {
        let pointerStartX = 0;
        const clickMoveTolerance = 1;
        let pointerStartY = 0;
        let pointerDownAt = 0;
        let pointerActive = false;
        let holdTimer;
        let interactionMoved = false;

        const markNonClick = (type) => {
            element.dataset.wasDragged = 'true';
            element.dataset.interactionType = type;
            clearTimeout(holdTimer);
            setTimeout(() => {
                delete element.dataset.wasDragged;
                delete element.dataset.interactionType;
            }, 700);
        };

        element.addEventListener('click', (event) => {
            if (event.target.closest('.remove-queue-btn, .song-actions-wrapper')) return;
            if (element.dataset.wasDragged !== 'true') return;
            event.preventDefault();
            event.stopPropagation();
            delete element.dataset.wasDragged;
            delete element.dataset.interactionType;
        }, true);

        element.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || event.target.closest('.remove-queue-btn, .song-actions-wrapper')) return;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
            pointerDownAt = performance.now();
            pointerActive = true;
            interactionMoved = false;
            clearTimeout(holdTimer);
            holdTimer = setTimeout(() => {
                if (pointerActive && !interactionMoved) markNonClick('held');
            }, 450);
        });

        element.addEventListener('pointermove', (event) => {
            if (!pointerActive) return;
            if (Math.abs(event.clientX - pointerStartX) > clickMoveTolerance || Math.abs(event.clientY - pointerStartY) > clickMoveTolerance) {
                interactionMoved = true;
                clearTimeout(holdTimer);
            }
        });

        const finishInteraction = (_event) => {
            if (!pointerActive) return;
            pointerActive = false;
            clearTimeout(holdTimer);
            const duration = performance.now() - pointerDownAt;
            if (interactionMoved) markNonClick('drag');
            else if (duration >= 450) markNonClick('held');
            onInteraction?.(_event, { duration, moved: interactionMoved });
        };

        element.addEventListener('pointerup', finishInteraction);
        element.addEventListener('pointercancel', finishInteraction);
    }

    function setupPullToQueue(element, trackIndex) {
        let pointerStartX = 0;
        const clickMoveTolerance = 1;
        let pointerStartY = 0;
        let pointerActive = false;
        let pullTriggered = false;
        let interactionMoved = false;
        let holdTimer;

        const suppressClickAfterPull = (type) => {
            element.dataset.wasDragged = 'true';
            element.dataset.interactionType = type;
            setTimeout(() => {
                delete element.dataset.wasDragged;
                delete element.dataset.interactionType;
            }, 700);
        };

        element.addEventListener('click', (event) => {
            if (element.dataset.wasDragged !== 'true') return;
            event.preventDefault();
            event.stopPropagation();
            delete element.dataset.wasDragged;
            delete element.dataset.interactionType;
        }, true);

        element.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || event.target.closest('.song-actions-wrapper')) return;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
            pointerActive = true;
            pullTriggered = false;
            interactionMoved = false;
            clearTimeout(holdTimer);
            holdTimer = setTimeout(() => {
                if (pointerActive && !interactionMoved) suppressClickAfterPull('held');
            }, 450);
            element.classList.add('pulling');
            element.style.transition = 'none';
            element.setPointerCapture?.(event.pointerId);
        });

        element.addEventListener('pointermove', (event) => {
            if (!pointerActive) return;
            const deltaX = event.clientX - pointerStartX;
            const deltaY = event.clientY - pointerStartY;
            if (Math.abs(deltaX) > clickMoveTolerance || Math.abs(deltaY) > clickMoveTolerance) {
                interactionMoved = true;
            }
            if (interactionMoved) clearTimeout(holdTimer);
            const isClearlyVertical = Math.abs(deltaY) > clickMoveTolerance && Math.abs(deltaY) > Math.abs(deltaX);
            if (deltaX >= clickMoveTolerance || isClearlyVertical) {
                event.preventDefault();
                pointerActive = false;
                element.style.transition = '';
                element.style.transform = '';
                element.classList.remove('pull-ready');
                setTimeout(() => element.classList.remove('pulling'), 220);
                suppressClickAfterPull('drag');
                return;
            }

            event.preventDefault();
            const pullDistance = Math.max(-34, deltaX);
            element.style.transform = `translateX(${pullDistance}px)`;
            pullTriggered = pullDistance <= -24;
            element.classList.toggle('pull-ready', pullTriggered);
        });

        const finishPull = (event) => {
            if (!pointerActive) return;
            const deltaX = event.clientX - pointerStartX;
            const deltaY = event.clientY - pointerStartY;
            pointerActive = false;
            clearTimeout(holdTimer);
            element.releasePointerCapture?.(event.pointerId);
            element.style.transition = '';
            element.style.transform = '';
            element.classList.remove('pull-ready');
            setTimeout(() => element.classList.remove('pulling'), 220);

            if (Math.abs(deltaX) > clickMoveTolerance || Math.abs(deltaY) > clickMoveTolerance) {
                interactionMoved = true;
            }
            if (interactionMoved) suppressClickAfterPull('drag');
            if (pullTriggered || deltaX <= -24) {
                addTrackToQueue(trackIndex);
            }
        };

        element.addEventListener('pointerup', finishPull);
        element.addEventListener('pointercancel', finishPull);
    }

    function reorderQueueItems(kind, fromIndex, toIndex) {
        if (fromIndex === toIndex) return;

        if (kind === 'custom') {
            const [movedTrack] = customQueue.splice(fromIndex, 1);
            customQueue.splice(toIndex, 0, movedTrack);
        } else if (kind === 'shuffle') {
            const [movedIndex] = unplayedIndices.splice(fromIndex, 1);
            unplayedIndices.splice(toIndex, 0, movedIndex);
        } else if (kind === 'regular') {
            const currentPosition = activeQueueTracks.findIndex(track => playlist.indexOf(track) === currentTrackIndex);
            if (currentPosition === -1) return;
            const upcomingTracks = activeQueueTracks.slice(currentPosition + 1);
            const [movedTrack] = upcomingTracks.splice(fromIndex, 1);
            upcomingTracks.splice(toIndex, 0, movedTrack);
            activeQueueTracks = [
                ...activeQueueTracks.slice(0, currentPosition + 1),
                ...upcomingTracks
            ];
        }

        renderQueue();
    }

    function setupQueueDrag(element, kind, position) {
        element.draggable = true;
        element.dataset.queueKind = kind;
        element.dataset.queuePosition = position;
        setupClickDragGuard(element);
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerMoved = false;

        element.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || event.target.closest('.remove-queue-btn, .song-actions-wrapper')) return;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
            pointerMoved = false;
        });
        element.addEventListener('pointermove', (event) => {
            if (Math.abs(event.clientX - pointerStartX) > 8 || Math.abs(event.clientY - pointerStartY) > 8) {
                pointerMoved = true;
            }
        });
        element.addEventListener('pointerup', () => {
            if (pointerMoved) {
                element.dataset.wasDragged = 'true';
                setTimeout(() => delete element.dataset.wasDragged, 500);
            }
        });
        element.addEventListener('dragstart', (event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', `queue:${kind}:${position}`);
            element.classList.add('dragging');
            element.dataset.wasDragged = 'true';
            element.dataset.interactionType = 'drag';
        });
        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            setTimeout(() => delete element.dataset.wasDragged, 500);
        });
        element.addEventListener('dragover', (event) => {
            event.preventDefault();
            element.classList.add('drag-over');
            event.dataTransfer.dropEffect = 'move';
        });
        element.addEventListener('dragleave', () => element.classList.remove('drag-over'));
        element.addEventListener('drop', (event) => {
            event.preventDefault();
            element.classList.remove('drag-over');
            const source = event.dataTransfer.getData('text/plain').match(/^queue:(custom|shuffle|regular):(\d+)$/);
            if (!source || source[1] !== kind) return;
            reorderQueueItems(kind, Number(source[2]), position);
        });
    }

    function setupPlaylistDrag(element, playlistData, trackPosition) {
        element.draggable = true;
        setupClickDragGuard(element);
        element.addEventListener('dragstart', (event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', `playlist:${playlistData.id}:${trackPosition}`);
            element.classList.add('dragging');
            element.dataset.wasDragged = 'true';
            element.dataset.interactionType = 'drag';
        });
        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            setTimeout(() => delete element.dataset.wasDragged, 500);
        });
        element.addEventListener('dragover', (event) => {
            event.preventDefault();
            element.classList.add('drag-over');
            event.dataTransfer.dropEffect = 'move';
        });
        element.addEventListener('dragleave', () => element.classList.remove('drag-over'));
        element.addEventListener('drop', (event) => {
            event.preventDefault();
            element.classList.remove('drag-over');
            const source = event.dataTransfer.getData('text/plain').match(/^playlist:(.+):(\d+)$/);
            if (!source || source[1] !== playlistData.id) return;
            const fromPosition = Number(source[2]);
            if (fromPosition === trackPosition) return;
            const [movedTrack] = playlistData.tracks.splice(fromPosition, 1);
            const targetPosition = trackPosition;
            playlistData.tracks.splice(targetPosition, 0, movedTrack);
            savePlaylistsToDB(playlistData);
            openPlaylistView(playlistData.id);
        });
    }

    function setupSongMenuListeners(element, trackIndex) {
        element.addEventListener('click', (e) => {
            if (element.dataset.wasDragged === 'true') {
                delete element.dataset.wasDragged;
                return;
            }
            const btn3Dots = e.target.closest('.song-actions-btn');
            const actionAddQueue = e.target.closest('.action-add-queue');
            const actionAddPl = e.target.closest('.action-add-pl');
            const actionEdit = e.target.closest('.action-edit');
            const actionCopy = e.target.closest('.action-copy');
            const removeQueueItem = e.target.closest('.remove-queue-btn');

            if (removeQueueItem) {
                e.stopPropagation();
                const queueKind = element.dataset.queueKind;
                const queuePosition = Number(element.dataset.queuePosition);
                if (queueKind === 'shuffle') {
                    unplayedIndices.splice(queuePosition, 1);
                } else if (queueKind === 'regular') {
                    const currentPosition = activeQueueTracks.findIndex(track => playlist.indexOf(track) === currentTrackIndex);
                    if (currentPosition !== -1) activeQueueTracks.splice(currentPosition + 1 + queuePosition, 1);
                }
                renderQueue();
                return;
            }

            if (btn3Dots) {
                e.stopPropagation();
                const menu = element.querySelector('.song-actions-menu');
                const wasOpen = menu.classList.contains('show');
                
                document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
                document.querySelectorAll('.all-songs-item, .playlist-track-row, .queue-item').forEach(el => el.style.zIndex = '1');
                
                if (!wasOpen) {
                    element.style.zIndex = '9999';
                    positionSongActionsMenu(menu, btn3Dots.closest('.song-actions-wrapper'));
                }
                return;
            }

            if (actionAddQueue) {
                e.stopPropagation();
                document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
                customQueue.push(playlist[trackIndex]);
                renderQueue();
                return;
            }

            if (actionCopy) {
                e.stopPropagation();
                const track = playlist[trackIndex];
                const text = `${track?.name || 'Canción'} - ${track?.artist || 'Artista desconocido'}`;
                copySongText(text, actionCopy);
                return;
            }

            if (actionAddPl) {
                e.stopPropagation();
                document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
                openAddToPlaylistModal(trackIndex);
                return;
            }

            if (actionEdit) {
                e.stopPropagation();
                document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
                openEditSongPanel(trackIndex);
                return;
            }

            if (!e.target.closest('.song-actions-wrapper')) {
                const queueSource = element.dataset.queueSource;
                if (queueSource && trackIndex !== currentTrackIndex && playlist[currentTrackIndex]) {
                    playbackHistory.push({ index: currentTrackIndex, source: currentTrackSource });

                    if (queueSource === 'shuffle') {
                        const queuedPosition = unplayedIndices.indexOf(trackIndex);
                        if (queuedPosition !== -1) {
                            unplayedIndices.slice(0, queuedPosition).forEach(index => {
                                playbackHistory.push({ index, source: 'shuffle' });
                            });
                            unplayedIndices.splice(0, queuedPosition + 1);
                        }
                    } else {
                        const upcomingIndices = getSequentialQueueIndices();
                        const queuedPosition = upcomingIndices.indexOf(trackIndex);
                        if (queuedPosition > 0) {
                            upcomingIndices.slice(0, queuedPosition).forEach(index => {
                                playbackHistory.push({ index, source: 'regular' });
                            });
                        }
                    }
                } else if (!queueSource) {
                    activePlaylistId = null;
                    activeQueueTracks = [...playlist];
                    playbackHistory = [];
                    unplayedIndices = [];
                }
                loadAndPlayTrack(trackIndex, queueSource || 'regular');
            }
        });
    }

    async function copySongText(text, button) {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const helper = document.createElement('textarea');
                helper.value = text;
                helper.setAttribute('readonly', '');
                helper.style.position = 'fixed';
                helper.style.opacity = '0';
                document.body.appendChild(helper);
                helper.select();
                document.execCommand('copy');
                helper.remove();
            }
            const originalText = button.textContent;
            button.textContent = '¡Copiado!';
            setTimeout(() => { button.textContent = originalText; }, 1200);
        } catch (error) {
            console.warn('No se pudo copiar la canción:', error);
        }
    }

    if (btnAddToPlaylistBar && bottomBarActionMenu) {
        btnAddToPlaylistBar.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = bottomBarActionMenu.classList.contains('show');
            document.querySelectorAll('.song-actions-menu').forEach(m => m.classList.remove('show'));
            if (!wasOpen) bottomBarActionMenu.classList.add('show');
        });
        
        bottomBarActionMenu.querySelector('.action-add-queue').addEventListener('click', (e) => {
            e.stopPropagation();
            bottomBarActionMenu.classList.remove('show');
            customQueue.push(playlist[currentTrackIndex]);
            renderQueue();
        });
        
        bottomBarActionMenu.querySelector('.action-add-pl').addEventListener('click', (e) => {
            e.stopPropagation();
            bottomBarActionMenu.classList.remove('show');
            openAddToPlaylistModal(currentTrackIndex);
        });
    }

    function renderAllSongs() {
        if (!allSongsList) return;
        songsRenderToken += 1;
        const renderToken = songsRenderToken;
        allSongsList.innerHTML = '';
        let songIndex = 0;

        const renderSongBatch = () => {
            if (renderToken !== songsRenderToken) return;
            const songsFragment = document.createDocumentFragment();
            const batchEnd = Math.min(songIndex + 50, playlist.length);

            for (; songIndex < batchEnd; songIndex += 1) {
                const track = playlist[songIndex];
                const i = songIndex;
            const li = document.createElement('li');
            li.className = 'all-songs-item';
            li.innerHTML = `
                ${createImageMarkup(getSongCover(track), 'item-cover')}
                <div class="all-songs-item-info">
                    <span class="all-songs-item-name">${track.name}</span>
                    <span class="all-songs-item-artist">${track.artist}</span>
                </div>
                ${createSongContextMenuHtml(i, true)}
            `;
            setupSongMenuListeners(li, i);
            setupPullToQueue(li, i);
            songsFragment.appendChild(li);
            }
            allSongsList.appendChild(songsFragment);

            if (songIndex < playlist.length) {
                requestAnimationFrame(renderSongBatch);
                return;
            }

            const addSongLi = document.createElement('li');
            addSongLi.className = 'all-songs-item add-song-card';
            addSongLi.style.border = '1px dashed rgba(255,255,255,0.3)';
            addSongLi.innerHTML = `
                <div style="width: 40px; height: 40px; border-radius: 4px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: #fff;">+</div>
                <div class="all-songs-item-info">
                    <span class="all-songs-item-name">Añadir Canción</span>
                    <span class="all-songs-item-artist">Haz clic para agregar un nuevo tema</span>
                </div>
            `;
            addSongLi.addEventListener('click', () => {
                openEditSongPanel(null);
            });
            allSongsList.appendChild(addSongLi);
        };

        renderSongBatch();
    }

    function renderSidebarPlaylists() {
        if(!sidebarPlaylists) return;
        sidebarPlaylists.innerHTML = '';
        userPlaylists.forEach(pl => {
            const el = document.createElement('div');
            el.className = 'pl-sidebar-item';
            el.innerHTML = `${createImageMarkup(getPlaylistCover(pl), '', pl.name)}`;
            
            el.addEventListener('click', () => {
                openPlaylistView(pl.id);
                closeSidebar();
            });
            
            el.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if (pl.tracks.length > 0) {
                    activeQueueTracks = pl.tracks.map(t => playlist.find(main => main._id === t._id)).filter(Boolean);
                    customQueue = []; 
                    resetPlaybackHistory();
                    renderQueue();
                    loadAndPlayTrack(playlist.indexOf(activeQueueTracks[0]));
                }
            });
            sidebarPlaylists.appendChild(el);
        });
    }

    function generateId() { return 'pl-' + Math.random().toString(36).substring(2, 9); }

    function openEditSongPanel(index = null) {
        editingTrackIndex = index;
        
        if (index !== null && playlist[index]) {
            const track = playlist[index];
            if (getSongCover(track)) {
                editSongDisplayCover.src = getSongCover(track);
                editSongDisplayCover.style.display = 'block';
            } else {
                editSongDisplayCover.removeAttribute('src');
                editSongDisplayCover.style.display = 'none';
            }
            editInputName.value = track.name || '';
            editInputArtist.value = track.artist || '';
            editInputColor.value = track.color || "#1db954";
            editInputLyrics.value = track.lyrics || "";
            btnSaveEditedSong.textContent = "Guardar Cambios";
            if (btnDeleteSong) btnDeleteSong.style.display = 'inline-block';
        } else {
            editingTrackIndex = null;
            editSongDisplayCover.removeAttribute('src');
            editSongDisplayCover.style.display = 'none';
            editInputName.value = '';
            editInputArtist.value = '';
            editInputColor.value = "#1db954";
            editInputLyrics.value = '';
            btnSaveEditedSong.textContent = "Añadir Canción";
            if (btnDeleteSong) btnDeleteSong.style.display = 'none';
        }

        editInputMp3.value = "";
        if (editInputFileName) editInputFileName.value = "";
        editSongPhoto.value = "";
        if (editInputYt) editInputYt.value = "";

        isEditSongMode = true;
        isEditPlaylistMode = false;
        isLyricsMode = false;
        isAllSongsMode = false;
        isPlaylistViewMode = false;
        isSettingsMode = false;
        updateBackgroundAndViews();
    }

    if (btnAddSongHeader) {
        btnAddSongHeader.addEventListener('click', () => {
            openEditSongPanel(null);
        });
    }

    if (songImageEditWrapper && editSongPhoto) {
        songImageEditWrapper.addEventListener('click', () => {
            editSongPhoto.click();
        });

        editSongPhoto.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    editSongDisplayCover.src = ev.target.result;
                    editSongDisplayCover.style.display = 'block';
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    btnSaveEditedSong.addEventListener('click', async () => {
        btnSaveEditedSong.textContent = "Guardando...";
        btnSaveEditedSong.disabled = true;
        if (loadingSpinner) loadingSpinner.style.display = 'flex';

        const formData = new FormData();
        if (editingTrackIndex !== null && playlist[editingTrackIndex]) {
            formData.append('id', playlist[editingTrackIndex]._id);
            formData.append('existingPath', playlist[editingTrackIndex].path || '');
            formData.append('existingCover', playlist[editingTrackIndex].cover || '');
        }

        formData.append('name', editInputName.value.trim() || 'Canción Sin Título');
        formData.append('artist', editInputArtist.value.trim() || 'Artista Desconocido');
        formData.append('color', editInputColor.value);
        formData.append('lyrics', editInputLyrics.value);
        if (editInputFileName?.value.trim()) {
            formData.append('fileName', editInputFileName.value.trim());
        }

        if (editInputMp3.files && editInputMp3.files[0]) {
            formData.append('mp3', editInputMp3.files[0]);
        }
        
        const ytLinkVal = editInputYt ? editInputYt.value.trim() : "";
        if (ytLinkVal) {
            if (!isValidYoutubeLink(ytLinkVal)) {
                showYoutubeLinkStatus("El enlace de YouTube no es válido.", true);
                btnSaveEditedSong.textContent = editingTrackIndex !== null ? "Guardar Cambios" : "Añadir Canción";
                btnSaveEditedSong.disabled = false;
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                return;
            }
            formData.append('ytLink', ytLinkVal);
            startYtDownloadProgress(editingTrackIndex !== null ? 'Actualizando canción' : 'Añadiendo canción');
            showYoutubeLinkStatus('Descargando y convirtiendo el audio antes de subirlo...', false);
        }

        if (editSongPhoto.files && editSongPhoto.files[0]) {
            formData.append('cover', editSongPhoto.files[0]);
        }

        try {
            const response = await fetch(`${API_URL}/songs`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) {
                const message = result?.error || 'No se pudo procesar el enlace de YouTube.';
                throw new Error(message);
            }
            await fetchMusicData();

            if (ytLinkVal) {
                stopYtDownloadProgress({ success: true, message: 'MP3 convertido, subido a Drive y guardado en MongoDB' });
            }
            
            isEditSongMode = false;
            isAllSongsMode = true;
            updateBackgroundAndViews();
            
        } catch (e) {
            console.error(e);
            const message = e?.message || 'Error al guardar la canción.';
            if (ytLinkVal) {
                stopYtDownloadProgress({ success: false, message, error: true });
            }
            showYoutubeLinkStatus(message.includes('YouTube') ? message : 'El enlace de YouTube no es válido o fue rechazado por YouTube.', true);
            if (!message.includes('tardó demasiado') && !message.includes('demora') && !message.includes('sigue en curso')) {
                alert(message.includes('YouTube') ? message : 'El enlace de YouTube no es válido o fue rechazado por YouTube.');
            }
        } finally {
            btnSaveEditedSong.textContent = editingTrackIndex !== null ? "Guardar Cambios" : "Añadir Canción";
            btnSaveEditedSong.disabled = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    });

    if (btnDeleteSong) {
        btnDeleteSong.addEventListener('click', async () => {
            if (editingTrackIndex === null || !playlist[editingTrackIndex]) return;
            const songId = playlist[editingTrackIndex]._id;
            
            if (confirm("¿Estás seguro de que deseas eliminar esta canción?")) {
                if (loadingSpinner) loadingSpinner.style.display = 'flex';
                try {
                    await fetch(`${API_URL}/songs/${songId}`, { method: 'DELETE' });
                    await fetchMusicData();
                    isEditSongMode = false;
                    isAllSongsMode = true;
                    updateBackgroundAndViews();
                } catch (e) {
                    console.error(e);
                    alert("Error al eliminar la canción.");
                } finally {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                }
            }
        });
    }

    btnCancelEditedSong.addEventListener('click', () => {
        isEditSongMode = false;
        isAllSongsMode = true;
        updateBackgroundAndViews();
    });

    function openEditPlaylistPanel(id = null) {
        playlistEditorPreviousView = {
            isLyricsMode,
            isAllSongsMode,
            isPlaylistViewMode,
            isEditSongMode,
            isSettingsMode,
            activePlaylistId
        };
        editingPlaylistId = id;
        if (editingPlaylistId) {
            const pl = userPlaylists.find(p => p.id === editingPlaylistId);
            if (pl) {
                editPlName.value = pl.name;
                editPlDesc.value = pl.desc || '';
                const cover = getPlaylistCover(pl);
                if (cover) {
                    editPlDisplayCover.src = cover;
                    editPlDisplayCover.style.display = 'block';
                } else {
                    editPlDisplayCover.removeAttribute('src');
                    editPlDisplayCover.style.display = 'none';
                }
            }
        } else {
            editPlName.value = '';
            editPlDesc.value = '';
            editPlDisplayCover.removeAttribute('src');
            editPlDisplayCover.style.display = 'none';
            editPlPhoto.value = ''; 
        }
        
        if (btnDeletePl) {
            btnDeletePl.style.display = editingPlaylistId ? 'inline-block' : 'none';
        }
        
        isEditPlaylistMode = true;
        isEditSongMode = false;
        isLyricsMode = false;
        isAllSongsMode = false;
        isPlaylistViewMode = false;
        isSettingsMode = false;
        updateBackgroundAndViews();
    }

    btnCreatePlaylist.addEventListener('click', () => {
        openEditPlaylistPanel();
        closeSidebar();
    });

    btnEditPlaylist.addEventListener('click', () => {
        openEditPlaylistPanel(activePlaylistId);
    });

    plImageEditWrapper.addEventListener('click', () => {
        editPlPhoto.click();
    });

    editPlPhoto.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                editPlDisplayCover.src = ev.target.result;
                editPlDisplayCover.style.display = 'block';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    btnSaveEditedPl.addEventListener('click', async () => {
        const name = editPlName.value.trim() || 'Nueva Playlist';
        const desc = editPlDesc.value.trim();

        if (loadingSpinner) loadingSpinner.style.display = 'flex';

        let targetPl = userPlaylists.find(p => p.id === editingPlaylistId);
        const plId = editingPlaylistId || generateId();
        
        const formData = new FormData();
        formData.append('id', plId);
        formData.append('name', name);
        formData.append('desc', desc);
        
        if (targetPl && targetPl.photo) {
            formData.append('existingPhoto', targetPl.photo);
        }
        if (targetPl && targetPl.tracks) {
            formData.append('tracks', JSON.stringify(targetPl.tracks));
        } else {
            formData.append('tracks', JSON.stringify([]));
        }

        if (editPlPhoto.files && editPlPhoto.files[0]) {
            formData.append('photo', editPlPhoto.files[0]);
        }

        try {
            const res = await fetch(`${API_URL}/playlists`, {
                method: 'POST',
                body: formData
            });
            const updatedPl = await res.json();
            
            await loadPlaylists(); 
            openPlaylistView(updatedPl.id || plId);
        } catch (e) {
            console.error(e);
            alert("Error al guardar la playlist");
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    });

    if (btnDeletePl) {
        btnDeletePl.addEventListener('click', async () => {
            if (!editingPlaylistId) return;
            if (confirm("¿Estás seguro de que deseas eliminar esta playlist?")) {
                if (loadingSpinner) loadingSpinner.style.display = 'flex';
                try {
                    await fetch(`${API_URL}/playlists/${editingPlaylistId}`, { method: 'DELETE' });
                    await loadPlaylists();
                    isEditPlaylistMode = false;
                    isAllSongsMode = true;
                    updateBackgroundAndViews();
                } catch (e) {
                    console.error(e);
                    alert("Error al eliminar la playlist.");
                } finally {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                }
            }
        });
    }

    btnCancelEditedPl.addEventListener('click', () => {
        const previousView = playlistEditorPreviousView;
        playlistEditorPreviousView = null;
        isEditPlaylistMode = false;

        if (!previousView) {
            isAllSongsMode = true;
            updateBackgroundAndViews();
            return;
        }

        activePlaylistId = previousView.activePlaylistId;
        isLyricsMode = previousView.isLyricsMode;
        isAllSongsMode = previousView.isAllSongsMode;
        isPlaylistViewMode = previousView.isPlaylistViewMode;
        isEditSongMode = previousView.isEditSongMode;
        isSettingsMode = previousView.isSettingsMode;

        if (isPlaylistViewMode && activePlaylistId) {
            openPlaylistView(activePlaylistId);
        } else {
            updateBackgroundAndViews();
        }
    });

    function openAddToPlaylistModal(trackIndex) {
        trackToAddIndex = trackIndex;
        addToPlList.innerHTML = '';
        const songId = playlist[trackToAddIndex]._id; 

        userPlaylists.forEach(pl => {
            const alreadyAdded = pl.tracks.some(track => track._id === songId);
            const li = document.createElement('li');
            li.className = 'add-pl-item';
            li.innerHTML = `
                ${createImageMarkup(getPlaylistCover(pl))}
                <span>${pl.name}</span>
                ${alreadyAdded ? '<small class="playlist-membership-status">Ya está añadida</small>' : ''}
            `;
            li.addEventListener('click', () => {
                const isDuplicate = pl.tracks.some(track => track._id === songId);
                if (isDuplicate) {
                    const status = li.querySelector('.playlist-membership-status');
                    if (li.dataset.duplicateConfirm !== 'true') {
                        li.dataset.duplicateConfirm = 'true';
                        if (status) status.textContent = '¿Confirmar?';
                        return;
                    }
                }
                pl.tracks.push(playlist[trackToAddIndex]);
                savePlaylistsToDB(pl);
                hideAllModals();
                if (activePlaylistId === pl.id) openPlaylistView(pl.id);
            });
            addToPlList.appendChild(li);
        });
        
        hideAllModals();
        modalOverlay.classList.add('active');
        addToPlModal.classList.add('active');
    }

    btnCloseAddPl.addEventListener('click', hideAllModals);

    function openPlaylistView(id) {
        const pl = userPlaylists.find(p => p.id === id);
        if (!pl) return;
        
        const coverUrl = getPlaylistCover(pl);

        if (plViewPhoto.src !== coverUrl && !plViewPhoto.src.endsWith(coverUrl)) {
            if (loadingSpinner) loadingSpinner.style.display = 'flex';
            plViewPhoto.onload = () => {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                plViewPhoto.onload = null;
            };
            plViewPhoto.onerror = () => {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                plViewPhoto.onerror = null;
            };
            if (coverUrl) {
                plViewPhoto.src = coverUrl;
                plViewPhoto.classList.remove('no-image');
            } else {
                plViewPhoto.removeAttribute('src');
                plViewPhoto.classList.add('no-image');
            }
        }
        
        activePlaylistId = id;
        isPlaylistViewMode = true;
        isLyricsMode = false;
        isAllSongsMode = false;
        isEditSongMode = false;
        isEditPlaylistMode = false;
        isSettingsMode = false;
        
        if (coverUrl) {
            plViewPhoto.src = coverUrl;
            plViewPhoto.classList.remove('no-image');
        } else {
            plViewPhoto.removeAttribute('src');
            plViewPhoto.classList.add('no-image');
        }
        plViewName.textContent = pl.name;
        plViewDesc.textContent = pl.desc || 'Sin descripción';
        
        plViewTracks.innerHTML = '';
        pl.tracks.forEach((trackItem, arrayIndex) => {
            const track = playlist.find(t => t._id === trackItem._id) || trackItem; 
            const playlistIndex = playlist.findIndex(t => t._id === track._id);

            const li = document.createElement('li');
            li.className = 'playlist-track-row';
            li.innerHTML = `
                ${createImageMarkup(getSongCover(track), 'item-cover')}
                <div class="all-songs-item-info">
                    <span class="all-songs-item-name">${track.name}</span>
                    <span class="all-songs-item-artist">${track.artist}</span>
                </div>
                <button class="remove-from-pl-btn" style="background:transparent; border:none; cursor:pointer; justify-self:end;" type="button">
                    <img src="/img/cancel.png" draggable="false" class="no-drag" alt="Remove" style="width:20px;">
                </button>
            `;
            li.addEventListener('click', (e) => {
                if(e.target.closest('.remove-from-pl-btn')) {
                    e.stopPropagation();
                    pl.tracks.splice(arrayIndex, 1);
                    savePlaylistsToDB(pl); 
                    openPlaylistView(id); 
                    return;
                }
                if (playlistIndex !== -1) {
                    activeQueueTracks = pl.tracks.map(t => playlist.find(main => main._id === t._id)).filter(Boolean);
                    customQueue = [];
                    resetPlaybackHistory();
                    renderQueue();
                    loadAndPlayTrack(playlistIndex);
                }
            });
            setupPlaylistDrag(li, pl, arrayIndex);
            plViewTracks.appendChild(li);
        });
        
        updateBackgroundAndViews();
    }

    btnPlayPlaylist.addEventListener('click', () => {
        if (!activePlaylistId) return;
        const pl = userPlaylists.find(p => p.id === activePlaylistId);
        if (pl && pl.tracks.length > 0) {
            activeQueueTracks = pl.tracks.map(t => playlist.find(main => main._id === t._id)).filter(Boolean);
            customQueue = []; 
            resetPlaybackHistory();
            renderQueue();
            loadAndPlayTrack(playlist.indexOf(activeQueueTracks[0]));
        }
    });

    btnPlayAllSongs.addEventListener('click', () => {
        activePlaylistId = null;
        activeQueueTracks = [...playlist];
        customQueue = [];
        resetPlaybackHistory();
        renderQueue();
        loadAndPlayTrack(0);
    });

    function updateLyricsView() {
        if (!lyricsPanel) return;
        const track = playlist[currentTrackIndex];
        const trackColor = track?.color || '#151515';
        const textColor = getContrastTextColor(trackColor);
        const lyricsContent = track?.lyrics ? track.lyrics.replace(/\n/g, '<br>') : 'Letra no disponible';

        lyricsPanel.style.backgroundColor = '#000';
        lyricsPanel.style.setProperty('--lyrics-color', trackColor);
        lyricsPanel.style.color = textColor;

        lyricsPanel.innerHTML = `
            <div class="lyrics-container">
                <table class="lyrics-table" style="color: ${textColor};">
                    <tbody>
                        <tr>
                            <td class="lyrics-cell">${lyricsContent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function updateBackgroundAndViews() {
        const trackColor = playlist[currentTrackIndex]?.color || '#000';
        
        if (isLyricsMode) {
            mainContent.style.backgroundColor = '#000';
            merged.style.opacity = '0';
        } else if (isAllSongsMode || isPlaylistViewMode || isEditSongMode || isEditPlaylistMode || isSettingsMode) {
            mainContent.style.backgroundColor = trackColor;
            merged.style.opacity = '0'; 
        } else {
            mainContent.style.backgroundColor = 'transparent';
            merged.style.opacity = '1'; 
        }

        if (lyricsPanel && !isLyricsMode) {
            lyricsPanel.style.backgroundColor = 'transparent';
            lyricsPanel.style.removeProperty('--lyrics-color');
        }

        if (sidebarShell) {
            sidebarShell.classList.toggle('lyrics-open', isLyricsMode);
        }
        
        if(lyricsPanel) lyricsPanel.classList.toggle('active', isLyricsMode);
        if(allSongsPanel) allSongsPanel.classList.toggle('active', isAllSongsMode);
        if(plViewPanel) plViewPanel.classList.toggle('active', isPlaylistViewMode);
        if(editSongPanel) editSongPanel.classList.toggle('active', isEditSongMode);
        if(editPlaylistPanel) editPlaylistPanel.classList.toggle('active', isEditPlaylistMode);
        if(settingsPanel) settingsPanel.classList.toggle('active', isSettingsMode);
        if(btnLyrics) btnLyrics.classList.toggle('active', isLyricsMode);
        
        if (isLyricsMode) updateLyricsView();
    }

    if (btnLyrics) {
        btnLyrics.addEventListener('click', () => {
            isLyricsMode = !isLyricsMode;
            if (isLyricsMode) {
                isAllSongsMode = false; 
                isPlaylistViewMode = false;
                isEditSongMode = false;
                isEditPlaylistMode = false;
                isSettingsMode = false;
            }
            updateBackgroundAndViews();
        });
    }

    audio.addEventListener('play', () => { 
        btnPlayPause.querySelector('img').src = '/img/pause.png'; 
        resetAutoSpin(); 
    });
    audio.addEventListener('pause', () => { 
        btnPlayPause.querySelector('img').src = '/img/play.png'; 
        stopSpin(); 
    });

    audio.addEventListener('loadstart', () => {
        if (inlineSpinner) inlineSpinner.style.display = 'block';
        if (perroGif) perroGif.style.display = 'none';
    });

    audio.addEventListener('waiting', () => {
        if (inlineSpinner) inlineSpinner.style.display = 'block';
        if (perroGif) perroGif.style.display = 'none';
    });

    audio.addEventListener('canplay', () => {
        if (inlineSpinner) inlineSpinner.style.display = 'none';
        if (perroGif) perroGif.style.display = 'block';
    });

    audio.addEventListener('playing', () => {
        if (inlineSpinner) inlineSpinner.style.display = 'none';
        if (perroGif) perroGif.style.display = 'block';
    });

    btnVolume.addEventListener('click', () => {
        if (gainNode.gain.value > 0) {
            gainNode.gain.value = 0;
            volumeSlider.value = 0;
            btnVolume.querySelector('img').src = '/img/mute.png';
            updateVolumeSliderUI(0);
        } else {
            gainNode.gain.value = currentVolume > 0 ? currentVolume : 1;
            volumeSlider.value = gainNode.gain.value;
            btnVolume.querySelector('img').src = '/img/volume.png';
            updateVolumeSliderUI(gainNode.gain.value);
        }
    });

    const updateVolumeSliderUI = (val) => {
        const percent = Math.round(val * 100);
        volumeTooltip.textContent = percent + '%';
        const sliderPercent = (val / maxVolume) * 100;
        const trackColor = playlist[currentTrackIndex]?.color || '#ffffff';

        if (percent <= 100) {
            volumeSlider.style.background = `linear-gradient(to right, ${trackColor} ${sliderPercent}%, #333 ${sliderPercent}%)`;
            volumeTooltip.style.color = '#fff';
        } else {
            const normalPercent = (1 / maxVolume) * 100;
            volumeSlider.style.background = `linear-gradient(to right, ${trackColor} ${normalPercent}%, red ${normalPercent}%, red ${sliderPercent}%, #333 ${sliderPercent}%)`;
            volumeTooltip.style.color = 'red';
        }
    };

    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        gainNode.gain.value = val;
        currentVolume = val;
        btnVolume.querySelector('img').src = val === 0 ? '/img/mute.png' : '/img/volume.png';
        updateVolumeSliderUI(val);
    });

    if (inputMaxVolume) {
        inputMaxVolume.addEventListener('change', (event) => {
            const requestedPercent = Number(event.target.value);
            const clampedPercent = Math.min(1000, Math.max(100, Number.isFinite(requestedPercent) ? requestedPercent : 200));
            maxVolume = clampedPercent / 100;
            event.target.value = String(clampedPercent);
            localStorage.setItem('maxVolume', String(maxVolume));
            volumeSlider.max = String(maxVolume);
            if (currentVolume > maxVolume) {
                currentVolume = maxVolume;
                gainNode.gain.value = maxVolume;
                volumeSlider.value = String(maxVolume);
            }
            updateVolumeSliderUI(currentVolume);
        });
    }

    function renderQueue() {
        queueList.innerHTML = '';
        const upcomingIndices = isShuffle ? [...unplayedIndices] : getSequentialQueueIndices();
        const currentTrack = playlist[currentTrackIndex];

        if (currentTrack) {
            const currentHeader = document.createElement('div');
            currentHeader.className = 'queue-header';
            currentHeader.textContent = 'Reproduciendo ahora';
            queueList.appendChild(currentHeader);

            const currentItem = document.createElement('li');
            currentItem.className = 'queue-item active';
            currentItem.style.setProperty('--track-color', currentTrack.color);
            currentItem.innerHTML = `
                ${createImageMarkup(getSongCover(currentTrack), 'queue-item-img')}
                <div class="queue-item-info">
                    <span class="queue-item-name">${currentTrack.name}</span>
                    <span class="queue-item-artist">${currentTrack.artist}</span>
                </div>
            `;
            queueList.appendChild(currentItem);
        }

        if (customQueue.length > 0) {
            const header = document.createElement('div');
            header.className = 'queue-header';
            header.textContent = 'A continuación en la cola';
            queueList.appendChild(header);

            customQueue.forEach((track, idx) => {
                const li = document.createElement('li');
                li.className = 'queue-item';
                li.style.setProperty('--track-color', track.color);
                li.innerHTML = `
                    ${createImageMarkup(getSongCover(track), 'queue-item-img')}
                    <div class="queue-item-info">
                        <span class="queue-item-name">${track.name}</span>
                        <span class="queue-item-artist">${track.artist}</span>
                    </div>
                    <button class="remove-queue-btn" type="button">
                        <img src="/img/cancel.png" draggable="false" class="no-drag" alt="">
                    </button>
                `;
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (e.target.closest('.remove-queue-btn')) {
                        customQueue.splice(idx, 1);
                        renderQueue();
                    }
                });
                setupQueueDrag(li, 'custom', idx);
                queueList.appendChild(li);
            });

        }

        if (upcomingIndices.length > 0) {
            const activePlaylist = userPlaylists.find(playlistItem => playlistItem.id === activePlaylistId);
            const sourceHeader = document.createElement('div');
            sourceHeader.className = 'queue-header';
            sourceHeader.textContent = `${activePlaylist?.name || 'GENERAL'}`;
            queueList.appendChild(sourceHeader);

            upcomingIndices.forEach((origIndex, position) => {
                const track = playlist[origIndex];
                if (!track) return;
                const li = document.createElement('li');
                li.className = 'queue-source-item';
                li.dataset.queueSource = isShuffle ? 'shuffle' : 'regular';
                li.dataset.queuePosition = position;
                li.style.setProperty('--track-color', track.color);
                li.innerHTML = `
                    ${createImageMarkup(getSongCover(track), 'queue-item-img')}
                    <div class="queue-item-info">
                        <span class="queue-item-name">${track.name}</span>
                        <span class="queue-item-artist">${track.artist}</span>
                    </div>
                `;
                setupSongMenuListeners(li, origIndex);
                setupPullToQueue(li, origIndex);
                queueList.appendChild(li);
            });
        } else if (customQueue.length === 0) {
            const emptyQueue = document.createElement('div');
            emptyQueue.className = 'queue-header';
            emptyQueue.textContent = 'NO HAY MÁS CANCIONES EN LA COLA';
            queueList.appendChild(emptyQueue);
        }
    }

    function loadAndPlayTrack(index, source = 'regular') {
        if (index >= playlist.length) index = 0;
        if (index < 0) index = playlist.length - 1;

        currentTrackIndex = index;
        currentTrackSource = source;
        const track = playlist[currentTrackIndex];
        if (!track) return;

        audio.src = track.path;
        audio.play().catch((err) => console.log('Esperando interacción para reproducción:', err));

        trackNameEl.textContent = track.name;
        trackArtistEl.textContent = track.artist;
        bottomBar.style.setProperty('--track-color', track.color);
        const trackCover = getSongCover(track);
        bottomBarCover.src = trackCover;
        bottomBarCover.alt = trackCover ? '' : 'SIN IMG';
        bottomBarCover.classList.toggle('no-image', !trackCover);
        updateVolumeSliderUI(currentVolume); 
        renderQueue(); 
        showPlayerPopup(track);

        updateBackgroundAndViews();
    }

    function showPlayerPopup(track) {
        const trackCover = getSongCover(track);
        popupCover.src = trackCover;
        popupCover.alt = trackCover ? '' : 'SIN IMG';
        popupCover.classList.toggle('no-image', !trackCover);
        popupSongName.innerHTML = `${track.name}<span class="popup-artist">${track.artist}</span>`;
        playerPopup.style.setProperty('--track-color', track.color);
        playerPopup.classList.add('active');

        if (popupTimeout) clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => playerPopup.classList.remove('active'), 4000);
    }

    function playNextTrack() {
        if (customQueue.length > 0) {
            const nextTrack = customQueue.shift();
            const idx = playlist.findIndex(t => t.path === nextTrack.path);
            if (idx !== -1) {
                if (playlist[currentTrackIndex]) playbackHistory.push({ index: currentTrackIndex, source: currentTrackSource });
                loadAndPlayTrack(idx, 'custom');
            }
            return;
        }

        if (isShuffle) {
            if(unplayedIndices.length === 0) return; 

            const nextRandom = unplayedIndices.shift();
            if (playlist[currentTrackIndex]) playbackHistory.push({ index: currentTrackIndex, source: currentTrackSource });
            loadAndPlayTrack(nextRandom, 'shuffle');
        } else {
            const nextIndex = getSequentialQueueIndices()[0];
            if (nextIndex !== undefined) {
                if (playlist[currentTrackIndex]) playbackHistory.push({ index: currentTrackIndex, source: currentTrackSource });
                loadAndPlayTrack(nextIndex, 'regular');
            }
        }
    }

    function rewindTrack() {
        if (audio.duration) {
            audio.currentTime = Math.max(0, audio.currentTime - seekSeconds);
        }
    }

    function forwardTrack() {
        if (audio.duration) {
            audio.currentTime = Math.min(audio.duration, audio.currentTime + seekSeconds);
        }
    }

    if (btnRewind) btnRewind.addEventListener("click", rewindTrack);
    if (btnForward) btnForward.addEventListener("click", forwardTrack);

    if (inputSeekSeconds) {
        inputSeekSeconds.addEventListener("change", (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                seekSeconds = val;
                if (rewindLabel) rewindLabel.textContent = `${seekSeconds}s`;
                if (forwardLabel) forwardLabel.textContent = `${seekSeconds}s`;
            }
        });
    }

    const handleKeyDown = (e) => {
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
            return;
        }
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            rewindTrack();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            forwardTrack();
        }
    };
    document.addEventListener("keydown", handleKeyDown);

    btnNext.addEventListener('click', playNextTrack);
    audio.addEventListener('ended', playNextTrack);
    btnPrev.addEventListener('click', () => {
        const previous = playbackHistory.pop();
        if (!previous) {
            const currentPosition = activeQueueTracks.findIndex(track => playlist.indexOf(track) === currentTrackIndex);
            const fallbackTrack = activeQueueTracks[currentPosition - 1] || activeQueueTracks[activeQueueTracks.length - 1];
            if (fallbackTrack) loadAndPlayTrack(playlist.indexOf(fallbackTrack), 'regular');
            return;
        }

        if (playlist[currentTrackIndex]) {
            if (currentTrackSource === 'custom') {
                customQueue.unshift(playlist[currentTrackIndex]);
            } else if (isShuffle) {
                unplayedIndices.unshift(currentTrackIndex);
            }
        }

        loadAndPlayTrack(previous.index, previous.source);
        renderQueue();
    });

    btnShuffle.addEventListener('click', () => {
        isShuffle = !isShuffle;
        btnShuffle.classList.toggle('active', isShuffle);
        if (isShuffle) {
            unplayedIndices = buildShuffleQueue();
        } else {
            unplayedIndices = [];
        }
        playbackHistory = [];
        renderQueue();
    });

    if (btnAllSongs) {
        btnAllSongs.addEventListener('click', (e) => {
            e.preventDefault(); 
            isAllSongsMode = !isAllSongsMode;
            if (isAllSongsMode) {
                activePlaylistId = null;
                activeQueueTracks = [...playlist];
                playbackHistory = [];
                unplayedIndices = [];
                isLyricsMode = false;
                isPlaylistViewMode = false;
                isEditSongMode = false;
                isEditPlaylistMode = false;
                isSettingsMode = false;
            }
            updateBackgroundAndViews();
            closeSidebar();
        });
    }

    if (btnSettings) {
        btnSettings.addEventListener('click', (e) => {
            e.preventDefault();
            isSettingsMode = !isSettingsMode;
            if (isSettingsMode) {
                isAllSongsMode = false;
                isLyricsMode = false;
                isPlaylistViewMode = false;
                isEditSongMode = false;
                isEditPlaylistMode = false;
            }
            updateBackgroundAndViews();
            closeSidebar();
        });
    }

    if (btnSettingsYt) {
        btnSettingsYt.addEventListener('click', async () => {
            const link = inputSettingsYt.value.trim();
            if (!link || !isValidYoutubeLink(link)) {
                showYoutubeLinkStatus('El enlace de YouTube no es válido.', true);
                return;
            }

            btnSettingsYt.textContent = "Descargando...";
            btnSettingsYt.disabled = true;
            startYtDownloadProgress('Descargando canción');
            showYoutubeLinkStatus('Descargando y guardando el MP3 localmente...', false);

            const requestedFileName = inputSettingsYtName?.value.trim() || '';
            const requestBody = JSON.stringify({ ytLink: link, fileName: requestedFileName });

            try {
                const response = await fetch(`${API_URL}/yt-download`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: requestBody
                });
                const result = await response.json().catch(() => null);
                if (!response.ok) {
                    const message = result?.error || 'El enlace de YouTube fue rechazado o no es válido.';
                    throw new Error(message);
                }
                stopYtDownloadProgress({ success: true, message: `MP3 guardado localmente: ${result.fileName}` });
                showYoutubeLinkStatus(`¡MP3 guardado en ${result.path}!`, false);
                inputSettingsYt.value = '';
                if (inputSettingsYtName) inputSettingsYtName.value = '';
            } catch (e) {
                console.error(e);
                const message = e?.message || 'El enlace de YouTube fue rechazado o no es válido.';
                stopYtDownloadProgress({ success: false, message, error: true });
                showYoutubeLinkStatus(message, true);
            } finally {
                btnSettingsYt.textContent = "Descargar Audio";
                btnSettingsYt.disabled = false;
                setTimeout(() => { if (statusSettingsYt) statusSettingsYt.style.display = 'none'; }, 5000);
            }
        });
    }

    btnQueue.addEventListener('click', () => {
        isQueueOpen = !isQueueOpen;
        if (isQueueOpen) {
            queueContainer.classList.add('show');
            bottomBarWrapper.classList.add('queue-open');
            setTimeout(() => {
                const activeItem = queueList.querySelector('.queue-item.active');
                if(activeItem) activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            queueContainer.classList.remove('show');
            bottomBarWrapper.classList.remove('queue-open');
        }
    });

    btnPlayPause.addEventListener('click', () => {
        if (audio.paused) { audio.play(); } 
        else { audio.pause(); }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) audio.currentTime = (clickX / width) * duration;
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + '%';
        }
    });

    resetAutoSpin();

    return () => {
        audio.pause();
        cancelAnimationFrame(spinAf);
        clearTimeout(autoSpinTimer);
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener("keydown", handleKeyDown);
    };
}