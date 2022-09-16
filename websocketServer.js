const ws = require('ws');

const PORT = 7071;

const server = new ws.Server({ port: PORT });

const publicIdToSubscribers = {};

server.on('connection', websocket => {
  console.log('connection event');
  console.log();

  websocket.on('message', message => {
    console.log('message event');
    console.log('message:');
    console.log(JSON.parse(message));
    console.log();

    const { type, publicId } = JSON.parse(message);

    if (type === 'new_subscriber') {
      if (publicIdToSubscribers[publicId] === undefined) {
        publicIdToSubscribers[publicId] = [websocket];
      } else {
        publicIdToSubscribers[publicId].push(websocket);
      }

      websocket.on('close', () => {
        publicIdToSubscribers[publicId] = publicIdToSubscribers[publicId].filter(subscriber => {
          subscriber !== websocket;
        });
      });

      return;
    }

    if (type === 'new_request') {
      (publicIdToSubscribers[publicId] || []).forEach(subscriber => {
        subscriber.send();
      });

      return;
    }
  })

  websocket.on('close', () => {
    console.log('close event');
    console.log();
  })
});

console.log(`Websocket server listening on port ${PORT}...`);
