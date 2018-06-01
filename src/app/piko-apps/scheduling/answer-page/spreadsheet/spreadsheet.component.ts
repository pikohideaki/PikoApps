import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { utils } from '../../../../my-own-library/utilities';
import { AlertDialogComponent } from '../../../../my-own-library/alert-dialog.component';
import { SchedulingEvent, Answer, MySymbol } from '../../scheduling-event';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: [
    '../../../../my-own-library/data-table/data-table.component.css',
    './spreadsheet.component.css'
  ]
})
export class SpreadsheetComponent implements OnInit {

  @Input() answerDeadlineExpired$: Observable<boolean>;
  @Input() event$: Observable<SchedulingEvent>;
  @Output() answerIdChange = new EventEmitter<string>();

  symbols$:           Observable<MySymbol[]>
    = this.event$.map( e => e.symbols );
  answers$:           Observable<Answer[]>
    = this.event$.map( e => e.answers );
  selectedDatetimes$: Observable<Date[]>
    = this.event$.map( e => e.selectedDatetimes );

  spreadSheet$: Observable<Object>
      = this.event$.map( event => {
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
      });

  flipTableState: boolean = true;


  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }


  flipTable() {
    this.flipTableState = !this.flipTableState;
  }


  /* for print */
  getAverageScore( event: SchedulingEvent, date: Date ) {
    const symbolIdsOfDate
      = event.answers
          .map( ans => ans.selection )
          .map( selections => selections.find( e => e.date.valueOf() === date.valueOf() ) )
          .filter( e => e !== undefined )
          .map( e => e.symbolID );
    const scores = symbolIdsOfDate.map( id =>
        (event.symbols.find( e => e.id === id ) || new MySymbol() ).score );
    return utils.number.roundAt( utils.array.average( scores ), 3 );
  }

  /* for print */
  getIconNameOfAnswer( answer: Answer, date: Date, symbols: MySymbol[] ): string {
    const selection = answer.selection.find( e => e.date.valueOf() === date.valueOf() );
    if ( !selection ) return '';
    const symbol = symbols.find( e => e.id === selection.symbolID );
    return ( !!symbol ? symbol.iconName : '' );
  }


  commentOnClick( comment: string ) {
    const dialogRef = this.dialog.open( AlertDialogComponent );
    dialogRef.componentInstance.message = comment;
  }


  userClicked( answer: Answer ) {
    this.answerIdChange.emit( answer.databaseKey );
  }

  toYMD( date: Date ) {
    return utils.date.toYMD(date);
  }
  getDayStringJp( date: Date ) {
    return utils.date.getDayStringJp(date);
  }
  toHM( date: Date ) {
    return utils.date.toHM(date);
  }

}
