const ws = require('ws');

const PORT = 7071;

const server = new ws.Server({ port: PORT });

server.on('connection', websocket => {
  console.log('connection event');
  console.log();

  websocket.on('message', message => {
    console.log('message event');
    console.log('message:');
    console.log(JSON.parse(message));
    console.log();
  })

  websocket.on('close', () => {
    console.log('close event');
    console.log();
  })
});

console.log(`Websocket server listening on port ${PORT}...`);
