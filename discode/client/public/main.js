const { app, BrowserWindow, ipcMain, dialog, } = require('electron')

const path = require('path')
const fs = require('fs');

// const isDev = require('electron-is-dev')

require('@electron/remote/main').initialize()

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    icon: path.join(__dirname, 'preload.js'),
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,

      preload: path.join(__dirname, 'preload.js')
    }
  })

  // win.loadURL("http://localhost:3000");

  var isDev = false;


  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  win.maximize();
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


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


app.whenReady().then(createDiscodeProjectsFolder);

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