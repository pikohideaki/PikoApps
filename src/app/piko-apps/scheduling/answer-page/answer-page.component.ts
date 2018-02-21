import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatDialog } from '@angular/material';

import { UtilitiesService } from '../../../my-own-library/utilities.service';
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
export class AnswerPageComponent implements OnInit, OnDestroy {
  private alive = true;

  eventId$: Observable<string>;
  eventId: string;  /* for routing */
  event$: Observable<SchedulingEvent>;
  event: SchedulingEvent;  /* for template */
  answerDeadlineExpired$: Observable<boolean>;
  answerDeadlineExpired: boolean;  /* for template */

  private answerIdSource = new BehaviorSubject<string>('');
  answerId$ = this.answerIdSource.asObservable();



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public utils: UtilitiesService,
    private database: CloudFirestoreMediatorService,
  ) {
  }


  ngOnInit() {
    this.eventId$
      = this.route.paramMap
          .switchMap( (params: ParamMap) => params.getAll('eventId') );

    this.event$
      = Observable.combineLatest(
          this.database.schedulingEvents$,
          this.eventId$,
          (list, id) => list.find( e => e.databaseKey === id ) );

    this.answerDeadlineExpired$
      = this.event$.map( e =>
          this.utils.compareDates( new Date(), this.utils.getTomorrow( e.answerDeadline ) ) === 1 );

    /* subscriptions */
    this.event$
      .takeWhile( () => this.alive )
      .subscribe( val => this.event = val );
    this.eventId$
      .takeWhile( () => this.alive )
      .subscribe( val => this.eventId = val );
    this.answerDeadlineExpired$
      .takeWhile( () => this.alive )
      .subscribe( val => this.answerDeadlineExpired = val );
  }

  ngOnDestroy() {
    this.alive = false;
  }


  answerIdOnChange( answerId: string ) {
    this.answerIdSource.next( answerId );
  }

  editEvent() {
    const path = [`scheduling/edit-event/${this.eventId}`];
    if ( !this.event.password ) {
      this.router.navigate( path );
    } else {
      const dialogRef = this.dialog.open( EditPasswordDialogComponent );
      dialogRef.componentInstance.passwordAnswer = this.event.password;
      dialogRef.afterClosed().subscribe( result => {
        if ( result === 'yes' ) this.router.navigate( path );
      });
    }
  }

  scrollTo( targetElement ) {
    targetElement.scrollIntoView();
  }
}
