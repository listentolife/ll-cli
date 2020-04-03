const axios = require('axios')
const { downloadGitRepo } = require('./utils')
const { downloadDirectory } = require('./constents')

// 获取仓库列表
const fetchRepoList = async () => {
  try {
    const { data } = await axios.get('http://api.github.com/users/listentolife/repos')
    return data;
  } catch (e) {
    // console.log(e)
    console.log('\nfetch fail')
    return []
  }
}

// 获取tag列表
const fetchTagList = async (repo) => {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/listentolife/${repo}/tags`)
    return data
  } catch (e) {
    // console.log(e)
    console.log('\nfetch fail')
    return []
  }
}

const download = async (repo, tag) => {
  let api = `listentolife/${repo}`
  if (tag !== '') api += `#${tag}`
  let dest = `${downloadDirectory}/${repo}`

  await downloadGitRepo(api, dest)
  return dest
}

module.exports = {
  fetchRepoList,
  fetchTagList,
  download
}