import { ipcRenderer, contextBridge } from "electron";
import { TransactionData } from "../src/types/common";

export type Product = {
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

export type Customer = {
  name: string;
  phone: string;
  address: string;
};

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld("api", {
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),
    create: (product: Product) =>
      ipcRenderer.invoke("products:create", product),
    delete: (id: number) => ipcRenderer.invoke("products:delete", id),
    update: (id: number, product: Product) =>
      ipcRenderer.invoke("products:update", id, product),
  },
  customers: {
    getAll: () => ipcRenderer.invoke("customers:getAll"),
    create: (customer: Customer) =>
      ipcRenderer.invoke("customers:create", customer),
    delete: (id: number) => ipcRenderer.invoke("customers:delete", id),
    update: (id: number, customer: Customer) =>
      ipcRenderer.invoke("customers:update", id, customer),
  },
  transactions: {
    getAll: () => ipcRenderer.invoke("transactions:getAll"),
    createBulk: (transaction: TransactionData) =>
      ipcRenderer.invoke("transactions:createBulk", transaction),
    updateBulk: (transaction: TransactionData) =>
      ipcRenderer.invoke("transactions:updateBulk", transaction),
    delete: (id: string) => ipcRenderer.invoke("transactions:delete", id),
    // updateStatus: (id: number, transaction: Transaction) =>
    //   ipcRenderer.invoke("transactions:updateStatus", id, transaction),
  },
});
