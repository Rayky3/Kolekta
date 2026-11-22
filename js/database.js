/* Kolekta - database.js : pembungkus IndexedDB (data dan foto disimpan lokal) */
const DB_NAME='kolekta-db',DB_VER=1,STORE='koleksi';
const KolektaDB={
  _db:null,
  open(){
    if(this._db)return Promise.resolve(this._db);
    return new Promise((res,rej)=>{
      const r=indexedDB.open(DB_NAME,DB_VER);
      r.onupgradeneeded=()=>{const db=r.result;
        if(!db.objectStoreNames.contains(STORE)){const s=db.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});s.createIndex('createdAt','createdAt');s.createIndex('jenis','jenis')}};
      r.onsuccess=()=>{this._db=r.result;res(this._db)};
      r.onerror=()=>rej(r.error);
    });
  },
  async _run(mode,fn){
    const db=await this.open();
    return new Promise((res,rej)=>{const t=db.transaction(STORE,mode);const q=fn(t.objectStore(STORE));
      t.oncomplete=()=>res(q.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)});
  },
  add(item){item.createdAt=Date.now();return this._run('readwrite',s=>s.add(item))},
  update(item){return this._run('readwrite',s=>s.put(item))},
  getAll(){return this._run('readonly',s=>s.getAll()).then(a=>a.sort((x,y)=>y.createdAt-x.createdAt))},
  get(id){return this._run('readonly',s=>s.get(Number(id)))},
  remove(id){return this._run('readwrite',s=>s.delete(Number(id)))}
};