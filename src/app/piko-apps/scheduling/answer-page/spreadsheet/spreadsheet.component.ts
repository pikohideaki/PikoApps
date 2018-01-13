import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService } from '../../../../my-own-library/utilities.service';
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
export class SpreadsheetComponent implements OnInit, OnDestroy {
  private alive = true;

  flipTableState = true;

  @Input() private event$: Observable<SchedulingEvent>;
  event: SchedulingEvent;  /* for template */

  symbols: MySymbol[] = [];
  answers: Answer[] = [];
  selectedDatetimes: Date[] = [];

  @Input() private answerDeadlineExpired$: Observable<boolean>;
  answerDeadlineExpired: boolean;  /* for template */

  spreadSheet = {};  /* for template */

  @Output() answerIdChange = new EventEmitter<string>();

  dataIsReady = false;



  constructor(
    private dialog: MatDialog,
    public utils: UtilitiesService,
  ) {
  }

  ngOnInit() {
    const spreadSheet$: Observable<Object>
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

    const symbols$ = this.event$.map( e => e.symbols );
    const answers$ = this.event$.map( e => e.answers );
    const selectedDatetimes$ = this.event$.map( e => e.selectedDatetimes );

    /* subscriptions */
    this.event$
      .takeWhile( () => this.alive )
      .subscribe( val => this.event = val );
    this.answerDeadlineExpired$
      .takeWhile( () => this.alive )
      .subscribe( val => this.answerDeadlineExpired = val );
    spreadSheet$
      .takeWhile( () => this.alive )
      .subscribe( val => this.spreadSheet = val );

    symbols$
      .takeWhile( () => this.alive )
      .subscribe( val => this.symbols = val );
    answers$
      .takeWhile( () => this.alive )
      .subscribe( val => this.answers = val );
    selectedDatetimes$
      .takeWhile( () => this.alive )
      .subscribe( val => this.selectedDatetimes = val );

    Observable.combineLatest(
        this.event$,
        this.answerDeadlineExpired$,
        spreadSheet$ )
      .first()
      .subscribe( () => this.dataIsReady = true );
  }

  ngOnDestroy() {
    this.alive = false;
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
    return this.utils.average( scores );
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
}
