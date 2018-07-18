
import {first, switchMap, combineLatest} from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatStepper, MatDialog } from '@angular/material';
import { Observable ,  BehaviorSubject } from 'rxjs';



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
    = this.route.paramMap.pipe(
        switchMap( (params: ParamMap) => params.getAll('eventId') ));

  private myEvent$: Observable<SchedulingEvent>
    = this.myEventId$.pipe(combineLatest(
        this.database.schedulingEvents$,
        (id, list) => list.find( e => e.databaseKey === id ) || new SchedulingEvent() ));

  myEventEditing: SchedulingEvent = new SchedulingEvent();

  passwordEnabled: boolean = false;




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private database: CloudFirestoreMediatorService
  ) {
  }

  ngOnInit() {
    this.myEvent$.pipe(first()).subscribe( myEventInit => {
      console.log(myEventInit);

      this.myEventEditing = myEventInit;
    });
  }


  /* callback functions */
  // titleChange( title: string ) {
  //   this.myEventEditing.title = title;
  // }
  // notesChange( notes: string ) {
  //   this.myEventEditing.notes = notes;
  // }
  // selectedDatetimesChange( selectedDatetimes: Date[] ) {
  //   this.myEventEditing.selectedDatetimes = selectedDatetimes;
  // }
  // answerDeadlineChange( answerDeadline: Date ) {
  //   this.myEventEditing.answerDeadline = answerDeadline;
  // }
  // symbolsChange( symbols: MySymbol[] ) {
  //   this.myEventEditing.symbols = symbols;
  // }
  // passwordChange( password: string ) {
  //   this.myEventEditing.password = password;
  // }


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
