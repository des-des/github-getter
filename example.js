require('env2')('config.env')

const { user, repo, file } = require('./src/')(process.env.ghtoken);

const logContent = (err, res) => {
  if (err) throw err
  console.log(res.content);
};

file({ repoName: 'des-des/github-getter', filePath: 'README.md' }, logContent)

repo({ repoName: 'des-des/github-getter' }, (err, githubGetter) => {
  if (err) throw err;
  githubGetter['README.md'](logContent)
})

user({ name: 'des-des' }, (err, desdes) => {
  if (err) throw err
  desdes['github-getter']((err, githubGetter) => {
    if (err) throw err
    githubGetter['README.md'](logContent)
  })
});
