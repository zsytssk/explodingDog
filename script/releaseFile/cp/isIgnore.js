const path = require('path');
const fs = require('fs');

function isIgnore(src_path) {
  let global_ignore = global.ignore.global || [];
  let cur_ignore = global.ignore.cur || [];
  let ignores = global_ignore.concat(cur_ignore);
  if (!cur_ignore) {
    return false;
  }
  for (let i = 0; i < ignores.length; i++) {
    let item = path.resolve(global.src_git, ignores[i]);
    if (src_path == item) {
      return true;
    }
  }
  return false;
}

module.exports = isIgnore;