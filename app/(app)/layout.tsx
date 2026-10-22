import Link from "next/link";import {redirect} from "next/navigation";import {createClient} from "@/lib/supabase/server";
const nav=[["Dashboard","dashboard"],["Client management","clients"],["My task","tasks"],["Map","map"],["Admin","admin"],["Library","library"],["Notice","notice"],["Contract","contract"]];
export default async function Shell({children}:{children:React.ReactNode}){
 const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user)redirect("/login");
 const {data:p}=await sb.from("profiles").select("full_name,role").eq("id",user.id).single();
 if(!p)redirect("/login");
 return <div className="flex min-h-screen"><aside className="w-60 shrink-0 bg-surface border-r border-white/10 p-5 flex flex-col">
  <div className="font-serif tracking-[0.2em] text-lg mb-8">DRAVYA<div className="font-sans text-[10px] text-gold tracking-widest">Architecture &amp; Build</div></div>
  <nav className="space-y-1 text-sm">{nav.filter(([n])=>n!=="Admin"||p.role==="admin").map(([n,h])=><Link key={h} href={"/"+h} className="block px-3 py-2 rounded-lg text-muted hover:text-gold hover:bg-white/5">{n}</Link>)}</nav>
  <form action="/auth/signout" method="post" className="mt-auto text-xs text-muted">{p.full_name} ({p.role})<br/><button className="mt-2 text-gold">Sign out</button></form></aside>
  <main className="flex-1 p-8 overflow-auto">{children}</main></div>}
