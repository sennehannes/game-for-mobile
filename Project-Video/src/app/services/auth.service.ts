import {Injectable} from '@angular/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Router} from '@angular/router';
import {Auth, signInWithCredential, signOut} from '@angular/fire/auth';
import {updateProfile, GoogleAuthProvider, PhoneAuthProvider, User} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {BehaviorSubject} from 'rxjs';

export class AuthService {
    constructor(public auth: Auth) {}
    async signInWithGoogle(): Promise<void> {
        // Sign in on the native layer.
        const {credential: {idToken}} =
            await FirebaseAuthentication.signInWithGoogle();
        // Sign in on the web layer.
        if (Capacitor.isNativePlatform()) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(this.auth, credential);
        }
    }
 }
