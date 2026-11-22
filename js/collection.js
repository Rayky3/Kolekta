/* Kolekta - collection.js : daftar koleksi, detail koleksi, dan hapus koleksi */
(async()=>{
  const page=document.body.dataset.page;
  if(page==='collection'){
    const items=await KolektaDB.getAll(),grid=document.getElementById('grid'),empty=document.getElementById('empty');
    empty.hidden=items.length>0;grid.hidden=!items.length;
    grid.innerHTML=items.map(i=>`<a class="gcard" href="detail-collection.html?id=${i.id}"><div class="thumb">${Util.photo(i)}</div><p class="nm">${Util.esc(i.nama)}</p><p class="kind">${Util.esc(i.jenis||'Lainnya')}</p><u>Detail Lengkap!</u></a>`).join('');
  }
  if(page==='detail'){
    const id=new URLSearchParams(location.search).get('id'),box=document.getElementById('detail');
    const i=id&&await KolektaDB.get(id);
    if(!i){box.innerHTML='<p class="lb">Koleksi tidak ditemukan.</p>';return}
    const f=(l,v,full)=>`<div class="f${full?' full':''}">${l}<div class="val">${Util.esc(v)||'-'}</div></div>`;
    box.innerHTML=`<div class="photo-view">${Util.photo(i)}</div><div class="rt"><div class="fields">${f('Nama',i.nama,1)+f('Merk',i.merk)+f('Seri (Jika ada)',i.seri)+f('Harga Beli (Rp)',Util.rupiah(i.harga))+f('Tanggal Beli',Util.tgl(i.tanggal))+f('Kondisi',i.kondisi)+f('Tempat Beli',i.tempat)}</div><a class="btn" href="edit-collection.html?id=${id}">EDIT KOLEKSI</a><button class="btn danger" id="delBtn" type="button">HAPUS KOLEKSI</button></div>`;
    document.getElementById('delBtn').onclick=()=>{
      const m=Util.modal(`<p>Apakah anda yakin ingin menghapus koleksi ini?</p><div class="acts"><button class="b-white" id="delNo" type="button">Batal</button><button class="b-dark" id="delYes" type="button">Yakin</button></div>`);
      m.el.querySelector('#delNo').onclick=m.close;
      m.el.querySelector('#delYes').onclick=async()=>{
        await KolektaDB.remove(id);sessionStorage.setItem('toast','Koleksi berhasil dihapus');location.href='collection.html';
      };
    };
  }
})();