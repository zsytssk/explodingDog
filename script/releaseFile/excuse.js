'use strict';

const exec = require('child_process').exec;

function excuse(command, path) {
    let result;
    let config = { maxBuffer: 1024 * 1024 * 100 };
    if (path) {
        config.cwd = path;
    }
    return new Promise((resolve, reject) => {
        const run_process = exec(command, config);

        run_process.stdout.setEncoding('utf8');
        run_process.stderr.setEncoding('utf8');

        run_process.stdout.on('data', data => {
            result = data;
            console.log(
                '\x1b[32m%s\x1b[0m',
                `[${command}]:>${data.toString()}`
            );
        });

        run_process.stderr.on('data', data => {
            result = data;
            console.log(
                '\x1b[31m%s\x1b[0m',
                `[${command}]:err:>${data.toString()}`
            );
        });

        run_process.on('exit', code => {
            code = code && code.toString ? code.toString() : code;
            if (code == 1) {
                console.log('\x1b[31m%s\x1b[0m', `[${command}]:>exit;`);
                resolve(result);
            } else {
                console.log('\x1b[31m%s\x1b[0m', `[${command}]:>exit with error code:${code}:> `);
                resolve(result);
            }
        });
    });
}

async function main(cmds, path) {
    let result;
    if (!Array.isArray(cmds)) {
        result = await excuse(cmds, path);
        return result;
    }
    for (let cmd of cmds) {
        result = await excuse(cmd, path);
    }
    return result;
}

module.exports = main;
