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
  key: string = '';
  subset;

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

    this.data.getUserData().subscribe((user) => {

      this.user = user;
      this.getSubset();
      console.log('ddfregrthyjyhrtegrgthryjhteg', this.user.$key);

      this.data.list('users/' + this.user.$key + '/names/' + this.gender).subscribe(votes => {
        console.log('1ddfregrthyjyhrtegrgthryjhteg', this.user.$key);

        let excludedNamesArray = [];

        for (let i = 0; i <= votes.length; i++) {
          for (let vote in votes[ i ]) {
            excludedNamesArray.push(votes[ i ][ vote ]);
          }
        }

        this.subset = this.utils.substractArray(this.subset, excludedNamesArray);
        if (this.subset.length >= 0) {
          this.addNewCard();
          console.log('3ddfregrthyjyhrtegrgthryjhteg', this.user.$key);
        }
      });

    });


  }

  onItemMove( element, x, y, r ) {
    element.style[ 'transform' ] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  vote( like: boolean ) {
    this.recentCard = this.card[ 0 ].$value;

    console.log('dd', like, this.user, this.gender, this.recentCard, 'users/' + this.user.$key + '/names/' + this.gender + '/liked', this.recentCard);
    if (like) {
      this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/liked', this.recentCard);
    }
    else {
      this.data.push('users/' + this.user.$key + '/names/' + this.gender + '/unliked', this.recentCard);
    }
  }

  addNewCard() {
    this.card = [];
    if (this.subset.length > 0) {
      this.card = this.subset;
      this.subset.indexOf(this.subset, this.card[ 0 ].$value)
    }
    else {
      this.getSubset();
      this.addNewCard()
    }
  }

  getSubset() {
    const amount = 1;
    const random = Math.floor(Math.random() * this.names.length);
    const r = (random >= this.names.length - amount ) ? this.names.length : random;
    this.subset = this.names.slice(r, r + amount);
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

    //
  }
}
