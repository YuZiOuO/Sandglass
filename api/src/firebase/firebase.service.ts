import { Injectable } from '@nestjs/common';
import { App, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService {
    private readonly config = {
        apiKey: "AIzaSyD9IV71jOxRLjGUnV0jEFirU9cf2V099c4",
        authDomain: "sandglass-ccce4.firebaseapp.com",
        projectId: "sandglass-ccce4",
        storageBucket: "sandglass-ccce4.firebasestorage.app",
        messagingSenderId: "703398515772",
        appId: "1:703398515772:web:29adadfaac7717e2811f39"
    }
    private readonly app: App = initializeApp(this.config);

    get auth(){
        return getAuth(this.app);
    }

    get db(){
        return getFirestore(this.app);
    }
}
