/* Kolekta - crop.js : pangkas foto (rasio Kostum, 1:1, 4:3, 16:9, 3:4, 9:16) memakai canvas */
const KolektaCrop={
  open(file){
    return new Promise(resolve=>{
      const url=URL.createObjectURL(file),el=document.createElement('div');el.className='crop';
      const R=[['Kostum',0],['1:1',1],['4:3',4/3],['16:9',16/9],['3:4',3/4],['9:16',9/16]];
      el.innerHTML=`<div class="crop-box">
        <div class="crop-head"><button class="back" id="cpBack" type="button" aria-label="Kembali">${Util.icon('back')}</button><h2>Pangkas Foto</h2><button class="btn soft" id="cpReset" type="button">Reset</button></div>
        <div class="crop-stage"><div class="crop-wrap"><img id="cpImg" alt="Foto koleksi" src="${url}"><div class="crop-sel" id="cpSel"><i class="h"></i></div></div></div>
        <div class="ratios" id="cpRatios">${R.map(([l,r],i)=>`<button type="button" data-r="${r}" class="${i?'':'on'}">${l}</button>`).join('')}</div>
        <button class="btn full" id="cpSave" type="button">Simpan Foto</button></div>`;
      document.body.appendChild(el);
      const img=el.querySelector('#cpImg'),sel=el.querySelector('#cpSel');
      let W=0,H=0,ratio=0,box={x:0,y:0,w:0,h:0};
      const done=b=>{el.remove();URL.revokeObjectURL(url);resolve(b)};
      const paint=()=>{sel.style.left=box.x+'px';sel.style.top=box.y+'px';sel.style.width=box.w+'px';sel.style.height=box.h+'px'};
      function fit(r){
        ratio=r;W=img.clientWidth;H=img.clientHeight;
        if(!r)box={x:0,y:0,w:W,h:H};
        else{let w=W,h=w/r;if(h>H){h=H;w=h*r}box={x:(W-w)/2,y:(H-h)/2,w,h}}
        paint();
      }
      img.onload=()=>fit(0);
      let mode=null,sx=0,sy=0,sb=null;
      sel.addEventListener('pointerdown',e=>{mode=e.target.classList.contains('h')?'resize':'move';sx=e.clientX;sy=e.clientY;sb={...box};sel.setPointerCapture(e.pointerId);e.preventDefault()});
      sel.addEventListener('pointermove',e=>{
        if(!mode)return;const dx=e.clientX-sx,dy=e.clientY-sy;
        if(mode==='move'){box.x=Math.min(Math.max(0,sb.x+dx),W-box.w);box.y=Math.min(Math.max(0,sb.y+dy),H-box.h)}
        else{
          let w=Math.max(40,Math.min(sb.w+dx,W-sb.x)),h=ratio?w/ratio:Math.max(40,Math.min(sb.h+dy,H-sb.y));
          if(ratio&&sb.y+h>H){h=H-sb.y;w=h*ratio}
          box.w=w;box.h=h;
        }
        paint();
      });
      sel.addEventListener('pointerup',()=>{mode=null});
      const setOn=i=>el.querySelectorAll('#cpRatios button').forEach((b,j)=>b.classList.toggle('on',i===j));
      el.querySelector('#cpRatios').addEventListener('click',e=>{
        const b=e.target.closest('button');if(!b)return;
        setOn([...b.parentNode.children].indexOf(b));fit(+b.dataset.r);
      });
      el.querySelector('#cpReset').onclick=()=>{setOn(0);fit(0)};
      el.querySelector('#cpBack').onclick=()=>done(null);
      el.querySelector('#cpSave').onclick=()=>{
        const k=img.naturalWidth/W,c=document.createElement('canvas');
        c.width=Math.round(box.w*k);c.height=Math.round(box.h*k);
        c.getContext('2d').drawImage(img,box.x*k,box.y*k,box.w*k,box.h*k,0,0,c.width,c.height);
        c.toBlob(b=>done(b),'image/jpeg',.9);
      };
    });
  }
};