import { Component, Input } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { StackConfig } from 'angular2-swing';
import { UtilsProvider } from '../../providers/utils';
import 'rxjs/Rx';
import 'rxjs/add/operator/take';


@Component({
  selector: 'ion-card-container',
  templateUrl: 'card.html'
})

export class CardComponent {
  stackConfig: StackConfig;
  endPoint: string = '';
  cardStack: Array<any>;
  noCardsMessage: string = 'Loading names...';
  user: any;
  match: boolean = false;
  matchedUserLikes: Array<any> = [];
  names: Array<any> = [];
  counter: number = 0;

  @Input() gender: string = 'girl';

  constructor( private data: DataProvider, private utils: UtilsProvider ) {
    this.stackConfig = {
      throwOutConfidence: ( offsetX, offsetY, element ) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
      },
      transform: ( element, x, y, r ) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: ( d ) => {
        return 800;
      }
    };

    this.utils.load({ text: 'Loading ' + this.gender + ' names', show: true });
    this.data.getUserData().take(1).subscribe(( user ) => {
      this.user = user;
      this.endPoint = 'users/' + this.user.$key + '/names/' + this.gender;

      this.data.list(this.endPoint + '/repo').subscribe(names => {
        this.names = names;

        this.counter += 1;
        if (this.counter == 1) {
          this.addNewCard();
          this.utils.load({ show: false });
        }

        if (user.match) {
          this.data.getMatchedUserData().take(1).subscribe(matchedData => {
            this.data.list('users/' + matchedData.$key + '/names/' + this.gender + '/liked').subscribe(votes => {
              this.matchedUserLikes = votes;
            });
          });
        }
      });
    });
  }

  private nameMatches( name ) {
    return this.matchedUserLikes.some(function ( ob ) {
      return ob.$value == name;
    });
  }

  private onItemMove( element, x, y, r ) {
    element.style[ 'transform' ] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  public vote( like: boolean ) {
    const card = this.cardStack[ 0 ];
    this.data.list(this.endPoint + '/repo').remove(card.$key).then(() => {
      if (like) {
        this.data.push(this.endPoint + '/liked', card.$value);

        if (this.matchedUserLikes.length > 0 && this.nameMatches(card.$value)) {
          this.utils.toast({ message: card.$value + ' matched!' });
          this.match = true;
          setTimeout(() => {
            this.match = false;
          }, 3000);
        }
      }
      else {
        this.data.push(this.endPoint + '/unliked', card.$value);
      }

      this.addNewCard();
    });
  }

  private addNewCard() {
    this.cardStack = [];
    if (this.names.length > 0) {
      const newCard = this.names[ Math.floor(Math.random() * this.names.length) ];

      if (newCard) {
        this.cardStack.push(newCard);
      }
    }
    else {
      this.data.object(this.endPoint).take(1).subscribe(( userData ) => {
        if (userData.totalset > userData.currentset) {
          this.data.list('names/' + this.user.local + '/' + this.gender).take(1).subscribe(( names ) => {
            const newCurrentSet = userData.currentset + 1;
            this.names = names.slice(userData.currentset * userData.setsize, newCurrentSet * userData.setsize);

            /* Loop through list and keep keys and values intact and set it as objects in personal name repo  */
            let key = [];
            for (let a = 0; a < this.names.length; a++) {
              key[ this.names[ a ].$key ] = this.names[ a ].$value;
              this.data.object(this.endPoint + '/repo').set(key);
            }

            this.data.object(this.endPoint + '/currentset').set(newCurrentSet);

            const newCard = this.names[ Math.floor(Math.random() * this.names.length) ];
            this.cardStack.push(newCard);
          });
        }
        else {
          this.noCardsMessage = 'You\'ve seen all names!';
        }
      });
    }
  }

  public sneak() {
    this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/excluded', this.cardStack[ 0 ].$value);
  }
}
