"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var ico = path_1.default.join(__dirname, "../icon.ico");
var apps = require("../apps.json");
var ready = function (win) {
    var window = win ||
        new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            icon: ico,
            webPreferences: {
                preload: path_1.default.join(__dirname, "./preload.js"),
                nodeIntegration: true,
            },
        });
    window.removeMenu();
    function exit() {
        window.destroy();
        electron_1.app.quit();
    }
    function restart() {
        var newWin = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            icon: ico,
            webPreferences: {
                preload: path_1.default.join(__dirname, "./preload.js"),
                nodeIntegration: true,
            },
        });
        window.destroy();
        tray.destroy();
        ready(newWin);
    }
    var tray = new electron_1.Tray(ico);
    tray.on("click", function (e) {
        window.show();
    });
    tray.setContextMenu(electron_1.Menu.buildFromTemplate([
        { label: "Open DevTools", click: function () { return window.webContents.openDevTools(); } },
        { label: "Restart", click: restart },
        { label: "Exit", click: exit },
    ]));
    tray.on("right-click", function () {
        tray.popUpContextMenu();
    });
    window.loadFile(path_1.default.join(__dirname, "../index.html"));
    window.on("close", function (e) {
        e.preventDefault();
        window.hide();
    });
    window.webContents.send("apps", apps);
    window.webContents.on("ipc-message-sync", function (e, arg1, arg2) {
        if (arg1 == "exit")
            exit();
        else if (arg1 == "hide")
            window.hide();
        else if (arg1 == "devtools")
            window.webContents.openDevTools();
        else if (arg1 == "launch") {
            var launch = apps.find(function (a) { return a.id == arg2; });
            if (!launch)
                return;
            window.hide();
            var sub = (0, child_process_1.spawn)("START", ["\"" + launch.launch + "\"", "\"" + launch.launch + "\"", "/b"], {
                detached: true,
                shell: true,
            });
            sub.unref();
        }
    });
};
electron_1.app.on("ready", function () { return ready(); });
