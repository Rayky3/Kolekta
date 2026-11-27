/* Kolekta - dashboard.js : ringkasan (3 kartu bisa diklik) dan 5 koleksi terbaru */
(async()=>{
  const items=await KolektaDB.getAll(),now=Date.now(),week=7*864e5;
  const kat=new Set(items.map(i=>i.jenis||'Lainnya')).size;
  const foto=items.filter(i=>i.foto).length,baru=items.filter(i=>now-i.createdAt<week).length;
  document.getElementById('totalText').textContent=items.length+' Item';
  const card=(ic,n,l,href)=>{
    const inner=`<div class="top"><span class="ic">${Util.icon(ic)}</span><b>${n}</b></div><div class="bt"><span>${l}</span>${href?`<span class="go">${Util.icon('chev')}</span>`:''}</div>`;
    return href?`<a class="stat" href="${href}">${inner}</a>`:`<div class="stat nc">${inner}</div>`;
  };
  document.getElementById('stats').innerHTML=
    card('archive',items.length,'Total Koleksi','collection.html')+
    card('grid',kat,'Kategori','collection.html?filter=kategori')+
    card('imgs',foto,'Dengan Foto','collection.html?filter=foto')+
    card('fileplus',baru,'Baru Ditambahkan','');
  const rec=document.getElementById('recent');
  rec.innerHTML=items.length?items.slice(0,5).map(i=>`<a class="item-row" href="detail-collection.html?id=${i.id}"><div class="thumb">${Util.photo(i)}</div><div class="im"><p class="nm">${Util.esc(i.nama)}</p><span class="bd">${Util.esc(i.jenis||'Lainnya')}</span><p>${Util.rupiah(i.harga)}</p><p class="mu">${Util.longDate(i.createdAt)}</p></div></a>`).join(''):'<p class="lb">Belum ada koleksi. Tambahkan koleksi pertamamu!</p>';
})();