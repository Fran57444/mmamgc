import { useEffect, useState } from 'react'
import './style.css'
import { ultraintro } from './script'

function App() {
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    const cleanup = ultraintro()
    return cleanup
  }, [])

  useEffect(() => {
  window.isLetterOpen = showLetter;
  }, [showLetter]);

  return (
    <>
      <div id="gate-screen">
        <div className="gate-text">Frami.</div>
      </div>

      <div id="main-content" className="hidden-content">
        <div className="animation-container">
          <div id="symbol-x" className="symbol purple-neon">
            <div className="line line1" />
            <div className="line line2" />
          </div>

          <div id="symbol-plus" className="symbol orange-neon">
            <div className="line line-h" />
            <div className="line line-v" />
          </div>

          <div id="flash-overlay" />
          <div id="glow-left" className="side-glow" />
          <div id="glow-right" className="side-glow" />

          <div id="zoomed-left-content" className="zoomed-panel left-panel hidden">
            <button onClick={() => setShowLetter(true)} className="dummy-btn">
              CARTA PARA MIMI
            </button>
          </div>

          <div id="zoomed-right-content" className="zoomed-panel right-panel hidden">
            <a href="https://open.spotify.com/playlist/7Fc8Gt8HRHY64n3O7Wu1HF?si=e397481ae70d4e64" target="_blank" rel="noreferrer" className="dummy-btn">PLAYLIST!</a>
            <button id="btn-top10" className="dummy-btn" type="button">cansionesdeftonestop</button>
          </div>

          <div id="top10-container" className="top10-hidden">
            <h2 className="top10-title">top top 10 cansiones</h2>
            <ul id="top10-list"></ul>
          </div>

          <div id="merged-symbol" className="merged-symbol" aria-hidden="true">
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

        <div id="action-text" className="hidden-text">
          Apreta click bro.
        </div>
      </div>

      <div id="carta-panel" className={`slide-panel ${showLetter ? 'active' : ''}`}>
        <button className="close-panel-btn" onClick={() => setShowLetter(false)}>✖</button>
        <div className="table-container">
          <table className="reactive-table">
            <thead>
              <tr>
                <th>Ola mimi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="letter-content">
                      De verdad espero que te gustaran los regalitos sinceramente me deje bro esa es la realidad, nunca había hecho un regalo tan elaborado, podría tirarlo hasta de proyecto y colocarlo en mi curriculum imagina XD<br></br>
                      Aun asi me gustaria haber implementado mucho más, siento que queda un poquito vacio pero sera que me falla la cabeza no se, ojala te guste de todas formas mucho esfuerzo bro estaba pensando quizás añadir la letra de las canciones o tal vez un apartado para agregar nuevas canciones, hacer playlists y incluso hacer un port a celular si es que quieres usarlo realmente asi esq menuda alternativa a spotify ngl gng cualquiera (no se ni como hacer que no pese mas de 500mb)<br></br>

                      <br></br>Dejando de lado ese tema voy a plasmar mis sentimientos en letras bro::<br></br>
                                    <br></br>
                      No puedo dejar de pensar en que aun quiero dar mas por ti, tu me haces sentir de una manera muy especial y yo no puedo quitarte de mi cabeza, no te haces una idea de lo mucho que me gustas, me hace tremendamente feliz el que sigas aquí a mi lado a pesar todo lo que ha pasado y quiero recompensarte todo lo que me has hecho sentir con detalles como estos o dejándote ver lo mucho que soy capaz de amarte a ti como persona en general, incluso con lo que tu piensas que está mal sobre ti. Te amo con locura and i can’t get enough of it 🗣🗣🗣<br></br>
                      Me gustaria acompañarte muchos cumpleaños mas y asi intentar mejorar con cada regalo que te haga para impresionarte de alguna forma, siento que por ti vale la pena realmente, no como un sentimiento tonto si no que genuinamente noto que me nace dejarme por ti y se siente bien kjldnfj se siente autentico, no puedo dejar de sentir mariposas por ti mimi es impresionante, adoro sentirme asi, adoro que alteres mi comportamiento, adoro estar tan motivado cuando se trata de ti, adoro sentirme vivo contigo, adoro que cambies cosas en mi, adoro que quiera verte todos los dias, adoro tenerte tan cerca de mi, adoro preocuparme tanto por ti, adoro que nuestra conexion sea tan evidente, adoro que las palabras me salgan solitas cuando expreso lo que siento por ti, adoro notar que mi corazon se acelera cuando estoy contigo, adoro que me atraigas tanto, adoro estar provocado por ti todo el tiempo, adoro estar tan enamorado de ti, adoro que lo cambies todo solo por estar presente, <br></br>
                      TE ADORO MIMI!!! <br></br>

                      <br></br>Dejame estar junto a ti por siempre prispris tu eres mi salvación, nunca podría hacerte daño, no pienso colocarte ninguna condición porque yo te amo de todas las formas y nunca puedo dejar de sentir mas, no se que me haces ush me tienes totalmente loco que locura yo keyo ser tu bb 🥺🥺🥺🥺🥺🥺  y a mi me gustan como tu 🗣🗣🗣 me robaste el kooorasoon sekuestraste laaa rasoon en ese magic muuusik box y me haces rodar y rodarrr 
                      te amo mimi copones solo tu solo tu no puedo pensar en nadie mas que tu realmente debo ser mimi221541731anaismonserratgatilloncuetossexual jajajaj entiendes bro jaj solo te quiero a ti, te necesito, tengo a dios aqui de mi testigo 🗣🗣 solo dame lo ke eres te lo pidoo q imbecil no se estoy que me muero de amor por ti déjame en paz nunca se me va a olvidar tu olor, no sabes lo enganchado y decidido que me dejaste desde que vi tu carita de preciosa sonreirme en la oscuridad, tu lo has cambiado todo para mi y quisiera que sigas cambiando mi perspectiva.<br></br><br></br>
                      Ya saliendo de lo amoroso, de verdad espero que te den hartos regalitos aparte de los míos!<br></br>
                      Pasala super porque tu lo mereces por completo y un gran pastel aquí con los super gorros que digan feliz cumple mimi y las sorpresas y los regalos de papelería así por montones, que te llueva el dinero también c;<br></br><br></br>

                      Te dedico todas las canciones de la playlist, desde el fondo de mi corazón feliz cumpleaños mimi<br></br>
                      - Fran 💜:3


                    
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="music-player-popup" className="player-popup">
        <img id="popup-cover" alt="" />
        <div className="popup-info">
          <div id="popup-song-name" />
        </div>
      </div>

      <div id="secret-text" className="secret-text">?!</div>

      <div id="bottom-bar-wrapper">
        <div id="queue-container">
          <ul id="queue-list"></ul>
        </div>

        <div id="bottom-bar">
          <div id="progress-container" style={{ position: 'relative', width: '100%' }}>
              <img id="perro-gif" src="./img/perrocorasongif.gif" alt="Dog" />
              <div id="progress-bar" />
          </div>

          <div className="bar-content">
            <div className="track-info">
              <img id="bottom-bar-cover" alt="cover" />
              <div className="track-text-wrapper">
                <div id="track-name" />
                <span id="track-artist" />
              </div>
            </div>

            <div className="track-controls">
              <button id="btn-prev" className="control-btn" type="button">⏮</button>
              <button id="btn-playpause" className="control-btn" type="button">▶</button>
              <button id="btn-next" className="control-btn" type="button">⏭</button>
            </div>

            <div className="queue-action">
              <div className="volume-wrapper">
                <button id="btn-volume" className="control-btn" type="button" title="Mutear">🗣</button>
                <div className="volume-slider-container">
                  <div id="volume-tooltip">100%</div>
                  <input type="range" id="volume-slider" min="0" max="2" step="0.01" defaultValue="1" />
                </div>
              </div>
              <button id="btn-shuffle" className="control-btn" type="button" title="Aleatorio">
                <img src="./img/aleatorio.png" alt="Aleatorio" style={{ width: '20px', pointerEvents: 'none' }} />
              </button>
              <button id="btn-queue" className="control-btn" type="button" title="Cola">=</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App