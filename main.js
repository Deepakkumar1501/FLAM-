WS.connect();
const c = document.getElementById('color');
const s = document.getElementById('size');
const er = document.getElementById('eraser');

c.addEventListener('input', e => window.CanvasApp.setColor(e.target.value));
s.addEventListener('input', e => window.CanvasApp.setSize(e.target.value));
er.addEventListener('click', ()=>{ window.CanvasApp.setColor('#ffffff'); });

WS.send({type:'join_room', payload:{roomId:'default'}});
