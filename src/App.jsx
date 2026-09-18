import { useEffect } from 'react'
import './style.css'
import { initMusicPlayer } from './script'

function App() {
  useEffect(() => {
    const cleanup = initMusicPlayer();
    return cleanup;
  }, []);

  return (
    <>
      <div id="loading-spinner" className="spinner-overlay" style={{ display: 'none' }}>
          <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
      </div>

      <div id="main-content">
        <div id="yt-download-popup" className="yt-download-popup" aria-live="polite">
          <div className="yt-download-popup-header">
            <span className="yt-download-popup-icon">♪</span>
            <div>
              <strong id="yt-download-popup-title">Descargando canción</strong>
              <small id="yt-download-popup-message">Preparando audio...</small>
            </div>
          </div>
          <div className="yt-download-progress-bar">
            <div id="yt-download-progress-fill" className="yt-download-progress-fill"></div>
          </div>
          <div className="yt-download-progress-text">
            <span id="yt-download-progress-label">0%</span>
          </div>
        </div>

        <div className="sidebar-shell">
          <span className="sidebar-trigger" aria-hidden="true" title="Abrir menú" />
          <nav aria-label="Navegación principal">
            <div className="nav-left"></div>
            
            <div id="btn-home" style={{ cursor: 'pointer' }} title="Ir a inicio">
               <pre>{`            
             ;x            
             +x            
       ;X:   +x   .X;      
         +x. +x .xx.      
          .x++xxX.        
  :XXXXXXXXX$&&&XXXXXXXXX:
           :Xx$$:          
         .Xx +x +X.        
       .xx.  +x  .X;      
       ;:    +x    ;:      
             +x            
             ;x `}</pre>
            </div>

            <div className="sidebar-separator"></div><br />
            <button id="btn-create-playlist" className="sidebar-btn" title="Crear Playlist">
              <img src="/img/add.png" draggable="false" className="no-drag" alt="Añadir Playlist" />
            </button>
            <div id="sidebar-playlists"></div>
            <div className="sidebar-separator"></div>
            <div className="nav-links">
              <a href="#canciones" id="btn-all-songs" title="Todas las canciones">
                CANCIONES
              </a>
              <a href="#ajustes" id="btn-settings" title="Ajustes">
                AJUSTES
              </a>
            </div>
          </nav>
        </div>
        
        <div id="lyrics-panel" className="view-panel"></div>
        
        <div id="all-songs-panel" className="view-panel">
          <div className="view-header-bar">
            <div style={{ display: 'flex', alignItems: 'left', gap: '15px' }}>
              <h2>lista completa canciones</h2>
            </div>
            <button id="btn-play-all-songs" className="main-play-btn">
              <img src="/img/play.png" draggable="false" className="no-drag" alt="Reproducir todas" width="20" />
            </button>
          </div>
          <ul id="all-songs-list"></ul>
        </div>

        <div id="pl-view-panel" className="view-panel">
          <div className="pl-header-main">
            <img id="pl-view-photo" src="" draggable="false" className="no-drag" alt=""/>
            <div className="pl-info-header">
               <span className="pl-badge">PLAYLIST</span>
               <h1 id="pl-view-name"></h1>
               <p id="pl-view-desc"></p>
               <div className="pl-actions-row">
                 <button id="btn-play-playlist" className="main-play-btn">
                   <span>▶</span>
                 </button>
                 <button id="btn-edit-playlist" className="control-btn" title="Editar Playlist">
                     <img src="/img/edit.png" draggable="false" className="no-drag" alt=""/>
                 </button>
               </div>
            </div>
          </div>
          <ul id="pl-view-tracks" className="pl-tracks-grid"></ul>
        </div>

        <div id="settings-panel" className="view-panel">
          <div className="view-header-bar">
            <h2>Ajustes</h2>
          </div>
          <div className="settings-wrapper">
            <div className="settings-section">
              <h3>Reproducción</h3>
              <div className="field-row">
                <label>TIEMPO DE SALTO EN SEGUNDOS</label>
                <input 
                  type="number" 
                  id="input-seek-seconds" 
                  defaultValue="5" 
                  min="1" 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '12px 15px', 
                    color: '#fff', 
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    width: '100px'
                  }} 
                />
              </div>
              <div className="field-row">
                <label htmlFor="input-max-volume">VOLUMEN MÁXIMO (%)</label>
                <p>Mientras mas alto, mas se distorsionara el audio :p</p>
                <input
                  type="number"
                  id="input-max-volume"
                  defaultValue="200"
                  min="100"
                  max="1000"
                  step="10"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px 15px',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    width: '100px'
                  }}
                />
              </div>
            </div>

            <div className="settings-section">
              <h3>Descargar de YouTube</h3>
              <p>Ingresar link de Youtube limpio, sin &list=, sin &start_radio=, este se descargara como mp3 para almacenarse localmente en la carpeta /public/mp3</p>
              <div className="field-row" style={{ maxWidth: '400px' }}>
                <input 
                  type="text" 
                  id="settings-yt-link" 
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '12px 15px', 
                    color: '#fff', 
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }} 
                />
                <input
                  type="text"
                  id="settings-yt-name"
                  placeholder="Nombre del archivo (opcional)"
                  maxLength="80"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px 15px',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    marginTop: '8px'
                  }}
                />
                <button id="btn-settings-yt-download" className="main-play-btn" style={{backgroundColor: '#ff7221', marginTop: '10px', justifyContent: 'center', padding: '10px' }}>
                  Descargar Audio
                </button>
                <span id="settings-yt-status" style={{ fontSize: '0.85rem', color: '#1db954', marginTop: '5px', display: 'none' }}></span>
              </div>
            </div>
          </div>
        </div>

        <div id="edit-song-panel" className="view-panel">
          <div className="edit-song-container">
            <div className="edit-song-top">
              <div className="edit-song-preview pl-image-edit-wrapper" id="song-image-edit-wrapper">
                <img id="edit-song-display-cover" src="" alt="" />
                <div className="pl-image-placeholder">
                  <img src="/img/add.png" alt="Añadir foto" />
                  <span>Seleccionar foto</span>
                </div>
                <div className="pl-image-edit-overlay">
                    <img src="/img/edit.png" alt="Editar" />
                </div>
                <input type="file" id="edit-song-photo" accept="image/*" style={{display: 'none'}} />
              </div>

              <div className="edit-song-fields-red">
                <div className="field-row">
                  <label>NOMBRE</label>
                  <input type="text" id="edit-input-name" />
                </div>
                <div className="field-row">
                  <label>ARTISTA</label>
                  <input type="text" id="edit-input-artist" />
                </div>
                <div className="field-row">
                  <label>COLOR</label>
                  <input type="color" id="edit-input-color" />
                </div>
                <div className="field-row">
                  <label>PISTA DE AUDIO</label>
                  <input type="file" id="edit-input-mp3" accept="audio/*" />
                  <input type="text" id="edit-input-yt" placeholder="O ingresa el link de YouTube aquí..." style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '12px 15px', 
                    color: '#fff', 
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    marginTop: '5px'
                  }} />
                  <input
                    type="text"
                    id="edit-input-file-name"
                    placeholder="Nombre del archivo MP3 (opcional)"
                    maxLength="80"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '12px 15px',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      marginTop: '8px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="edit-song-lyrics-section">
              <label className="label-red-title">LETRA</label>
              <textarea id="edit-input-lyrics" placeholder="Si no existe letra, puedes escribirla aquí..."></textarea>
            </div>

            <div className="edit-song-actions">
              <button id="btn-delete-song" className="modal-btn-text" style={{color: '#ff4d4d', display: 'none'}}>Eliminar Canción</button>
              <button id="btn-save-edited-song" className="main-play-btn">Guardar Cambios</button>
              <button id="btn-cancel-edited-song" className="modal-btn-text">Cancelar</button>
            </div>
          </div>
        </div>

        <div id="edit-playlist-panel" className="view-panel">
          <div className="edit-song-container">
            <div className="edit-song-top">
              <div className="edit-song-preview pl-image-edit-wrapper" id="pl-image-edit-wrapper">
                <img id="edit-pl-display-cover" src="" alt="" />
                <div className="pl-image-placeholder">
                  <img src="/img/add.png" alt="Añadir foto" />
                  <span>Seleccionar foto</span>
                </div>
                <div className="pl-image-edit-overlay">
                    <img src="/img/edit.png" alt="Editar" />
                </div>
                <input type="file" id="edit-pl-photo" accept="image/*" style={{display: 'none'}} />
              </div>

              <div className="edit-song-fields-red">
                <div className="field-row">
                  <label>NOMBRE</label>
                  <input type="text" id="edit-pl-name" />
                </div>
                <div className="field-row">
                  <label>DESCRIPCIÓN</label>
                  <input type="text" id="edit-pl-desc" />
                </div>
              </div>
            </div>

            <div className="edit-song-actions">
              <button id="btn-delete-pl" className="modal-btn-text" style={{color: '#ff4d4d', display: 'none'}}>Eliminar Playlist</button>
              <button id="btn-save-edited-pl" className="main-play-btn">Guardar Playlist</button>
              <button id="btn-cancel-edited-pl" className="modal-btn-text">Cancelar</button>
            </div>
          </div>
        </div>

        <div className="animation-container">
          <div id="merged-symbol" className="merged-symbol show" aria-hidden="true">
            <svg viewBox="-100 -100 200 200" width="240" height="240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="depth-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                  <feOffset dx="0" dy="8" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g id="star-lines" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" filter="url(#depth-shadow)">
                <line x1="0" y1="-88" x2="0" y2="88" />
                <line x1="-88" y1="0" x2="88" y2="0" />
                <line x1="-78" y1="-78" x2="78" y2="78" />
                <line x1="-78" y1="78" x2="78" y2="-78" />
              </g>
            </svg>
          </div>
        </div>

        <div id="music-player-popup" className="player-popup">
          <img id="popup-cover" draggable="false" className="no-drag" alt="" />
          <div className="popup-info">
            <div id="popup-song-name" />
          </div>
        </div>

        <div id="bottom-bar-wrapper" className="ready interactive">
          <div id="queue-container">
            <ul id="queue-list"></ul>
          </div>

          <div id="bottom-bar">
            <div id="progress-container" style={{ position: 'relative', width: '100%' }}>
                <div id="inline-spinner" className="spinner" style={{ position: 'absolute', left: '47px', bottom: '25px', width: '30px', height: '30px', borderWidth: '3px', zIndex: 10, pointerEvents: 'none', display: 'none' }}></div>
                <img id="perro-gif" src="/img/perrocorasongif.gif" draggable="false" className="no-drag" alt="" style={{ display: 'none' }} />
                <div id="progress-bar" />
            </div>

            <div className="bar-content">
              <div className="track-info">
                <img id="bottom-bar-cover" draggable="false" className="no-drag" alt="" />
                <div className="track-text-wrapper">
                  <div className="track-title-container">
                    <div id="track-name" />
                    
                    <div className="song-actions-wrapper" id="bottom-bar-action-wrapper" style={{ position: 'relative' }}>
                      <button id="btn-add-to-playlist-bar" className="song-actions-btn" type="button" title="Opciones" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                         <img src="/img/add.png" draggable="false" className="no-drag" alt="Add" style={{ width: '20px', pointerEvents: 'none' }} />
                      </button>
                      <div className="song-actions-menu" id="bottom-bar-action-menu" style={{ bottom: '100%', top: 'auto', marginBottom: '5px' }}>
                        <button className="action-add-queue">Añadir a cola</button>
                        <button className="action-add-pl">Añadir a playlist</button>
                      </div>
                    </div>

                  </div>
                  <span id="track-artist" />
                </div>
              </div>

              <div className="track-controls">
                <button id="btn-rewind" className="control-btn seek-btn" type="button" title="Retroceder">
                  «<span id="rewind-label" style={{fontSize:'0.7rem', marginLeft:'2px', opacity: 0.8}}></span>
                </button>
                <button id="btn-prev" className="control-btn" type="button">⏮</button>
                <button id="btn-playpause" className="control-btn" type="button">
                  <img src="/img/play.png" draggable="false" className="no-drag" alt=""/>
                </button>
                <button id="btn-next" className="control-btn" type="button">⏭</button>
                <button id="btn-forward" className="control-btn seek-btn" type="button" title="Adelantar">
                  <span id="forward-label" style={{fontSize:'0.7rem', marginRight:'2px', opacity: 0.8}}></span>»
                </button>
              </div>
              

              <div className="queue-action">
                <div className="volume-wrapper">
                    <button id="btn-volume" className="control-btn" type="button">
                        <img src="/img/volume.png" draggable="false" className="no-drag" alt=""/>
                    </button>
                    <div className="volume-slider-container">
                        <span id="volume-tooltip">100%</span>
                        <input type="range" id="volume-slider" min="0" max="2" step="0.01" defaultValue="1" />
                    </div>
                </div>
                <button id="btn-lyrics" className="control-btn">
                   <img src="/img/lyrics.png" draggable="false" className="no-drag" alt="Letra"/>
                </button>
                <button id="btn-shuffle" className="control-btn">
                   <img src="/img/aleatorio.png" draggable="false" className="no-drag" alt="Aleatorio" style={{ opacity: 0.7 }} />
                </button>
                <button id="btn-queue" className="control-btn">
                   =
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="modal-overlay" className="modal-overlay">
        <div id="add-to-pl-modal" className="modal">
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>Añadir a Playlist</h3>
          <ul id="add-to-pl-list"></ul>
          <div className="modal-btns" style={{ marginTop: '10px' }}>
             <button id="btn-close-add-pl" className="modal-btn-text">Cerrar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App