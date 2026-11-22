/* Kolekta - storage.js : fungsi bantu (format, ikon, dialog, toast) */
const ICONS={
  home:'<path d="M4 20.5v-9.2L12 4l8 7.3v9.2h-5.2v-5.2a2.8 2.8 0 0 0-5.6 0v5.2z"/>',
  stack:'<path d="M8.5 3.5h8a3 3 0 0 1 3 3V16"/><path d="M4.5 7.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21l-5-3.5L4.5 21z"/><path d="M7.5 10.5h4"/>',
  plus:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>',
  plusonly:'<path d="M12 6v12M6 12h12"/>',
  chart:'<path d="M6.5 20v-3.5M11 20v-5.5M15.5 20v-7.5M20 20v-10"/><path d="M3.5 13.5l5-3.5 4 2.5 7.5-8"/><path d="M15.5 4.5H20V9"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  img:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/>',
  imgs:'<rect x="7" y="3" width="14" height="13" rx="2"/><path d="M3 8v11a2 2 0 0 0 2 2h11"/><circle cx="12" cy="8" r="1.4"/><path d="M7 14l4-4 3 3 2-2 5 5"/>',
  fileplus:'<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M13 3l5 5v3"/><path d="M13 3v5h5"/><circle cx="17" cy="17" r="4.2"/><path d="M17 14.8v4.4M14.8 17h4.4"/>',
  cam:'<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
  gal:'<rect x="4" y="5" width="16" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.5"/><path d="M4 16.5l5-5 4 4 3-3 4 4"/>',
  back:'<path d="M12.5 6l-6 6 6 6M19 6l-6 6 6 6"/>',
  rotate:'<rect x="7" y="4" width="10" height="16" rx="2.5"/><path d="M4 8.5c-1 1.2-1 5.8 0 7M20 8.5c1 1.2 1 5.8 0 7"/>',
  crop:'<path d="M7 3v14h14M3 7h14v14"/>'
};
const MONTHS=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const Util={
  icon:n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`,
  esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  rupiah:v=>'Rp'+Number(String(v||'0').replace(/\D/g,'')||0).toLocaleString('id-ID')+',00',
  tgl:s=>{if(!s)return '-';const [y,m,d]=s.split('-');return `${d}/${m}/${y}`},
  shortDate:t=>{const d=new Date(t);return `${d.getDate()} ${MONTHS[d.getMonth()]}`},
  /* foto koleksi; kalau belum ada foto, kotak abu-abu seperti di desain */
  photo:item=>item.foto?`<img src="${URL.createObjectURL(item.foto)}" alt="${Util.esc(item.nama)}">`:'',
  modal(html,sheet){
    const el=document.createElement('div');el.className='modal'+(sheet?' sheet':'');
    el.innerHTML=`<div class="${sheet?'sheet-box':'box'}">${html}</div>`;
    const close=()=>el.remove();el.addEventListener('click',e=>{if(e.target===el)close()});
    document.body.appendChild(el);return{el,close};
  },
  toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
};