import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatStepper, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';

import { CloudFirestoreMediatorService } from '../../../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../../../my-own-library/confirm-dialog.component';

import { SchedulingEvent, MySymbol } from '../scheduling-event';


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  title$:             Observable<string>;
  notes$:             Observable<string>;
  selectedDatetimes$: Observable<Date[]>;
  answerDeadline$:    Observable<Date>;
  symbols$:           Observable<MySymbol[]>;
  password$:          Observable<string>;

  private myEventId = '';  /* used in submitting to firebase */
  myEvent = new SchedulingEvent();

  dataIsReady = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private database: CloudFirestoreMediatorService
  ) {
    const myEventId$: Observable<string>
      = this.route.paramMap
          .switchMap( (params: ParamMap) => params.getAll('eventId') );

    const myEvent$: Observable<SchedulingEvent>
      = myEventId$.combineLatest(
            this.database.schedulingEvents$,
            (eventId, list) => list.find( e => e.databaseKey === eventId ) || new SchedulingEvent() );

    this.title$             = myEvent$.map( e => e.title );
    this.notes$             = myEvent$.map( e => e.notes );
    this.selectedDatetimes$ = myEvent$.map( e => e.selectedDatetimes );
    this.answerDeadline$    = myEvent$.map( e => e.answerDeadline );
    this.symbols$           = myEvent$.map( e => e.symbols );
    this.password$          = myEvent$.map( e => e.password );

    myEventId$.first().subscribe( val => this.myEventId = val );
    myEvent$.subscribe( val => {
      this.myEvent = val;
      this.dataIsReady = true;
    });
  }

  ngOnInit() {
  }


  /* callback functions */
  titleChange            ( value: string     ) { this.myEvent.title             = value; }
  notesChange            ( value: string     ) { this.myEvent.notes             = value; }
  selectedDatetimesChange( value: Date[]     ) { this.myEvent.selectedDatetimes = value; }
  answerDeadlineChange   ( value: Date       ) { this.myEvent.answerDeadline    = value; }
  symbolsChange          ( value: MySymbol[] ) { this.myEvent.symbols           = value; }
  passwordChange         ( value: string     ) { this.myEvent.password          = value; }


  exit() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = '更新を破棄して回答ページへ戻ります。よろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.router.navigate([`scheduling/answer/${this.myEventId}`]);
      }
    });
  }

  updateEvent() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'イベントを更新します。よろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        /* remove selection for removed dates from answers */
        const selectedDateValues = this.myEvent.selectedDatetimes.map( e => e.valueOf() );
        this.myEvent.answers.forEach( answer => {
          answer.selection
            = answer.selection.filter( sl => selectedDateValues.includes( sl.date.valueOf() ) );
        });
        /* add default selection to answers for added dates */
        this.myEvent.selectedDatetimes.forEach( date => {
          this.myEvent.answers.forEach( answer => {
            if ( !answer.selection.map( e => e.date.valueOf() ).includes( date.valueOf() ) ) {
              answer.selection.push( { date: date, symbolID: '' } );
            }
          });
        });

        this.database.scheduling.setEvent( this.myEventId, this.myEvent );
        this.router.navigate([`scheduling/answer/${this.myEventId}`]);
      }
    });
  }
}
