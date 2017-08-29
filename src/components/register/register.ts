import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { NavController, ToastController } from 'ionic-angular';
import { AccountPage } from '../../pages/account/account';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})

export class RegisterComponent {
  account = { email: '', password: '' };
  user;
  userData;

  constructor( private data: DataProvider,
               private auth: AuthProvider,
               private utils: UtilsProvider,
               private navCtrl: NavController ) {
  }


  register() {
    this.auth.register(this.account.email.trim(), this.account.password).subscribe(
      data => {
        let message;
        if (data && data.code && data.message) {
          message = data.message;
        }
        else if (data.uid) {
          this.user = data;
          message = 'Welcome!';

          this.createValue('uid', data.uid);
          this.setUpAccount();

          this.navCtrl.push(AccountPage);
        }

        this.utils.toast({message: message});
      }
    );
  }

  createValue( key, value ) {
    const root = 'users';

    const matchingUser = this.data.list(root, {
      query: {
        orderByChild: 'uid',
        equalTo: this.user.uid
      }
    });

    matchingUser.subscribe(userResult => {
      this.userData = userResult[ 0 ];
      if (userResult.length == 1) {
        const user = userResult[ 0 ];
        if (!user.hasOwnProperty(key)) {

          user[ key ] = value;
          this.data.object(root + '/' + user.$key).set(user);
        }
      }
      else if (userResult.length == 0 && key == 'uid') {
        const bla = [];
        bla[ key ] = value;
        matchingUser.push(bla);
      }
    });
  }

  setUpAccount() {
    this.createValue('uid', this.user.uid);
    this.createValue('id', this.user.email);
    this.createValue('matchcode', this.generateRandomString());
  }

  generateRandomString() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function ( c ) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

