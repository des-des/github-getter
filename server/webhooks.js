var os = require('os');

var Hapi = require('hapi')

var port = process.env.PORT || 3000;
var server = new Hapi.Server();

server.connection({ port: port });

server.route({
  method: 'POST',
  path: '/webhook',
  handler: (request, reply) => {
    console.log('post');
    console.log(request.params);
    console.log(request.payload);
    reply('yo');
  }
});

server.start(function(){
  console.log('server listening on port', port);
});
