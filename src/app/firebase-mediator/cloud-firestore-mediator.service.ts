import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore    } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { UtilitiesService } from '../my-own-library/utilities.service';

import { User } from '../classes/user';
import { SchedulingEvent, Answer } from '../piko-apps/scheduling/scheduling-event';
import { Feedback } from '../classes/feedback';


@Injectable()
export class CloudFirestoreMediatorService {
  fdPath = {
    users : '/users',
    schedulingEvents: '/schedulingEvents',
    feedbacks: '/feedbacks',
  };

  users$: Observable<User[]>;
  schedulingEvents$: Observable<SchedulingEvent[]>;
  feedbacks$: Observable<Feedback[]>;

  /* methods */
  user: {
    setUser: ( uid: string, newUser: User ) => Promise<void>,
    set: {
      name:      ( uid: string, value: string ) => Promise<void>,
      name_yomi: ( uid: string, value: string ) => Promise<void>,
    }
  };

  scheduling: {
    addEvent:     ( value: SchedulingEvent ) => firebase.database.ThenableReference,
    setEvent:     ( eventID: string, value: SchedulingEvent ) => Promise<void>,
    addAnswer:    ( eventID: string, value: Answer ) => firebase.database.ThenableReference,
    setAnswer:    ( eventID: string, answerID: string, value: Answer ) => Promise<void>,
    removeAnswer: ( eventID: string, answerID: string )                => Promise<void>,
  };

  feedbacks: {
    add: ( value: Feedback ) => firebase.database.ThenableReference,
    closeIssue: ( feedbackID: string, value: boolean ) => Promise<void>,
  };


  constructor(
    private afs: AngularFirestore,
    private afdb: AngularFireDatabase,
    private utils: UtilitiesService,
  ) {
    this.users$
      = this.afdb.list( this.fdPath.users, ref => ref.orderByChild('name_yomi') ).snapshotChanges()
          .map( actions => actions.map( action => new User( action.key, action.payload.val() ) ) );
          // .do( val => console.log( 'users$ changed', JSON.stringify(val), val ) );


    this.schedulingEvents$
      = this.afdb.list( this.fdPath.schedulingEvents ).snapshotChanges()
          .map( actions => actions.map( action => new SchedulingEvent( action.key, action.payload.val() ) ) );
          // .do( val => console.log( 'schedulingEvents$ changed', JSON.stringify(val), val ) );

    this.feedbacks$
      = this.afdb.list( this.fdPath.feedbacks ).snapshotChanges()
          .map( actions => actions.map( action => new Feedback( action.key, action.payload.val() ) ) );
          // .do( val => console.log( 'feedbacks$ changed', JSON.stringify(val), val ) );




    /*** methods ***/

    const userSetProperty = ( uid: string, pathPrefix: string, value: any ) => {
      if ( !uid ) throw new Error('uid is empty');
      return this.afdb.object( `${this.fdPath.users}/${uid}/${pathPrefix}` )
                      .set( value );
    };
    this.user = {
      setUser: ( uid: string, newUser: User ) => {
        const newUserObj = this.utils.copyObject( newUser );
        delete newUserObj.databaseKey;
        return this.afdb.object(`${this.fdPath.users}/${uid}`).set( newUserObj );
      },

      set: {
        name: ( uid: string, value: string ) =>
          userSetProperty( uid, 'name', value ),

        name_yomi: ( uid: string, value: string ) =>
          userSetProperty( uid, 'name_yomi', value ),
      }
    };



    this.scheduling = {
      addEvent: ( value: SchedulingEvent ) => {
        const copy = this.utils.copyObject( value );
        delete copy.databaseKey;
        delete copy.selectedDatetimes;
        delete copy.answerDeadline;
        copy.selectedDatetimesTimeStamps = value.selectedDatetimes.map( e => e.valueOf() );
        copy.answerDeadlineTimeStamp     = value.answerDeadline.valueOf();
        return this.afdb.list( this.fdPath.schedulingEvents ).push( copy );
      },

      setEvent: ( eventID: string, value: SchedulingEvent ) => {
        const copy = this.utils.copyObject( value );
        delete copy.databaseKey;
        delete copy.selectedDatetimes;
        delete copy.answerDeadline;
        copy.selectedDatetimesTimeStamps = value.selectedDatetimes.map( e => e.valueOf() );
        copy.answerDeadlineTimeStamp     = value.answerDeadline.valueOf();
        copy.answers = {};
        value.answers.forEach( answer => {
          copy.answers[ answer.databaseKey ] = ({
            comment   : answer.comment,
            userName  : answer.userName,
            selection : answer.selection.map( e => ({
                            dateValue : e.date.valueOf(),
                            symbolID  : e.symbolID
                          }) ),
          });
        });
        return this.afdb.object( `${this.fdPath.schedulingEvents}/${eventID}` ).set( copy );
      },

      addAnswer: ( eventID: string, value: Answer ) => {
        const copy = this.utils.copyObject( value );
        delete copy.databaseKey;
        copy.selection
          = value.selection.map( e => ({ dateValue: e.date.valueOf(), symbolID: e.symbolID }) );
        return this.afdb.list( `${this.fdPath.schedulingEvents}/${eventID}/answers` ).push( copy );
      },

      setAnswer: ( eventID: string, answerID: string, value: Answer ) => {
        const copy = this.utils.copyObject( value );
        delete copy.databaseKey;
        copy.selection
          = value.selection.map( e => ({ dateValue: e.date.valueOf(), symbolID: e.symbolID }) );
        return this.afdb.object( `${this.fdPath.schedulingEvents}/${eventID}/answers/${answerID}` )
          .set( copy );
      },

      removeAnswer: ( eventID: string, answerID: string ) =>
          this.afdb.object( `${this.fdPath.schedulingEvents}/${eventID}/answers/${answerID}` ).remove(),
    };

    this.feedbacks = {
      add: ( value: Feedback ) => {
        const copy = this.utils.copyObject( value );
        delete copy.databaseKey;
        delete copy.date;
        copy.timeStamp = value.date.valueOf();
        return this.afdb.list( this.fdPath.feedbacks ).push( copy );
      },

      closeIssue: ( feedbackID: string, value: boolean ) =>
        this.afdb.object( `${this.fdPath.feedbacks}/${feedbackID}/closed`).set( value ),
    };
  }




}
