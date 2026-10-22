"use client";
import {useState} from "react";import {useRouter} from "next/navigation";import {createClient} from "@/lib/supabase/client";
export default function Login(){
 const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [err,setErr]=useState(false);const [shake,setShake]=useState(false);const [show,setShow]=useState(false);const [msg,setMsg]=useState("");
 const r=useRouter();const sb=createClient();const clear=()=>{setErr(false);setMsg("")};
 async function submit(e:React.FormEvent){e.preventDefault();const {error}=await sb.auth.signInWithPassword({email,password:pw});
  if(error){setErr(true);setShake(false);requestAnimationFrame(()=>setShake(true))}else{r.push("/clients");r.refresh()}}
 async function forgot(e:React.MouseEvent){e.preventDefault();if(!email){setMsg("Enter your email first.");return}
  await sb.auth.resetPasswordForEmail(email);setMsg("If that account exists, a reset link has been sent.")}
 return <main className="min-h-screen grid place-items-center" style={{backgroundImage:"linear-gradient(to right,#141414 1px,transparent 1px),linear-gradient(to bottom,#141414 1px,transparent 1px)",backgroundSize:"45px 45px"}}>
  <div className={`w-[400px] max-w-[92vw] bg-[#1a1a1c] border border-[#2d2d2d] rounded-3xl p-10 text-center shadow-2xl ${shake?"shake":""}`}>
   <h1 className="font-serif text-2xl tracking-[0.25em] mb-1">DRAVYA</h1><p className="text-xs text-muted mb-9">Staff sign in</p>
   <form onSubmit={submit}>
    <div className={`field ${err?"error":""}`} onMouseDown={clear}><input type="email" placeholder="Email" value={email} onChange={e=>{setEmail(e.target.value);clear()}} onFocus={clear} required/></div>
    <div className={`field ${err?"error":""}`} onMouseDown={clear}><input type={show?"text":"password"} placeholder="Password" value={pw} onChange={e=>{setPw(e.target.value);clear()}} onFocus={clear} required/><button type="button" className="text-xs text-muted" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div>
    {err&&<p className="text-[#ff4d4d] text-xs -mt-2 mb-3">Email or password is incorrect.</p>}{msg&&<p className="text-gold text-xs mb-3">{msg}</p>}
    <div className="flex justify-between text-sm text-muted my-4 mb-8"><a href="#" onClick={forgot} className="hover:text-gold">Forgot password?</a><label className="flex items-center gap-2 cursor-pointer">Remember me<input type="checkbox" defaultChecked className="accent-[#c9a86a]"/></label></div>
    <button className="btn-gold w-full py-3.5 tracking-widest">LOGIN</button>
   </form></div></main>}
