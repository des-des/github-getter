import { GHUser, GHRepo } from './GHGetter.js'

GHUser('des-des')({
  getRepos: repos => Object.keys(repos).forEach(key => repos[key]({
    getReadme: readme => readme({
      getData: readmeData => {
        console.log('readme!', readmeData );
      }
    })
  }))
});

GHUser('dwyl', true)({
  getRepos: repos => {
    // console.log(Object.keys(repos));
    repos['adoro']({
      getReadme: readme => readme({
        getData: console.log
      })
    })
  }
});

GHRepo('des-des/aibox')({
  getFiles: files => {
    files['.babelrc']({
      getData: console.log
    })
  },
  getReadme: readme => readme({
    getData: console.log
  })
  // console.log//console.log(new Buffer(readmeData.content, 'base64').toString())
});
