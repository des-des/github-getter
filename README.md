[![codecov.io](https://codecov.io/github/des-des/github-getter/coverage.svg?branch=master)](https://codecov.io/github/des-des/github-getter?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/des-des/github-getter/badges/score.svg)](https://www.bithound.io/github/des-des/github-getter) [![bitHound Dependencies](https://www.bithound.io/github/des-des/github-getter/badges/dependencies.svg)](https://www.bithound.io/github/des-des/github-getter/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/des-des/github-getter/badges/devDependencies.svg)](https://www.bithound.io/github/des-des/github-getter/master/dependencies/npm)

**webhooks coming soon (so you gh hosted content can tell you site when to update!)**

# github-getter

## What?

#### A quick and easy way to get files from github

github-getter is a small module to take the hassle out of downloading files from github. Download specific files, or specify repositories/users and recieve lists of files/repositories available.

## Why?

Save time digging around docs / fiddling with with headers.

## How?

get a github api token. Create a personal one [here](https://github.com/settings/tokens) or use [oauth](https://github.com/settings/tokens).

#### node 6
```js
const { user, repo, file } = require('./src/')(process.env.ghtoken)

const logContent = (err, res) => {
  if (err) throw err
  console.log(res.content)
}

file({ repoName: 'des-des/github-getter', filePath: 'README.md' }, logContent)

repo({ repoName: 'des-des/github-getter' }, (err, githubGetter) => {
  if (err) throw err
  githubGetter['README.md'](logContent)
})

user({ name: 'des-des' }, (err, desdes) => {
  if (err) throw err
  desdes['github-getter']((err, githubGetter) => {
    if (err) throw err
    githubGetter['README.md'](logContent)
  })
})
```

## Documentation

  * `init` - `token => githubGetter`, where
    * `token` - github api token.
  * `githubGetter` - object with
    * `file` - `({ repoName, filePath }, cb) => {}`, where
      * `repoName` - name of the repository,
      * `filePath` - path of desired file, ie `assets/someData.json`,
      * `cb` - `(err, githubFile) => {}`.
    * `repo` - `({ repoName }, cb) => {}`, where
      * `repoName` - name of the repository,
      * `cb` - `(err, githubRepo) => {}`.
    * `user` - `({ name }, cb) => {}`, where
      * `name` - github user name,
      * `cb` - `(err, githubUser) => {}`.
    * `org` - `({ name }, cb) => {}`, where
      * `name` - github org name,
      * `cb` - `(err, githubUser) => {}`.
  * `githubFile` - object containing
    * `content` - string containing file content
  * githubRepo - an object were keys are paths to repos files:
    * `[filepath]` - `cb(err, githubFile) => {}`.
  * githubUser - an object were keys are repo names belonging to the user/org:
    * `[repoName]` - `cb(err, githubRepo) => {}`.
