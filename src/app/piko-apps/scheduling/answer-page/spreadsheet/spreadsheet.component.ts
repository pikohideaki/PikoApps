
import {map} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { SchedulingEvent, Answer, MySymbol } from '../../scheduling-event';
import { utils } from '../../../../my-own-library/utilities';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styles: []
})
export class SpreadsheetComponent implements OnInit {

  @Input() answerDeadlineExpired$: Observable<boolean>;
  @Input() event$: Observable<SchedulingEvent>;
  @Output() answerIdChange = new EventEmitter<string>();

  symbols$:           Observable<MySymbol[]>;
  answers$:           Observable<Answer[]>;
  selectedDatetimes$: Observable<Date[]>;
  spreadSheet$:       Observable<Object>;

  flipTableState: boolean = true;  // date-user <--> user-date


  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.symbols$ = this.event$.pipe(map( e => e.symbols ));

    this.answers$ = this.event$.pipe(map( e => e.answers ));

    this.selectedDatetimes$
      = this.event$.pipe(map( e => e.selectedDatetimes ));

    this.spreadSheet$ = this.event$.pipe(map( event => {
        const symbolIDs = event.symbols.filter( e => e.useThis ).map( e => e.id );
        const dates = event.selectedDatetimes;
        const spreadSheet = {};
        dates.forEach( date => {
          spreadSheet[ date.valueOf() ] = {};
          symbolIDs.forEach( id => spreadSheet[ date.valueOf() ][ id ] = 0 );
        });
        event.answers.forEach( answer =>
          answer.selection.forEach( val => {
            if ( !!spreadSheet[ val.date.valueOf() ] ) {
              spreadSheet[ val.date.valueOf() ][ val.symbolID ]++;
            }
          }) );
        return spreadSheet;
      }));
  }

  answerOnSelect( answer: Answer ) {
    this.answerIdChange.emit( answer.databaseKey );
  }

}
