import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { UtilsProvider } from './utils';

@Injectable()
export class AuthProvider {
  user: any;

  constructor(public auth: AngularFireAuth, public utils: UtilsProvider) {}

  public getUser() {
    return this.auth.authState;
  }

  register(email, password) {
    return Observable.create(
      observer => {
        this.auth.auth.createUserWithEmailAndPassword(email, password).then(data => {
          observer.next(data);
        },
        err => {
          observer.next(err);
        })
      });
  }

  loginGoogle() {
    this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginFacebook() {
    this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginTwitter() {
    this.auth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  loginGithub() {
    this.auth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  public loginEmail(email, password) {
    let that =this;
    this.auth.auth.signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        that.utils.toast({message: error.message});
      });
  }

  loginPhone() {
    this.auth.auth.signInWithPopup(new firebase.auth.PhoneAuthProvider());
  }

  logout() {
    this.auth.auth.signOut()
  }

}
