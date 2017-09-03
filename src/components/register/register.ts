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

          this.data.setUserValue('uid', data.uid).subscribe(() => {
            this.setUpAccount();
          });

          this.navCtrl.push(AccountPage);
        }

        this.utils.toast({ message: message });
      }
    );
  }

  setUpAccount() {
    const userService = this.data.object('names').subscribe(names => {
      const nameSetSize: number = 100;

      const namesInfo = {
        'boy': {
          'totalset': Math.ceil( names.boy.length / nameSetSize ),
          'currentset': 1,
          'setsize': nameSetSize,
          'repo': names.boy.slice(0, nameSetSize)
        },
        'girl': {
          'totalset': Math.ceil( names.girl.length / nameSetSize ),
          'currentset': 1,
          'setsize': nameSetSize,
          'repo': names.girl.slice(0, nameSetSize)
        }
      };

      this.data.setUserValue('id', this.user.email).subscribe();
      this.data.setUserValue('matchcode', this.generateRandomString()).subscribe();
      this.data.setUserValue('names', namesInfo).subscribe();


      userService.unsubscribe();
    });
  }

  generateRandomString() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function ( c ) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

