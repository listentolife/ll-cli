const { waitFnLoading, ncp, render } = require('./utils')
const { fetchRepoList, fetchTagList, download } = require('./api')
const Inquirer = require('inquirer')
const Metalsmith = require('metalsmith'); // 遍历文件夹，找需不需要渲染

const fs = require('fs')
const path = require('path')

module.exports = async (projectName) => {
  // 拉取仓库列表
  let repos = await waitFnLoading(fetchRepoList, 'fetch template...')()
  // 筛选初始化仓库列表
  repos = repos.filter(item => item.name.includes('init-template'))
  repos = repos.map(item => item.name)
  // 选择仓库
  let { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos
  })

  // 拉取tags列表
  let tags = await waitFnLoading(fetchTagList, 'fetch tags...')(repo)
  // 选择tag
  let tag = ''
  if (tags.length > 1) {
    tags = tags.map(item => item.name)
    tagData = await Inquirer.prompt({
      name: 'tag',
      type: 'list',
      message: 'please choise a version to create project',
      choices: tag
    })
    tag = tagData.tag
  } else if (tags.length === 1) {
    tag = tags[0].name
  }

  // 下载模板
  let template = await waitFnLoading(download, 'download template...')(repo, tag)

  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    // 没有ask.js，只要复制到目录下即可
    await ncp(template, path.resolve(projectName))
  } else {
    await new Promise((resolve, reject) => {
      Metalsmith(__dirname)
        .source(template) // 需要编译的资源
        .destination(path.resolve(projectName)) // 编译后存放的目录
        .use(async (files, metal, done) => {
          // 获取用户填写的资料
          const asks = require(path.join(template, 'ask.js'))
          const anwsers = await Inquirer.prompt(asks)
          // 用户填的信息通过metaData传给下一个use
          const meta = metal.metadata()
          Object.assign(meta, anwsers)
          // 删除ask.js文件，用户项目不需要
          delete files['ask.js']
          done()
        })
        .use(async (files, metal, done) => {
          let anwsers = metal.metadata()
          Reflect.ownKeys(files).forEach(async file => {
            // 找到js格式跟json格式的文件
            if (file.includes('js') || file.includes('json')) {
              let content = files[file].contents.toString()
              // 判断内容是否包含编译模板字符串
              if (content.includes('<%')) {
                // 模板编译
                content = await render(content, anwsers)
                // 将编译的内容赋回去
                files[file].conetents = Buffer.from(content)
              }
            }
          })
          done()
        })
        .build(err => {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
    })
  }
}