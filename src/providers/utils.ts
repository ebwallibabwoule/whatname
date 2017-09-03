import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilsProvider {
  loading;

  constructor( private toastCtrl: ToastController,
               private nativeStorage: NativeStorage,
               private storage: Storage,
               private platform: Platform,
               private loadingCtrl: LoadingController) {
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

  public toast( options ) {
    const defaults = {
      duration: 2000,
      position: 'bottom',
      cssClass: 'colorized'
    };

    this.toastCtrl.create(Object.assign(defaults, options)).present();
  }


  public setStorage( storeName, data ) {
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem(storeName, data);
    }
    else {
      this.storage.set(storeName, data);
    }
  }

  public getStorage( storeName ) {
    return Observable.create(
      observer => {
        if (this.platform.is('cordova')) {
          this.nativeStorage.getItem(storeName).then(
            ( data ) => {
              observer.next(data);
            },
            ( error ) => {
              observer.next(error);
            }
          );
        }
        else {
          console.log('nietcordova');
          this.storage.get(storeName).then(( data ) => {
            console.log('nietcordova data?', data);
            if (data) {
            console.log('nietcordova data!', data);
              observer.next(data);
            }
            else {
              console.log('nietcordova error!');
              observer.next(false);
            }
          });
        }
      }
    );
  }

  public load(options) {
    if (options.show == true) {
      this.loading = this.loadingCtrl.create({
        content: (options.text) ? options.text: 'Loading...'
      });
      this.loading.present();
    }
    else {
      this.loading.dismiss();
    }
  }
}