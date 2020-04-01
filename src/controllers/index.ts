/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
import * as path from "path";
import { ipcRenderer, remote } from "electron";
import { MyTab } from "../models/mytab";
import { FileHandler } from "../models/filehandler";
import { Language } from "../models/language";
import { Runner } from "../models/runner";
import { Config } from "../models/config";
import * as fs from "fs";

MyTab.init();
Language.init();

try {
    Config.init();
} catch(e) {

}

loadComponents(()=> {

    /*
    fetch(path.join(__dirname, '../../themes/Monokai.json'))
    .then(data => data.json())
    .then(data => {
        monaco.editor.defineTheme('monokai', data);
        monaco.editor.setTheme('monokai');
    })
    */

   monaco.editor.defineTheme('vs-dark-plus', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'yuhangq.key.if', foreground: 'c586c0'},
            { token: 'yuhangq.key.return', foreground: 'c586c0'},
            { token: 'yuhangq.key.while', foreground: 'c586c0'},
            { token: 'yuhangq.key.else', foreground: 'c586c0'},
            { token: 'yuhangq.key.continue', foreground: 'c586c0'},
            { token: 'keyword.directive.include', foreground: 'c586c0'},
            { token: 'yuhangq.key.define', foreground: 'c586c0'},
            { token: 'yuhangq.key.public', foreground: 'c586c0'},
            { token: 'yuhangq.key.private', foreground: 'c586c0'},
            { token: 'yuhangq.key.protected', foreground: 'c586c0'},
            { token: 'yuhangq.key.inline', foreground: 'c586c0'},
            { token: 'yuhangq.key.const', foreground: 'c586c0'},
            { token: 'yuhangq.key.using', foreground: 'c586c0'},
            { token: 'yuhangq.key.break', foreground: 'c586c0'},
            { token: 'yuhangq.key.case', foreground: 'c586c0'},
            { token: 'yuhangq.key.register', foreground: 'c586c0'},
            { token: 'yuhangq.key.for', foreground: 'c586c0'},
            { token: 'yuhangq.key.operator', foreground: 'c586c0'},
            { token: 'yuhangq.key.switch', foreground: 'c586c0'},
            { token: 'yuhangq.key.do', foreground: 'c586c0'},
            { token: 'yuhangq.key.new', foreground: 'c586c0'},
            { token: 'yuhangq.key.true', foreground: 'c586c0'},
            { token: 'yuhangq.key.false', foreground: 'c586c0'},
            { token: 'yuhangq.key.sizeof', foreground: 'c586c0'},
            { token: 'yuhangq.key.friend', foreground: 'c586c0'},
            { token: 'yuhangq.key.operator', foreground: 'c586c0'},
            { token: 'yuhangq.function', foreground: 'dcdcaa'},
        ],
        colors: {

        }
    });

    MyTab.createUntitled();
    
    
    MyTab.setExampleEditor(monaco.editor.create(document.getElementById("config-example"), {
        value: FileHandler.readText(Config.examplePath),
        language: "json",
        automaticLayout: true,
        theme: Config.theme,
        fontSize: MyTab.getFontSize(),
        autoClosingBrackets: "always",
        autoIndent: "brackets",
        mouseWheelZoom: Config.mouseWheelZoom,
        fontFamily: Config.fontFamily,
        //useTabStops: Config.tabSize
        //useTabStops: false,
        //glyphMargin: true,
        readOnly: true,
        folding: Config.folding,
        renderIndentGuides: Config.renderIndentGuides,
        minimap: {enabled: false},
    }));
    document.getElementById("config-example").hidden = true;
});

ipcRenderer.on("action", (event, arg) => {
    switch (arg) {
        case "new": MyTab.createUntitled(); break;
        case "open": FileHandler.openFile(); break;
        case "save": MyTab.getActiveTab().saveFile(); break;
        case "saveas": MyTab.getActiveTab().saveAs(); break;
        case "closetag": MyTab.getActiveTab().close(); break;
        case "cprun": Runner.cprun(MyTab.getActiveTab()); break;
        case "font-larger": MyTab.setFontSize(MyTab.getFontSize() + 1); break;
        case "font-smaller": MyTab.setFontSize(MyTab.getFontSize() - 1); break;
        case "remove-settings":
            fs.writeFileSync(Config.path, "{}");
            alert("重置设置成功，程序将关闭。");
            ipcRenderer.send("quit");
            break;
        //case "devtools": mainWindow.webContents.openDevTools(); break;
        case "settings": MyTab.create(Config.path); break;
        //case "newSnippets": ipcRenderer.send("snippets"); break;
        case "quit":
            let tabs = MyTab.getTabs();
            let cnt = 0;
            for(let tab of tabs) {
                if(tab.isUntitled() && tab.isChanged()) cnt++;
            }
            if(cnt > 0) {
                let choice = remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                    title: "退出程序？",
                    buttons: ["取消", "退出"],
                    message: "还有未保存文件，是否退出程序？",
                    detail: "退出程序，将永久失去未保存的信息.",
                    cancelId: 2
                })
                if(choice == 1) {
                    MyTab.saveAll();
                    ipcRenderer.send("quit");
                }
            } else {
                MyTab.saveAll();
                ipcRenderer.send("quit");
            }
            break;
    }
});

/**
 * 初始化 monaco 编辑器
 * @param func 
 */
function loadComponents(func: Function) {
    
    const amdLoader = require('monaco-editor/dev/vs/loader.js');
    const amdRequire = amdLoader.require;
    function uriFromPath(_path) {
        var pathName = path.resolve(_path).replace(/\\/g, '/');
        if (pathName.length > 0 && pathName.charAt(0) !== '/') {
            pathName = '/' + pathName;
        }
        return encodeURI('file://' + pathName);
    }

    amdRequire.config({
        baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/dev'))
    });

    // workaround monaco-css not understanding the environment
    self.module = undefined;

    amdRequire(['vs/editor/editor.main'], func);
}