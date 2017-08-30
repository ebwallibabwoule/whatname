import { DataProvider } from '../../providers/data';
import { Component, ViewChildren, OnInit } from '@angular/core';
import { UtilsProvider } from '../../providers/utils';

@Component({
  selector: 'liked',
  templateUrl: 'liked.html',
  queries: {
    slideItem: new ViewChildren('slidingItemprepop'),
    item: new ViewChildren('itemprepop')
  }
})

export class LikedComponent {
  @ViewChildren('slidingItemprepop') slideItem: any;
  @ViewChildren('itemprepop') item: any;
  voted = { 'boy': [], 'girl': [] };
  unliked = { 'boy': [], 'girl': [] };
  matched = { 'boy': [], 'girl': [] };
  key: string = '';
  visible: boolean = false;
  unlikedVisible: boolean = false;
  objectKeys: any = Object.keys;
  // monster = {
  //   'boys': {
  //     'liked': [],
  //     'unliked': [],
  //     'matched': []
  //   },
  //   'girls': {
  //     'liked': [],
  //     'unliked': [],
  //     'matched': []
  //   },
  // };

  constructor( private data: DataProvider, private utils: UtilsProvider ) {
    this.data.getUserData().subscribe(data => {
      this.key = data.$key;

      this.data.list('users/' + this.key + '/names/boy/liked').subscribe(votes => {
        this.voted.boy = votes;
        // this.monster.boy.liked = votes;
      });

      this.data.list('users/' + this.key + '/names/girl/liked').subscribe(votes => {
        this.voted.girl = votes;
        // this.monster.girl.liked = votes;
      });

      if (data.match) {
        this.data.getMatchedUserData().subscribe(matchedData => {
          this.data.list('users/' + matchedData.$key + '/names/boy/liked').subscribe(votes => {
            this.matched.boy = this.utils.getDupes(votes, this.voted.boy);
            // this.monster.boy.matched = this.matched.boy;
          });

          this.data.list('users/' + matchedData.$key + '/names/girl/liked').subscribe(votes => {
            this.matched.girl = this.utils.getDupes(votes, this.voted.girl);
            // this.monster.girl.matched = this.matched.girl;
          });
        });
      }

      this.visible = true;
    });
  }

  ngOnInit() {
    setTimeout(() => {
        this.prepop();
      }, 1000
    );
  }

  private getUnliked() {
    this.unlikedVisible = true;

    this.data.list('users/' + this.key + '/names/boy/unliked').subscribe(votes => {
      this.unliked.boy = votes;
    });

    this.data.list('users/' + this.key + '/names/girl/unliked').subscribe(votes => {
      this.unliked.girl = votes;
    });
  }

  private vote( gender, item, like = true ) {
    console.log(gender, item, like );
    const likePath = (like) ? '/liked' : '/unliked';
    this.data.push('users/' + this.key + '/names/' + gender + likePath, item.$value);
    this.remove(gender, item, !like);
  }

  private remove( gender, item, like = true ) {
    const likePath = (like) ? '/liked' : '/unliked';
    this.data.list('users/' + this.key + '/names/' + gender + likePath).remove(item.$key);
  }

  private prepop() {
    let timer = 25;
    this.slideItem._results.forEach(( slideItem, index ) => {
      if (index < 10) {
        setTimeout(() => {
          slideItem.setElementClass('active-sliding', true);
          slideItem.setElementClass('active-slide', true);
          slideItem.setElementClass('active-options-right', true);
          slideItem.item.setElementClass('prepop', true);

          setTimeout(() => {
            slideItem.item.setElementClass('prepop', false);
          }, timer * index + 500);
          setTimeout(() => {
            slideItem.setElementClass('active-sliding', false);
            slideItem.setElementClass('active-slide', false);
            slideItem.setElementClass('active-options-right', false);
          }, timer * index + 1000);
        }, timer * index)
      }
    });
  }
}
