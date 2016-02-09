import os from 'os';

import Hapi from 'hapi'

var port = process.env.PORT || 3000;
var server = new Hapi.Server();

server.connection({ port: port });

server.register(function (err) {
  server.route({
    method: 'POST',
    path: '/{param*}',
    handler: (request, reply) => {
      console.log('post');
      console.log(request.params);
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: (request, reply) => {
      console.log('get');
      console.log(request.params);
    }
  });
});

server.start(function(){
  console.log('server listening on port', port);
});



// credit: http://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);
