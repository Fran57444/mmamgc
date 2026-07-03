export function ultraintro() {
    const gateScreen = document.getElementById("gate-screen");
    const mainContent = document.getElementById("main-content");
    const symbolX = document.getElementById("symbol-x");
    const symbolPlus = document.getElementById("symbol-plus");
    const actionText = document.getElementById("action-text");
    const flashOverlay = document.getElementById("flash-overlay");
    const merged = document.getElementById("merged-symbol");
    const glowLeft = document.getElementById("glow-left");
    const glowRight = document.getElementById("glow-right");
    const secretText = document.getElementById("secret-text"); 

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

    const top10Btn = document.getElementById("btn-top10");
    const top10Container = document.getElementById("top10-container");
    const top10List = document.getElementById("top10-list");

    if (!gateScreen || !mainContent || !symbolX || !symbolPlus || !actionText || !flashOverlay || !merged || !glowLeft || !glowRight || !playerPopup || !popupCover || !popupSongName || !bottomBarWrapper || !bottomBar || !trackNameEl || !trackArtistEl || !btnPrev || !btnPlayPause || !btnNext || !progressContainer || !progressBar || !bottomBarCover || !btnShuffle || !btnQueue || !secretText || !queueContainer || !queueList || !btnVolume || !volumeSlider) {
        return () => {}
    }

    let introStarted = false;
    let canClick = false;
    let hasMerged = false;
    let popupTimeout = null;
    let isZoomed = false;
    
    let isQueueOpen = false;
    let isShuffle = false;
    let isPlayingTop10 = false;
    let currentVolume = 1;

    let customQueue = [];
    let unplayedIndices = [];
    
    let autoSpinTimer = null; 
    let svgRot = 0;
    let spinAf;
    let isAutoSpinning = false;
    const mergedSvg = merged.querySelector('svg');

    const startSpin = () => {
        if (!hasMerged || isZoomed || isAutoSpinning) return;
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
        autoSpinTimer = setTimeout(() => {
            startSpin();
        }, 10000);
    };

    const handleInteractiveClick = (e) => {
        const isInteractive = e.target.closest('button, .side-glow, input, #progress-container, .queue-item, .merged-symbol, .slide-panel');
        
        if (isInteractive) {
            resetAutoSpin();
        }
    };
    document.body.addEventListener('click', handleInteractiveClick);

    const secretPhrases = [
        "44457", "FRAMI", "?!", "MIMI TE AMO", "FELIZ PUMPE", "03/07/2026", "MF", "FM", "SACRED KEY TO LIFE", "+++xx", "57444", "AND IF YOU'RE THINKING OF ME", "I'M PROBABLY THINKING OF YOU", "SKTL", "#00ADA9", "#00E064", "MIAU"
    ];

    const TIME_TO_SEC_18 = 5990;
    const TIME_TO_SEC_21 = 7990;
    const TIME_TO_SEC_25 = 10990;
    const TOTAL_IDLE_TIME = 13000;  
    const sprintDuration = 200;
    let idleRaf = null;

    let targetPeriod = 2.4;
    let actualPeriod = 2.4;
    let targetShake = 0.12;
    let actualShake = 0.12;
    const SMOOTH_FACTOR = 0.025;

    const PAUSE_TIME = 13.9;
    const DRAMATIC_FADE = 2;
    let hasPausedDramatically = false;

    const playlist = [
        { path: "/mp3/vinculo.mp3", name: "Vínculo", artist: "Enjambre", cover: "/img/vinculo.png", color: "#263cb6" },
        { path: "/mp3/thespellofmathematics.mp3", name: "The Spell of Mathematics", artist: "Deftones", cover: "/img/ohms.png", color: "#4d4d4d" },
        { path: "/mp3/fs.mp3", name: "Fallen Star", artist: "The Neighbourhood", cover: "/img/fallenstar.png", color: "#dfb600ff" },
        { path: "/mp3/bp.mp3", name: "Body Paint", artist: "Arctic Monkeys", cover: "/img/thecar.png", color: "#eed88eff" },
        { path: "/mp3/souvenir.mp3", name: "souvenir", artist: "Deftones", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/baileinolvidable.mp3", name: "BAILE INoLVIDABLE", artist: "Bad Bunny", cover: "/img/debitirarmasfotos.jpg", color: "#417900" },
        { path: "/mp3/cdll.mp3", name: "Ciencia de la Lluvia", artist: "Enjambre", cover: "/img/daltonico.jpg", color: "#e09200" },
        { path: "/mp3/tpwhitb.mp3", name: "The Place Where He Inserted the Blade", artist: "Black Country, New Road", cover: "/img/antsfromupthere.png", color: "#ddac52" },
        { path: "/mp3/metaldream.mp3", name: "~metal dream", artist: "Deftones", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/dtb.mp3", name: "departing the body", artist: "Deftones", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/ygsh.mp3", name: "You Get Me So High", artist: "The Neighbourhood", cover: "/img/htitnec.png", color: "#b9a79c" },
        { path: "/mp3/nok.mp3", name: "No One Knows (with Laufey)", artist: "Stephen Sanchez, Laufey", cover: "/img/angelface.png", color: "#a6452a" },
        { path: "/mp3/atwci.mp3", name: "As the World Caves In", artist: "Matt Maltese", cover: "/img/atwci.png", color: "#c52222ff" },
        { path: "/mp3/halflife.mp3", name: "Half Life", artist: "Djo", cover: "/img/decide.png", color: "#2e5099ff" },
        { path: "/mp3/jmid.mp3", name: "Join Me In Death", artist: "HIM", cover: "/img/razorbladeromance.png", color: "#d9427b" },
        { path: "/mp3/sf.mp3", name: "Siesta Freestyle", artist: "Lewis OfMan, Alicia te quiero", cover: "/img/dp.png", color: "#ffffff" },
        { path: "/mp3/itayatt.mp3", name: "i think about you all the time", artist: "Deftones", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/lp.mp3", name: "little person", artist: "Matt Maltese", cover: "/img/madhouse.png", color: "#748a73" },
        { path: "/mp3/tty.mp3", name: "Talk to You", artist: "Ricky Montgomery", cover: "/img/edits.png", color: "#6a7c5b" },
        { path: "/mp3/mme.mp3", name: "Ma Meilleure Ennemie", artist: "Stromae, Pomme, Arcane", cover: "/img/arcanebro.png", color: "#163a6a" },
        { path: "/mp3/iwby.mp3", name: "I Wanna Be Yours", artist: "Arctic Monkeys", cover: "/img/am.png", color: "#ffffffff" },
        { path: "/mp3/stwiwgowy.mp3", name: "Stop The World I Wanna Get Off With You", artist: "Arctic Monkeys", cover: "/img/wyocmwyh.png", color: "#fdfdfdff" },
        { path: "/mp3/diamondeyes.mp3", name: "Diamond Eyes", artist: "Deftones", cover: "/img/diamondeyes.png", color: "#a5a5a5" },
        { path: "/mp3/royal.mp3", name: "Royal", artist: "Deftones", cover: "/img/diamondeyes.png", color: "#a5a5a5" },
        { path: "/mp3/glitter.mp3", name: "glitter☆·.˚", artist: "lexycat", cover: "/img/glitter.png", color: "#f7b2c5" },
        { path: "/mp3/care.mp3", name: "Care", artist: "Clark Rainbow", cover: "/img/care.png", color: "#eeeebcff" },
        { path: "/mp3/guylikeyou.mp3", name: "guy like you", artist: "Yazida", cover: "/img/musthave.png", color: "#f098b6" },
        { path: "/mp3/supersonic.mp3", name: "SUPERSONIC", artist: "berryblue", cover: "/img/supersonic.png", color: "#4f5a5c" },
        { path: "/mp3/inamood.mp3", name: "IN A MOOD", artist: "berryblue", cover: "/img/gotmelike.png", color: "#e39d93" },
        { path: "/mp3/ringringring.mp3", name: "Ring Ring Ring", artist: "Tyler, The Creator", cover: "/img/dttg.png", color: "#ac3227" },
        { path: "/mp3/frontin.mp3", name: "Frontin' (feat. JAY-Z) - Club Mix", artist: "Pharrell Williams, JAY-Z", cover: "/img/tnpclones.png", color: "#5f87bbff" },
        { path: "/mp3/ryb.mp3", name: "Rock Your Body", artist: "Justin Timberlake", cover: "/img/justified.png", color: "#657aa0ff" },
        { path: "/mp3/rumine.mp3", name: "R U Mine?", artist: "Arctic Monkeys", cover: "/img/am.png", color: "#ffffffff" },
        { path: "/mp3/rosemary.mp3", name: "Rosemary", artist: "Deftones", cover: "/img/koinoyokan.png", color: "#c42e00ff" },
        { path: "/mp3/ginkgo.mp3", name: "Ginkgo", artist: "Panchiko", cover: "/img/ginkgo.png", color: "#89d2ecff" },
        { path: "/mp3/ald.mp3", name: "A Little Death", artist: "The Neighbourhood", cover: "/img/thankyou.png", color: "#d9d9d9" },
        { path: "/mp3/smile.mp3", name: "Smile", artist: "Deftones", cover: "/img/smile.png", color: "#9037d8" },
        { path: "/mp3/never.mp3", name: "Never", artist: "Mag.Lo, O Super", cover: "/img/never.png", color: "#e4e4e4" },
        { path: "/mp3/mmiam.mp3", name: "my mind is a mountain", artist: "Deftones", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/ohms.mp3", name: "Ohms", artist: "Deftones", cover: "/img/ohms.png", color: "#4d4d4d" },
        { path: "/mp3/killshot.mp3", name: "Killshot", artist: "Magdalena Bay", cover: "/img/killshot.png", color: "#3d4b3b" },
        { path: "/mp3/lytte.mp3", name: "Love You to the End", artist: "And One, Naghavi, Steve", cover: "/img/bodypop.png", color: "#f7941d" },
        { path: "/mp3/flawless.mp3", name: "Flawless", artist: "The Neighbourhood", cover: "/img/iloveyou.png", color: "#8a8a8a" },
        { path: "/mp3/lbl.mp3", name: "Little by Little", artist: "The Marías", cover: "/img/cinema.png", color: "#9d2925" },
        { path: "/mp3/lial.mp3", name: "Love is a Laserquest", artist: "Arctic Monkeys", cover: "/img/suckitandsee.png", color: "#f2e4c4" },
        { path: "/mp3/paula.mp3", name: "Paula", artist: "Zoé", cover: "/img/mrcyelcadlvl.png", color: "#ff0099" },
        { path: "/mp3/eay.mp3", name: "Everyone Adores You (at least I do)", artist: "Matt Maltese", cover: "/img/gmint.png", color: "#354e4c" },
        { path: "/mp3/dnpi.mp3", name: "Donde Nadie Pueda Ir", artist: "Manuel Medrano", cover: "/img/manuelmedrano.png", color: "#513068ff" },
        { path: "/mp3/likeyoudo.mp3", name: "Like You Do", artist: "Joji", cover: "/img/nectar.png", color: "#8f0c00ff" },
        { path: "/mp3/cicyt.mp3", name: "Can I Call You Tonight?", artist: "Dayglow", cover: "/img/fuzzybrain.png", color: "#7cb1c4" },
        { path: "/mp3/ca.mp3", name: "Cien Años", artist: "Paté de Fuá", cover: "/img/amoresajenos.png", color: "#ad8e65" },
        { path: "/mp3/vacio.mp3", name: "El Vacío - Noches de Salón", artist: "Enjambre", cover: "/img/nochesdesalon.png", color: "#8b201a" },
        { path: "/mp3/losimanes.mp3", name: "Los Imanes", artist: "Odisseo", cover: "/img/cambioestacional.png", color: "#3a4c8a" },
        { path: "/mp3/tlw.mp3", name: "True Love Waits", artist: "Radiohead", cover: "/img/amoonshapedpool.png", color: "#d0d0d0" },
        { path: "/mp3/quierover.mp3", name: "Quiero Ver", artist: "Café Tacvba", cover: "/img/sino.png", color: "#a9a9a9" },
        { path: "/mp3/1amfreestyle.mp3", name: "1AM FREESTYLE", artist: "Joji", cover: "/img/smithereens.png", color: "#5c798a" },
        { path: "/mp3/cfy.mp3", name: "Care For You", artist: "The Marías", cover: "/img/careforyou.png", color: "#ffffffff" },
        { path: "/mp3/otm.mp3", name: "Over the Moon", artist: "The Marías", cover: "/img/superclean.png", color: "#ac0000ff" },
        { path: "/mp3/pr.mp3", name: "Purple Rain", artist: "Prince", cover: "/img/purplerain.png", color: "#4f2b6e" },
        { path: "/mp3/miy.mp3", name: "Maybe It's You", artist: "Pump Action", cover: "/img/maybeitsyou.png", color: "#8abcc4" },
        { path: "/mp3/disco.mp3", name: "Disco", artist: "Surf Curse", cover: "/img/disc.png", color: "#30568c" },
        { path: "/mp3/comotu.mp3", name: "Como Tú (Magic Music Box)", artist: "León Larregui", cover: "/img/solstis.png", color: "#6a6a6a" },
        { path: "/mp3/carmin.mp3", name: "Carmín", artist: "León Larregui", cover: "/img/solstis.png", color: "#6a6a6a" },
        { path: "/mp3/lanovela.mp3", name: "La Novela", artist: "boy pablo, Cuco", cover: "/img/lanovela.png", color: "#e8a46b" },
        { path: "/mp3/fl.mp3", name: "Frances Limon", artist: "Los Enanitos Verdes", cover: "/img/loqueelrocknosdejo.png", color: "#944444ff" },
        { path: "/mp3/vivos.mp3", name: "Vivos", artist: "Enjambre", cover: "/img/vivos.png", color: "#d66928" },
        { path: "/mp3/visita.mp3", name: "Visita - Noches de Salón", artist: "Enjambre", cover: "/img/nochesdesalon.png", color: "#8b201a" },
        { path: "/mp3/allineed.mp3", name: "All I Need", artist: "Radiohead", cover: "/img/inrainbows.png", color: "#c05c19ff" },
        { path: "/mp3/rxqueen.mp3", name: "Rx Queen", artist: "Deftones", cover: "/img/whitepony.png", color: "#e8e8e8" },
        { path: "/mp3/gauze.mp3", name: "Gauze", artist: "Deftones", cover: "/img/koinoyokan.png", color: "#c42e00ff" },
        { path: "/mp3/bs.mp3", name: "Beauty School", artist: "Deftones", cover: "/img/diamondeyes.png", color: "#a5a5a5" },
        { path: "/mp3/reflections.mp3", name: "Reflections", artist: "The Neighbourhood", cover: "/img/htitnec.png", color: "#c6bca8" },
        { path: "/mp3/glasseyes.mp3", name: "Glass Eyes", artist: "Radiohead", cover: "/img/amoonshapedpool.png", color: "#d0d0d0" },
        { path: "/mp3/thca.mp3", name: "Time Has Come Again", artist: "The Last Shadow Puppets, Alex Turner, Miles Kane", cover: "/img/taotu.png", color: "#862c2cff" },
        { path: "/mp3/oma.mp3", name: "Oh My Angel", artist: "Bertha Tillman", cover: "/img/pberthatillman.png", color: "#d85da9ff" },
        { path: "/mp3/cifcik.mp3", name: "Call It Fate, Call It Karma", artist: "The Strokes", cover: "/img/comedownmachine.png", color: "#cc3e2c" },
        { path: "/mp3/pm.mp3", name: "Pink Matter", artist: "Frank Ocean, André 3000", cover: "/img/channelorange.png", color: "#e87b28" },
        { path: "/mp3/st.mp3", name: "She's Thunderstorms", artist: "Arctic Monkeys", cover: "/img/suckitandsee.png", color: "#f2e4c4" },
        { path: "/mp3/ld.mp3", name: "La Diferencia", artist: "Enjambre", cover: "/img/ladiferencia.png", color: "#3c86b4" },
        { path: "/mp3/elemento.mp3", name: "Elemento - Noches de Salón", artist: "Enjambre", cover: "/img/nochesdesalon.png", color: "#8b201a" },
        { path: "/mp3/jupiter.mp3", name: "Jupiter", artist: "Matt Maltese", cover: "/img/krystal.png", color: "#a88e7b" },
        { path: "/mp3/iloveyou.mp3", name: "I Love You", artist: "Woodkid", cover: "/img/thegoldenage.png", color: "#d0d0d0" },
        { path: "/mp3/theultracheese.mp3", name: "The Ultracheese", artist: "Arctic Monkeys", cover: "/img/tranquilitybasehotelandcasino.png", color: "#917a5dff" },
        { path: "/mp3/pinkwhite.mp3", name: "Pink + White", artist: "Frank Ocean", cover: "/img/blond.png", color: "#85b58fff" },
        { path: "/mp3/mwol.mp3", name: "My Way Of Life", artist: "Frank Sinatra", cover: "/img/cycles.png", color: "#2d4454" },
        { path: "/mp3/gh.mp3", name: "Geometric Headdress", artist: "Deftones", cover: "/img/gore.png", color: "#5e6978" },
        { path: "/mp3/risk.mp3", name: "Risk", artist: "Deftones", cover: "/img/diamondeyes.png", color: "#a5a5a5" },
        { path: "/mp3/entombed.mp3", name: "Entombed", artist: "Deftones", cover: "/img/koinoyokan.png", color: "#c42e00ff" },
        { path: "/mp3/mar.mp3", name: "Mar", artist: "León Larregui", cover: "/img/voluma.png", color: "#6a7b8e" },
        { path: "/mp3/siempretu.mp3", name: "Siempre Tú", artist: "Enjambre", cover: "/img/proximosprojimos.png", color: "#366a8c" },
        { path: "/mp3/lisa.mp3", name: "Lisa", artist: "Gustavo Cerati", cover: "/img/amoramarillo.png", color: "#f8e030" },
        { path: "/mp3/lainnombrable.mp3", name: "La Innombrable", artist: "Julius Popper", cover: "/img/juliuspopper.png", color: "#d0b07a" },
        { path: "/mp3/amores.mp3", name: "Amores", artist: "Nova Club, Azul de Viena", cover: "/img/amores.png", color: "#a874a8" },
        { path: "/mp3/2o00s.mp3", name: "2o00s!", artist: "White MJ, Juanki", cover: "/img/2o00s.png", color: "#e8a49c" },
        { path: "/mp3/etatle.mp3", name: "el tiempo a tu lado es ?!?!", artist: "White MJ", cover: "/img/nomeprestesatencion.png", color: "#2a2a2a" }
    ];

    const top10Songs = [
        { path: "/mp3/dtb.mp3", name: "departing the body", artist: "Deftones", album: "private music", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/thespellofmathematics.mp3", name: "The Spell of Mathematics", artist: "Deftones", album: "Ohms", cover: "/img/ohms.png", color: "#4d4d4d" },
        { path: "/mp3/smile.mp3", name: "Smile", artist: "Deftones", album: "Eros", cover: "/img/smile.png", color: "#9037d8" },
        { path: "/mp3/souvenir.mp3", name: "souvenir", artist: "Deftones", album: "private music", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/itayatt.mp3", name: "i think about you all the time", artist: "Deftones", album: "private music", cover: "/img/privatemusic.png", color: "#00e01e" },
        { path: "/mp3/gh.mp3", name: "Geometric Headdress", artist: "Deftones", album: "Gore", cover: "/img/gore.png", color: "#5e6978" },
        { path: "/mp3/sc.mp3", name: "Swerve City", artist: "Deftones", album: "Koi no Yokan", cover: "/img/koinoyokan.png", color: "#c42e00ff" },
        { path: "/mp3/diamondeyes.mp3", name: "Diamond Eyes", artist: "Deftones", album: "Diamond Eyes", cover: "/img/diamondeyes.png", color: "#ffffff" },
        { path: "/mp3/genesis.mp3", name: "Genesis", artist: "Deftones", album: "Ohms", cover: "/img/ohms.png", color: "#4d4d4d" },
        { path: "/mp3/leathers.mp3", name: "Leathers", artist: "Deftones", album: "Koi no Yokan", cover: "/img/koinoyokan.png", color: "#c42e00ff" }
    ];

    let currentTrackIndex = 0;
    const audio = new Audio();
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
    gainNode.gain.value=currentVolume;

    const timeouts = [];

    const setInteractionLock = (ms, lockType = 'global') => {
        const unlockTime = Date.now() + ms;
        if (window.currentUnlockTime && window.currentUnlockTime > unlockTime) return;
        window.currentUnlockTime = unlockTime;
        
        const className = lockType === 'track' ? 'lock-track-changes' : 'lock-interactions';
        document.body.classList.add(className);

        if (window.interactionLockTimer) clearTimeout(window.interactionLockTimer);
        
        window.interactionLockTimer = setTimeout(() => {
            document.body.classList.remove('lock-interactions', 'lock-track-changes');
            window.currentUnlockTime = 0;
        }, ms);
    };

    const registerTimeout = (callback, delay) => {
        const id = window.setTimeout(callback, delay);
        timeouts.push(id);
        return id;
    };

    const clearTrackedTimeouts = () => {
        timeouts.forEach((id) => window.clearTimeout(id));
    };

    const updateSecretText = () => {
        const randomPhrase = secretPhrases[Math.floor(Math.random() * secretPhrases.length)];
        secretText.textContent = randomPhrase;
    };

    audio.addEventListener('play', () => { btnPlayPause.textContent = '⏸'; });
    audio.addEventListener('pause', () => { btnPlayPause.textContent = '▶'; });

    btnVolume.addEventListener('click', () => {
        if (gainNode.gain.value > 0) {
            gainNode.gain.value = 0;
            volumeSlider.value = 0;
            btnVolume.textContent = '🗣 X';
            updateVolumeSliderUI(0);
        } else {
            gainNode.gain.value = currentVolume > 0 ? currentVolume : 1;
            volumeSlider.value = gainNode.gain.value;
            btnVolume.textContent = '🗣';
            updateVolumeSliderUI(gainNode.gain.value);
        }
    });

    const updateVolumeSliderUI = (val) => {
        const percent = Math.round(val * 100);
        volumeTooltip.textContent = percent + '%';
        
        const sliderPercent = (val / 2) * 100; 
        const currentArray = isPlayingTop10 ? top10Songs : playlist;
        const trackColor = currentArray[currentTrackIndex]?.color || '#ffffff';

        if (percent <= 100) {
            volumeSlider.style.background = `linear-gradient(to right, ${trackColor} ${sliderPercent}%, #333 ${sliderPercent}%)`;
            volumeTooltip.style.color = '#fff';
        } else {
            volumeSlider.style.background = `linear-gradient(to right, ${trackColor} 50%, red 50%, red ${sliderPercent}%, #333 ${sliderPercent}%)`;
            volumeTooltip.style.color = 'red';
        }
    };

    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        gainNode.gain.value = val;
        currentVolume = val;
        btnVolume.textContent = val === 0 ? '🗣X' : '🗣';
        updateVolumeSliderUI(val);
    });

    function renderQueue() {
        queueList.innerHTML = '';
        
        if (customQueue.length > 0) {
            const header1 = document.createElement('div');
            header1.className = 'queue-header';
            header1.textContent = 'A continuación en la cola';
            queueList.appendChild(header1);

            customQueue.forEach((track, idx) => {
                const li = document.createElement('li');
                li.className = 'queue-item';
                li.style.setProperty('--track-color', track.color);
                li.innerHTML = `
                    <img class="queue-item-img" src="${track.cover}" alt="">
                    <div class="queue-item-info">
                        <span class="queue-item-name">${track.name}</span>
                        <span class="queue-item-artist">${track.artist}</span>
                    </div>
                    <button class="remove-queue-btn" type="button" title="Quitar">✖</button>
                `;
                li.addEventListener('click', (e) => {
                    if (e.target.classList.contains('remove-queue-btn')) {
                        e.stopPropagation();
                        customQueue.splice(idx, 1);
                        renderQueue();
                        return;
                    }
                });
                queueList.appendChild(li);
            });
        }

        const header2 = document.createElement('div');
        header2.className = 'queue-header';
        header2.textContent = 'Siguientes';
        queueList.appendChild(header2);

        playlist.forEach((track, i) => {
            const li = document.createElement('li');
            li.className = `queue-item ${!isPlayingTop10 && i === currentTrackIndex ? 'active' : ''}`;
            li.style.setProperty('--track-color', track.color);
            li.innerHTML = `
                <img class="queue-item-img" src="${track.cover}" alt="">
                <div class="queue-item-info">
                    <span class="queue-item-name">${track.name}</span>
                    <span class="queue-item-artist">${track.artist}</span>
                </div>
                <button class="add-to-queue-btn" type="button" title="Añadir a la cola">+</button>
            `;
            
            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-queue-btn')) {
                    e.stopPropagation();
                    customQueue.push(track);
                    renderQueue();
                    return;
                }
                isPlayingTop10 = false;
                loadAndPlayTrack(i, playlist);
            });
            queueList.appendChild(li);
        });
    }

    function renderTop10() {
        top10List.innerHTML = '';
        top10Songs.forEach((track, i) => {
            const li = document.createElement('li');
            li.className = `queue-item ${isPlayingTop10 && i === currentTrackIndex ? 'active' : ''}`;
            li.style.setProperty('--track-color', track.color);
            li.innerHTML = `
                <img class="queue-item-img" src="${track.cover}" alt="">
                <div class="queue-item-info">
                    <span class="queue-item-name">${track.name}</span>
                    <span class="queue-item-artist">${track.album}</span>
                </div>
            `;
            li.addEventListener('click', () => {
                isPlayingTop10 = true;
                loadAndPlayTrack(i, top10Songs);
                renderTop10(); 
                renderQueue(); 
            });
            top10List.appendChild(li);
        });
    }

    function loadAndPlayTrack(index, currentArray = playlist) {
        if (index >= currentArray.length) index = 0;
        if (index < 0) index = currentArray.length - 1;

        if (hasMerged) setInteractionLock(600, 'track');

        currentTrackIndex = index;
        const track = currentArray[currentTrackIndex];

        audio.src = track.path;
        audio.play().catch((err) => console.log('Audio bloqueado:', err));

        trackNameEl.textContent = track.name;
        trackArtistEl.textContent = track.artist;
        bottomBar.style.setProperty('--track-color', track.color);
        bottomBarCover.src = track.cover;
        
        updateVolumeSliderUI(currentVolume); 
        renderQueue(); 
        if(isPlayingTop10) renderTop10();
        showPlayerPopup(track);
    }

    function showPlayerPopup(track) {
        if (!hasMerged) return; 

        popupCover.src = track.cover;
        popupSongName.innerHTML = `${track.name}<span class="popup-artist">${track.artist}</span>`;
        playerPopup.style.setProperty('--track-color', track.color);
        playerPopup.classList.add('active');

        if (popupTimeout) clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
            playerPopup.classList.remove('active');
        }, 4000);
    }

    function playNextTrack() {
        if (customQueue.length > 0) {
            const nextTrack = customQueue.shift();
            const idx = playlist.findIndex(t => t.path === nextTrack.path);
            isPlayingTop10 = false;
            
            if (idx !== -1) {
                loadAndPlayTrack(idx, playlist);
            } else {
                const topIdx = top10Songs.findIndex(t => t.path === nextTrack.path);
                if (topIdx !== -1) {
                    isPlayingTop10 = true;
                    loadAndPlayTrack(topIdx, top10Songs);
                }
            }
            return;
        }

        let currentArray = isPlayingTop10 ? top10Songs : playlist;

        if (isShuffle && !isPlayingTop10) {
            if (unplayedIndices.length === 0) {
                unplayedIndices = playlist.map((_, i) => i).filter(i => i !== currentTrackIndex);
            }
            if(unplayedIndices.length === 0) return; 
            
            const randomPos = Math.floor(Math.random() * unplayedIndices.length);
            const nextRandom = unplayedIndices[randomPos];
            unplayedIndices.splice(randomPos, 1); 
            
            loadAndPlayTrack(nextRandom, playlist);
        } else {
            loadAndPlayTrack(currentTrackIndex + 1, currentArray);
        }
    }

    btnNext.addEventListener('click', playNextTrack);
    audio.addEventListener('ended', playNextTrack);

    btnPrev.addEventListener('click', () => {
        let currentArray = isPlayingTop10 ? top10Songs : playlist;
        loadAndPlayTrack(currentTrackIndex - 1, currentArray);
    });

    btnShuffle.addEventListener('click', () => {
        isShuffle = !isShuffle;
        btnShuffle.classList.toggle('active', isShuffle);
        if (isShuffle && !isPlayingTop10) {
            unplayedIndices = playlist.map((_, i) => i).filter(i => i !== currentTrackIndex);
        }
    });

    btnQueue.addEventListener('click', () => {
        isQueueOpen = !isQueueOpen;
        if (isQueueOpen) {
            queueContainer.classList.add('show');
            bottomBarWrapper.classList.add('queue-open');
            glowLeft.style.pointerEvents = 'none';
            glowRight.style.pointerEvents = 'none';
            
            setTimeout(() => {
                const activeItem = queueList.querySelector('.queue-item.active');
                if(activeItem) activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            queueContainer.classList.remove('show');
            bottomBarWrapper.classList.remove('queue-open');
            glowLeft.style.pointerEvents = '';
            glowRight.style.pointerEvents = '';
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

        if (currentTrackIndex !== 0 || hasPausedDramatically) return;

        if (audio.currentTime >= (PAUSE_TIME - DRAMATIC_FADE) && audio.currentTime < PAUSE_TIME) {
            const timeLeft = PAUSE_TIME - audio.currentTime;
            audio.volume = Math.max(0, (timeLeft / DRAMATIC_FADE) * currentVolume);
        }

        if (audio.currentTime >= PAUSE_TIME) {
            hasPausedDramatically = true;
            audio.pause();
            audio.volume = currentVolume; 
        }
    });

    function goToSide(side) {
        if (isQueueOpen) btnQueue.click(); 
        isZoomed = true;
        setInteractionLock(800, 'global'); 
        resetAutoSpin();

        document.body.classList.add('zoomed-mode');
        bottomBarWrapper.style.display = 'none';
        glowLeft.style.display = 'none';
        glowRight.style.display = 'none';
        
        document.getElementById('zoomed-left-content').classList.remove('show');
        document.getElementById('zoomed-right-content').classList.remove('show');
        document.body.classList.remove('show-top10');

        merged.classList.remove('show');
        if (side === 'right') {
            merged.classList.add('zoomed-right');
            document.getElementById('zoomed-right-content').classList.add('show');
        } else {
            merged.classList.add('zoomed-left');
            document.getElementById('zoomed-left-content').classList.add('show');
        }
    }

    glowLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!hasMerged || isZoomed) return;
        goToSide('left');
    });

    glowRight.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!hasMerged || isZoomed) return;
        goToSide('right');
    });

    top10Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('zoomed-right-content').classList.remove('show');
        document.body.classList.add('show-top10'); 
    });

    merged.addEventListener('click', (e) => {
        e.stopPropagation();

        if (window.isLetterOpen) {
            return; 
        }

        if (!isZoomed) return;

        if (document.body.classList.contains('show-top10')) {
            document.body.classList.remove('show-top10');
            document.getElementById('zoomed-right-content').classList.add('show');
            return;
        }

        isZoomed = false;
        setInteractionLock(800, 'global'); 

        document.body.classList.remove('zoomed-mode');
        document.body.classList.remove('show-top10');
        bottomBarWrapper.style.display = 'block';
        glowLeft.style.display = 'block';
        glowRight.style.display = 'block';

        merged.classList.remove('zoomed-right', 'zoomed-left');
        
        updateSecretText();
        merged.classList.add('show');
        resetAutoSpin();
    });

    const handleBodyClick = (e) => {
        if (e.target.closest('#bottom-bar-wrapper') || e.target.closest('.side-glow') || e.target.closest('.merged-symbol') || e.target.closest('.zoomed-panel') || e.target.closest('#top10-container') || e.target.closest('.slide-panel')) return;

        if (!introStarted) {
            audioCtx.resume();
            introStarted = true;
            setInteractionLock(15200, 'global');

            gateScreen.style.opacity = '0';
            loadAndPlayTrack(0, playlist);
            mainContent.classList.remove('hidden-content');

            registerTimeout(() => {
                gateScreen.style.display = 'none';
            }, 1200);

            registerTimeout(() => {
                symbolX.classList.add('animate-up');
                symbolPlus.classList.add('animate-up');
            }, 200);

            registerTimeout(() => {
                actionText.classList.add('show');
                document.body.classList.add('clickable');
                canClick = true;
            }, 14010);

            return;
        }

        if (!canClick) return;
        canClick = false;

        audio.play().catch((err) => console.log('Error al reanudar:', err));

        actionText.classList.remove('show');
        document.body.classList.remove('clickable');

        symbolX.classList.add('idle-spin');
        symbolPlus.classList.add('idle-spin');

        const idleStart = performance.now();

        function idleTick(now) {
            const elapsed = now - idleStart;

            if (elapsed >= TIME_TO_SEC_25) { targetPeriod = 0.04; targetShake = 0.01; } 
            else if (elapsed >= TIME_TO_SEC_21) { targetPeriod = 0.26; targetShake = 0.03; } 
            else if (elapsed >= TIME_TO_SEC_18) { targetPeriod = 0.45; targetShake = 0.06; } 
            else {
                const progress = Math.min(elapsed / TIME_TO_SEC_18, 1);
                targetPeriod = 2.4 - (1.5 * progress);
                targetShake = 0.12 - (0.05 * progress);
            }

            actualPeriod += (targetPeriod - actualPeriod) * SMOOTH_FACTOR;
            actualShake += (targetShake - actualShake) * SMOOTH_FACTOR;

            symbolX.style.setProperty('--idle-rot', actualPeriod + 's');
            symbolPlus.style.setProperty('--idle-rot', actualPeriod + 's');
            symbolX.style.setProperty('--shake-interval', actualShake + 's');
            symbolPlus.style.setProperty('--shake-interval', actualShake + 's');

            if (elapsed < TOTAL_IDLE_TIME) {
                idleRaf = window.requestAnimationFrame(idleTick);
            } else {
                idleRaf = null;
            }
        }
        idleRaf = window.requestAnimationFrame(idleTick);

        registerTimeout(() => {
            if (idleRaf) {
                window.cancelAnimationFrame(idleRaf);
                idleRaf = null;
            }

            symbolX.style.setProperty('--idle-rot', '0.03s');
            symbolPlus.style.setProperty('--idle-rot', '0.03s');
            symbolX.classList.add('sprint-to-center');
            symbolPlus.classList.add('sprint-to-center');

            registerTimeout(() => {
                flashOverlay.classList.add('trigger');
                symbolX.classList.add('hidden');
                symbolPlus.classList.add('hidden');

                merged.style.transition = 'none';
                merged.classList.add('show');
                merged.classList.add('merged-spinning-effect');

                document.body.classList.add('illuminated');

                registerTimeout(() => {
                    hasMerged = true;
                    merged.classList.remove('merged-spinning-effect');
                    glowLeft.classList.add('interactive');
                    glowRight.classList.add('interactive');
                    bottomBarWrapper.classList.add('ready');
                    bottomBarWrapper.classList.add('interactive');
                    
                    updateSecretText();
                    secretText.classList.add('show');
                    renderQueue();
                    renderTop10();
                    resetAutoSpin();
                }, 4500);

                void merged.offsetWidth;
                merged.style.transition = '';
            }, sprintDuration);
        }, TOTAL_IDLE_TIME);
    };

    document.body.addEventListener('click', handleBodyClick);

    return () => {
        document.body.removeEventListener('click', handleBodyClick);
        document.body.removeEventListener('click', handleInteractiveClick);
        clearTrackedTimeouts();
        if (idleRaf) window.cancelAnimationFrame(idleRaf);
        if (window.interactionLockTimer) clearTimeout(window.interactionLockTimer);
        audio.pause();
        cancelAnimationFrame(spinAf);
        clearTimeout(autoSpinTimer);
        document.body.classList.remove('clickable', 'illuminated', 'zoomed-mode', 'lock-interactions', 'lock-track-changes');
    };
}