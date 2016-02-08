import { gHUser, gHRepo } from './gHGetter.js';

gHUser('des-des')({
  getRepos: (err, repos) => Object.keys(repos).forEach(key => repos[key]({
    getReadme: (err, readme) => readme({
      getData: console.log
    })
  }))
});

gHUser('dwyl', true)({
  getRepos: (err, repos) => {
    repos.adoro({
      getReadme: (err, readme) => readme({
        getData: console.log
      })
    });
  }
});

gHRepo('des-des/aibox')({
  getFiles: (err, files) => {
    files['.babelrc']({
      getData: (err, fileData) => console.log(fileData)
    });
  },
  getReadme: (err, readme) => readme({
    getData: console.log
  })
});
