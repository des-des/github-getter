const makeGHRequest = require('./github_request.js')

const fileUrl = ({ repoName, filePath }) =>
  `/repos/${repoName}/contents/${filePath}`

const commitsUrl = ({ repoName }) =>
  `/repos/${repoName}/commits`

const repoTreeUrl = ({ repoName }, commits) =>
  `/repos/${repoName}/git/trees/${commits[0].sha}?recursive=1`

const userUrl = ({ name }) =>
  `/users/${name}/repos`

const orgUrl = ({ name }) =>
  `/users/${name}/repos`

const waterfallRequester = token => res => ([processRes, ...rest]) =>
  (opts, cb) => {
    const data = processRes(opts, res)
    if (rest.length) {
      makeGHRequest(data, token, (err, res) => {
        if (err) cb(err)
        else waterfallRequester(token)(res)(rest)(opts, cb)
      })
    } else cb(null, data)
  }

const setCb = f => (...args) => cb => f(...args, cb)

const githubGetter = token => {
  const getter = waterfallRequester(token)()

  const gHFile = (_, fileData) => ({
    content: new Buffer(fileData.content, 'base64').toString(),
    fileData
  })

  const file = getter([fileUrl, gHFile])

  const gHRepo = ({ repoName }, treeData) => {
    return treeData.tree.reduce((files, treeElem) => {
      if (treeElem.type === 'blob') {
        files[treeElem.path] = setCb(file)({ repoName, filePath: treeElem.path })
      }
      return files
    }, {})
  }

  const repo = getter([commitsUrl, repoTreeUrl, gHRepo])

  const gHUser = (_, repoDataArr) =>
    repoDataArr.reduce((repos, { full_name }) => {
      repos[full_name.split('/')[1]] = setCb(repo)({ repoName: full_name })
      return repos
    }, {})

  const user = getter([userUrl, gHUser])

  const org = getter([orgUrl, gHUser])

  return { file, file, repo, user, org }
}

module.exports = { githubGetter, waterfallRequester, setCb }
