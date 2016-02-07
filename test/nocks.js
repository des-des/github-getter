var nock = require('nock');

var nockFileRequest = (repoName, fileName, responseCode, responseData) => {
  nock('https://api.github.com')
    .get('/repos/' + repoName + '/contents/' + fileName)
    .reply(responseCode, typeof responseData !== 'undefined' ? {
      content: new Buffer(responseData).toString('base64')
    } : '');
};

var nockCommitRequest = (repoName, sha, statusCode) => {
  nock('https://api.github.com')
    .get('/repos/' +  repoName + '/commits')
    .reply(statusCode, [{
      sha: sha
    }]);
};

var nockTreeRequest = (repoName, sha, filePath, statusCode) => {
  nock('https://api.github.com')
    .get('/repos/' +  repoName + '/git/trees/' + sha + '?recursive=1')
    .reply(statusCode, {
      tree: [
        {
          path: filePath
        }
      ]
    });
};

var nockUserRequest = (name, isOrg, repoName, statusCode) => {
  nock('https://api.github.com')
    .get('/' + (isOrg ? 'orgs' : 'users') + '/' + name + '/repos')
    .reply(statusCode, [{
      full_name: name + '/' + repoName
    }]);
};

module.exports = {
  nockFileRequest: nockFileRequest,
  nockCommitRequest: nockCommitRequest,
  nockTreeRequest: nockTreeRequest,
  nockUserRequest: nockUserRequest
};
