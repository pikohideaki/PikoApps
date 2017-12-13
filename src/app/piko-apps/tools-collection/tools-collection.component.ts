import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MyUserInfoService } from '../../firebase-mediator/my-user-info.service';

@Component({
  selector: 'app-tools-collection',
  template: `
    <div class="body-with-padding">
      <app-list appName="Tools Collection" [apps$]="apps$" > </app-list>
    </div>
  `,
  styles: []
})
export class ToolsCollectionComponent implements OnInit {

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
        { routerLink: '/tools-collection/tsv2json',
          inService: true, title: 'CSV to JSON', subtitle: 'テキスト変換(CSV to JSON)' },
        { routerLink: '/tools-collection/json-pretty-print',
          inService: true, title: 'JSON pretty print', subtitle: 'テキスト変換（JSON整形）' },
      ] );
  }

  ngOnInit() {
  }

}
