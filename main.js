// control lifecycle and create native browser window
const { app, BrowserWindow } = require('electron');
const electronReload = require('electron-reload'); // view changes in real time without restart
const path = require('path')

electronReload(__dirname);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,  // should be true by default
        }
    });

    // load index.html of app
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});
