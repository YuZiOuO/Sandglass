import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserCredential } from 'firebase/auth'

export const useUserCredentialStore = defineStore('userCredential', () => {
  const userCredentialStore = ref<UserCredential | null>(null);
  function get(){
    return userCredentialStore.value;
  }
  function set(userCredential:UserCredential | null){
    userCredentialStore.value = userCredential;
  }
  function isSet(){
    return userCredentialStore === null;
  }
  
  return { get,set,isSet }
})