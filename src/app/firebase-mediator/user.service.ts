
import {combineLatest as observableCombineLatest,  Observable ,  BehaviorSubject } from 'rxjs';

import {distinctUntilChanged, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../classes/user';
import { CloudFirestoreMediatorService } from './cloud-firestore-mediator.service';


@Injectable()
export class UserService {
  private uid: string = '';
  uid$:      Observable<string>;
  signedIn$: Observable<boolean>;

  private user$: Observable<User>;
  name$:      Observable<string>;
  name_yomi$: Observable<string>;



  constructor(
    private afAuth: AngularFireAuth,
    private database: CloudFirestoreMediatorService,
  ) {
    this.signedIn$      = this.afAuth.authState.pipe(map( user => !!user ));
    this.uid$           = this.afAuth.authState.pipe(map( user => ( !user ? '' : user.uid ) ));

    this.user$ = observableCombineLatest(
        this.uid$,
        this.database.users$,
        ( uid: string, users: User[] ) =>
          (!uid || users.length === 0) ? new User() : users.find( e => e.databaseKey === uid ) || new User() );

    this.name$      = this.user$.pipe(map( e => e.name      ),distinctUntilChanged(),);
    this.name_yomi$ = this.user$.pipe(map( e => e.name_yomi ),distinctUntilChanged(),);

    this.uid$.subscribe( val => this.uid = val );
  }


  setMyName( value: string ) {
    if ( !this.uid ) return Promise.resolve();
    return this.database.user.set.name( this.uid, value );
  }
}
