import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';

import { UtilitiesService } from '../../../../my-own-library/utilities.service';
import { CloudFirestoreMediatorService } from '../../../../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../../../../my-own-library/confirm-dialog.component';

import { SchedulingEvent, Answer, MySymbol } from '../../scheduling-event';



@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: [
    '../../../../my-own-library/data-table/data-table.component.css',
    './answer-form.component.css'
  ]
})
export class AnswerFormComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() private eventId: string;
  @Input() event$: Observable<SchedulingEvent>;
  event: SchedulingEvent;

  @Input() answerId$: Observable<string>;
  answerId: string;
  @Output() answerIdChange = new EventEmitter<string>();

  userName = '';  /* bound to input element */
  comment  = '';  /* bound to input element */

  private dateToSymbolIdSource = new BehaviorSubject<Object>({});
  dateToSymbolId$ = this.dateToSymbolIdSource.asObservable();
  dateToSymbolId: Object;
  allDatesSelected$: Observable<boolean>;
  allDatesSelected: boolean;


  constructor(
    private dialog: MatDialog,
    public utils: UtilitiesService,
    private database: CloudFirestoreMediatorService,
  ) { }


  ngOnInit() {
    this.allDatesSelected$
      = this.dateToSymbolId$.map( obj => Object.keys(obj).every( date => obj[date] !== '' ) );

    const selectedUsersAnswer$: Observable<Answer|undefined>
      = this.answerId$.combineLatest(
            this.event$.map( e => e.answers ),
            (answerId, answers) => ( answers.find( e => e.databaseKey === answerId ) || new Answer() ) );

    /* subscriptions */
    this.allDatesSelected$
      .takeWhile( () => this.alive )
      .subscribe( val => this.allDatesSelected = val );

    this.answerId$
      .takeWhile( () => this.alive )
      .subscribe( val => this.answerId = val );

    this.event$
      .takeWhile( () => this.alive )
      .subscribe( val => this.event = val );

    this.dateToSymbolId$
      .takeWhile( () => this.alive )
      .subscribe( val => this.dateToSymbolId = val );

    this.event$
      .takeWhile( () => this.alive )
      .subscribe( event => {
        /* initialize */
        const obj = this.dateToSymbolIdSource.value;
        event.selectedDatetimes.forEach( date => obj[ date.valueOf() ] = '' );
        this.dateToSymbolIdSource.next( obj );
      });

    selectedUsersAnswer$
      .takeWhile( () => this.alive )
      .subscribe( answer => {
        this.userName = answer.userName;
        this.comment  = answer.comment;
        const obj = this.dateToSymbolIdSource.value;
        answer.selection.forEach( e => obj[ e.date.valueOf() ] = e.symbolID );
        this.dateToSymbolIdSource.next( obj );
      });

  }

  ngOnDestroy() {
    this.alive = false;
  }



  userNameOnChange( value: string ) {
    this.userName = value;
  }

  commentOnChange( comment: string ) {
    this.comment = comment;
  }

  resetForm() {
    this.userName = '';
    this.comment = '';
    this.answerIdChange.emit('');
    const obj = this.dateToSymbolIdSource.value;
    Object.keys( obj ).forEach( key => obj[key] = '' );
    this.dateToSymbolIdSource.next( obj );
  }


  symbolSelected( date: Date, symbolID: string ) {
    const obj = this.dateToSymbolIdSource.value;
    obj[ date.valueOf() ] = symbolID;
    this.dateToSymbolIdSource.next( obj );
  }

  symbolHeaderSelected( symbolID: string ) {
    const obj = this.dateToSymbolIdSource.value;
    this.utils.objectForEach( obj, (_, key, o) => o[key] = symbolID );
    this.dateToSymbolIdSource.next( obj );
  }


  submitAnswer() {
    const answerId = this.answerId;
    const newAnswer = new Answer( null, {
      userName: this.userName,
      comment:  this.comment,
      selection:
        this.utils.objectKeysAsNumber( this.dateToSymbolIdSource.value )
          .map( key => ({ dateValue: key, symbolID: this.dateToSymbolIdSource.value[key] }) ),
    });

    if ( answerId === '' ) {
      this.database.scheduling.addAnswer( this.eventId, newAnswer );
    } else {
      this.database.scheduling.setAnswer( this.eventId, answerId, newAnswer );
    }
    this.resetForm();
  }

  deleteAnswer() {
    const answerId = this.answerId;
    if ( !answerId ) return;
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'このデータを削除しますか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.database.scheduling.removeAnswer( this.eventId, answerId );
        this.resetForm();
      }
    });
  }
}
