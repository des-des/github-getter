import https from 'https';
import url from 'url';

import httpsRequest from './httpsRequest.js'

require('env2')('./config.env');

const getBody = (res, cb) => {
  let body = '';
  if (res.statusCode !== 200) {
    console.log(`STATUS: ${res.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    cb('status code not 200');
  } else {
    res.on('data', chunk => body += chunk);
    res.on('end', () => cb(null, JSON.parse(body)));
    res.on('error', console.warn);
  }
};

const makeGHRequest = (path, cb) => httpsRequest(requestOptions(path), (err, body) => (
  cb(err, err ? null : JSON.parse(body))
));

const requestOptions = path => ({
  host: 'api.github.com',
  path: `${path}`,
  method: 'GET',
  protocol: 'https:',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Authorization': 'token '+ process.env.ghtoken
  }
});

// makeGHRequest('/orgs/des-des/repos', () => console.log('done'));

export default makeGHRequest;
