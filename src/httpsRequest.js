import https from 'https';

const httpsRequest = (path, cb) => {
  // console.log('>>>>', path);
  const request = https.request(path, (response) => {
    getBody(response, function(err, body) {
      cb(err, body);
    });
  });
  request.on('error', console.warn);
  request.end();
};

const getBody = (response, cb) => {
  let body = '';
  if (response.statusCode !== 200) {
    console.log(`STATUS: ${response.statusCode}`);
    cb('status code not 200');
  } else {
    response.on('data', chunk => body += chunk);
    response.on('end', () => cb(null, body));
    response.on('error', console.warn);
  }
};

export default httpsRequest;
