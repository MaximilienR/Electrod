const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');
const PDFDocument = require('pdfkit');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    const template = [
        {
            label: 'File',
            submenu: [
                { label: 'Save', accelerator: 'CmdOrCtrl+S', click: saveNote },
                { label: 'Save as PDF', click: savePdf },
                { label: 'Open', click: openNote },
                { role: 'quit' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                { label: 'Doc', click: doc },
                { label: 'Dark Mode', click: toggleDarkMode }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// -------- TXT --------
function saveNote() {
    dialog.showSaveDialog(mainWindow, {
        title: 'Enregistrer la note',
        defaultPath: 'note.txt',
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePath;
            mainWindow.webContents.executeJavaScript('document.getElementById("input").value')
                .then(content => {
                    fs.writeFile(filePath, content, err => {
                        if (err) console.error(err);
                        else console.log('TXT enregistré ✅');
                    });
                });
        }
    });
}

function openNote() {
    dialog.showOpenDialog(mainWindow, {
        title: 'Ouvrir une note',
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt', '*'] }],
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePaths[0];
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) console.error(err);
                else mainWindow.webContents.executeJavaScript(`document.getElementById("input").value = \`${content}\``);
            });
        }
    });
}

// -------- PDF --------
function savePdf() {
    dialog.showSaveDialog(mainWindow, {
        title: 'Enregistrer la note en PDF',
        defaultPath: 'note.pdf',
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePath;
            mainWindow.webContents.executeJavaScript('document.getElementById("input").value')
                .then(content => {
                    const doc = new PDFDocument();
                    const stream = fs.createWriteStream(filePath);
                    doc.pipe(stream);
                    doc.text(content);
                    doc.end();
                    stream.on('finish', () => console.log('PDF enregistré ✅'));
                });
        }
    });
}

// -------- Help --------
function doc() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Documentation',
        message: `
Développeur : Maximilien Freelance
Année de création : 2025

Description :
Cette application permet la création rapide et intuitive de notes. Elle offre une interface simple et efficace pour faciliter la prise de notes au quotidien.

Technologies utilisées :
- HTML5
- CSS3
- JavaScript (ES6)

Objectif :
Fournir un outil pratique pour capturer et organiser ses idées, tâches et informations importantes rapidement.

Fonctionnalités principales :
- Interface simple et intuitive
- Sauvegarde et ouverture facile des notes
- Léger et performant
- Partage possible des notes avec d'autres utilisateurs
        `,
        buttons: ['OK']
    });
}

// -------- Dark Mode --------
function toggleDarkMode() {
    mainWindow.webContents.executeJavaScript(`
        document.body.classList.toggle('dark-mode');
        document.querySelector('.container').classList.toggle('dark-mode');
    `);
}

app.whenReady().then(createWindow);
