import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';

import { utils } from '../../../../my-own-library/utilities';
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

  @Input() eventId$: Observable<string>;
  @Input() event$: Observable<SchedulingEvent>;

  @Input() answerId$: Observable<string>;
  @Output() answerIdChange = new EventEmitter<string>();

  userName = '';  /* bound to input element */
  comment  = '';  /* bound to input element */

  private dateToSymbolIdSource = new BehaviorSubject<Object>({});
  dateToSymbolId$ = this.dateToSymbolIdSource.asObservable();
  allDatesSelected$: Observable<boolean>;


  constructor(
    private dialog: MatDialog,
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


  symbolSelected( date: Date, symbolId: string ) {
    const obj = this.dateToSymbolIdSource.value;
    obj[ date.valueOf() ] = symbolId;
    this.dateToSymbolIdSource.next( obj );
  }

  symbolHeaderSelected( symbolId: string ) {
    const obj = this.dateToSymbolIdSource.value;
    utils.object.forEach( obj, (_, key, o) => o[key] = symbolId );
    this.dateToSymbolIdSource.next( obj );
  }


  submitAnswer( eventId: string, answerId: string ) {
    const newAnswer = new Answer( null, {
      userName: this.userName,
      comment:  this.comment,
      selection:
        utils.object.keysAsNumber( this.dateToSymbolIdSource.value )
          .map( key => ({ dateValue: key, symbolID: this.dateToSymbolIdSource.value[key] }) ),
    });

    if ( answerId === '' ) {
      this.database.scheduling.addAnswer( eventId, newAnswer );
    } else {
      this.database.scheduling.setAnswer( eventId, answerId, newAnswer );
    }
    this.resetForm();
  }


  deleteAnswer( eventId: string, answerId: string ) {
    if ( !answerId ) return;
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'このデータを削除しますか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.database.scheduling.removeAnswer( eventId, answerId );
        this.resetForm();
      }
    });
  }
}
