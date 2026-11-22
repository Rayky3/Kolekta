/* Kolekta - edit.js : ubah koleksi (isi form dari data lama, simpan lewat KolektaDB.update) */
(async()=>{
  const id=new URLSearchParams(location.search).get('id');
  const form=document.getElementById('form'),photoBtn=document.getElementById('photoBtn');
  const item=id&&await KolektaDB.get(id);
  if(!item){form.innerHTML='<p class="lb">Koleksi tidak ditemukan.</p>';return}

  const back='detail-collection.html?id='+id;
  let dirty=false,foto=item.foto||null;
  window.KolektaGuard=()=>dirty;

  /* isi form dengan data lama */
  ['nama','merk','seri','harga','tanggal','kondisi','tempat'].forEach(k=>{form[k].value=item[k]||''});
  if(foto)photoBtn.innerHTML=`<img src="${URL.createObjectURL(foto)}" alt="Foto koleksi">`;

  form.addEventListener('input',()=>{dirty=true;document.getElementById('errNama').hidden=true});
  document.getElementById('backBtn').onclick=()=>dirty?confirmLeave(back):location.href=back;
  window.addEventListener('beforeunload',e=>{if(window.KolektaGuard&&dirty){e.preventDefault();e.returnValue=''}});

  photoBtn.onclick=()=>{
    const m=Util.modal(`<h2>Pilih Sumber Gambar</h2><button class="src-btn" id="srcCam" type="button"><span class="circ">${Util.icon('cam')}</span>Kamera</button><button class="src-btn" id="srcGal" type="button"><span class="circ">${Util.icon('gal')}</span>Galeri</button>`,true);
    m.el.querySelector('#srcCam').onclick=()=>{m.close();document.getElementById('fileCamera').click()};
    m.el.querySelector('#srcGal').onclick=()=>{m.close();document.getElementById('fileGallery').click()};
  };
  ['fileCamera','fileGallery'].forEach(fid=>document.getElementById(fid).addEventListener('change',async e=>{
    const f=e.target.files[0];e.target.value='';if(!f)return;
    const b=await KolektaCrop.open(f);if(!b)return;
    foto=b;dirty=true;photoBtn.innerHTML=`<img src="${URL.createObjectURL(b)}" alt="Foto koleksi">`;
  }));

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form).entries());
    if(!d.nama.trim()){document.getElementById('errNama').hidden=false;form.nama.focus();return}
    try{
      await KolektaDB.update({...item,nama:d.nama.trim(),merk:d.merk.trim(),seri:d.seri.trim(),harga:d.harga.replace(/\D/g,''),tanggal:d.tanggal,kondisi:d.kondisi.trim(),tempat:d.tempat.trim(),foto});
      dirty=false;sessionStorage.setItem('toast','Perubahan berhasil disimpan');location.href=back;
    }catch(err){Util.toast('Gagal menyimpan perubahan')}
  });
})();