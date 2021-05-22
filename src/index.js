const { app, BrowserWindow } = require('electron');
const ejs = require('ejs-electron');
const path = require('path');

if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  const splashWindow = new BrowserWindow({
    width: 285,
    height: 375,
    resizable: false,
    frame: false,
    icon: __dirname + '/views/public/favicon.ico',
    autoHideMenuBar: true
  })
  const mainWindow = new BrowserWindow({
    width: 575,
    height: 625,
    resizable: false,
    icon: __dirname + '/views/public/favicon.ico',
    autoHideMenuBar: true,
    show: false
  });

  splashWindow.loadFile(path.join(__dirname, '/views/splash.ejs'));
  mainWindow.loadFile(path.join(__dirname, '/views/index.ejs'));

  splashWindow.once('close', () => {
    mainWindow.show();
  })
  mainWindow.setMenu(null);
  splashWindow.setMenu(null);
  //mainWindow.webContents.openDevTools(); 
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
