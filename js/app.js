/* Kolekta - app.js : inisialisasi umum (service worker, penyimpanan persisten, toast) */
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('../service-worker.js').catch(e=>console.warn('SW gagal:',e)));
}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();
document.addEventListener('DOMContentLoaded',()=>{const m=sessionStorage.getItem('toast');if(m){sessionStorage.removeItem('toast');Util.toast(m)}});