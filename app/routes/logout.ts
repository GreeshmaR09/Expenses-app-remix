import { ActionFunctionArgs, json } from "@remix-run/node";
import { destroyUserSession } from "~/utils/auth.server";

export async function action({request}:ActionFunctionArgs){
    
    if(request.method !== 'POST'){
        throw json ({message:'Invalid request method'},{status:400})
    }
    return destroyUserSession(request)
}