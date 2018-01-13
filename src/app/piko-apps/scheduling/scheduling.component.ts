import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { UtilitiesService } from '../../my-own-library/utilities.service';
import { CloudFirestoreMediatorService } from '../../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../../my-own-library/confirm-dialog.component';

import { SchedulingEvent, MySymbol } from './scheduling-event';


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit, OnDestroy {
  private alive = true;

  symbols$: Observable<MySymbol[]> = Observable.from([
      [
        { id: 'fav',      useThis: false, score: 10, iconName: 'favorite',               description: 'できればこの日で' },
        { id: 'ok',       useThis: true,  score: 10, iconName: 'radio_button_unchecked', description: '参加可能' },
        { id: 'maybe',    useThis: true,  score:  5, iconName: 'change_history',         description: '行けるかも' },
        { id: 'depends',  useThis: false, score:  5, iconName: 'watch',                  description: '時間によります' },
        { id: 'late',     useThis: false, score:  5, iconName: 'schedule',               description: '遅れてなら参加可能' },
        { id: 'unknown',  useThis: false, score:  5, iconName: 'help_outline',           description: '分からない' },
        { id: 'ng',       useThis: true,  score:  0, iconName: 'clear',                  description: '参加不可' },
        { id: 'kusonemi', useThis: false, score:  0, iconName: 'hotel',                  description: '起きられません' },
      ]] );

  newEvent = new SchedulingEvent();

  eventPageUrlPrefix = '';
  eventPageId = '';


  constructor(
    public dialog: MatDialog,
    public utils: UtilitiesService,
    private database: CloudFirestoreMediatorService
  ) {
  }

  ngOnInit() {
    this.newEvent.answerDeadline = undefined;  /* reset */
    this.eventPageUrlPrefix = window.location.href + '/answer/';

    this.symbols$
      .takeWhile( () => this.alive )
      .subscribe( val => this.newEvent.symbols = val );
  }

  ngOnDestroy() {
    this.alive = false;
  }


  /* callback functions */
  titleChange            ( value: string     ) { this.newEvent.title             = value; }
  notesChange            ( value: string     ) { this.newEvent.notes             = value; }
  selectedDatetimesChange( value: Date[]     ) { this.newEvent.selectedDatetimes = value; }
  answerDeadlineChange   ( value: Date       ) { this.newEvent.answerDeadline    = value; }
  symbolsChange          ( value: MySymbol[] ) { this.newEvent.symbols           = value; }
  passwordChange         ( value: string     ) { this.newEvent.password          = value; }


  createEvent( stepper: MatStepper ) {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = 'イベントを作成します。よろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        const databaseKey = this.database.scheduling.addEvent( this.newEvent ).key;
        this.eventPageId = databaseKey;
        stepper.next();
      }
    });
  }
}
