import { Component } from '@angular/core';
import { UtilsProvider } from '../../providers/utils';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'add-name',
  templateUrl: 'add-name.html'
})

export class AddNameComponent {
  name = { name: '', gender: 'boy' };
  user;

  constructor( private data: DataProvider, private utils: UtilsProvider ) {
    this.data.getUserData().subscribe(user => {
      this.user = user;
    });
  }


  addName() {
    if (this.name.name) {
      this.data.push('users/' + this.user.$key + '/names/' + this.name.gender + '/liked', this.name.name.trim());
      this.utils.toast({ message: this.name.gender + ' name "' + this.name.name + '" has been added to your favorites' })
    }
    else {
      this.utils.toast({ message: 'The name field is empty.'})
    }
  }
}
