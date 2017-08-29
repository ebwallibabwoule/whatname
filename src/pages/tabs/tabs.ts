import { Component } from '@angular/core';
import { AccountPage } from '../account/account';
import { BoyPage } from '../boy/boy';
import { GirlPage } from '../girl/girl';
import { SettingsPage } from '../settings/settings';
import { AuthProvider } from '../../providers/auth';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = AccountPage;
  tab2Root = BoyPage;
  tab3Root = GirlPage;
  tab4Root = SettingsPage;
  user;

  constructor( private auth: AuthProvider ) {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  }
}
