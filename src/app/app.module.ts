import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { WhatNameApp } from './app.component';

import { AccountPage } from '../pages/account/account';
import { GirlPage } from '../pages/girl/girl';
import { BoyPage } from '../pages/boy/boy';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpModule } from '@angular/http';
import { SwingModule } from 'angular2-swing';
import { DataProvider } from '../providers/data';
import { AuthProvider } from '../providers/auth';
import { UtilsProvider } from '../providers/utils';

import { InviteComponent } from '../components/invite/invite';
import { CardComponent } from '../components/card/card';
import { LikedComponent } from '../components/liked/liked';
import { UserComponent } from '../components/user/user';
import { ConnectAccountsComponent } from '../components/connect-accounts/connect-accounts';
import { RegisterComponent } from '../components/register/register';
import { AddNameComponent } from '../components/add-name/add-name';

declare var window;

export class MyErrorHandler implements ErrorHandler {
  handleError( err: any ): void {
    window.Ionic.handleNewError(err);
  }
}

export const firebaseConfig = {
  apiKey: 'AIzaSyAOk1hjvqnhf2WLramxxzAWocIJ7RGDd9Y',
  authDomain: 'whatname-420ab.firebaseapp.com',
  databaseURL: 'https://whatname-420ab.firebaseio.com',
  storageBucket: 'whatname-420ab.appspot.com'
};

@NgModule({
  declarations: [
    WhatNameApp,
    AccountPage,
    GirlPage,
    BoyPage,
    TabsPage,
    SettingsPage,
    RegisterPage,
    InviteComponent,
    CardComponent,
    LikedComponent,
    UserComponent,
    RegisterComponent,
    ConnectAccountsComponent,
    AddNameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SwingModule,
    IonicModule.forRoot(WhatNameApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    WhatNameApp,
    AccountPage,
    GirlPage,
    BoyPage,
    TabsPage,
    SettingsPage,
    RegisterPage,
    InviteComponent,
    CardComponent,
    LikedComponent,
    UserComponent,
    RegisterComponent,
    ConnectAccountsComponent,
    AddNameComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    AuthProvider,
    UtilsProvider,
    NativeStorage
  ]
})

export class AppModule {
}
