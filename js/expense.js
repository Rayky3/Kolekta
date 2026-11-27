/* Kolekta - expense.js : statistik pengeluaran (dihitung dari harga beli dan tanggal beli) */
(async()=>{
  const items=await KolektaDB.getAll(),$=id=>document.getElementById(id);
  const ex=items.map(i=>({i,v:Number(String(i.harga||'0').replace(/\D/g,''))||0,t:Util.dateOf(i)})).filter(x=>x.v>0).sort((a,b)=>b.t-a.t);
  const now=new Date(),mk=d=>d.getFullYear()*12+d.getMonth();
  const sum=new Map();ex.forEach(x=>{const k=mk(new Date(x.t));sum.set(k,(sum.get(k)||0)+x.v)});
  const total=ex.reduce((s,x)=>s+x.v,0),cur=sum.get(mk(now))||0,prev=sum.get(mk(now)-1)||0;

  $('totalExp').textContent=Util.rp(total);
  if(ex.length){const o=new Date(ex[ex.length-1].t);$('since').textContent=`Sejak ${MONTHS[o.getMonth()]} ${o.getFullYear()}`}
  else $('since').textContent='Belum ada data';
  $('monthExp').textContent=Util.rp(cur);
  const pm=MONTHS[new Date(now.getFullYear(),now.getMonth()-1,1).getMonth()];
  if(prev>0){
    const p=Math.round((cur-prev)/prev*100);
    $('delta').innerHTML=`<span class="${p>=0?'up2':'dn'}">${p>=0?'▲':'▼'} ${Math.abs(p)}%</span> <span class="mu">vs ${pm}</span>`;
  }else $('delta').innerHTML=`<span class="mu">Belum ada data ${pm}</span>`;

  /* grafik batang 6 bulan terakhir */
  const ms=[];for(let k=5;k>=0;k--){const d=new Date(now.getFullYear(),now.getMonth()-k,1);ms.push({m:MONTHS[d.getMonth()],v:sum.get(mk(d))||0})}
  const mx=Math.max(...ms.map(x=>x.v),1);
  $('mbars').innerHTML=ms.map((x,i)=>`<div class="mb${i===5?' now':''}"><span>${Util.juta(x.v)}</span><i style="height:${x.v?Math.max(6,x.v/mx*110):2}px"></i><em>${x.m}</em></div>`).join('');

  /* rincian per kategori */
  const SHADES=['#8B7CF6','#A78BFA','#C4B5FD','#DDD6FE','#A8A8AD'],by={};
  ex.forEach(x=>{const k=x.i.jenis||'Lainnya';by[k]=(by[k]||0)+x.v});
  const rows=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  $('byKat').innerHTML=rows.length?rows.map(([k,v],i)=>`<div class="bl"><span>${Util.esc(k)}</span><b>${Util.rp(v)} · ${Math.round(v/total*100)}%</b></div><div class="bar"><i style="width:${v/rows[0][1]*100}%;background:${SHADES[Math.min(i,4)]}"></i></div>`).join(''):'<p class="lb" style="margin-top:12px">Belum ada data.</p>';

  /* riwayat transaksi */
  let all=false;
  function hist(){
    const list=all?ex:ex.slice(0,5);
    $('history').innerHTML=list.length?list.map(x=>{const d=new Date(x.t);return `<a class="tx" href="detail-collection.html?id=${x.i.id}"><div class="d"><b>${d.getDate()}</b>${MONTHS[d.getMonth()]}</div><div class="m"><p>${Util.esc(x.i.nama)}</p><span class="bd">${Util.esc(x.i.jenis||'Lainnya')}</span></div><b>${Util.rp(x.v)}</b></a>`}).join(''):'<p class="lb" style="padding:8px 0 14px">Belum ada pengeluaran. Isi harga beli saat menambah koleksi.</p>';
    $('moreTx').hidden=ex.length<=5;$('moreTx').textContent=all?'Tampilkan Sedikit':'Lihat Semua';
  }
  $('moreTx').onclick=()=>{all=!all;hist()};
  hist();
})();