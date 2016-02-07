import https from 'https';
import url from 'url';

import httpsRequest from './httpsRequest.js'

require('env2')('./config.env');

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

export default makeGHRequest;
