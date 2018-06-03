import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

// import { UserService } from './firebase-mediator/user.service';
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
  title = '日程調整ツール';

  constructor(
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
    // private user: UserService,
    // private autoBackup: AutoBackupOnFirebaseService,
  ) {
    iconRegistry.addSvgIcon(
        'twitter',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/twitter.svg'));
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
