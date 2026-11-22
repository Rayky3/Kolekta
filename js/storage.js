/* Kolekta - storage.js : fungsi bantu (format, ikon, modal, toast) */
const ICONS={home:'M3 11l9-8 9 8M5 10v10h14V10',plus:'M12 5v14M5 12h14',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',chart:'M4 20V4M4 20h16M8 16l4-5 3 3 5-7',cam:'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',back:'M15 5l-7 7 7 7',img:'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4',tag:'M3 12l9-9h8v8l-9 9z',fold:'M3 7h6l2 2h10v10H3z'};
const MONTHS=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const Util={
  icon:n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`,
  esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  rupiah:v=>'Rp'+Number(String(v||'0').replace(/\D/g,'')||0).toLocaleString('id-ID')+',00',
  tgl:s=>{if(!s)return '-';const [y,m,d]=s.split('-');return `${d}/${m}/${y}`},
  shortDate:t=>{const d=new Date(t);return `${d.getDate()} ${MONTHS[d.getMonth()]}`},
  photo:item=>item.foto?`<img src="${URL.createObjectURL(item.foto)}" alt="${Util.esc(item.nama)}">`:Util.icon('img'),
  modal(html){
    const el=document.createElement('div');el.className='modal';el.innerHTML=`<div class="box">${html}</div>`;
    const close=()=>el.remove();el.addEventListener('click',e=>{if(e.target===el)close()});
    document.body.appendChild(el);return{el,close};
  },
  toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
};