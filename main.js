// control lifecycle and create native browser window
const { app, BrowserWindow } = require('electron');
const electronReload = require('electron-reload'); // view changes in real time without restart
const path = require('path')

electronReload(__dirname);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        // webPreferences: {
        //     nodeIntegration: true,
        //     preload: path.join(_dirname, 'preload.js')
        // }
    });

// load index.html of app
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
});
