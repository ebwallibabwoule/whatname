import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'invite',
  templateUrl: 'invite.html'
})

export class InviteComponent {
  validEmail: boolean = false;

  uri: string = 'mailto:';
  emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  subject: string = 'Find a nice baby name with me';
  body: string = 'Hi!\nI would like to invite you to the \"WhatName!\" app. Find a great baby name together!\n\nWhat to do next?\n' +
    '1. Go to http://www.emmanuelweethetwel.nl/whatname or download and install the app from your app store. Look for \'WhatName!\'\n' +
    '2. Open the app or site, sign up and connect with the following code: %%code%%\n' +
    '3. Swipe and vote, and see which names will match my favorites!\n\n' +
    'Have fun!';
  matchcode: string = '';
  mailLink: string = '';

  constructor(private data: DataProvider) {
    this.data.getUserData().subscribe(user => {
        this.matchcode = user.matchcode;
        this.body = this.body.replace('%%code%%', this.matchcode);
    });
  }

  public checkEmail(event) {
    this.validEmail = this.emailRegEx.test(event.target.value);
    if (this.validEmail) {
      this.mailLink = this.uri + encodeURI(event.target.value) + '?subject=' + encodeURI(this.subject) + '&body=' + encodeURI(this.body);
    }
  }
}
