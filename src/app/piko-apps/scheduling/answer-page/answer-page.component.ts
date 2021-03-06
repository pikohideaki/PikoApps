
import {combineLatest as observableCombineLatest,  Observable ,  BehaviorSubject } from 'rxjs';

import {map, switchMap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { utils } from '../../../my-own-library/utilities';
import { CloudFirestoreMediatorService } from '../../../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../../../my-own-library/confirm-dialog.component';

import { SchedulingEvent, Answer, MySymbol } from '../scheduling-event';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { EditPasswordDialogComponent } from './edit-password-dialog.component';

@Component({
  selector: 'app-answer-page',
  templateUrl: './answer-page.component.html',
  styleUrls: [
    '../../../my-own-library/data-table/data-table.component.css',
    './answer-page.component.css'
  ]
})
export class AnswerPageComponent implements OnInit {

  eventId$: Observable<string>;
  event$: Observable<SchedulingEvent>;
  answerDeadlineExpired$: Observable<boolean>;

  private answerIdSource = new BehaviorSubject<string>('');
  answerId$ = this.answerIdSource.asObservable();



  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private database: CloudFirestoreMediatorService,
  ) {
  }


  ngOnInit() {
    // set browser title
    this.titleService.setTitle('日程調整');

    this.eventId$
      = this.route.paramMap.pipe(
          switchMap( (params: ParamMap) => params.getAll('eventId') ));

    this.event$
      = observableCombineLatest(
          this.database.schedulingEvents$,
          this.eventId$,
          (list, id) => ( list.find( e => e.databaseKey === id )
                          || new SchedulingEvent() ) );

    this.answerDeadlineExpired$
      = this.event$.pipe(map( e =>
          utils.date.compare(
              new Date(),
              utils.date.getTomorrow( e.answerDeadline )
            ) === 1 ));
  }


  answerIdOnChange( answerId: string ) {
    this.answerIdSource.next( answerId );
  }

  editEvent( eventId: string, password: string ) {
    const path = [`scheduling/edit-event/${eventId}`];
    if ( !password ) {
      this.router.navigate( path );
    } else {
      const dialogRef = this.dialog.open( EditPasswordDialogComponent );
      dialogRef.componentInstance.passwordAnswer = password;
      dialogRef.afterClosed().subscribe( result => {
        if ( result === 'yes' ) this.router.navigate( path );
      });
    }
  }

  scrollTo( targetElement ) {
    targetElement.scrollIntoView();
  }

  toYMD = utils.date.toYMD;

}
