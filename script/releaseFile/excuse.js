'use strict';

const exec = require('child_process').exec;

function excuse(command, path) {
    let config = { maxBuffer: 1024 * 1024 * 100, encoding: 'utf-8' };
    if (path) {
        config.cwd = path;
    }
    return new Promise((resolve, reject) => {
        let std_out = '',
            std_err = '';
        const run_process = exec(command, config);

        run_process.stdout.pipe(process.stdout);
        run_process.stderr.pipe(process.stderr);
        run_process.stdout.on('data', data => {
            std_out += data;
        });
        run_process.stderr.on('data', data => {
            std_err += data;
        });

        run_process.on('exit', code => {
            console.log(`[${cmd}]:>exit code = ${code};`);
            if (code == 0) {
                resolve(std_out);
            } else {
                resolve(std_err);
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
