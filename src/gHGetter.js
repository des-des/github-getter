import makeGHRequest from './gHRequest.js';
import httpsRequest from './httpsRequest.js';

export const gHFile = (repoName, filePath) => config => {
  if (config.getData) {
    makeGHRequest(`/repos/${repoName}/contents/${filePath}`, (err, file) => {
      if (err) {
        config.getData(`getting file failed with error: ${err}`);
      } else {
        config.getData(null, new Buffer(file.content, 'base64').toString());
      }
	  });
  }
  if (config.getConfig) {
    config.getConfig({
      repoName: repoName,
      filePath: filePath
    });
  }
};

export const gHRepo = name => config => {
  if (config.getReadme) {
    config.getReadme(null, gHFile(name, 'README.md'));
  }
  if (config.getFiles) {
    getTree(name, config.getFiles);
  }
  if (config.getConfig) {
    config.getConfig({
      repoName: name
    });
  }
};

const getTree = (name, cb) => {
  makeGHRequest(`/repos/${name}/commits`, (err, commits) => {
    if (err) {
      cb(`getting latest commit failed with err ${err}`);
    } else {
      makeGHRequest(
        `/repos/${name}/git/trees/${commits[0].sha}?recursive=1`,
        (err, treeData) => {
          if (err) {
            cb(`getting tree failed with err ${err}`);
          } else {
            cb(null, treeData.tree.reduce((files, treeElem) => {
              files[treeElem.path] = gHFile(name, treeElem.path);
              return files;
            }, {}));
          }
        }
      );
    }
  });
};

export const gHUser = (name, isOrg) => config => {
  const requestPath = `/${isOrg ? `orgs` : `users`}/${name}/repos`;
  if (config.getRepos) {
    makeGHRequest(requestPath, (err, repoDataArr) => {
      if (err) {
        config.getRepos(`getting repos failed with err ${err}`);
      } else {
        config.getRepos(null, repoDataArr.reduce((repos, repoData) => {
          const repoName = repoData.full_name;
          repos[repoName.split('/')[1]] = gHRepo(repoName);
          return repos;
        }, {}));
      }
    });
  }
  if (config.getConfig) {
    config.getConfig({
      name: name,
      isOrg: isOrg
    });
  }
};
