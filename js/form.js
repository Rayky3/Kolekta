/* Kolekta - form.js : tambah koleksi (foto kamera/galeri + pangkas, validasi, simpan ke IndexedDB) */
(()=>{
  const form=document.getElementById('form'),photoBtn=document.getElementById('photoBtn');
  let dirty=false,foto=null;
  window.KolektaGuard=()=>dirty;
  form.addEventListener('input',()=>{dirty=true;document.getElementById('errNama').hidden=true});
  document.getElementById('backBtn').onclick=()=>dirty?confirmLeave('collection.html'):location.href='collection.html';
  window.addEventListener('beforeunload',e=>{if(window.KolektaGuard&&dirty){e.preventDefault();e.returnValue=''}});
  photoBtn.onclick=()=>{
    const m=Util.modal(`<h2>Pilih Sumber Gambar</h2><button class="src-btn" id="srcCam" type="button"><span class="circ">${Util.icon('cam')}</span>Kamera</button><button class="src-btn" id="srcGal" type="button"><span class="circ">${Util.icon('gal')}</span>Galeri</button>`,true);
    m.el.querySelector('#srcCam').onclick=()=>{m.close();document.getElementById('fileCamera').click()};
    m.el.querySelector('#srcGal').onclick=()=>{m.close();document.getElementById('fileGallery').click()};
  };
  ['fileCamera','fileGallery'].forEach(id=>document.getElementById(id).addEventListener('change',async e=>{
    const f=e.target.files[0];e.target.value='';if(!f)return;
    const b=await KolektaCrop.open(f);if(!b)return;
    foto=b;dirty=true;photoBtn.innerHTML=`<img src="${URL.createObjectURL(b)}" alt="Foto koleksi">`;
  }));
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form).entries());
    if(!d.nama.trim()){document.getElementById('errNama').hidden=false;form.nama.focus();return}
    try{
      await KolektaDB.add({nama:d.nama.trim(),merk:d.merk.trim(),seri:d.seri.trim(),jenis:'Lainnya',harga:d.harga.replace(/\D/g,''),tanggal:d.tanggal,kondisi:d.kondisi.trim(),tempat:d.tempat.trim(),foto});
      dirty=false;sessionStorage.setItem('toast','Koleksi berhasil disimpan');location.href='collection.html';
    }catch(err){Util.toast('Gagal menyimpan koleksi')}
  });
})();