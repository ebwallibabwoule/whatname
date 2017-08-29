import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})

export class UserComponent {
  user;
  userData;

  constructor( private auth: AuthProvider ) {
    this.user = this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  }

}
