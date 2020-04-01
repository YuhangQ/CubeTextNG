"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var process = require("process");
var GDB = /** @class */ (function () {
    function GDB(file) {
        this.file = file;
        this.cmd = child_process_1.spawn("gdb", [file]);
        this.cmd.stdout.on('data', function (data) {
            console.log("stdout: " + data);
        });
        this.cmd.stdin.write("set new-console on\n");
        this.cmd.stderr.on('data', function (data) {
            console.error("err: " + data + "$\n---------------\n");
        });
        this.cmd.on('close', function (code) {
            console.log("child process exited with code " + code);
        });
    }
    GDB.prototype.run = function () {
        this.cmd.stdin.write("run\n");
    };
    GDB.run1 = function () {
        var cmd = process.platform == 'win32' ? 'tasklist' : 'ps aux';
        var qqname = 'a.exe';
        var stdout = child_process_1.execSync(cmd).toString();
        stdout.split('\n').filter(function (line) {
            var p = line.trim().split(/\s+/), pname = p[0], pid = p[1];
            if (pname.toLowerCase().indexOf(qqname) >= 0 && parseInt(pid)) {
                console.log(pname, pid);
                GDB.pid = pid;
            }
        });
    };
    return GDB;
}());
exports.GDB = GDB;
//exec("start a.exe")
//GDB.run1();
var gdb = new GDB("a.exe");
gdb.run();
