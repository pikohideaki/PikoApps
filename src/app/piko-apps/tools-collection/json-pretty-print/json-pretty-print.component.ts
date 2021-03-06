
import {combineLatest as observableCombineLatest,  Observable ,  BehaviorSubject } from 'rxjs';

import {map, debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-json-pretty-print',
  templateUrl: './json-pretty-print.component.html',
  styleUrls: ['./json-pretty-print.component.css']
})
export class JsonPrettyPrintComponent implements OnInit {

  inputSource  = new BehaviorSubject<string>('');

  spacerSource = new BehaviorSubject<string>('  ');
  spacer$ = this.spacerSource.asObservable().pipe(debounceTime( 300 /* ms */ ));

  obj$
    = this.inputSource.asObservable().pipe(
        debounceTime( 300 /* ms */ ),
        map( input => {
          try {
            return JSON.parse( input );
          } catch (e) {
            return;
          }
        }),);

  output$: Observable<string>
    = observableCombineLatest( this.obj$, this.spacer$ ).pipe(
        map( val => this.convert( val[0], val[1] ) ));

  constructor() { }

  ngOnInit() {
  }


  spacerChange( value: string ) {
    this.spacerSource.next( value );
  }

  inputTextOnInput( value: string ) {
    this.inputSource.next( value );
  }

  convert( data, spacer ) {
    return JSON.stringify( data, null, spacer );
  }

}
