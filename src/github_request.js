const https = require('https')
const url = require('url')

const getPayload = (response, cb) => {
  let data = ''
  response.on('data', chunk => data += chunk)
  response.on('end', () => {
    const { statusCode } = response
    const payload = JSON.parse(data)
    if (statusCode !== 200) {
      cb({ statusCode, payload })
    } else cb(null, payload)
  })
}

const errMessage = ({ statusCode, payload }, path) =>
  `Request to ${path} failed with ${statusCode}.\n ${JSON.stringify(payload)}`

const httpsRequest = (options, cb) => {
  const request = https.request(options, (response) => {
    getPayload(response, (err, res) => {
      if (err) {
        const { statusCode, paylaod } = err
        cb(new Error(errMessage(err, options.path)))
      } else cb(null, res)
    })
  })
  request.on('error', cb)
  request.end()
}

const requestOptions = (token, path) => ({
  host: 'api.github.com',
  path: `${path}`,
  method: 'GET',
  protocol: 'https:',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10.8 rv:24.0)' +
      ' Gecko/20100101 Firefox/24.0',
    'Authorization': 'token '+ token
  }
})

const makeGHRequest = (path, token, cb) =>
  httpsRequest(requestOptions(token, path), cb)

module.exports = makeGHRequest
