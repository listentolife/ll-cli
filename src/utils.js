const { promisify } = require('util')
let downloadGitRepo = require('download-git-repo') // 下载github模块
let ncp = require('ncp') // 拷贝目录文件
let { render } = require('consolidate').ejs // cosolidate 统一了所有的模板引擎
const ora = require('ora')

// 把异步的api转换成promise
downloadGitRepo = promisify(downloadGitRepo)
ncp = promisify(ncp)
render = promisify(render)

// 封装loading效果
const waitFnLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  let data = await fn(...args);
  spinner.succeed();
  return data
}

module.exports = {
  downloadGitRepo,
  ncp,
  render,
  waitFnLoading
}