import { useAuth } from "@/hooks/useFirebase";
import pinia from "@/stores";
import { useUserCredentialStore } from "@/stores/userCredential";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = useAuth();
const userCredentialStore = useUserCredentialStore(pinia);

export async function createUser(email:string,password:string){
    try{
        const result = await createUserWithEmailAndPassword(auth,email,password);
        userCredentialStore.set(result);
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

export async function login(email:string,password:string){
    try{
        const result = await signInWithEmailAndPassword(auth,email,password);
        userCredentialStore.set(result);
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}