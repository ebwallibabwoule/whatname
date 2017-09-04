import { Component, Input } from '@angular/core';
import { DataProvider } from '../../providers/data';
import 'rxjs/Rx';
import 'rxjs/add/operator/take';

import {
  StackConfig
} from 'angular2-swing';


@Component({
  selector: 'ion-card-container',
  templateUrl: 'card.html'
})

export class CardComponent {
  stackConfig: StackConfig;
  endPoint: string = '';
  cardStack: Array<any>;
  noCardsMessage: string = 'Loading more names';
  user;

  @Input() gender: string = 'girl';
  @Input() names;

  constructor( private data: DataProvider ) {
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
  }

  ngAfterViewInit() {
    this.data.getUserData().take(1).subscribe(( user ) => {
      this.user = user;
      this.endPoint = 'users/' + this.user.$key + '/names/' + this.gender;

      this.addNewCard();
    });
  }

  private onItemMove( element, x, y, r ) {
    element.style[ 'transform' ] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  private vote( like: boolean ) {
    this.data.list(this.endPoint + '/repo').remove(this.cardStack[ 0 ].$key).then(() => {
      if (like) {
        console.log('liked!', this.cardStack[ 0 ].$value);
        this.data.push(this.endPoint + '/liked', this.cardStack[ 0 ].$value);
      }
      else {
        console.log('unliked!', this.cardStack[ 0 ].$value);
        this.data.push(this.endPoint + '/unliked', this.cardStack[ 0 ].$value);
      }

      console.log('delll!', this.cardStack[ 0 ].$key);
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
          const newCurrentSet = userData.currentset + 1;
          this.data.list('names/' + userData.local + '/' + this.gender).take(1).subscribe(( names ) => {
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

  private sneak() {
    this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/excluded', this.cardStack[ 0 ].$value);
  }
}
