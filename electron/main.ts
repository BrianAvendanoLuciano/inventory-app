import { app, BrowserWindow, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { createDatabase } from './db/database'
import { initProductRepo, ProductRepo } from './db/products'
import { initCustomerRepo, CustomerRepo } from './db/customers'
import { initTransactionRepo, TransactionRepo } from './db/transactions'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle("products:getAll", () => {
  return ProductRepo.getAll();
});

ipcMain.handle("products:create", (_, product) => {
  return ProductRepo.create(product);
});

ipcMain.handle("products:delete", (_, id) => {
  return ProductRepo.delete(id);
});

ipcMain.handle("products:update", (_, id, product) => {
  return ProductRepo.update(id, product);
});

// customer
ipcMain.handle("customers:getAll", () => {
  return CustomerRepo.getAll();
});

ipcMain.handle("customers:create", (_, customer) => {
  return CustomerRepo.create(customer);
});

ipcMain.handle("customers:delete", (_, id) => {
  return CustomerRepo.delete(id);
});

ipcMain.handle("customers:update", (_, id, customer) => {
  return CustomerRepo.update(id, customer);
});

// transaction
ipcMain.handle("transactions:getAll", () => {
  return TransactionRepo.getAll();
});

ipcMain.handle("transactions:createBulk", (_, transaction) => {
  return TransactionRepo.createBulk(transaction);
});

ipcMain.handle("transactions:updateBulk", (_, transaction) => {
  return TransactionRepo.updateBulk(transaction);
});

ipcMain.handle("transactions:delete", (_, id) => {
  return TransactionRepo.delete(id);
});

// ipcMain.handle("transactions:updateStatus", (_, id, transaction) => {
//   return TransactionRepo.updateStatus(id, transaction);
// });

app.whenReady().then(() => {
  const db = createDatabase();
  initProductRepo(db);
  initCustomerRepo(db);
  initTransactionRepo(db)

  createWindow();
});
