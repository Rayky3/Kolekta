/* Kolekta - dashboard.js : ringkasan dan koleksi terbaru */
(async()=>{
  const items=await KolektaDB.getAll(),now=Date.now(),week=7*864e5;
  const jenis=new Set(items.map(i=>i.jenis||'Lainnya')).size;
  document.getElementById('totalText').textContent=items.length+' Item';
  const stats=[['grid',items.length,'Total Koleksi'],['tag',jenis,'Kategori'],['img',items.filter(i=>i.foto).length,'Dengan Foto'],['plus',items.filter(i=>now-i.createdAt<week).length,'Baru Ditambahkan']];
  document.getElementById('stats').innerHTML=stats.map(([ic,n,l])=>`<div class="card stat"><div class="ic">${Util.icon(ic)}</div><div><b>${n}</b><span>${l}</span></div></div>`).join('');
  const rec=document.getElementById('recent');
  rec.innerHTML=items.length?items.slice(0,2).map(i=>`<a class="card item-row" href="detail-collection.html?id=${i.id}"><div class="thumb">${Util.photo(i)}</div><div><p class="name">${Util.esc(i.nama)}</p><p>${Util.esc(i.jenis||'Lainnya')}</p><p>${Util.rupiah(i.harga)}</p><p>Ditambahkan baru-baru ini</p></div></a>`).join(''):'<p class="lb">Belum ada koleksi. Tambahkan koleksi pertamamu!</p>';
})();