import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { NavController } from 'ionic-angular';
import { AccountPage } from '../../pages/account/account';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';
import 'rxjs/add/operator/take';

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})

export class RegisterComponent {
  account = { email: '', password: '', local: 'us' };
  user: any;
  locals: Array<any> = [];

  constructor( private data: DataProvider,
               private auth: AuthProvider,
               private utils: UtilsProvider,
               private navCtrl: NavController ) {

    this.data.list('/names').subscribe(locals => {
      this.locals = locals;
    });
  }

  public register() {
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

  private setUpAccount() {
    this.data.object('names/' + this.account.local).take(1).subscribe(names => {
      const nameSetSize: number = 100;

      const namesInfo = {
        'boy': {
          'totalset': Math.ceil( names.boy.length / nameSetSize ),
          'currentset': 0,
          'setsize': nameSetSize
        },
        'girl': {
          'totalset': Math.ceil( names.girl.length / nameSetSize ),
          'currentset': 0,
          'setsize': nameSetSize
        }
      };

      this.data.setUserValue('id', this.user.email).subscribe();
      this.data.setUserValue('matchcode', this.generateRandomString()).subscribe();
      this.data.setUserValue('names', namesInfo).subscribe();
      this.data.setUserValue('local', this.account.local).subscribe();
    });
  }

  generateRandomString() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function ( c ) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

