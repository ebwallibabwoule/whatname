import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';

@Component({
  selector: 'boy',
  templateUrl: 'boy.html'
})

export class BoyPage {
  names: Array<any>;
  user;

  constructor( private data: DataProvider,
               private utils: UtilsProvider) {

    utils.load({ text: 'Loading boy names', show: true });
    data.getUserData().subscribe(( user ) => {
      this.user = user;
      this.data.list('users/' + this.user.$key + '/names/boy/repo').subscribe(names => {
        this.names = names;
        this.utils.load({ show: false });
      });
    });
  }
}
