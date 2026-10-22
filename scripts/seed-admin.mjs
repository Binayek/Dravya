import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const {data,error}=await sb.auth.admin.createUser({email:"db@gmail.com",password:"123456789",email_confirm:true});
if(error)throw error;
await sb.from("profiles").insert({id:data.user.id,full_name:"Dravya Admin",role:"admin"});
console.log("Admin created. Change this password before real use.");
