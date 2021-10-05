import { contextBridge, ipcRenderer } from "electron";

let apps = [];
ipcRenderer.on("apps", (e, a) => {
  apps = a;
});

contextBridge.exposeInMainWorld("launchApp", function (path: string) {
  ipcRenderer.sendSync("launch", path);
});
contextBridge.exposeInMainWorld("exit", function () {
  ipcRenderer.sendSync("exit");
});
contextBridge.exposeInMainWorld("hide", function () {
  ipcRenderer.sendSync("hide");
});
contextBridge.exposeInMainWorld("devTools", function () {
  ipcRenderer.sendSync("devtools");
});
contextBridge.exposeInMainWorld("getApps", async function () {
  return new Promise((res) => {
    function seeApps() {
      if (!apps.length) setTimeout(seeApps, 75);
      res(apps);
    }
    seeApps();
  });
});
