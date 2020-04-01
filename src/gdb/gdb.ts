import { spawn, exec, execSync , ChildProcessWithoutNullStreams} from "child_process";
import * as process from "process";

class GDB {
    private file: string;
    private cmd: ChildProcessWithoutNullStreams;
    constructor(file: string) {
        this.file = file;
        this.cmd = spawn("gdb", [file, "--interpreter=mi2"]);

        this.cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        this.cmd.stdin.write(`set new-console on\n`);

        this.cmd.stderr.on('data', (data) => {
            console.error(`err: ${data}$\n---------------\n`);
        });

        this.cmd.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    public run() {
        this.cmd.stdin.write("run\n");
    }


    public static pid: string;
    public static run1() {
        var cmd = process.platform == 'win32' ? 'tasklist' : 'ps aux';
        var qqname = 'a.exe';
        let stdout = execSync(cmd).toString();
        stdout.split('\n').filter(function (line) {
            var p = line.trim().split(/\s+/), pname = p[0], pid = p[1];
            if (pname.toLowerCase().indexOf(qqname) >= 0 && parseInt(pid)) {
                console.log(pname, pid);
                GDB.pid = pid;
            }
        });
    }
}

//exec("start a.exe")
//GDB.run1();

let gdb = new GDB("a.exe");
gdb.run();





export { GDB }