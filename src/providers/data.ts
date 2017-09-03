import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../providers/auth';

@Injectable()
export class DataProvider {
  constructor( private db: AngularFireDatabase, private auth: AuthProvider ) {
  }

  getUserData() {
    return Observable.create(
      observer => {
        let userService = this.auth.getUser().subscribe(user => {
            const u = this.db.list('users', {
              query: {
                orderByChild: 'uid',
                equalTo: user.uid
              }
            });

            u.subscribe(userResult => {
              if (userResult.length > 0) {
                observer.next(userResult[ 0 ]);
              }
              else {
                observer.next({ 'err': userResult, 'uid': user.uid });
              }
            });
            userService.unsubscribe();
          },
        ( error ) => {
          userService.unsubscribe();
        });
      });
  }

  getMatchedUserData() {
    return Observable.create(
      observer => {
        this.getUserData().subscribe(userData => {

          const u = this.db.list('users', {
            query: {
              orderByChild: 'uid',
              equalTo: userData.match
            }
          });

          u.subscribe(userResult => {
            if (userResult.length > 0) {
              observer.next(userResult[ 0 ]);
            }
            else {
              observer.next({ 'err': userResult, 'uid': userData.uid });
            }
          });
        });
      });
  }

  list( path: string, options = {} ): FirebaseListObservable<any> {
    return this.db.list(path, options);
  }

  push( path: string, data: any ) {
    return this.db.list(path).push(data);
  }

  object( path: string ): FirebaseObjectObservable<any> {
    return this.db.object(path);
  }

  setUserValue( key, value ) {
    return Observable.create(
      observer => {
        this.getUserData().subscribe(userData => {
          const root = 'users';
          const matchingUser = this.db.list(root, {
            query: {
              orderByChild: 'uid',
              equalTo: userData.uid
            }
          });

          const matchingUserService = matchingUser.subscribe(userResult => {
            if (userResult.length == 1) {
              const user = userResult[ 0 ];
              if (!user.hasOwnProperty(key)) {

                user[ key ] = value;
                this.db.object(root + '/' + user.$key).set(user);
              }
            }
            else if (userResult.length == 0 && key == 'uid') {
              const tempArray = [];
              tempArray[ key ] = value;
              matchingUser.push(tempArray).then(() => {
                observer.next();
              });
            }
            matchingUserService.unsubscribe();
          });
        });
      }
    );
  }
}