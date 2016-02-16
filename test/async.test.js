var test = require('tape');

var nocks = require('./nocks');

var gHFile = require('../src/gHGetter.js').gHFile;

test('testing async behavior of getters', (t) => {
  var testData = 'test data';
  var repoName = 'test-repo';
  var fileName = 'test-file-name';

  nocks.nockFileRequest(repoName, fileName, 200, testData);

  var fileHandle = gHFile(repoName, fileName)
  setTimeout(() => fileHandle({
    getData: (err, fileData) => {
      t.ok(!err, 'no error passed');
      t.equal(fileData, testData, 'corrent data received');
      t.end();
    }
  }), 100);
});
