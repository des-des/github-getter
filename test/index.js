const test = require('tape')

const {
  nockFileRequest, nockCommitRequest, nockTreeRequest, nockUserRequest
} = require('./nocks')
const { file, repo, user, org } = require('../src/')('token')
const { setCb } = require('../src/github_getter.js')

test('util', t => {
  t.plan(1)
  const f = (data, cb) => cb(data)
  setCb(f)('test')(data => {
    t.equal(data, 'test', 'setCb binds correctly')
  })
})

test('error test', t => {
  const testData = 'test data'
  const repoName = 'test-repo'
  const filePath = 'test-file-name'

  nockFileRequest(repoName, filePath, 400, testData)

  file({ repoName, filePath }, (err) => {
    t.ok(err, 'error passed')

    t.end()
  })
})

test('ghFile requests and recieves file data', (t) => {
  const testData = 'test data'
  const repoName = 'test-repo'
  const filePath = 'test-file-name'

  nockFileRequest(repoName, filePath, 200, testData)

  file({ repoName, filePath }, (err, file) => {
    t.ok(!err, 'no error passed')
    t.equal(file.content, testData, 'corrent data received')
    t.end()
  })
})

test('retrieving commit then tree then file', (t) => {
  const repoName = 'test-repo'
  const filePath = 'test-path'
  const sha = 'test-sha'

  nockCommitRequest(repoName, sha, 200)
  nockTreeRequest(repoName, sha, filePath, 200)

  repo({ repoName }, (err, fileData) => {
    t.ok(!err, 'no error')

    const expected = [filePath]
    const actual = Object.keys(fileData)
    t.deepEqual(actual, expected, 'returned file has correct repo and path')
    t.end()
  })
})

test('user', (t) => {
  const name = 'test-user-name'
  const repoName = 'test-repo-name'

  nockUserRequest(name, false, repoName, 200)

  user(({ name }), (err, res) => {
    t.ok(!err, 'no error')

    const expected = [repoName]
    const actual = Object.keys(res)
    t.deepEqual(actual, expected, 'correct repo name in return object')
    t.end()
  })
})

test('org', (t) => {
  const name = 'test-org-name'
  const repoName = 'test-repo-name'

  nockUserRequest(name, false, repoName, 200)

  org(({ name }), (err, res) => {
    t.ok(!err, 'no error')
    const expected = [repoName]
    const actual = Object.keys(res)
    t.deepEqual(actual, expected, 'correct repo name in return object')
    t.end()
  })
})
