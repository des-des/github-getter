var test = require('tape');
var nock = require('nock');

var nocks = require('./nocks');

var gHRepo = require('../lib/gHGetter.js').gHRepo;

test('retrieving commit then tree then file', (t) => {
  var expected;
  var repoName = 'test-repo';
  var filePath = 'test-path';
  var sha = 'test-sha'

  nocks.nockCommitRequest(repoName, sha, 200);
  nocks.nockTreeRequest(repoName, sha, filePath, 200);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      fileData[filePath]({
        getConfig: config => {
          t.equal(config.filePath, filePath, 'correct file path');
          t.equal(config.repoName, repoName, 'correct repo name');
          t.end();
        }
      });
    }
  });
});

test('retrieving commit then checking response fails correctly for tree', (t) => {
  var expected;
  var repoName = 'test-repo';
  var testData = 'test-data';

  gHRepo(repoName)({
    getReadme: (err, readme) => {
      readme({
        getConfig: config => {
          t.equal(config.filePath, 'README.md', 'correct file path');
          t.equal(config.repoName, repoName, 'correct repo name');
          t.end();
        }
      })
    }
  });
});

test('retrieving commit then checking response fails correctly for tree', (t) => {
  var expected;
  var repoName = 'test-repo';
  var filePath = 'test-path';
  var sha = 'test-sha'

  nocks.nockCommitRequest(repoName, sha, 200);
  nocks.nockTreeRequest(repoName, sha, filePath, 404);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      expected = 'getting tree failed with err status code not 200';
      t.equal(err, expected, 'correct error passed')
      t.end();
    }
  });
});

test('retrieving commit then checking response fails correctly for tree', (t) => {
  var expected;
  var repoName = 'test-repo';
  var sha = 'test-sha'

  nocks.nockCommitRequest(repoName, sha, 404);

  gHRepo(repoName)({
    getFiles: (err, fileData) => {
      expected = 'getting latest commit failed with err status code not 200';
      t.equal(err, expected, 'correct error passed')
      t.end();
    }
  });
});