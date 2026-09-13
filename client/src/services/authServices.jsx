
import { authClient } from "../lib/auth-client";

export async function login() {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:5173",
  });
  


}

export async function logout(){
    
    return await authClient.signOut();
}