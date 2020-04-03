const program = require('commander')
const path = require('path')
const { version, mapActions } = require('./constents')

Reflect.ownKeys(mapActions).forEach(action => {
  program
    .command(action) // 配置命令名字
    .alias(mapActions[action].alias) // 配置命令别名
    .description(mapActions[action].description) // 配置命令描述
    .action(() => {
      if (action === '*') {
        console.log(mapActions[action].description)
      } else {
        require(path.resolve(__dirname, action))(...process.argv.slice(3))
      }
    })
})

program.on('--help', () => {
  console.log('\nExample:')
  Reflect.ownKeys(mapActions).forEach(action => {
    mapActions[action].examples.forEach(example => {
      console.log(`  ${example}`)
    })
  })
})

program.version(version).parse(process.agrv)
