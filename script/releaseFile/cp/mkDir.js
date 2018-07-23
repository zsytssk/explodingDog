// 从一个文件夹复制文件到另外文件夹
let fs = require('fs');
let path = require('path');

function createPath(dir_path) {
    if (fs.existsSync(dir_path)) {
        return true;
    }
    dir_path = path.normalize(dir_path);
    let path_arr = dir_path.split(path.sep);
    for (let i = 0; i < path_arr.length; i++) {
        if (!path_arr[i]) {
            continue;
        }
        let cur_dir = path_arr.slice(0, i + 1).join(path.sep);
        if (!fs.existsSync(cur_dir)) {
            fs.mkdirSync(cur_dir, 0755);
        }
    }
}

module.exports = createPath;
