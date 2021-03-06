import { execFile, execFileSync, spawn } from "child_process";
import { app, BrowserWindow, Menu, Tray, ipcMain } from "electron";
import path from "path";

const ico = path.join(__dirname, "../icon.ico");

const apps: {
  id: string;
  name: string;
  icon: string;
  launch: string;
}[] = require("../apps.json");

let ready = (win?: BrowserWindow) => {
  let window =
    win ||
    new BrowserWindow({
      width: 800,
      height: 600,
      icon: ico,
      webPreferences: {
        preload: path.join(__dirname, "./preload.js"),
        nodeIntegration: true,
      },
    });
  window.removeMenu();

  function exit() {
    window.destroy();
    app.quit();
  }

  function restart() {
    let newWin = new BrowserWindow({
      width: 800,
      height: 600,
      icon: ico,
      webPreferences: {
        preload: path.join(__dirname, "./preload.js"),
        nodeIntegration: true,
      },
    });
    window.destroy();
    tray.destroy();
    ready(newWin);
  }

  let tray = new Tray(ico);
  tray.on("click", (e) => {
    window.show();
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open DevTools", click: () => window.webContents.openDevTools() },
      { label: "Restart", click: restart },
      { label: "Exit", click: exit },
    ])
  );
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });

  window.loadFile(path.join(__dirname, "../index.html"));

  window.on("close", (e) => {
    e.preventDefault();
    window.hide();
  });

  window.webContents.send("apps", apps);
  window.webContents.on("ipc-message-sync", (e, arg1, arg2) => {
    if (arg1 == "exit") exit();
    else if (arg1 == "hide") window.hide();
    else if (arg1 == "devtools") window.webContents.openDevTools();
    else if (arg1 == "launch") {
      let launch = apps.find((a) => a.id == arg2);
      if (!launch) return;

      window.hide();
      const sub = spawn("START", [`"${launch.launch}"`, `"${launch.launch}"`], {
        detached: true,
        shell: true,
      });
      sub.unref();
    }
  });
};

app.on("ready", () => ready());
