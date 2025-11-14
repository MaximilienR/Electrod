const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
    saveFile: (content) => ipcRenderer.invoke("save-file", { content }),
    openFile: () => ipcRenderer.invoke("open-file"),
    savePDF: (content) => ipcRenderer.invoke("save-pdf", { content }),
    on: (channel, callback) => {
        const allowedChannels = ["save-note", "save-pdf", "open-note", "toggle-dark-mode", "show-doc"];
        if (allowedChannels.includes(channel)) {
            ipcRenderer.on(channel, (_, data) => callback(data));
        }
    }
});
