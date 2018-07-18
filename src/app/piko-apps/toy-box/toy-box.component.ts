
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../../firebase-mediator/user.service';


@Component({
  selector: 'app-toy-box',
  template: `
    <div class="body-with-padding">
      <app-list appName="Toy Box" [apps$]="apps$" > </app-list>
    </div>
  `,
  styles: [],
})
export class ToyBoxComponent implements OnInit {

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
        { routerLink: '/toybox/lambda-interpreter',
          inService: true, title: 'Lambda Calculus Interpreter', subtitle: 'λ計算インタプリタ' },
      ] ));
  }

  ngOnInit() {
  }

}
