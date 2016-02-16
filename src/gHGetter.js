import makeGHRequest from './gHRequest.js';
import httpsRequest from './httpsRequest.js';

const gHGetter = (makeRequest, getterConfigMap) => (...initParams) => {
  let err_, response_;
  let hasResponse = false;
  let configFuncCaller = false;
  makeRequest(initParams, (err, response) => {
    if (configFuncCaller) {
      configFuncCaller(err, response);
    } else {
      err_ = err;
      response_ = response;
      hasResponse = true;
    }
  });
  const gHGetter = getterConfig => {
    configFuncCaller = (err, response) => {
      Object.keys(getterConfigMap).forEach(key => {
        if (getterConfig[key]) {
          if (err) {
            getterConfig[key](err);
          } else {
            getterConfig[key](null, getterConfigMap[key](response, initParams));
          }
        }
      });
    }
    if (hasResponse) {
      configFuncCaller(err_, response_)
    }
  }
  gHGetter.initParams = initParams;
  return gHGetter;
};

export const gHFile = gHGetter(
  ([repoName, filePath], cb) => (
    makeGHRequest(`/repos/${repoName}/contents/${filePath}`, cb)
  ),
  {
    getData: fileData => new Buffer(fileData.content, 'base64').toString()
  }
);

export const gHRepo = gHGetter(
  ([name], cb) => (
    makeGHRequest(`/repos/${name}/commits`, (err, commits) => {
      if (err) {
        cb(err);
      } else {
        makeGHRequest(
          `/repos/${name}/git/trees/${commits[0].sha}?recursive=1`, cb
        );
      }
    })
  ),
  {
    getFiles: (treeData, initParams) => treeData.tree.reduce((files, treeElem) => {
      files[treeElem.path] = gHFile(initParams[0], treeElem.path);
      return files;
    }, {}),
    getReadme: (treeData, initParams) => gHFile(initParams[0], 'README.md')
  }
);

export const gHUser = gHGetter(
  ([name, isOrg], cb) => makeGHRequest(
    `/${isOrg ? `orgs` : `users`}/${name}/repos`,
    cb
  ),
  {
    getRepos: (repoDataArr, initParams) => (
      repoDataArr.reduce((repos, repoData) => {
        const repoName = repoData.full_name.split('/')[1];
        repos[repoName] = gHRepo(repoName);
        return repos;
      }, {})
    )
  }
);
