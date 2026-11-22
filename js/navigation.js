/* Kolekta - navigation.js : satu markup navigasi, tampil bawah (mobile) atau sidebar (desktop) */
const NAV_ITEMS=[['dashboard','Beranda','dashboard.html','home'],['add','Tambah Koleksi','add-collection.html','plus'],['collection','Collections','collection.html','grid'],['chart','Grafik','chart.html','chart']];
function confirmLeave(href){
  const m=Util.modal(`<p>Jika anda keluar dari halaman ini, maka pengisian koleksi akan terhapus</p><div class="acts"><button class="btn soft" id="lvOk">Keluar</button><button class="btn" id="lvNo">Tetap di Sini</button></div>`);
  m.el.querySelector('#lvOk').onclick=()=>{window.KolektaGuard=null;location.href=href};
  m.el.querySelector('#lvNo').onclick=m.close;
}
document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.getElementById('nav');if(!nav)return;
  const page=document.body.dataset.page,active=page==='detail'?'collection':page;
  nav.className='nav';nav.setAttribute('aria-label','Navigasi utama');
  nav.innerHTML='<div class="brand">Kolekta</div>'+NAV_ITEMS.map(([k,l,h,i])=>`<a href="${h}" class="${k==='add'?'add ':''}${k===active?'on':''}">${Util.icon(i)}<span>${l}</span></a>`).join('');
  nav.addEventListener('click',e=>{const a=e.target.closest('a');
    if(a&&window.KolektaGuard&&window.KolektaGuard()){e.preventDefault();confirmLeave(a.getAttribute('href'))}});
});