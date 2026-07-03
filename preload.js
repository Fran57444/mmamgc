const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  openExternalLink: (url) => ipcRenderer.invoke('abrir-link-externo', url)
});