/* Kolekta - navigation.js : navigasi bawah (4 ikon) dan dialog keluar halaman */
const NAV_ITEMS=[['dashboard','Beranda','dashboard.html','home'],['collection','Collections','collection.html','stack'],['add','Tambah Koleksi','add-collection.html','plus'],['chart','Statistik','chart.html','chart']];
function confirmLeave(href){
  const m=Util.modal(`<p>Jika anda keluar dari halaman ini, maka pengisian koleksi akan terhapus</p><div class="acts"><button class="b-line" id="lvOk" type="button">Keluar</button><button class="b-white pr" id="lvNo" type="button">Tetap di Sini</button></div>`);
  m.el.querySelector('#lvOk').onclick=()=>{window.KolektaGuard=null;location.href=href};
  m.el.querySelector('#lvNo').onclick=m.close;
}
document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.getElementById('nav');if(!nav)return;
  const page=document.body.dataset.page,active=(page==='detail'||page==='edit')?'collection':(page==='expense'?'chart':page);
  nav.className='nav';nav.setAttribute('aria-label','Navigasi utama');
  nav.innerHTML=NAV_ITEMS.map(([k,l,h,i])=>`<a href="${h}" aria-label="${l}" title="${l}" class="${k===active?'on':''}">${Util.icon(i)}</a>`).join('');
  nav.addEventListener('click',e=>{const a=e.target.closest('a');
    if(a&&window.KolektaGuard&&window.KolektaGuard()){e.preventDefault();confirmLeave(a.getAttribute('href'))}});
});