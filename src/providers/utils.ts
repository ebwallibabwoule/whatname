import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UtilsProvider {
  constructor(public toastCtrl: ToastController) {
  }

  public convertListArray( array ) {
    const convertedArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[ i ] && array[ i ].$value) {
        convertedArray.push(array[ i ].$value);
      }
    }
    return convertedArray.slice().sort();
  }

  public getDupes( array1, array2 ) {
    const concatArray = array1.concat(array2);

    const dupes = [];
    const sortedDupes = this.convertListArray(concatArray);
    for (let i = 0; i < sortedDupes.length; i++) {
      if (sortedDupes[ i ] == sortedDupes[ i + 1 ]) {
        dupes.push(sortedDupes[ i ]);
      }
    }

    return dupes;
  }

  public removeDupes( array ) {
    const sortedDupes = array.slice().sort();
    for (let i = 0; i < sortedDupes.length; i++) {
      if (sortedDupes[ i ] == sortedDupes[ i + 1 ]) {
        sortedDupes.splice(i, 1);
      }
    }

    return sortedDupes;
  }

  public substractArray( array1, array2 ) {
    if (array1 && array2) {
      return array1.filter(function ( x ) {
        return array2.indexOf(x.$value) < 0;
      });
    }
    return false;
  }

  public toast(options) {
    const defaults = {
      duration: 1000,
      position: 'bottom',
      cssClass: 'colorized'
    };

    this.toastCtrl.create(Object.assign(defaults, options)).present();

  }
}
