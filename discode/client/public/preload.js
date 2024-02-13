const { contextBridge, ipcRenderer } = require('electron');

// Expose only necessary APIs to the renderer process
contextBridge.exposeInMainWorld(
  'electron_',
  {
    // Expose only specific methods or properties of ipcRenderer
    ipcRenderer: {
      send: (channel, data) => {
        ipcRenderer.send(channel, data);
      },
      on(channel, func) {
        const subscription = (_event, args) =>
          func(...args);
        ipcRenderer.on(channel, subscription);
  
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      },
      once(channel, func) {
        ipcRenderer.once(channel, (_event, args) => func(args));
      },
    },
   
    dialog: {
      message: (msg) => {
        ipcRenderer.send("show-dialog", msg);
      }
    }
    }
  
);