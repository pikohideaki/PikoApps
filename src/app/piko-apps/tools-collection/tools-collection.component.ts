
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../../firebase-mediator/user.service';


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
    private user: UserService
  ) {
    this.apps$ = this.user.signedIn$.pipe(map( signedIn => [
        { routerLink: '/tools-collection/tsv2json',
          inService: true, title: 'CSV to JSON', subtitle: 'テキスト変換(CSV to JSON)' },
        { routerLink: '/tools-collection/json-pretty-print',
          inService: true, title: 'JSON Pretty Print', subtitle: 'テキスト変換（JSON整形）' },
      ] ));
  }

  ngOnInit() {
  }

}
