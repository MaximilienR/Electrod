const { app, BrowserWindow, Menu, dialog, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

let mainWindow;

// Charger le logo depuis la racine du projet
const logoPath = path.join(__dirname, 'Logo.png');
const logoImage = nativeImage.createFromPath(logoPath);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    mainWindow.loadFile('index.html');

    const template = [
        {
            label: "File",
            submenu: [
                { label: "Save", accelerator: "CmdOrCtrl+S", click: () => mainWindow.webContents.send("save-note") },
                { label: "Save as PDF", click: () => mainWindow.webContents.send("save-pdf") },
                { label: "Open", click: () => mainWindow.webContents.send("open-note") },
                { role: "quit" }
            ]
        },
        {
            label: "Help",
            submenu: [
                { label: "Documentation", click: () => showDoc() },
                { label: "Dark Mode", click: () => mainWindow.webContents.send("toggle-dark-mode") }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Fonction Documentation avec logo
function showDoc() {
    dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "Documentation",
        icon: logoImage,
        message: `
Développeur : Maximilien Freelance
Année : 2025

Application de prise de notes simple et intuitive.
Fonctionnalités :
- Sauvegarde de fichiers
- Ouverture de fichiers
- Exportation PDF
- Mode sombre
        `,
        buttons: ["OK"]
    });
}

// Sauvegarde TXT
ipcMain.handle("save-file", async (_, { content }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: path.join(app.getPath("documents"), "note.txt"),
        filters: [{ name: "Text", extensions: ["txt"] }]
    });

    if (canceled || !filePath) return null;

    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
});

// Ouverture TXT
ipcMain.handle("open-file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Text", extensions: ["txt"] }]
    });

    if (canceled || !filePaths || filePaths.length === 0) return null;

    return fs.readFileSync(filePaths[0], "utf8");
});

// Sauvegarde PDF
ipcMain.handle("save-pdf", async (_, { content }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: path.join(app.getPath("documents"), "note.pdf"),
        filters: [{ name: "PDF", extensions: ["pdf"] }]
    });

    if (canceled || !filePath) return null;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(content);
    doc.end();

    return filePath;
});

app.whenReady().then(createWindow);
