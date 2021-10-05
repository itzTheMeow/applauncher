"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var shouldExit = false;
var shouldDevTools = false;
var launching = [];
electron_1.ipcMain.on("synchronous-message", function (event, arg) {
    if (arg == "shouldExit") {
        event.returnValue = shouldExit;
        shouldExit = false;
    }
    else if (arg == "shouldDevTools") {
        event.returnValue = shouldDevTools;
        shouldDevTools = false;
    }
    else if (arg == "launching") {
        event.returnValue = launching.shift();
    }
});
electron_1.contextBridge.exposeInMainWorld("launchApp", function (path) {
    launching.push(path);
});
electron_1.contextBridge.exposeInMainWorld("exit", function () {
    shouldExit = true;
});
electron_1.contextBridge.exposeInMainWorld("devTools", function () {
    shouldDevTools = true;
});
