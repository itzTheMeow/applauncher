import { app, BrowserWindow, Menu, Tray, ipcRenderer } from "electron";
import path from "path";

const ico = path.join(__dirname, "../icon.ico");

app.on("ready", () => {
  let window = new BrowserWindow({
    width: 800,
    height: 600,
    icon: ico,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  window.removeMenu();
  window.webContents.openDevTools();

  function exit() {
    window.destroy();
    app.quit();
  }

  let tray = new Tray(ico);
  tray.on("click", (e) => {
    window.show();
  });

  tray.setContextMenu(Menu.buildFromTemplate([{ label: "Exit", click: exit }]));
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });

  window.loadFile(path.join(__dirname, "../index.html"));

  window.on("close", (e) => {
    e.preventDefault();
    window.hide();
  });

  setInterval(function () {
    let shouldExit = ipcRenderer.sendSync("shouldExit");
    if (shouldExit) exit();

    let shouldDevTools = ipcRenderer.sendSync("shouldExit");
    if (shouldDevTools) window.webContents.openDevTools();

    let launching = ipcRenderer.sendSync("launching");
    if (launching) {
      // launch
    }
  });
});
