/* Kolekta - service-worker.js : network-first, cache sebagai cadangan offline */
const CACHE='kolekta-v13';
const FILES=['./','index.html','manifest.json','assets/icon.png','assets/fonts/Conthrax-SemiBold.otf','assets/fonts/Poppins-Regular.ttf','assets/fonts/Poppins-Medium.ttf','assets/fonts/Poppins-SemiBold.ttf','assets/fonts/Poppins-Bold.ttf',
'css/style.css','css/components.css','css/responsive.css',
'js/storage.js','js/database.js','js/navigation.js','js/app.js','js/crop.js','js/form.js','js/collection.js','js/dashboard.js','js/chart.js','js/edit.js','js/expense.js',
'pages/dashboard.html','pages/add-collection.html','pages/collection.html','pages/detail-collection.html','pages/chart.html','pages/edit-collection.html','pages/expense.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(f=>c.add(f)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});