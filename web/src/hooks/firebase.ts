// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD9IV71jOxRLjGUnV0jEFirU9cf2V099c4',
  authDomain: 'sandglass-ccce4.firebaseapp.com',
  projectId: 'sandglass-ccce4',
  storageBucket: 'sandglass-ccce4.firebasestorage.app',
  messagingSenderId: '703398515772',
  appId: '1:703398515772:web:29adadfaac7717e2811f39',
}

const app = initializeApp(firebaseConfig)

export type FirebaseService = { app: FirebaseApp; auth: Auth }

export async function useFirebase(): Promise<FirebaseService> {
  const auth = getAuth(app)
  await auth.authStateReady()
  return { app: app, auth: auth }
}
