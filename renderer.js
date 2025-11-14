const noteArea = document.getElementById("note");
const container = document.querySelector(".container");
const body = document.body;

// Sauvegarde TXT
window.api.on("save-note", async () => {
    try {
        const savedPath = await window.api.saveFile(noteArea.value);
        if (savedPath) alert("Fichier sauvegardé : " + savedPath);
    } catch (err) {
        alert(err.message);
    }
});

// Sauvegarde PDF
window.api.on("save-pdf", async () => {
    try {
        const savedPath = await window.api.savePDF(noteArea.value);
        if (savedPath) alert("PDF sauvegardé : " + savedPath);
    } catch (err) {
        alert(err.message);
    }
});

// Ouvrir fichier
window.api.on("open-note", async () => {
    try {
        const content = await window.api.openFile();
        if (content !== null) noteArea.value = content;
    } catch (err) {
        alert(err.message);
    }
});

// Dark Mode
window.api.on("toggle-dark-mode", () => {
    body.classList.toggle("dark-mode");
    container.classList.toggle("dark-mode");
    noteArea.classList.toggle("dark-mode");
});

// Documentation (via IPC vers main.js)
window.api.on("show-doc", () => {
});
