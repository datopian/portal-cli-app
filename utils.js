const fs = require('fs')
const { exec } = require('child_process');


function directoryExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
                reject(error)
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

function processArgs(args) {
    const userArgs = { npm: false, override: false, port: 3000, path: process.cwd(), show: args.includes("show") }
    args.forEach((arg) => {
        if (arg.includes("=")) {
            let temp = arg.split("=")
            userArgs[temp[0]] = temp[1]
        }
    })
    return userArgs
}

module.exports = { directoryExists, execShellCommand, processArgs }