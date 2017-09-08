import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';
import 'rxjs/add/operator/take';

@Component({
  selector: 'connect-accounts',
  templateUrl: 'connect-accounts.html'
})

export class ConnectAccountsComponent {
  account = { code: '' };
  uid: string;
  user: any;
  email: string;

  constructor( private auth: AuthProvider, private data: DataProvider, private utils: UtilsProvider ) {
    this.auth.getUser().take(1).subscribe(thisuser => {
      this.uid = thisuser.uid;
      this.email = thisuser.email;
      this.user = thisuser;
    });
  }

  private connect() {
    const code = this.account.code;
    const matchingUser = this.data.list('users', {
      query: {
        orderByChild: 'matchcode',
        equalTo: code
      }
    });

    matchingUser.take(1).subscribe(userResult => {
      if (userResult.length == 1) {
        const user = userResult[ 0 ];

        const loggedInUser = this.data.list('users', {
          query: {
            orderByChild: 'uid',
            equalTo: this.uid
          }
        });

        loggedInUser.subscribe(userResult2 => {
          const user2 = userResult2[ 0 ];

          if (user2.uid != user.uid) {
            user2[ 'match' ] = user.uid;
            user2[ 'connected' ] = user.id;

            this.data.object('users/' + userResult2[ 0 ].$key).set(user2);

            const user1 = user;
            user1[ 'match' ] = user2.uid;
            user1[ 'connected' ] = user2.id;

            this.data.object('users/' + user.$key).set(user1);

            this.utils.toast({message: 'Connected to ' + user1.id + '!'});
          }
          else {
            this.utils.toast({message: 'You cannot connect with yourself' });
          }
        });
      }
      else {
        this.utils.toast({message: 'This code is invalid' });
      }

    });
  }
}