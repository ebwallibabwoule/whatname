import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  user;
  account = { email: '', password: ''};

  constructor( private auth: AuthProvider, private navCtrl: NavController ) {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  }

  public logout() {
    this.auth.logout();
  }

  public login(loginOption) {
    switch(loginOption) {
      case 'google':
        this.auth.loginGoogle();
        break;
      case 'facebook':
        this.auth.loginFacebook();
        break;
      case 'twitter':
        this.auth.loginTwitter();
        break;
      case 'github':
        this.auth.loginGithub();
        break;
      case 'email':
        this.auth.loginEmail(this.account.email.trim(), this.account.password);
        break;
      case 'phone':
        this.auth.loginPhone();
        break;
    }
  }

  public goToRegister() {
    this.navCtrl.push(RegisterPage);
  }


}
