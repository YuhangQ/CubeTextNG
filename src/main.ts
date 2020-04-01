import { app, BrowserWindow, ipcMain} from "electron";
import * as AppMenu from "./models/appmenu"

let mainWindow: BrowserWindow;
let confirm = false;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});
	AppMenu.createMenu();
	mainWindow.loadURL(`file://${__dirname}/../views/index.html`);
	//mainWindow.webContents.openDevTools();
	mainWindow.on('close', function (e) {
		if(!confirm) {
			mainWindow.webContents.send("action", "quit");
			e.preventDefault();
		}
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})

ipcMain.on("quit", ()=>{
	confirm = true;
	mainWindow.close();
})

export { mainWindow }