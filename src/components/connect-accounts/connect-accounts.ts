import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { DataProvider } from '../../providers/data';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'connect-accounts',
  templateUrl: 'connect-accounts.html'
})

export class ConnectAccountsComponent {
  account = { code: '' };
  uid;
  user;
  email;
  thisuser;

  constructor( private auth: AuthProvider, private data: DataProvider, private toastCtrl: ToastController ) {
    let userService = this.auth.getUser().subscribe(thisuser => {
      this.uid = thisuser.uid;
      this.email = thisuser.email;
      this.user = thisuser;
      userService.unsubscribe();
    });
  }


  presentToast( message ) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }


  connect() {
    const code = this.account.code;
    const matchingUser = this.data.list('users', {
      query: {
        orderByChild: 'matchcode',
        equalTo: code
      }
    });

    matchingUser.subscribe(userResult => {
      const root = 'users';
      const user = userResult[ 0 ];

      const loggedInUser = this.data.list(root, {
        query: {
          orderByChild: 'uid',
          equalTo: this.uid
        }
      });

      loggedInUser.subscribe(user2 => {
        const kaas = user2[ 0 ];
        kaas[ 'match' ] = user.uid;
        kaas[ 'connected' ] = user.id;

        this.data.object(root + '/' + user2[ 0 ].$key).set(kaas);

        const faas = user;
        faas[ 'match' ] = kaas.uid;
        faas[ 'connected' ] = kaas.id;

        this.data.object(root + '/' + user.$key).set(faas);
      });

      this.presentToast('Connected!');
    });
  }
}