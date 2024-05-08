// @ts-ignore
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path, { resolve } from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';


let mainWindow: BrowserWindow | null = null;
let consoleWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

async function createDiscodeProjectsFolder() {
  const documentsPath = app.getPath('documents');
  const discodeProjectsFolderPath = path.join(documentsPath, 'Discode Projects');

  try {
      await fs.promises.access(discodeProjectsFolderPath, fs.constants.F_OK);
      console.log('Discode Projects folder already exists');
  } catch (err) {
      try {
          await fs.promises.mkdir(discodeProjectsFolderPath, { recursive: true });
          console.log('Discode Projects folder created successfully');

      } catch (err) {
          console.error('Error creating Discode Projects folder:', err);

      }
  }
}


const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};


const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };


  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    title: "Discode",
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  await createDiscodeProjectsFolder();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.setTitle("Discode")
      mainWindow.show();
      mainWindow.maximize();
    }
  });


  mainWindow.on('closed', () => {
    mainWindow = null;
    consoleWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

   consoleWindow = new BrowserWindow({
    show: false,
    width: 864,
    height: 500,
    title: "Discode",
    icon: getAssetPath('icon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });


  consoleWindow.setMenuBarVisibility(false);
  consoleWindow.loadURL(resolveHtmlPath("index.html"))


  consoleWindow.webContents.on('did-finish-load', () => {
    consoleWindow!.setTitle("Discode - Console </>",)
    consoleWindow!.webContents.send("switch-to-console");

  });

  consoleWindow.on("close", (e) => {
    e.preventDefault()
    consoleWindow?.hide();
  })


};



/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);



ipcMain.on('open-folder-dialog', (event) => {
  const documentsPath = app.getPath('documents');


  dialog.showOpenDialog({
    defaultPath: path.join(documentsPath, 'Discode Projects'),
    filters: [
      {name: "Discode Project File", extensions: ["discode"]}
    ],
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      event.reply('selected-folder', folderPath);
    }
  }).catch(err => {
    console.log(err);
  });
});


ipcMain.on('open-file-dialog', (event) => {
  const documentsPath = app.getPath('documents');


  dialog.showOpenDialog({
    defaultPath: path.join(documentsPath, 'Discode Projects'),
    filters: [
      {name: "Discode Project File", extensions: ["discode"]}
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      event.reply('selected-file', folderPath);
    }
  }).catch(err => {
    console.log(err);
  });
});


ipcMain.on('show-dialog', (event, data) => {
  console.log(data);
  dialog.showMessageBox({
    type: 'error',
    title: "That's already there",
    message: data,
    buttons: ['OK']
})
})

ipcMain.on("open-documentation", (event) => {
  shell.openExternal("https://yetimeh.github.io/discode/")
})





ipcMain.on("open-console", (event) => {
  console.log("Opened console")

  if (!consoleWindow?.isVisible()) {
    consoleWindow?.show()
  } else {

    consoleWindow?.focus()
  }






})

ipcMain.on("clicked-log", (event, node) => {
  mainWindow!.webContents.send("clicked-log", node)
  mainWindow?.focus()

})

ipcMain.on("send-log", (event, data) => {
  console.log("Send-log in home")
  consoleWindow?.webContents.send("send-log", data)
})


