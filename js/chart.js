/* Kolekta - chart.js : grafik pertumbuhan koleksi dan rekap per jenis */
(async()=>{
  const items=await KolektaDB.getAll(),DAY=864e5,now=Date.now();
  const total=items.length,last30=items.filter(i=>now-i.createdAt<=30*DAY).length,before=total-last30;
  document.getElementById('total').textContent=total;
  document.getElementById('growth').textContent=before>0?'+'+Math.round(last30/before*100)+'%':'Baru';
  document.getElementById('last30').textContent=`+${last30} item dalam 30 hari terakhir`;
  const byJenis={};items.forEach(i=>{const k=i.jenis||'Lainnya';byJenis[k]=(byJenis[k]||0)+1});
  const rows=Object.entries(byJenis).sort((a,b)=>b[1]-a[1]),max=rows[0]?rows[0][1]:1;
  document.getElementById('byJenis').innerHTML=rows.length?rows.map(([k,n])=>`<div class="bl"><span>${Util.esc(k)}</span><b>${n}</b></div><div class="bar"><i style="width:${n/max*100}%"></i></div>`).join(''):'<p class="lb">Belum ada data.</p>';
  function draw(range){
    const N=7,pts=[];
    for(let i=0;i<N;i++){const t=now-(N-1-i)*range/(N-1)*DAY;pts.push({t,n:items.filter(x=>x.createdAt<=t).length})}
    const lo=Math.min(...pts.map(p=>p.n)),hi=Math.max(...pts.map(p=>p.n)),span=hi-lo||1;
    const xy=pts.map((p,i)=>[8+i/(N-1)*584,hi===lo?100:180-(p.n-lo)/span*160]);
    const line=xy.map(p=>p.join(',')).join(' ');
    document.getElementById('svg').innerHTML=[50,100,150].map(y=>`<line x1="0" x2="600" y1="${y}" y2="${y}" stroke="var(--ln)" vector-effect="non-scaling-stroke"/>`).join('')+`<polygon points="8,200 ${line} 592,200" fill="var(--pr)" opacity=".12"/><polyline points="${line}" fill="none" stroke="var(--pr)" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
    document.getElementById('xl').innerHTML=[0,2,4,6].map(i=>`<span>${Util.shortDate(pts[i].t)}</span>`).join('');
  }
  document.getElementById('chips').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    document.querySelectorAll('#chips button').forEach(x=>x.classList.toggle('on',x===b));draw(+b.dataset.r);
  });
  draw(30);
})();