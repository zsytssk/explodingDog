const fs = require('fs');
const path = require('path');
const walkPath = require('./walkPath');
const cpFile = require('./cpFile');
const isIgnore = require('./isIgnore');

function cpDir(src_folder, dist_folder) {
  let num = 0;
  if (!fs.existsSync(src_folder)) {
    console.error(`${src_folder} doesn't exist!`);
    return num;
  }
  if (isIgnore(src_folder)) {
    console.error(`${src_folder} is ignore!`);
    return num;
  }
  let files = fs.readdirSync(src_folder);
  for (let i = 0; i < files.length; i++) {
    let file_name = files[i];
    let abs_src_path = path.resolve(src_folder, file_name);
    let abs_dist_path = path.resolve(dist_folder, file_name);
    if (fs.statSync(abs_src_path).isDirectory()) {
      num += cpDir(abs_src_path, abs_dist_path);
      continue;
    }
    num++;
    cpFile(abs_src_path, abs_dist_path);
  }
  return num;
}

module.exports = cpDir;