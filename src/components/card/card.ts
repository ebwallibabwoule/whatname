import { Component, ViewChild, Input } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { UtilsProvider } from '../../providers/utils';
import 'rxjs/Rx';

import {
  StackConfig,
  DragEvent,
  SwingStackComponent
} from 'angular2-swing';


@Component({
  selector: 'ion-card-container',
  templateUrl: 'card.html'
})

export class CardComponent {
  @ViewChild('swingstack') swingStack: SwingStackComponent;

  card: Array<any> = [];
  cardsIn: Array<any> = [];
  stackConfig: StackConfig;
  recentCard: string = '';
  subset;
  excludedNamesArray: Array<any> = [];

  @Input() gender: string = 'girl';
  @Input() names;
  user;


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
  }

  ngAfterViewInit() {
    if (this.cardsIn.length > 0) {
      this.swingStack.throwin.subscribe(( event: DragEvent ) => {
        event.target.style.background = '#ffffff';
      });
    }

    let userService = this.data.getUserData().subscribe(( user ) => {

      userService.unsubscribe();

      this.user = user;
      this.data.list('users/' + this.user.$key + '/names/' + this.gender).subscribe(votes => {

        this.excludedNamesArray = [];

        for (let i = 0; i <= votes.length; i++) {
          for (let vote in votes[ i ]) {
            this.excludedNamesArray.push(votes[ i ][ vote ]);
          }
        }

        this.addNewCard();
      });
    });
  }

  onItemMove( element, x, y, r ) {
    element.style[ 'transform' ] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  vote( like: boolean ) {
    this.recentCard = this.card[ 0 ].$value;
    if (like) {
      this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/liked', this.recentCard);
    }
    else {
      this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/unliked', this.recentCard);
    }
  }

  addNewCard() {
    this.card = [];
    this.getSubset();
    if (this.subset && this.subset.length > 0) {
      this.card = this.subset;
      this.subset.indexOf(this.subset, this.card[ 0 ].$value);
    }
  }

  getSubset() {
    const amount = 1;
    const a = this.utils.substractArray(this.names, this.excludedNamesArray);
    const random = Math.floor(Math.random() * a.length);
    const r = (random >= a.length - amount ) ? a.length - amount : random;

    this.subset = a.slice(r, r + amount);
    //
    console.log('1this.subset', this.subset);
    console.log('1this.excludedNamesArray', this.excludedNamesArray);
    console.log('1a', a);
    console.log('1r', r);
    console.log('1random', random);
    console.log('1slice', a.slice(r, r + amount));

  }

  decimalToHex( d, padding ) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === 'undefined' || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
      hex = '0' + hex;
    }

    return hex;
  }

  sneak() {
    this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/excluded', this.card[ 0 ].$value);
  }
}
