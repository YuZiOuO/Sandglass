// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.SG_WEB_FB_APIKEY,
  authDomain: import.meta.env.SG_WEB_FB_AUTH_DOMAIN,
  projectId: import.meta.env.SG_WEB_FB_PROJECT_ID,
  storageBucket: import.meta.env.SG_WEB_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SG_WEB_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.SG_WEB_FB_APP_ID,
}

const app = initializeApp(firebaseConfig)

export type FirebaseService = { app: FirebaseApp; auth: Auth }

export async function useFirebase(): Promise<FirebaseService> {
  const auth = getAuth(app)
  await auth.authStateReady()
  return { app: app, auth: auth }
}
