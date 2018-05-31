import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from './firebase-mediator/my-user-info.service';


@Component({
  selector: 'app-home',
  template: `
    <div class="body-with-padding">
      <app-list appName="Piko Apps" [apps$]="apps$" > </app-list>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {

  apps$: Observable<{
      routerLink:  string,
      inService:   boolean,
      title:       string,
      subtitle:    string,
      description?: string
    }[]>;

  constructor(
    private user: UserService
  ) {
    this.apps$ = this.user.signedIn$.map( signedIn => [
        { routerLink: '/scheduling',       inService: true, title: 'Scheduling',       subtitle: '日程調整' },
        { routerLink: '/toybox',           inService: true, title: 'Toy Box',          subtitle: 'おもちゃ' },
        { routerLink: '/tools-collection', inService: true, title: 'Tools Collection', subtitle: 'ツール集' },
      ] );
  }

  ngOnInit() {
  }
}
