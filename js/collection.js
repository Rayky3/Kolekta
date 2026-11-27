/* Kolekta - collection.js : daftar koleksi (filter + badge kategori), detail, dan hapus koleksi */
(async()=>{
  const page=document.body.dataset.page,$=id=>document.getElementById(id);
  if(page==='collection'){
    const all=await KolektaDB.getAll(),q=new URLSearchParams(location.search);
    const grid=$('grid'),empty=$('empty'),noMatch=$('noMatch'),fbar=$('fbar');
    let mode=q.get('filter')==='foto'?'foto':(q.get('kategori')?'kategori':'all'),cat=q.get('kategori')||null;
    const cnt={};all.forEach(i=>{const k=i.jenis||'Lainnya';cnt[k]=(cnt[k]||0)+1});
    const cats=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]);
    const nFoto=all.filter(i=>i.foto).length;
    const view=()=>mode==='foto'?all.filter(i=>i.foto):(mode==='kategori'&&cat?all.filter(i=>(i.jenis||'Lainnya')===cat):all);
    function render(){
      const list=view();
      empty.hidden=all.length>0;noMatch.hidden=!(all.length&&!list.length);grid.hidden=!list.length;
      grid.innerHTML=list.map(i=>`<a class="gcard" href="detail-collection.html?id=${i.id}"><div class="thumb">${Util.photo(i)}</div><p class="nm">${Util.esc(i.nama)}</p><span class="bd">${Util.esc(i.jenis||'Lainnya')}</span><u>Detail Lengkap!</u></a>`).join('');
      fbar.hidden=!all.length;
      const label=mode==='foto'?`Dengan Foto · ${list.length}`:(mode==='kategori'?`${Util.esc(cat)} · ${list.length}`:`Semua · ${all.length}`);
      fbar.innerHTML=`<button class="fchip${mode==='all'?'':' act'}" id="fBtn" type="button" data-a="toggle" aria-haspopup="true" aria-expanded="false">${label}<span style="transform:rotate(90deg);display:grid">${Util.icon('chev')}</span></button>${mode==='all'?'':'<button class="fx" type="button" data-a="reset" aria-label="Hapus filter">✕</button>'}<div class="menu" hidden><button type="button" data-a="foto">${Util.icon('imgs')}Dengan Foto<small>${nFoto}</small></button><button type="button" data-a="kat">${Util.icon('grid')}Kategori<small>${cats.length}</small>${Util.icon('chev')}</button></div>`;
    }
    function openSheet(){
      let pick=mode==='kategori'?cat:null;
      const m=Util.modal(`<h2>Pilih Kategori</h2><div id="opts"></div><div class="sheet-acts"><button class="b-line" id="kReset" type="button">Reset</button><button class="b-main" id="kOk" type="button">Terapkan</button></div>`,true);
      const opts=m.el.querySelector('#opts');
      const paint=()=>{opts.innerHTML=cats.map(k=>`<button type="button" class="opt${k===pick?' on':''}" data-k="${Util.esc(k)}">${Util.esc(k)}<small>${cnt[k]} item</small><i>${k===pick?Util.icon('check'):''}</i></button>`).join('')};
      paint();
      opts.onclick=e=>{const b=e.target.closest('.opt');if(!b)return;pick=b.dataset.k;paint()};
      m.el.querySelector('#kReset').onclick=()=>{mode='all';cat=null;m.close();render()};
      m.el.querySelector('#kOk').onclick=()=>{if(pick){mode='kategori';cat=pick}m.close();render()};
    }
    fbar.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;
      if(a==='toggle'){const m=fbar.querySelector('.menu');m.hidden=!m.hidden;b.classList.toggle('open',!m.hidden);b.setAttribute('aria-expanded',String(!m.hidden))}
      else if(a==='foto'){mode='foto';cat=null;render()}
      else if(a==='kat'){render();openSheet()}
      else if(a==='reset'){mode='all';cat=null;render()}
    });
    document.addEventListener('click',e=>{
      if(fbar.contains(e.target))return;
      const m=fbar.querySelector('.menu');if(m&&!m.hidden){m.hidden=true;$('fBtn').classList.remove('open')}
    });
    render();
    if(q.get('filter')==='kategori'&&all.length)openSheet();
  }
  if(page==='detail'){
    const id=new URLSearchParams(location.search).get('id'),box=$('detail');
    const i=id&&await KolektaDB.get(id);
    if(!i){box.innerHTML='<p class="lb">Koleksi tidak ditemukan.</p>';return}
    const f=(l,v,full)=>`<div class="f${full?' full':''}">${l}<div class="val">${Util.esc(v)||'-'}</div></div>`;
    box.innerHTML=`<div class="photo-view">${Util.photo(i)}</div><div class="rt"><div class="fields">${f('Nama',i.nama,1)+f('Kategori',i.jenis||'Lainnya',1)+f('Merk',i.merk)+f('Seri (Jika ada)',i.seri)+f('Harga Beli (Rp)',Util.rupiah(i.harga))+f('Tanggal Beli',Util.tgl(i.tanggal))+f('Kondisi',i.kondisi)+f('Tempat Beli',i.tempat)}</div><a class="btn" href="edit-collection.html?id=${id}">EDIT KOLEKSI</a><button class="btn danger" id="delBtn" type="button">HAPUS KOLEKSI</button></div>`;
    $('delBtn').onclick=()=>{
      const m=Util.modal(`<p>Apakah anda yakin ingin menghapus koleksi ini?</p><div class="acts"><button class="b-white" id="delNo" type="button">Batal</button><button class="b-dark" id="delYes" type="button">Yakin</button></div>`);
      m.el.querySelector('#delNo').onclick=m.close;
      m.el.querySelector('#delYes').onclick=async()=>{
        await KolektaDB.remove(id);sessionStorage.setItem('toast','Koleksi berhasil dihapus');location.href='collection.html';
      };
    };
  }
})();