const { app, shell, BrowserWindow, session } = require('electron');
const ejs = require('ejs');
const ejsEL = require('ejs-electron');
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
  });
  const loginWindow = new BrowserWindow({
    width: 350,
    height: 450,
    minHeight: 450,
    minWidth: 350,
    resizable: true,
    icon: __dirname + '/views/public/favicon.ico',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: false
    }
  });
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
  loginWindow.loadFile(path.join(__dirname, '/views/login.ejs'));
  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
  
  let uss;
  mainWindow.webContents.executeJavaScript('localStorage.getItem("session")').then(object => uss = object);
  fetch(`https://www.eiffelware.net/api/apps/pimhash/0.1.1`, {
      method: 'get'
    }).then((r) => r.json()).then((b) => {
        splashWindow.once('close', () => {
          fetch(`https://www.eiffelware.net/api/v1/apps/pimhash/auth`, { method: 'post', headers: { session: uss } }).then((r) => r.json()).then((DD) => {
            if (!b.auth || !b.loginAuth) return app.quit()
            if (b.update) return app.quit()
            if (b.auth && DD.OK == true) return mainWindow.show()
            if (b.auth && DD.OK == false) return loginWindow.show()
            app.quit()
          });
        });

        loginWindow.once('close', () => {
          fetch(`https://www.eiffelware.net/api/v1/apps/pimhash/auth`, { method: 'post', headers: { session: uss } }).then((r) => r.json()).then((res) => {
            if (res.OK == true) return mainWindow.show()
            app.quit();
        }).catch(err => app.quit())});
      }).catch(err => app.quit());

  mainWindow.setMenu(null);
  loginWindow.setMenu(null);
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
