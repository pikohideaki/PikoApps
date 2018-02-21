import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-tsv2json',
  templateUrl: './tsv2json.component.html',
  styleUrls: [
    '../../../my-own-library/data-table/data-table.component.css',
    './tsv2json.component.css'
  ]
})
export class Tsv2jsonComponent implements OnInit {

  separators = [
      { value: '\t', viewValue: 'タブ (\\t)' },
      { value: ',',  viewValue: 'カンマ (,)' },
    ];
  separatorSource = new BehaviorSubject<string>('\t');
  separator$ = this.separatorSource.asObservable();

  tsvHeaderTextSource = new BehaviorSubject<string>('');
  tsvTextSource       = new BehaviorSubject<string>('');

  tableHeader$: Observable<string[]>;
  table$: Observable<any[][]>;

  jsonText$: Observable<string>;



  constructor() {
    this.tableHeader$
      = Observable.combineLatest(
            this.tsvHeaderTextSource.asObservable(),
            this.separator$ )
          .map( val => val[0].replace(/\n+$/g, '').split( val[1] ) );  // 末尾の改行は削除

    this.table$
      = Observable.combineLatest(
            this.tsvTextSource.asObservable(),
            this.separator$ )
          .map( val => {
              const lines = val[0].replace(/\n+$/g, '').split('\n');
              return lines.map( line => line.split( val[1] ).map( this.replacer ) );
          });

    this.jsonText$
      = Observable.combineLatest(
            this.tableHeader$,
            this.table$ )
          .debounceTime( 300 /* ms */ )
          .map( val => this.tsv2json( val[0], val[1] ) );
  }

  ngOnInit() {
  }


  replacer( e: string ) {
    if ( e.match(/^-?[0-9]+$/) ) return Number(e);
    if ( e === 'true'  ) return true;
    if ( e === 'false' ) return false;
    return e;
  }


  changeSeparator( sep: string ) {
    console.log(sep);
    this.separatorSource.next( sep );
  }

  tsvHeaderOnInput( value: string ) {
    this.tsvHeaderTextSource.next( value );
  }

  tsvOnInput( value: string ) {
    this.tsvTextSource.next( value );
  }

  tsv2json( tableHeader: string[], table: any[][] ) {
    const data = table.map( line => {
      const obj = {};
      tableHeader.forEach( (e, i) => obj[e] = line[i] );
      return obj;
    });
    return JSON.stringify( data, null, ' ' );
  }



}
