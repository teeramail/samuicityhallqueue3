const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const stream = require('./db');
wss.on('connection', function connection(ws) {
  stream.on("change", (change) => {
    console.log("Change detected on Onboardlandnums numland:", change);
    ws.send(change);
  });
});
