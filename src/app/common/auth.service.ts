import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  authState: any = null;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = firebaseAuth.authState;
    this.firebaseAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  isLoggedIn(): boolean {
    return this.authState !== null;
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        this.router.navigateByUrl('home');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('home');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.firebaseAuth
      .auth
      .signInWithPopup(provider)
      .then((credential) => {
        // this.authState = credential.user;
        // this.updateUserData();
        this.router.navigateByUrl('home');
      })
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut()
      .then(value => {
        console.log('Logged out!');
        this.router.navigateByUrl('');
        location.reload();
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

}
