/* Kolekta - dashboard.js : ringkasan dan koleksi terbaru */
(async()=>{
  const items=await KolektaDB.getAll(),now=Date.now(),week=7*864e5;
  const jenis=new Set(items.map(i=>i.jenis||'Lainnya')).size;
  document.getElementById('totalText').textContent=items.length+' Item';
  const stats=[['archive',items.length,'Total Koleksi',''],['grid',jenis,'Kategori','solid'],['imgs',items.filter(i=>i.foto).length,'Dengan Foto',''],['fileplus',items.filter(i=>now-i.createdAt<week).length,'Baru Ditambahkan','']];
  document.getElementById('stats').innerHTML=stats.map(([ic,n,l,c])=>`<div class="stat"><div class="top"><span class="ic ${c}">${Util.icon(ic)}</span><b>${n}</b></div><span class="lbl">${l}</span></div>`).join('');
  const rec=document.getElementById('recent');
  rec.innerHTML=items.length?items.slice(0,2).map(i=>`<a class="item-row" href="detail-collection.html?id=${i.id}"><div class="thumb">${Util.photo(i)}</div><div><p class="nm">${Util.esc(i.nama)}</p><p>${Util.esc(i.jenis||'Lainnya')}</p><p>${Util.rupiah(i.harga)}</p><p>Ditambahkan baru-baru ini</p></div></a>`).join(''):'<p class="lb">Belum ada koleksi. Tambahkan koleksi pertamamu!</p>';
})();