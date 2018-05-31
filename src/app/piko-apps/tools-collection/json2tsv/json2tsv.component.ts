import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/debounceTime';
import { utils } from '../../../my-own-library/utilities';


@Component({
  selector: 'app-json2tsv',
  templateUrl: './json2tsv.component.html',
  styleUrls: [
    '../../../my-own-library/data-table/data-table.component.css',
    './json2tsv.component.css'
  ]
})
export class Json2tsvComponent implements OnInit {

  // private separatorSource = new BehaviorSubject<string>(' ');
  // separator$ = this.separatorSource.asObservable();

  // private jsonTextSource = new BehaviorSubject<string>('');
  // private jsonText$ = this.jsonTextSource.asObservable()
  //                       .debounceTime( 300 /* ms */ );

  // object$ = this.jsonText$.map( text => {
  //               try {
  //                 return JSON.parse( text );
  //               } catch (e) {
  //                 return [];
  //               }
  //             });

  // asArray$: Observable<any[]>
  //   = this.object$.map( obj => ( Array.isArray(obj) ? obj : [] ) );

  // isObjectArray$: Observable<boolean>
  //   = this.asArray$.map( array => array.every( e => typeof(e) === 'object' ) );

  // table$: Observable<Object[]>
  //   = Observable.combineLatest( this.asArray$, this.isObjectArray$,
  //       (asArray, isObjectArray) => ( isObjectArray ? asArray : [] ) );

  // keys$: Observable<string[]>
  //   // = this.table$.map( table => utils.array. [].concat( table.map( Object.keys ) ) );

  // tsvText$: Observable<string>;


  constructor() { }

  ngOnInit() {
  }

}
