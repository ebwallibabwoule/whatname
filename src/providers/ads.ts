import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { DataProvider } from './data';
import 'rxjs/add/operator/take';

@Injectable()
export class Ads {
  constructor( private admobFree: AdMobFree, private data: DataProvider ) {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-5313588115397181/1243004268',
      autoShow: false
    };

    this.admobFree.banner.config(bannerConfig);
  }

  public show() {
    this.admobFree.banner.remove();
    this.data.getUserData().take(1).subscribe(userData => {
      if (userData && !userData.pro) {
        this.admobFree.banner.prepare()
          .then(() => {
            this.admobFree.banner.show();
          })
          .catch(e => console.log(e));
      }
    });
  }
}


