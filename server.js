const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const rooms = require('./rooms');
const drawingState = require('./drawing-state');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

app.use(express.static(path.join(__dirname, '..', 'client')));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let msg;
    try { msg = JSON.parse(message); } catch(e) { return; }
    handleMessage(ws, msg);
  });
});

function broadcastToRoom(roomId, except, msg){
  const clients = rooms.getClients(roomId);
  clients.forEach(client => {
    if(client.ws && client.ws.readyState === WebSocket.OPEN && client !== except){
      client.ws.send(JSON.stringify(msg));
    }
  });
}

function handleMessage(ws, msg){
  switch(msg.type){
    case 'join_room': {
      const roomId = msg.payload.roomId || 'default';
      rooms.addClient(roomId, ws);
      const ops = drawingState.getOps(roomId);
      ws.send(JSON.stringify({type:'init_state', payload:{ops}}));
      break;
    }
    case 'stroke': {
      const roomId = 'default';
      const op = {id: Date.now() + '-' + Math.random(), type:'stroke', payload: msg.payload};
      drawingState.appendOp(roomId, op);
      broadcastToRoom(roomId, null, {type:'stroke', payload: op.payload});
      break;
    }
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log('listening', PORT));
