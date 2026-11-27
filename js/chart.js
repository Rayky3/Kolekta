/* Kolekta - chart.js : statistik koleksi (grafik pertumbuhan, angka ringkas, rekap per kategori) */
(async()=>{
  const items=await KolektaDB.getAll(),DAY=864e5,now=Date.now();
  const total=items.length,last30=items.filter(i=>now-i.createdAt<=30*DAY).length,before=total-last30;
  document.getElementById('total').textContent=total;
  document.getElementById('growth').textContent=before>0?'+'+Math.round(last30/before*100)+'%':'Baru';
  document.getElementById('last30').textContent=`+${last30} item dalam 30 hari terakhir`;
  const SHADES=['#8B7CF6','#A78BFA','#C4B5FD','#DDD6FE','#A8A8AD'];
  const byJenis={};items.forEach(i=>{const k=i.jenis||'Lainnya';byJenis[k]=(byJenis[k]||0)+1});
  const rows=Object.entries(byJenis).sort((a,b)=>b[1]-a[1]),max=rows[0]?rows[0][1]:1;
  document.getElementById('byJenis').innerHTML=rows.length?rows.map(([k,n],i)=>`<div class="bl"><span>${Util.esc(k)}</span><b>${n} item · ${Math.round(n/total*100)}%</b></div><div class="bar"><i style="width:${n/max*100}%;background:${SHADES[Math.min(i,4)]}"></i></div>`).join(''):'<p class="lb" style="margin-top:12px">Belum ada data.</p>';
  const foto=items.filter(i=>i.foto).length;
  document.getElementById('kKat').textContent=rows.length;
  document.getElementById('kFoto').textContent=total?Math.round(foto/total*100)+'%':'0%';
  document.getElementById('kBaru').textContent=last30;

  let range=30,pts=[];
  /* kurva halus Catmull-Rom -> bezier */
  function smooth(p){
    let d=`M${p[0][0]},${p[0][1]}`;
    for(let i=0;i<p.length-1;i++){
      const a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;
      const lo=Math.min(b[1],c[1]),hi=Math.max(b[1],c[1]),cl=y=>Math.min(hi,Math.max(lo,y));
      d+=` C${b[0]+(c[0]-a[0])/6},${cl(b[1]+(c[1]-a[1])/6)} ${c[0]-(e[0]-b[0])/6},${cl(c[1]-(e[1]-b[1])/6)} ${c[0]},${c[1]}`;
    }
    return d;
  }
  function draw(){
    const svg=document.getElementById('svg'),W=svg.clientWidth||300,H=150,N=7;
    pts=[];for(let i=0;i<N;i++){const t=now-(N-1-i)*range/(N-1)*DAY;pts.push({t,n:items.filter(x=>x.createdAt<=t).length})}
    const lo=Math.min(...pts.map(p=>p.n)),hi=Math.max(...pts.map(p=>p.n)),span=hi-lo||1;
    const xy=pts.map((p,i)=>[10+i/(N-1)*(W-20),hi===lo?H/2:H-14-(p.n-lo)/span*(H-34)]);
    const line=smooth(xy),last=xy[N-1];
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    svg.innerHTML=`<defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B5CF6" stop-opacity=".45"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></linearGradient><filter id="gl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter></defs>`
      +`<path d="${line} L${last[0]},${H} L${xy[0][0]},${H}Z" fill="url(#ga)"/><path d="${line}" fill="none" stroke="#A78BFA" stroke-width="3" stroke-linecap="round"/>`
      +`<circle cx="${last[0]}" cy="${last[1]}" r="9" fill="#8B5CF6" filter="url(#gl)"/><circle cx="${last[0]}" cy="${last[1]}" r="5" fill="#fff"/>`;
    document.getElementById('xl').innerHTML=[0,2,4,6].map(i=>`<span>${Util.shortDate(pts[i].t)}</span>`).join('');
  }
  document.getElementById('chips').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    document.querySelectorAll('#chips button').forEach(x=>x.classList.toggle('on',x===b));range=+b.dataset.r;draw();
  });
  window.addEventListener('resize',draw);
  draw();
})();