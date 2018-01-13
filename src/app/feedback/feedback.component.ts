import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';

import { CloudFirestoreMediatorService } from '../firebase-mediator/cloud-firestore-mediator.service';
import { ConfirmDialogComponent } from '../my-own-library/confirm-dialog.component';
import { Feedback } from '../classes/feedback';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: [
    '../my-own-library/data-table/data-table.component.css',
    './feedback.component.css'
  ]
})
export class FeedbackComponent implements OnInit, OnDestroy {
  private alive = true;

  name = '';
  feedbackText = '';
  category: 'bugReport'|'suggestion'|'' = '';

  feedbacks: Feedback[] = [];

  constructor(
    private dialog: MatDialog,
    private database: CloudFirestoreMediatorService
  ) {
    this.database.feedbacks$
      .takeWhile( () => this.alive )
      .subscribe( val => this.feedbacks = val );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  nameChange        ( value ) { this.name         = value; }
  feedbackTextChange( value ) { this.feedbackText = value; }
  categoryChange    ( value ) { this.category     = value; }

  submit() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent );
    dialogRef.componentInstance.message = '送信してもよろしいですか？';
    dialogRef.afterClosed().subscribe( result => {
      if ( result === 'yes' ) {
        this.database.feedbacks.add( new Feedback( null, {
          name: this.name,
          content: this.feedbackText,
          timeStamp: Date.now(),
          closed: false,
          category: this.category,
        }) );
        this.name = '';
        this.feedbackText = '';
      }
    });
  }
}
