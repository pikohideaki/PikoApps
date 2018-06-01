import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { utils } from '../my-own-library/utilities';


@Injectable()
export class AutoBackupOnFirebaseService {

  private autoBackupDir = '/autoBackup';
  private latestBackupDatePath = this.autoBackupDir + '/latestBackupDate';

  private fdPath = {
    users : '/users',
    // data  : '/data',
  };

  constructor(
    private afdb: AngularFireDatabase
  ) { }

  async checkAndExecuteBackup() {
    const latestBackupDate = await this.getLatestBackupDate();
    if ( !utils.date.isToday( latestBackupDate ) ) {
      this.createBackup();
    }
  }

  private async getLatestBackupDate() {
    const timeStamp = await this.afdb.object<number>( this.latestBackupDatePath ).valueChanges().first().toPromise();
    return new Date( timeStamp );
  }

  private createBackup() {
    console.log('created backup');
    this.updateLatestBackupDate();

    const dateString = utils.date.toYMD( new Date(), '' );

    Object.keys( this.fdPath ).forEach( key => {
      const sourcePath = this.fdPath[key];
      const distPathPrefix = `${this.autoBackupDir}/index/${dateString}`;
      this.afdb.object( sourcePath ).valueChanges().first().toPromise()
        .then( val => {
          if ( !val ) return;
          this.afdb.object(`${distPathPrefix}${sourcePath}`).set( val );
        });
    });
  }


  private updateLatestBackupDate() {
    return this.afdb.object( this.latestBackupDatePath ).set( Date.now() );
  }
}
