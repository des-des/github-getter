var test = require('tape');
var nock = require('nock');

var nocks = require('./nocks');

var gHFile = require('../lib/gHGetter.js').gHFile;

test('ghFile requests and recieves file data', (t) => {
  var testData = 'test data';
  var repoName = 'test-repo';
  var fileName = 'test-file-name';

  nocks.nockFileRequest(repoName, fileName, 200, testData);

  gHFile(repoName, fileName)({
    getData: (err, fileData) => {
      t.ok(!err, 'no error passed');
      t.equal(fileData, testData, 'corrent data received');
      t.end();
    }
  });
});

test('ghFile requests handles bad file path', (t) => {
  var expected;
  var testData = 'test data';
  var repoName = 'test-repo';
  var fileName = 'test-file-name';

  nocks.nockFileRequest(repoName, fileName, 404, testData);


  gHFile(repoName, fileName)({
    getData: (err, fileData) => {
      expected = 'getting file failed with error: status code not 200';
      t.equal(err, expected, 'corrent data received');
      t.end();
    }
  });
});
