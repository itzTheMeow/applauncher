import { contextBridge, ipcMain } from "electron";

let shouldExit = false;
let shouldDevTools = false;
let launching = [];

ipcMain.on("synchronous-message", (event, arg) => {
  if (arg == "shouldExit") {
    event.returnValue = shouldExit;
    shouldExit = false;
  } else if (arg == "shouldDevTools") {
    event.returnValue = shouldDevTools;
    shouldDevTools = false;
  } else if (arg == "launching") {
    event.returnValue = launching.shift();
  }
});

contextBridge.exposeInMainWorld("launchApp", function (path: string) {
  launching.push(path);
});
contextBridge.exposeInMainWorld("exit", function () {
  shouldExit = true;
});
contextBridge.exposeInMainWorld("devTools", function () {
  shouldDevTools = true;
});
