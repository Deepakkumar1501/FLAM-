(function(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let drawing=false, points=[], color='#000', size=4, tool='brush';

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    redrawAll();
  }
  window.addEventListener('resize', resize);
  resize();

  function drawPoints(pts, strokeColor, strokeWidth){
    if(!pts || pts.length===0) return;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = strokeColor; ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  canvas.addEventListener('pointerdown', e => {
    drawing=true; points=[ [e.offsetX, e.offsetY] ];
  });
  canvas.addEventListener('pointermove', e => {
    if(!drawing) return;
    points.push([e.offsetX,e.offsetY]);
    drawPoints(points.slice(-2), color, size);
  });
  canvas.addEventListener('pointerup', e => {
    if(!drawing) return;
    drawing=false;
    WS.send({type:'stroke', payload:{color:color, width:size, points:points, tool:tool}});
    points=[];
  });

  WS.on(msg => {
    if(msg.type === 'stroke'){
      const p = msg.payload;
      drawPoints(p.points, p.color, p.width);
    }
    if(msg.type === 'init_state'){
      msg.payload.ops.forEach(op => {
        if(op.type === 'stroke') drawPoints(op.payload.points, op.payload.color, op.payload.width);
      });
    }
  });

  function redrawAll(){ }

  window.CanvasApp = { setColor(c){ color=c }, setSize(s){ size=s }};
})();
