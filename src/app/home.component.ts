import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MyUserInfoService } from './firebase-mediator/my-user-info.service';


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
    private myUserInfo: MyUserInfoService
  ) {
    this.apps$ = this.myUserInfo.signedIn$.map( signedIn => [
        { routerLink: '/scheduling' , inService: true, title: 'Scheduling', subtitle: '日程調整', },
      ] );
  }

  ngOnInit() {
  }
}
