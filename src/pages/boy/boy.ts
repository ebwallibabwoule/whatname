import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'boy',
  templateUrl: 'boy.html'
})

export class BoyPage {
  names: Array<any>;
  user;
  debug = false;
  root = (!this.debug) ? '/names': '/testnames';

  constructor( public data: DataProvider, public loadingCtrl: LoadingController, private nativeStorage: NativeStorage, private storage: Storage, private platform: Platform ) {
    let loading = this.loadingCtrl.create({
      content: 'Loading boy names'
    });

    let userService = data.getUserData().subscribe((user) => {
      this.user = user;
      userService.unsubscribe();
    });

    loading.present();
    if (this.platform.is('cordova')) {

      nativeStorage.getItem('boyNames').then(
        ( storageNames ) => {
          this.names = storageNames;
          loading.dismiss();
        },
        ( error ) => {
          this.data.list(this.root + '/boy').subscribe(names => {
            this.names = names;
            this.nativeStorage.setItem('boyNames', names);
            loading.dismiss();
          });
        }
      );
    }
    else {
      storage.get('boyNames').then(( storageNames ) => {
        if (storageNames) {
          this.names = storageNames;
          loading.dismiss();
        }
        else {
          this.data.list(this.root + '/boy').subscribe(names => {
            this.names = names;

            this.storage.set('boyNames', names);
            loading.dismiss();
          });
        }
      });
    }
  }
}
