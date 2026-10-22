"use client";
import {useState} from "react";import {useRouter} from "next/navigation";import {createClient} from "@/lib/supabase/client";
const DOCS=[["nagarikta","Nagarikta"],["naapi_naksa","Naapi naksa"],["tiro","Tiro"],["lalpurja","Lalpurja"],["baato_sifaris","Baato sifaris"],["other","Other documents"]];
const ADDR=[["district","District"],["municipality","VDC / Municipality"],["ward","Ward"],["tole","Tole"],["marga","Marga"],["latitude","Latitude"],["longitude","Longitude"]];
const pc:any={high:"text-red-400",medium:"text-gold",low:"text-muted"};
export default function ClientsView({clients,photos,role}:any){
 const [sel,setSel]=useState<any>(clients[0]||null);const [form,setForm]=useState<any>(null);const [del,setDel]=useState(false);const [more,setMore]=useState(false);
 const [busy,setBusy]=useState(false);const [err,setErr]=useState("");const r=useRouter();const sb=createClient();
 async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setErr("");
  try{const fd=new FormData(e.currentTarget);const f=form.id?form:null;
   const row:any={priority:fd.get("priority")};["full_name","phone","email",...ADDR.map(a=>a[0])].forEach(k=>{const v=String(fd.get(k)||"").trim();row[k]=["latitude","longitude"].includes(k)?(v?Number(v):null):v||null});
   let id=f?.id;
   if(id){const {error}=await sb.from("clients").update(row).eq("id",id);if(error)throw error}
   else{const {data,error}=await sb.from("clients").insert(row).select().single();if(error)throw error;id=data.id}
   const upd:any={};const docs={...(f?.docs||{})};
   const up=async(file:File,key:string)=>{const path=`${id}/${key}-${Date.now()}-${file.name.replace(/[^\w.-]/g,"_")}`;const {error}=await sb.storage.from("client-docs").upload(path,file);if(error)throw error;return path};
   const ph=fd.get("photo") as File;if(ph?.size){upd.photo_path=await up(ph,"photo")}
   for(const [k] of DOCS){const d=fd.get(k) as File;if(d?.size){docs[k]=await up(d,k)}}
   upd.docs=docs;const {error}=await sb.from("clients").update(upd).eq("id",id);if(error)throw error;
   setForm(null);r.refresh()}catch(x:any){setErr(x.message||"Could not save the client.")}setBusy(false)}
 async function remove(){const {error}=await sb.from("clients").delete().eq("id",sel.id);setDel(false);if(error){alert(error.message);return}setSel(null);r.refresh()}
 async function open(path:string){const {data}=await sb.storage.from("client-docs").createSignedUrl(path,120);if(data)window.open(data.signedUrl,"_blank")}
 const cur=sel&&clients.find((c:any)=>c.id===sel.id)||sel;
 return <div><div className="flex items-center justify-between mb-6"><h1 className="font-serif text-2xl">Client management</h1><button className="btn-gold" onClick={()=>{setErr("");setForm({})}}>Add new client</button></div>
 <div className="grid lg:grid-cols-[340px_1fr] gap-6">
  <div className="bg-surface border border-white/10 rounded-2xl divide-y divide-white/5 max-h-[80vh] overflow-auto">
   {clients.length===0&&<p className="p-6 text-sm text-muted">No clients yet. Add your first client.</p>}
   {clients.map((c:any)=><button key={c.id} onClick={()=>{setSel(c);setMore(false)}} className={`w-full text-left p-4 flex items-center gap-3 hover:bg-white/5 ${cur?.id===c.id?"bg-white/5":""}`}>
    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden grid place-items-center text-xs">{photos[c.photo_path]?<img src={photos[c.photo_path]} className="w-full h-full object-cover"/>:c.full_name[0]}</div>
    <div className="flex-1 min-w-0"><div className="text-sm truncate">{c.full_name}</div><div className="text-xs text-muted truncate">{c.phone||"No phone"}</div></div><span className={`text-xs ${pc[c.priority]}`}>{c.priority}</span></button>)}</div>
  <div className="bg-surface border border-white/10 rounded-2xl p-6">{!cur?<p className="text-sm text-muted">Select a client to see their details.</p>:<>
   <div className="flex gap-5 items-start"><div className="w-28 h-28 rounded-2xl bg-white/10 overflow-hidden grid place-items-center text-2xl">{photos[cur.photo_path]?<img src={photos[cur.photo_path]} className="w-full h-full object-cover"/>:cur.full_name[0]}</div>
    <div className="flex-1"><h2 className="text-xl">{cur.full_name}</h2><p className={`text-sm ${pc[cur.priority]}`}>{cur.priority} priority</p><p className="text-sm text-muted mt-2">{cur.phone} {cur.email&&`· ${cur.email}`}</p></div>
    <div className="flex gap-2"><button className="btn-ghost" onClick={()=>{setErr("");setForm(cur)}}>Update</button>{role==="admin"&&<button className="btn-ghost text-red-400" onClick={()=>setDel(true)}>Delete</button>}</div></div>
   <button className="btn-ghost mt-5" onClick={()=>setMore(!more)}>{more?"Hide details":"View all details"}</button>
   {more&&<div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">{ADDR.map(([k,l])=><div key={k} className="bg-black/30 rounded-lg p-3"><div className="text-xs text-muted">{l}</div>{cur[k]??"—"}</div>)}
    <div className="sm:col-span-2 mt-2 text-xs text-muted">Documents</div>{DOCS.map(([k,l])=><div key={k} className="bg-black/30 rounded-lg p-3 flex justify-between items-center">{l}{cur.docs?.[k]?<button className="text-gold text-xs" onClick={()=>open(cur.docs[k])}>Open PDF</button>:<span className="text-xs text-muted">Not uploaded</span>}</div>)}</div>}</>}</div></div>
 {form&&<div className="fixed inset-0 bg-black/70 grid place-items-center p-4 z-20"><form key={form.id||"new"} onSubmit={save} className="bg-[#14161c] border border-white/10 rounded-2xl p-6 w-[720px] max-w-full max-h-[92vh] overflow-auto space-y-4">
  <h2 className="font-serif text-xl">{form.id?"Update client":"New client"}</h2>
  <div className="grid sm:grid-cols-3 gap-3"><input name="full_name" required placeholder="Full name" defaultValue={form.full_name} className="inp"/><input name="phone" placeholder="Phone number" defaultValue={form.phone} className="inp"/><input name="email" type="email" placeholder="Email" defaultValue={form.email} className="inp"/></div>
  <div className="grid sm:grid-cols-3 gap-3">{ADDR.map(([k,l])=><input key={k} name={k} placeholder={l} defaultValue={form[k]??""} className="inp"/>)}
   <select name="priority" defaultValue={form.priority||"medium"} className="inp"><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></div>
  <label className="block text-xs text-muted">Photo (JPEG, JPG or PNG)<input name="photo" type="file" accept=".jpg,.jpeg,.png" className="inp mt-1"/></label>
  <div className="grid sm:grid-cols-2 gap-3">{DOCS.map(([k,l])=><label key={k} className="block text-xs text-muted">{l} (PDF){form.docs?.[k]&&" · replaces existing"}<input name={k} type="file" accept="application/pdf" className="inp mt-1"/></label>)}</div>
  {err&&<p className="text-red-400 text-sm">{err}</p>}
  <div className="flex gap-3 justify-end"><button type="button" className="btn-ghost" onClick={()=>setForm(null)}>Cancel</button><button disabled={busy} className="btn-gold">{busy?"Saving…":form.id?"Save changes":"Add client"}</button></div></form></div>}
 {del&&<div className="fixed inset-0 bg-black/70 grid place-items-center z-30"><div className="bg-[#14161c] border border-white/10 rounded-2xl p-6 w-80"><p className="mb-5">Delete file?</p><p className="text-xs text-muted mb-5">{cur.full_name} will be removed permanently.</p><div className="flex gap-3 justify-end"><button className="btn-ghost" onClick={()=>setDel(false)}>Cancel</button><button className="btn-gold" onClick={remove}>Delete</button></div></div></div>}
 </div>}
