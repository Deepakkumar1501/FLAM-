const WS = (function(){
  let socket;
  function connect(){
    socket = new WebSocket((location.protocol==='https:'?'wss':'ws') + '://' + location.host + '/ws');
    socket.onopen = () => console.log('ws open');
    socket.onclose = () => console.log('ws closed');
    socket.onerror = e => console.error('ws err', e);
  }
  function send(msg){
    if(socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(msg));
  }
  function on(cb){
    if(!socket) return;
    socket.onmessage = e => { try{ cb(JSON.parse(e.data)); } catch(err){ console.error('bad msg', err) }};
  }
  return {connect, send, on};
})();
