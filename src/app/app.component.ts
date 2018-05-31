import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

// import { UserService } from './firebase-mediator/my-user-info.service';
// import { AutoBackupOnFirebaseService } from './firebase-mediator/auto-backup-on-firebase.service';


@Component({
  providers: [AngularFireAuth],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  signedIn$: Observable<boolean>;
  myName$: Observable<string>;


  constructor(
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    // private user: UserService,
    // private autoBackup: AutoBackupOnFirebaseService,
  ) {
    // this.myName$ = user.name$;
    // this.signedIn$ = this.user.signedIn$;
    // this.autoBackup.checkAndExecuteBackup();
  }


  logout() {
    if ( !this.afAuth.auth.currentUser ) return;
    this.afAuth.auth.signOut()
    .then( () => this.openSnackBar('Successfully signed out!') );
  }

  private openSnackBar( message: string ) {
    this.snackBar.open( message, undefined, { duration: 3000 } );
  }

}
