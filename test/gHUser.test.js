var test = require('tape');
var nock = require('nock');

var nocks = require('./nocks');

var gHUser = require('../src/gHGetter.js').gHUser;

test('ghUser requests and recieves file data', (t) => {
  var userName = 'test-user-name';
  var repoName = 'test-repo-name';
  var actual, expected;

  nocks.nockUserRequest(userName, false, repoName, 200);

  gHUser(userName)({
    getRepos: (err, repoData) => {
      t.ok(!err, 'no error passed');
      actual   = repoData[repoName].initParams[0];
      expected = repoName;
      t.equal(actual, expected, 'correct params');
      t.end();
    }
  });
});

test('ghUser requests and recieves file data for org', (t) => {
  var userName = 'test-user-name1';
  var repoName = 'test-repo-name1';
  var actual, expected;

  nocks.nockUserRequest(userName, true, repoName, 200);

  gHUser(userName, true)({
    getRepos: (err, repoData) => {
      t.ok(!err, 'no error passed');
      actual   = repoData[repoName].initParams[0];
      expected = repoName;
      t.equal(actual, expected, 'correct params');
      t.end();
    }
  });
});
