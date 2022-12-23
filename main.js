const path = require('path');
const os = require('os');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, shell } = require('electron');

// Libs for arduino connection
const { SerialPort, ReadlineParser } = require('serialport');

process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 400,
    height: 400,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.ico'),
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

// Respond to the resize image event
ipcMain.on('file:create', (e, { portPath }) => {
  // Arduino connection
  console.log(portPath);
  let port = new SerialPort({
    path: portPath,
    baudRate: 9600,
  });
  const dest = path.join(os.homedir(), 'data-from-serial');

  //file create
  createTxt({ dest, port });
});

async function createTxt({ dest, port }) {
  try {
    // Get filename
    const filename = path.basename('data.txt');
    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    let resultData = '';

    fs.writeFileSync(path.join(dest, filename), resultData);
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    console.log('port', port);
    console.log('parser', parser);

    // Read the port data
    port.on('open', () => {
      // testing
      setInterval(() => {
        port.write('<', (err, res) => {
          if (err) return console.log('Error', err);
          return console.log('Result', res);
        });
      }, 1000);
      //
      console.log('serial port open');
    });
    parser.on('data', (data) => {
      // resultData += data;
      // Write the file to the destination folder
      fs.appendFileSync(path.join(dest, filename), data);

      // await port.write('<', (err, res) => {
      //   if (err) return console.log('Error', err);
      //   return console.log('Result', res);
      // });
    });

    // Open the folder in the file explorer
    shell.openPath(dest);
  } catch (err) {
    console.log(err);
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
