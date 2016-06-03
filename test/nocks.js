const nock = require('nock')

const nockFileRequest = (repoName, responseData, sha) => {
  nock('https://api.github.com')
    .get(`/repos/${repoName}/git/blobs/${sha}`)
    .reply(200, { content: new Buffer(responseData).toString('base64') })
}

const nockCommitRequest = (repoName, sha) => {
  nock('https://api.github.com')
    .get('/repos/' + repoName + '/commits')
    .reply(200, [{ sha }])
}

const nockTreeRequest = (repoName, rootSha, treeElem) => {
  nock('https://api.github.com')
    .get(`/repos/${repoName}/git/trees/${rootSha}?recursive=1`)
    .reply(200, { tree: [treeElem, { type: 'notablob' }] })
}

const nockUserRequest = (name, isOrg, repoName) => {
  nock('https://api.github.com')
    .get(`/${(isOrg ? 'orgs' : 'users')}/${name}/repos`)
    .reply(200, [{ full_name: `${name}/${repoName}` }])
}

module.exports = {
  nockFileRequest,
  nockCommitRequest,
  nockTreeRequest,
  nockUserRequest
}
