import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})

export class UserComponent {
  user;
  userData;

  constructor( private auth: AuthProvider, private data: DataProvider ) {
    let userService = this.auth.getUser().subscribe(user => {
      this.user = user;
      userService.unsubscribe();
      this.data.getUserData().subscribe((userData) => {
        this.userData = userData;
      });
    });
  }

}
