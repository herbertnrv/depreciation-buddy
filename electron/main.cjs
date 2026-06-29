// Electron main process — starts the bundled nitro node server and opens a window.
const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const net = require("node:net");

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("Server did not start in time");
}

async function startServer() {
  const port = await getFreePort();
  process.env.NITRO_PORT = String(port);
  process.env.NITRO_HOST = "127.0.0.1";
  process.env.PORT = String(port);
  process.env.HOST = "127.0.0.1";
  // Server file lives next to this main script after packaging.
  const serverEntry = path.join(__dirname, "..", "output", "server", "index.mjs");
  // Dynamic ESM import from CommonJS.
  await import(require("node:url").pathToFileURL(serverEntry).href);
  await waitForServer(`http://127.0.0.1:${port}/`);
  return port;
}

async function createWindow() {
  const port = await startServer();
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "GastronoAssets — Hotel & Gastro Service",
    icon: path.join(__dirname, "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  await win.loadURL(`http://127.0.0.1:${port}/`);
}

app.whenReady().then(createWindow).catch((err) => {
  console.error(err);
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
