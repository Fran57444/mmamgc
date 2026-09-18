import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import multer from 'multer';
import { google } from 'googleapis';
import fs from 'fs';
import axios from 'axios';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Readable } from 'node:stream';
import ytdl from '@distube/ytdl-core';
import youtubedl from 'youtube-dl-exec';
import ffmpegPath from 'ffmpeg-static';

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/mp3', express.static(path.resolve(process.cwd(), 'public/mp3'), {
  maxAge: '1d',
  immutable: true
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musicapp')
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  cover: String,
  path: String,
  color: String,
  lyrics: String
});
const Song = mongoose.model('Song', songSchema);

const playlistSchema = new mongoose.Schema({
  id: String,
  name: String,
  desc: String,
  photo: String, 
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
});
const Playlist = mongoose.model('Playlist', playlistSchema);

function getOAuthClient() {
  const credentialsPath = path.resolve(process.cwd(), 'oauth-credentials.json');
  const tokenPath = path.resolve(process.cwd(), 'token.json');
  const credentialsContent = process.env.GOOGLE_OAUTH_CREDENTIALS_JSON
    || (fs.existsSync(credentialsPath) && fs.readFileSync(credentialsPath, 'utf-8'));
  const tokenContent = process.env.GOOGLE_OAUTH_TOKEN_JSON
    || (fs.existsSync(tokenPath) && fs.readFileSync(tokenPath, 'utf-8'));

  if (!credentialsContent || !tokenContent) {
    console.warn('⚠️ Faltan credenciales o token OAuth.');
    return null;
  }
  const credentials = JSON.parse(credentialsContent);
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] || 'http://localhost:3000'
  );
  
  const token = JSON.parse(tokenContent);
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

const oauthClient = getOAuthClient();
const drive = google.drive({ version: 'v3', auth: oauthClient });
const upload = multer({ storage: multer.memoryStorage() });
let cachedDriveAccessToken = null;
let cachedDriveTokenExpiresAt = 0;

async function uploadToDrive(fileObject) {
  const bufferStream = new (await import('stream')).PassThrough();
  bufferStream.end(fileObject.buffer);
  
  const { data } = await drive.files.create({
    media: { mimeType: fileObject.mimetype, body: bufferStream },
    requestBody: { name: fileObject.originalname, parents: [process.env.DRIVE_FOLDER_ID] },
    fields: 'id, webContentLink' 
  });
  
  await drive.permissions.create({
    fileId: data.id,
    requestBody: { role: 'reader', type: 'anyone' }
  });
  
  return data.webContentLink;
}

async function saveMp3Locally(title, buffer, requestedName = '') {
  const mp3Directory = path.resolve(process.cwd(), 'public/mp3');
  await fs.promises.mkdir(mp3Directory, { recursive: true });

  const safeTitle = (requestedName || title || 'audio-youtube')
    .replace(/\.mp3$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || 'audio-youtube';
  const fileName = `${safeTitle}-${Date.now()}.mp3`;
  const filePath = path.join(mp3Directory, fileName);

  await fs.promises.writeFile(filePath, buffer);
  return { fileName, filePath: `/mp3/${fileName}` };
}

function extractDriveId(url) {
  if (!url) return url;
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : url;
}

function isValidYoutubeUrl(value) {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    return host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be';
  } catch {
    return false;
  }
}

function convertAudioStreamToMp3(inputStream) {
  if (!ffmpegPath) {
    return Promise.reject(new Error('FFmpeg no está disponible en este entorno.'));
  }

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',
      '-vn',
      '-codec:a', 'libmp3lame',
      '-b:a', '192k',
      '-f', 'mp3',
      'pipe:1'
    ]);
    const outputChunks = [];
    const errorChunks = [];

    ffmpeg.stdout.on('data', chunk => outputChunks.push(chunk));
    ffmpeg.stderr.on('data', chunk => errorChunks.push(chunk));
    ffmpeg.on('error', error => {
      reject(error);
    });
    ffmpeg.on('close', code => {
      if (code !== 0) {
        const details = Buffer.concat(errorChunks).toString('utf8').trim();
        reject(new Error(details || `FFmpeg terminó con código ${code}.`));
        return;
      }
      resolve(Buffer.concat(outputChunks));
    });

    ffmpeg.stdin.on('error', error => {
      if (error.code !== 'EPIPE') reject(error);
    });
    inputStream.on('error', reject);
    inputStream.pipe(ffmpeg.stdin);
  });
}

function convertAudioToMp3(inputBuffer) {
  return convertAudioStreamToMp3(Readable.from([inputBuffer]));
}

async function downloadWithYtDlp(ytLink) {
  const temporaryDirectory = path.resolve(process.cwd(), 'tmp');
  await fs.promises.mkdir(temporaryDirectory, { recursive: true });
  const temporaryInput = path.join(temporaryDirectory, `youtube-${Date.now()}.%(ext)s`);

  try {
    const output = await youtubedl(ytLink, {
      output: temporaryInput,
      format: 'bestaudio[abr<=128]/bestaudio[ext=m4a]/bestaudio/best',
      concurrentFragments: 8,
      httpChunkSize: '10M',
      noPlaylist: true,
      noWarnings: true,
      noCheckCertificates: true,
      print: 'after_move:%(title)s',
      addHeader: 'referer:https://www.youtube.com/'
    });

    const downloadedFiles = await fs.promises.readdir(temporaryDirectory);
    const inputFileName = downloadedFiles
      .filter(fileName => fileName.startsWith(path.basename(temporaryInput).split('.%')[0]))
      .sort()
      .pop();

    if (!inputFileName) throw new Error('yt-dlp no generó el archivo de audio.');
    const inputFilePath = path.join(temporaryDirectory, inputFileName);
    const inputBuffer = await fs.promises.readFile(inputFilePath);
    const title = String(output || 'audio').trim().split(/\r?\n/).pop() || 'audio';
    console.log(`[YouTube] Descarga concurrente terminada (${inputBuffer.length} bytes); convirtiendo.`);

    return { title, buffer: await convertAudioToMp3(inputBuffer), inputFilePath };
  } finally {
    const temporaryFiles = await fs.promises.readdir(temporaryDirectory).catch(() => []);
    await Promise.all(
      temporaryFiles
        .filter(fileName => fileName.startsWith(path.basename(temporaryInput).split('.%')[0]))
        .map(fileName => fs.promises.rm(path.join(temporaryDirectory, fileName), { force: true }))
    );
  }
}

async function downloadYoutubeAudio(ytLink) {
  try {
    return await downloadWithYtDlp(ytLink);
  } catch (ytDlpError) {
    console.warn('[YouTube] yt-dlp falló; usando extracción secundaria:', ytDlpError.message);
    try {
      const info = await ytdl.getInfo(ytLink);
    const audioStream = ytdl(ytLink, { quality: 'highestaudio', filter: 'audioonly' });
    console.log('[YouTube] Audio primario encontrado; descargando y convirtiendo.');
    return {
      title: info.videoDetails.title || 'audio',
      buffer: await convertAudioStreamToMp3(audioStream)
    };
    } catch (fallbackError) {
      const message = fallbackError?.message || 'El enlace no pudo ser procesado por YouTube.';
      throw new Error(message);
    }
  }
}

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().lean();
    const songsWithProxy = songs.map(song => {
      const songObj = song;
      if (songObj.path && songObj.path.includes('drive.google.com')) {
        songObj.path = `${req.protocol}://${req.get('host')}/api/media/${extractDriveId(songObj.path)}`;
      }
      if (songObj.cover && songObj.cover.includes('drive.google.com')) {
        songObj.cover = `${req.protocol}://${req.get('host')}/api/media/${extractDriveId(songObj.cover)}`;
      }
      return songObj;
    });
    res.json({ songs: songsWithProxy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta mejorada para soportar Links de YouTube
app.post('/api/songs', upload.fields([{ name: 'mp3' }, { name: 'cover' }]), async (req, res) => {
  try {
    let pathUrl = req.body.existingPath || '';
    let coverUrl = req.body.existingCover || '';

    // Si viene un link de YT, lo descarga y lo sube a Drive
    if (req.body.ytLink) {
      if (!isValidYoutubeUrl(req.body.ytLink)) {
        throw new Error('El enlace de YouTube no es válido.');
      }

      const { buffer, title } = await downloadYoutubeAudio(req.body.ytLink);
      console.log(`[YouTube] MP3 listo (${buffer.length} bytes); subiendo a Drive y guardando en MongoDB.`);

      const fileObject = {
        buffer,
        originalname: (title || 'Cancion_YT') + '.mp3',
        mimetype: 'audio/mpeg'
      };
      pathUrl = await uploadToDrive(fileObject);
    } else if (req.files['mp3']) {
      // Si subió un archivo normal
      pathUrl = await uploadToDrive(req.files['mp3'][0]);
    }

    if (req.files['cover']) coverUrl = await uploadToDrive(req.files['cover'][0]);

    const songData = {
      name: req.body.name,
      artist: req.body.artist,
      color: req.body.color,
      lyrics: req.body.lyrics,
      path: pathUrl,
      cover: coverUrl
    };

    let savedSong;
    if (req.body.id && req.body.id !== 'undefined') {
      savedSong = await Song.findByIdAndUpdate(req.body.id, songData, { new: true });
    } else {
      const newSong = new Song(songData);
      savedSong = await newSong.save();
    }
    
    res.json(savedSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Song.findByIdAndDelete(id);
    await Playlist.updateMany({}, { $pull: { tracks: id } });
    res.json({ success: true, message: 'Canción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .select('id name desc photo tracks')
      .populate({
        path: 'tracks',
        select: 'name artist cover path color'
      })
      .lean();
    
    const playlistsWithProxy = playlists.map(pl => {
      const plObj = pl;
      
      if (plObj.photo && plObj.photo.includes('drive.google.com')) {
        plObj.photo = `${req.protocol}://${req.get('host')}/api/media/${extractDriveId(plObj.photo)}`;
      }

      if (plObj.tracks && plObj.tracks.length > 0) {
        plObj.tracks = plObj.tracks.map(song => {
          if (song.path && song.path.includes('drive.google.com')) {
            song.path = `${req.protocol}://${req.get('host')}/api/media/${extractDriveId(song.path)}`;
          }
          if (song.cover && song.cover.includes('drive.google.com')) {
            song.cover = `${req.protocol}://${req.get('host')}/api/media/${extractDriveId(song.cover)}`;
          }
          return song;
        });
      }
      return plObj;
    });

    res.json(playlistsWithProxy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/playlists', upload.single('photo'), async (req, res) => {
  try {
    const { id, name, desc } = req.body;
    
    let tracks = req.body.tracks;
    if (typeof tracks === 'string') {
      try { tracks = JSON.parse(tracks); } catch { tracks = []; }
    }

    let photoUrl = req.body.photo || req.body.existingPhoto || '';

    if (req.file) {
      photoUrl = await uploadToDrive(req.file);
    }

    const newPl = await Playlist.findOneAndUpdate(
      { id: id || new mongoose.Types.ObjectId().toString() }, 
      { name, desc, photo: photoUrl, tracks }, 
      { upsert: true, returnDocument: 'after' }
    );
    res.json(newPl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/playlists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Playlist.findOneAndDelete({ id });
    res.json({ success: true, message: 'Playlist eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para descargar MP3 directo desde los Ajustes
app.post('/api/yt-download', async (req, res) => {
  try {
    const { ytLink, fileName } = req.body;
    if (!ytLink) return res.status(400).json({ error: 'Falta el link de YouTube' });
    if (!isValidYoutubeUrl(ytLink)) {
      return res.status(400).json({ error: 'El enlace de YouTube no es válido.' });
    }

    const { buffer, title } = await downloadYoutubeAudio(ytLink);
    const localFile = await saveMp3Locally(title, buffer, fileName);

    res.json({
      success: true,
      title,
      path: localFile.filePath,
      fileName: localFile.fileName,
      size: buffer.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/media/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!oauthClient) return res.status(500).send('Cliente OAuth no inicializado.');

    const now = Date.now();
    if (!cachedDriveAccessToken || cachedDriveTokenExpiresAt <= now) {
      const accessTokenObj = await oauthClient.getAccessToken();
      cachedDriveAccessToken = accessTokenObj.token || accessTokenObj;
      cachedDriveTokenExpiresAt = now + (5 * 60 * 1000);
    }

    const headers = { Authorization: `Bearer ${cachedDriveAccessToken}` };
    if (req.headers.range) headers.Range = req.headers.range;

    const response = await axios({
      method: 'get',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      headers: headers,
      responseType: 'stream',
      validateStatus: (status) => status >= 200 && status < 400 
    });

    if (response.headers['content-type']) res.setHeader('Content-Type', response.headers['content-type']);
    if (response.headers['content-length']) res.setHeader('Content-Length', response.headers['content-length']);
    if (response.headers['content-range']) res.setHeader('Content-Range', response.headers['content-range']);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    res.status(response.status);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error transmitiendo archivo:', error.message);
    res.status(500).send('Error al obtener el archivo multimedia');
  }
});

const isMainModule = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMainModule) {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
  server.requestTimeout = 0;
  server.timeout = 0;
}

export default app;