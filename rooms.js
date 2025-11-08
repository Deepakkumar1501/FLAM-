const rooms = new Map();

function addClient(roomId, ws){
  if(!rooms.has(roomId)) rooms.set(roomId, []);
  const clients = rooms.get(roomId);
  const clientObj = {ws};
  clients.push(clientObj);
  return clientObj;
}
function getClients(roomId){
  return rooms.get(roomId) || [];
}

module.exports = { addClient, getClients };
