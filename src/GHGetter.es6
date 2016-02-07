import makeGHRequest from './GHRequest.js';
import httpsRequest from './httpsRequest.js'

export const GHUser = (name, isOrg) => config => {
  const requestPath = `/${isOrg ? `orgs` : `users`}/${name}/repos`;
  console.log(requestPath);
  if (config.getRepos) {
    makeGHRequest(requestPath, (err, repoDataArr) => {
      if (err) {
        console.warn(`getting repos failed with err ${err}`);
      } else {
        config.getRepos(repoDataArr.reduce((repos, repoData) => {
          const repoName = repoData.full_name;
          repos[repoName.split('/')[1]] = GHRepo(repoName);
          return repos;
        }, {}))
      }
    });
  }
}

export const GHRepo = name => config => {
  console.log(name);
  if (config.getReadme) {
    config.getReadme(GHFile(name, 'README.md'));
  }
  if (config.getFiles) {
    getTree(name, config.getFiles);
  }
};

const getTree = (name, cb) => {
  makeGHRequest(`/repos/${name}/commits`, (err, commits) => {
    if (err) {
      console.warn(`getting latest commit failed with err ${err}`);
    } else {
      makeGHRequest(`/repos/${name}/git/trees/${commits[0].sha}?recursive=1`, (err, treeData) => {
        if (err) {
          console.warn(`getting latest commit failed with err ${err}`);
        } else {
          cb(treeData.tree.reduce((files, treeElem) => {
            files[treeElem.path] = GHFile(name, treeElem.path);
            return files;
          }, {}));
        }
      });
    }
  });
}

export const GHFile = (repoName, filePath) => config => {
  if (config.getData) {
    makeGHRequest(`/repos/${repoName}/contents/${filePath}`, (err, file) => {
      if (err) {
        console.warn(`getting file failed with err ${err}`);
      } else {
        config.getData(new Buffer(file.content, 'base64').toString());
      }
	  });
  }
}
