import { gHUser, gHRepo, gHFile } from './gHGetter.js';


// githubFile: get its data
gHFile('des-des/github-getter', 'README.md')({
  getData:  (err, readmeData) => console.log(readmeData)
})

// githubRepo: get a githubFile for every file in a repo (or just the readme)
gHRepo('des-des/github-getter')({
  getFiles: (err, files) => {
    if (!err) {
      files['package.json']({
        getData: (err, packageData) => console.log(packageData)
      });
    }
  },
  getReadme: (err, readme) => readme({
    getData: (err, readmeData) => console.log(readmeData)
  })
});

// githubUser: get a githubRepo for every repo belonging to a user or org
gHUser('des-des')({
  getRepos: (err, repos) => repos['github-getter']({
    getReadme: (err, readme) => {
      if (!err) {
        readme({
          getData: (err, readmeData) => console.log(readmeData)
        })
      }
    }
  })
})
