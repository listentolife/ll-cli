// 存放用户的所需要的常量
const { version } = require('../package.json')

// 存储模板的位置
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`

// 提供的命令
const mapActions = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'll-cli create <project-name>'
    ]
  },
  '*': {
    alias: '',
    description: 'command mot found',
    examples: []
  }
}

module.exports = {
  version,
  downloadDirectory,
  mapActions
};