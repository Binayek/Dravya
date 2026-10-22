import {createClient} from "@/lib/supabase/server";import {NextResponse} from "next/server";
export async function POST(req:Request){await createClient().auth.signOut();return NextResponse.redirect(new URL("/login",req.url),303)}
