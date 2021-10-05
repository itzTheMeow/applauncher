"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var ico = path_1.default.join(__dirname, "../icon.ico");
electron_1.app.on("ready", function () {
    require("electron").ipcRenderer.sendSync("a");
    var window = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        icon: ico,
        webPreferences: {
            preload: path_1.default.join(__dirname, "./preload.js"),
        },
    });
    window.removeMenu();
    window.webContents.openDevTools();
    function exit() {
        window.destroy();
        electron_1.app.quit();
    }
    var tray = new electron_1.Tray(ico);
    tray.on("click", function (e) {
        window.show();
    });
    tray.setContextMenu(electron_1.Menu.buildFromTemplate([{ label: "Exit", click: exit }]));
    tray.on("right-click", function () {
        tray.popUpContextMenu();
    });
    window.loadFile(path_1.default.join(__dirname, "../index.html"));
    window.on("close", function (e) {
        e.preventDefault();
        window.hide();
    });
    setInterval(function () {
        var shouldExit = electron_1.ipcRenderer.sendSync("shouldExit");
        if (shouldExit)
            exit();
        var shouldDevTools = electron_1.ipcRenderer.sendSync("shouldExit");
        if (shouldDevTools)
            window.webContents.openDevTools();
        var launching = electron_1.ipcRenderer.sendSync("launching");
        if (launching) {
            // launch
        }
    });
});
