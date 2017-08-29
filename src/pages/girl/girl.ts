import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'girl',
  templateUrl: 'girl.html'
})

export class GirlPage {
  names: Array<any>;
  user;

  constructor( public data: DataProvider, public loadingCtrl: LoadingController, private nativeStorage: NativeStorage, private storage: Storage, private platform: Platform ) {
    let loading = this.loadingCtrl.create({
      content: 'Loading girl names'
    });

    data.getUserData().subscribe((user) => {
      this.user = user;
    });

    loading.present();
    if (this.platform.is('cordova')) {

      nativeStorage.getItem('girlNames').then(
        ( storageNames ) => {
          this.names = storageNames;
          loading.dismiss();
        },
        ( error ) => {
          this.data.list('/names/girl').subscribe(names => {
            this.names = names;
            this.nativeStorage.setItem('girlNames', names);
            loading.dismiss();
          });
        }
      );
    }
    else {
      storage.get('girlNames').then(( storageNames ) => {
        if (storageNames) {
          this.names = storageNames;
          loading.dismiss();
        }
        else {
          this.data.list('/names/girl').subscribe(names => {
            this.names = names;

            this.storage.set('girlNames', names);
            loading.dismiss();
          });
        }
      });
    }
  }
}
