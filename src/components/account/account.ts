import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';

@Component({
  selector: 'account',
  templateUrl: 'account.html'
})

export class AccountComponent {
  user;
  account = { email: '', password: ''};

  constructor( private auth: AuthProvider, private navCtrl: NavController) {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  }

  login(loginOption) {
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

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }
}
