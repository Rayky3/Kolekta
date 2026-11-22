/* Kolekta - crop.js : pangkas foto (Kostum, 1:1, 3:4, 4:3, 16:9, 9:16), putar 90°, canvas */
const KolektaCrop={
  open(file){
    return new Promise(resolve=>{
      let src=URL.createObjectURL(file);
      const el=document.createElement('div');el.className='crop';
      const R=[['Kostum',0],['1:1',1],['3:4',3/4],['4:3',4/3],['16:9',16/9],['9:16',9/16]];
      const rIcon=r=>{if(!r)return '';const w=r>=1?16:16*r,h=r>=1?16/r:16;return `<svg class="ico" viewBox="0 0 24 24"><rect x="${12-w/2}" y="${12-h/2}" width="${w}" height="${h}" rx="1.5"/></svg>`};
      el.innerHTML=`<div class="crop-box">
        <div class="crop-head"><button class="back" id="cpBack" type="button" aria-label="Kembali">${Util.icon('back')}</button><h2 style="flex:1;text-align:center;font-size:20px;font-weight:600">Pangkas Foto</h2><button class="rot" id="cpRot" type="button" aria-label="Putar">${Util.icon('rotate')}</button></div>
        <div style="display:flex;justify-content:center"><button class="reset" id="cpReset" type="button">Reset</button></div>
        <div class="crop-stage"><div class="crop-wrap"><img id="cpImg" alt="Foto koleksi" src="${src}"><div class="crop-sel" id="cpSel"><i class="h-tl" data-c="tl"></i><i class="h-tr" data-c="tr"></i><i class="h-bl" data-c="bl"></i><i class="h-br" data-c="br"></i></div></div></div>
        <div class="ratios" id="cpRatios">${R.map(([l,r],i)=>`<button type="button" data-r="${r}" class="${i?'':'kostum on'}">${rIcon(r)}${l}</button>`).join('')}</div>
        <button class="save" id="cpSave" type="button">Simpan Foto</button></div>`;
      document.body.appendChild(el);
      const img=el.querySelector('#cpImg'),sel=el.querySelector('#cpSel');
      let W=0,H=0,ratio=0,box={x:0,y:0,w:0,h:0};
      const done=b=>{el.remove();URL.revokeObjectURL(src);resolve(b)};
      const paint=()=>{sel.style.left=box.x+'px';sel.style.top=box.y+'px';sel.style.width=box.w+'px';sel.style.height=box.h+'px'};
      function fit(r){
        ratio=r;W=img.clientWidth;H=img.clientHeight;
        if(!r)box={x:0,y:0,w:W,h:H};
        else{let w=W,h=w/r;if(h>H){h=H;w=h*r}box={x:(W-w)/2,y:(H-h)/2,w,h}}
        paint();
      }
      img.onload=()=>fit(0);
      /* putar 90°: gambar digambar ulang ke canvas lalu dijadikan sumber baru */
      el.querySelector('#cpRot').onclick=()=>{
        const c=document.createElement('canvas'),w=img.naturalWidth,h=img.naturalHeight;
        c.width=h;c.height=w;const x=c.getContext('2d');x.translate(h,0);x.rotate(Math.PI/2);x.drawImage(img,0,0);
        c.toBlob(b=>{const u=URL.createObjectURL(b);URL.revokeObjectURL(src);src=u;img.src=u},'image/jpeg',.95);
      };
      let mode=null,sx=0,sy=0,sb=null;
      sel.addEventListener('pointerdown',e=>{const c=e.target.dataset&&e.target.dataset.c;mode=c||'move';sx=e.clientX;sy=e.clientY;sb={...box};sel.setPointerCapture(e.pointerId);e.preventDefault()});
      sel.addEventListener('pointermove',e=>{
        if(!mode)return;const dx=e.clientX-sx,dy=e.clientY-sy,M=40;
        if(mode==='move'){box.x=Math.min(Math.max(0,sb.x+dx),W-box.w);box.y=Math.min(Math.max(0,sb.y+dy),H-box.h)}
        else{
          const L=mode[1]==='l',T=mode[0]==='t';
          let x1=sb.x,y1=sb.y,x2=sb.x+sb.w,y2=sb.y+sb.h;
          if(L)x1=Math.min(Math.max(0,sb.x+dx),x2-M);else x2=Math.max(Math.min(W,x2+dx),x1+M);
          if(T)y1=Math.min(Math.max(0,sb.y+dy),y2-M);else y2=Math.max(Math.min(H,y2+dy),y1+M);
          let w=x2-x1,h=y2-y1;
          if(ratio){
            h=w/ratio;
            const maxH=T?sb.y+sb.h:H-sb.y;
            if(h>maxH){h=maxH;w=h*ratio}
            if(L)x1=sb.x+sb.w-w;
            y1=T?sb.y+sb.h-h:sb.y;
          }
          box={x:x1,y:y1,w,h};
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