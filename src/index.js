const { app, BrowserWindow } = require('electron');
const ejs = require('ejs-electron');
const path = require('path');
const fetch = require('node-fetch');
const jq = require('jquery');
const fs = require('fs');

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
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  const mainWindow = new BrowserWindow({
    width: 575,
    height: 760,
    minHeight: 760,
    minWidth: 575,
    resizable: true,
    icon: __dirname + '/views/public/favicon.ico',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  splashWindow.loadFile(path.join(__dirname, '/views/splash.ejs'));
  mainWindow.loadFile(path.join(__dirname, '/views/index.ejs'));

  fetch(`https://www.eiffelware.net/api/apps/pimhash/0.1`, {
      method: 'get'
    }).then((r) => r.json()).then((b) => {
      splashWindow.once('close', () => {
        if (!b.auth) return app.quit()
        if (b.update) return app.quit()
        if (b.auth) { return mainWindow.show() }
        else { app.quit() };
      })
    });

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
