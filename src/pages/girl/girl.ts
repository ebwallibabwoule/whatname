import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';

@Component({
  selector: 'girl',
  templateUrl: 'girl.html'
})

export class GirlPage {
  names: Array<any>;
  user;

  constructor( private data: DataProvider,
               private utils: UtilsProvider) {

    utils.load({ text: 'Loading girl names', show: true });
    data.getUserData().subscribe(( user ) => {
      this.user = user;
      this.data.list('users/' + this.user.$key + '/names/girl/repo').subscribe(names => {
        this.names = names;
        this.utils.load({ show: false });
      });
    });
  }
}
