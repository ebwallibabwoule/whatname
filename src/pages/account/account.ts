import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: any;

  constructor( private auth: AuthProvider) {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  }
}
