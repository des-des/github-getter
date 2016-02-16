var test = require('tape');
var nock = require('nock');

var nocks = require('./nocks');

var gHRepo = require('../src/gHGetter.js').gHRepo;

test('retrieving commit then tree then file', (t) => {
  var actual, expected;
  var repoName = 'test-repo';
  var filePath = 'test-path';
  var sha = 'test-sha';

  nocks.nockCommitRequest(repoName, sha, 200);
  nocks.nockTreeRequest(repoName, sha, filePath, 200);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      expected = [repoName, filePath];
      actual = fileData[filePath].initParams;
      t.deepEqual(actual, expected, 'returned file has correct repo and path');
      t.end();
    }
  });
});

test('retrieving commit then checking response fails correctly for tree', (t) => {
  var actual, expected;
  var repoName = 'test-repo';
  var testData = 'test-data';
  var sha      = 'test-sha';

  nocks.nockCommitRequest(repoName, sha, 200);
  nocks.nockTreeRequest(repoName, sha, 'README.md', 200);

  gHRepo(repoName)({
    getReadme: (err, readme) => {
      // readme({
        expected = [repoName, 'README.md'];
        actual = readme.initParams;
        t.deepEqual(actual, expected, 'returned file has correct repo and path');
        t.end();
    }
  });
});

test('retrieving commit then checking response fails correctly for tree', (t) => {
  var expected;
  var repoName = 'test-repo';
  var filePath = 'test-path';
  var sha = 'test-sha';

  nocks.nockCommitRequest(repoName, sha, 200);
  nocks.nockTreeRequest(repoName, sha, filePath, 404);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      expected = 'status code not 200';
      t.equal(err, expected, 'correct error passed');
      t.end();
    }
  });
});

test('checking response fails correctly for commit', (t) => {
  var expected;
  var repoName = 'test-repo';
  var sha = 'test-sha';

  nocks.nockCommitRequest(repoName, sha, 404);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      expected = 'status code not 200';
      t.equal(err, expected, 'correct error passed');
      t.end();
    }
  });
});
