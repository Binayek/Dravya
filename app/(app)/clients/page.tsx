import {createClient} from "@/lib/supabase/server";import ClientsView from "@/components/ClientsView";
export default async function Page(){
 const sb=createClient();const {data:{user}}=await sb.auth.getUser();
 const {data:p}=await sb.from("profiles").select("role").eq("id",user!.id).single();
 const {data:clients}=await sb.from("clients").select("*").order("created_at",{ascending:false});
 const paths=(clients||[]).map(c=>c.photo_path).filter(Boolean);
 const {data:signed}=paths.length?await sb.storage.from("client-docs").createSignedUrls(paths,3600):{data:[]};
 const photos:Record<string,string>={};(signed||[]).forEach((s:any)=>{if(s.path)photos[s.path]=s.signedUrl});
 return <ClientsView clients={clients||[]} photos={photos} role={p?.role}/>}
