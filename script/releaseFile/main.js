/** 用package.json中的script发布文件
 * config.json位置在 ../save/config.json中
 * "src_git": "你本地开发的laya地址",
  "dist_git": "服务器git地址",
 * 下面的路径都是相对src_git 和dist_git的
 */

const path = require('path');
const cp = require('./cp/main');
const fileConfig = require('./config.json');
const excuse = require('./excuse');

let type = process.argv.slice(2)[0];

let project_folder = fileConfig.project_folder;
let dist_git = fileConfig.dist_git;
let src_git = fileConfig.src_git;
global.ignore = {
  global: fileConfig.ignore,
};
global.dist_git = dist_git;
global.src_git = src_git;

async function main() {
  let date = new Date();

  let cur_branch = await excuse(`git rev-parse --abbrev-ref HEAD`, path.resolve(dist_git));
  /** 去掉字符串中的换行符 */
  cur_branch = cur_branch.replace('\n', '');
  await excuse(`git pull origin ${cur_branch} --prune`, path.resolve(dist_git));
  uploadFile();
  // // await excuse(`git acpp "[upload] upload ${type} files"`, path.resolve(dist_git));
  /** 获取最近的git消息然后 用到gamehall上面 */
  let msg = await getLastCommitMsg();
  await excuse([
    `git add . `,
    `git commit -m "${cur_branch}:[upload] ${msg}\"`,
    `git pull origin ${cur_branch} --prune`,
    `git push -u origin ${cur_branch}`
  ], path.resolve(dist_git));

  let seconds = (new Date() - date) / 1000;
  console.log(`all completed: cost ${seconds}s`);
}

function uploadFile() {
  let res_map = fileConfig[type];
  let file_num = 0;
  if (res_map['ignore']) {
    global.ignore.cur = res_map['ignore'];
  }
  for (let key in res_map) {
    if (key == 'ignore') {
      continue;
    }
    let src_path = path.resolve(src_git, key);
    let dist_path = path.resolve(dist_git, res_map[key]);

    file_num += cp(src_path, dist_path);
  }
  global.ignore.cur = undefined;
}

/** 获取本地git最近的commit消息 */
async function getLastCommitMsg() {
  let all_msg = await excuse(`git log -1`, path.resolve(src_git));
  let regex = /\n\n\s+([^\n]+)/;
  let match = all_msg.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return '';
}

main();
