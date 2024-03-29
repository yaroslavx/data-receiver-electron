/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { SerialPort, ReadlineParser } from 'serialport';
import os from 'os';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
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
    fullscreenable: true,
    minHeight: 728,
    minWidth: 1024,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  async function createTxt({ e, dest, port }: Record<any, any>) {
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
        // setInterval(() => {
        //   port.write('<', (err: any, res: any) => {
        //     if (err) return console.log('Error', err);
        //     return console.log('Result', res);
        //   });
        // }, 1000);
        console.log('serial port open');
      });
      parser.on('data', (data: any) => {
        resultData += data;
        if (resultData.split(' ').length > 100) {
          fs.appendFileSync(path.join(dest, filename), resultData);
          e.reply('data', resultData);
          resultData = '';
        }
        // fs.appendFileSync(path.join(dest, filename), data);
        // Write the file to the destination folder
      });

      // Open the folder in the file explorer
      shell.openPath(dest);
    } catch (err) {
      console.log(err);
    }
  }

  ipcMain.on('file:create', async (e, { portPath }) => {
    // Arduino connection
    console.log(portPath);
    const port = new SerialPort({
      path: portPath,
      baudRate: 9600,
    });
    const dest = path.join(os.homedir(), 'data-from-serial');

    // file create
    createTxt({ e, dest, port });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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
