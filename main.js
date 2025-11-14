const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path'); // ← AJOUT IMPORTANT

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

function saveNote() { /* ... inchangé ... */ }
function openNote() { /* ... inchangé ... */ }

// -------- PDF --------

function savePdf() { /* ... inchangé ... */ }

// -------- Help --------

function doc() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Documentation',
        icon: path.join(__dirname, 'Logo.png'), // ← CORRIGÉ
        message: `
Développeur : Maximilien Freelance
Année de création : 2025

Description :
Cette application permet la création rapide et intuitive de notes. Elle offre une interface simple et efficace pour faciliter la prise de notes au quotidien.

Technologies utilisées :
- HTML5
- CSS3
- JavaScript (ES6)
- Electron.js

Objectif :
Fournir un outil pratique pour capturer et organiser ses idées, tâches et informations importantes rapidement.

Fonctionnalités principales :
- Interface simple et intuitive
- Sauvegarde et ouverture facile des notes
- Léger et performant
- Exportation des notes au format PDF
- Mode sombre pour le confort visuel
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
