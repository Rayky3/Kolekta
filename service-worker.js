/* Kolekta - service-worker.js : cache file aplikasi agar bisa dipakai offline */
const CACHE='kolekta-v2';
const FILES=[
  './','index.html','manifest.json','icons/icon.png',
  'pages/dashboard.html','pages/add-collection.html','pages/collection.html','pages/detail-collection.html','pages/chart.html',
  'css/style.css','css/components.css','css/responsive.css',
  'js/storage.js','js/database.js','js/navigation.js','js/app.js','js/form.js','js/crop.js','js/chart.js','js/collection.js','js/dashboard.js',
  'fonts/Conthrax-SemiBold.otf','fonts/Poppins-Regular.ttf','fonts/Poppins-Medium.ttf','fonts/Poppins-SemiBold.ttf','fonts/Poppins-Bold.ttf'
];
self.addEventListener('install',e=>{
  /* tiap file di-cache sendiri-sendiri, sehingga satu file yang hilang tidak menggagalkan semuanya */
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
/* ambil file terbaru dulu; cache dipakai hanya saat offline */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
      return res;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('pages/dashboard.html')))
  );
});