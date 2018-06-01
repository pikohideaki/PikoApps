import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatStepper, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/skip';

import { CloudFirestoreMediatorService } from '../../../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../../../my-own-library/confirm-dialog.component';

import { SchedulingEvent, MySymbol } from '../scheduling-event';


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  /**
   * ページ読み込み時のイベント情報 myEventInit を編集する．
   * [ToDo] 編集反映時に別のユーザーが編集を加えていたら確認
   */

  myEventId$: Observable<string>
    = this.route.paramMap
        .switchMap( (params: ParamMap) => params.getAll('eventId') );

  myEvent$: Observable<SchedulingEvent>
    = this.myEventId$.combineLatest(
        this.database.schedulingEvents$,
        (eventId, list) => list.find( e => e.databaseKey === eventId ) || new SchedulingEvent() );

  myEventInit$: Observable<SchedulingEvent>
    = this.myEvent$.first();

  private myEventEditingSource
    = new BehaviorSubject<SchedulingEvent>( new SchedulingEvent() );
  myEventEditing$
    = Observable.combineLatest(
        this.myEventInit$,
        this.myEventEditingSource.asObservable().skip(1) );


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private database: CloudFirestoreMediatorService
  ) {
  }

  ngOnInit() {
  }


  /* callback functions */
  titleChange( title: string ) {
    const curr = this.myEventEditingSource.getValue();
    curr.title = title;
    this.myEventEditingSource.next( curr );
  }
  notesChange( notes: string ) {
    const curr = this.myEventEditingSource.getValue();
    curr.notes = notes;
    this.myEventEditingSource.next( curr );
  }
  selectedDatetimesChange( selectedDatetimes: Date[] ) {
    const curr = this.myEventEditingSource.getValue();
    curr.selectedDatetimes = selectedDatetimes;
    this.myEventEditingSource.next( curr );
  }
  answerDeadlineChange( answerDeadline: Date ) {
    const curr = this.myEventEditingSource.getValue();
    curr.answerDeadline = answerDeadline;
    this.myEventEditingSource.next( curr );
  }
  symbolsChange( symbols: MySymbol[] ) {
    const curr = this.myEventEditingSource.getValue();
    curr.symbols = symbols;
    this.myEventEditingSource.next( curr );
  }
  passwordChange( password: string ) {
    const curr = this.myEventEditingSource.getValue();
    curr.password = password;
    this.myEventEditingSource.next( curr );
  }


  exit( myEventId: string ) {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = '更新を破棄して回答ページへ戻ります。よろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.router.navigate([`scheduling/answer/${myEventId}`]);
      }
    });
  }


  updateEvent( myEventId: string, myEvent: SchedulingEvent ) {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'イベントを更新します。よろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        /* remove selection for removed dates from answers */
        const selectedDateValues = myEvent.selectedDatetimes.map( e => e.valueOf() );
        myEvent.answers.forEach( answer => {
          answer.selection
            = answer.selection.filter( sl => selectedDateValues.includes( sl.date.valueOf() ) );
        });
        /* add default selection to answers for added dates */
        myEvent.selectedDatetimes.forEach( date => {
          myEvent.answers.forEach( answer => {
            if ( !answer.selection.map( e => e.date.valueOf() ).includes( date.valueOf() ) ) {
              answer.selection.push( { date: date, symbolID: '' } );
            }
          });
        });

        this.database.scheduling.setEvent( myEventId, myEvent );
        this.router.navigate([`scheduling/answer/${myEventId}`]);
      }
    });
  }
}
