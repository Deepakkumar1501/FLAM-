const logs = new Map();
function appendOp(roomId, op){
  if(!logs.has(roomId)) logs.set(roomId, []);
  logs.get(roomId).push(op);
}
function getOps(roomId){
  return logs.get(roomId) || [];
}
module.exports = { appendOp, getOps };
