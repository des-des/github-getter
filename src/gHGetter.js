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
            getterConfig[key](err)
          } else {
            getterConfig[key](null, getterConfigMap[key](response, initParams))
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
      // console.log('commits!!!', commits);
      if (err) {
        // console.log('error!!!!!');
        cb(`getting latest commit failed with err ${err}`);
      } else {
        // console.log('getting tree!!!!');
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

// export const gHUser = (name, isOrg) => config => {
export const gHUser = gHGetter(
  ([name, isOrg], cb) => makeGHRequest(
    `/${isOrg ? `orgs` : `users`}/${name}/repos`,
    cb
  ),
  {
    getRepos: (repoDataArr, initParams) => (
      repoDataArr.reduce((repos, repoData) => {
        const repoName = repoData.full_name;
        repos[repoName.split('/')[1]] = gHRepo(repoName);
        return repos;
      }, {})
    )
  }
);


// export const gHRepo = gHGetter(
//   ([repoName, filePath]) => `/repos/${repoName}/contents/${filePath}`,
//   {
//     getData: fileData => new Buffer(fileData.content, 'base64').toString()
//   }
// );
//
// export const gHFile = (repoName, filePath) => config => {
//   if (config.getData) {
//     makeGHRequest(`/repos/${repoName}/contents/${filePath}`, (err, file) => {
//       if (err) {
//         config.getData(`getting file failed with error: ${err}`);
//       } else {
//         config.getData(null, new Buffer(file.content, 'base64').toString());
//       }
// 	  });
//   }
//   if (config.getConfig) {
//     config.getConfig({
//       repoName: repoName,
//       filePath: filePath
//     });
//   }
// };

// export const gHRepo = name => config => {
//   if (config.getReadme) {
//     config.getReadme(null, gHFile(name, 'README.md'));
//   }
//   if (config.getFiles) {
//     getTree(name, config.getFiles);
//   }
//   if (config.getConfig) {
//     config.getConfig({
//       repoName: name
//     });
//   }
// };

// const getTree = (name, cb) => {
//   makeGHRequest(`/repos/${name}/commits`, (err, commits) => {
//     if (err) {
//       cb(`getting latest commit failed with err ${err}`);
//     } else {
//       makeGHRequest(
//         `/repos/${name}/git/trees/${commits[0].sha}?recursive=1`,
//         (err, treeData) => {
//           if (err) {
//             cb(`getting tree failed with err ${err}`);
//           } else {
//             cb(null, treeData.tree.reduce((files, treeElem) => {
//               files[treeElem.path] = gHFile(name, treeElem.path);
//               return files;
//             }, {}));
//           }
//         }
//       );
//     }
//   });
// };

// export const gHUser = (name, isOrg) => config => {
//   const requestPath = `/${isOrg ? `orgs` : `users`}/${name}/repos`;
//   if (config.getRepos) {
//     makeGHRequest(requestPath, (err, repoDataArr) => {
//       if (err) {
//         config.getRepos(`getting repos failed with err ${err}`);
//       } else {
//         config.getRepos(null, repoDataArr.reduce((repos, repoData) => {
//           const repoName = repoData.full_name;
//           repos[repoName.split('/')[1]] = gHRepo(repoName);
//           return repos;
//         }, {}));
//       }
//     });
//   }
//   if (config.getConfig) {
//     config.getConfig({
//       name: name,
//       isOrg: isOrg
//     });
//   }
// };
