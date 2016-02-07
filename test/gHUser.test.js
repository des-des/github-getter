var test = require('tape');
var nock = require('nock');

var nocks = require('./nocks');

var gHUser = require('../lib/gHGetter.js').gHUser;

test('ghFile requests and recieves file data', (t) => {
  var repoName = 'test-repo';
  var userName = 'test-user-name';
  nocks.nockUserRequest(userName, false, repoName, 200);

  gHUser(userName)({
    getRepos: (err, fileData) => {
      t.ok(!err, 'no error passed');
      fileData['test-repo']({
        getConfig: config => {
          t.equal(config.repoName, 'test-user-name/test-repo', 'corrent data received');
          t.end();
        }
      })
    }
  });
});

test('ghUser config', (t) => {
  var userName = 'test-user-name';

  gHUser(userName)({
    getConfig: config => {
      t.equal(config.name, 'test-user-name', 'corrent data received');
      t.equal(config.isOrg, undefined, 'corrent data received');
      t.end();
    }
  });
});

test('ghFile requests and recieves file data', (t) => {
  var repoName = 'test-repo';
  var userName = 'test-user-name';
  nocks.nockUserRequest(userName, true, repoName, 200);

  gHUser(userName, true)({
    getRepos: (err, fileData) => {
      t.ok(!err, 'no error passed');
      fileData['test-repo']({
        getConfig: config => {
          t.equal(config.repoName, 'test-user-name/test-repo', 'corrent data received');
          t.end();
        }
      })
    }
  });
});

test('ghUser responds with correct error on 404', (t) => {
  var repoName = 'test-repo';
  var userName = 'test-user-name';
  nocks.nockUserRequest(userName, false, repoName, 404);

  gHUser(userName)({
    getRepos: (err, fileData) => {
      console.log('err >>>>>>>>>>>', err);
      t.equal(
        err,
        'getting repos failed with err status code not 200',
        'correct error passed'
      );
      t.end();
    }
  })
});
