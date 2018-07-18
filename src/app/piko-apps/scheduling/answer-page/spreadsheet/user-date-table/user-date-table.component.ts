import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AlertDialogComponent } from '../../../../../my-own-library/alert-dialog.component';
import { SchedulingEvent, MySymbol, Answer } from '../../../scheduling-event';
import { utils } from '../../../../../my-own-library/utilities';
import { getAverageScore, getIconName } from '../functions';


@Component({
  selector: 'app-user-date-table',
  templateUrl: './user-date-table.component.html',
  styleUrls: [
    '../../../../../my-own-library/data-table/data-table.component.css',
    '../spreadsheet-table.css'
  ]
})
export class UserDateTableComponent implements OnInit {

  @Input() answerDeadlineExpired$: Observable<boolean>;
  @Input() answers$:               Observable<Answer[]>;
  @Input() event$:                 Observable<SchedulingEvent>;
  @Input() spreadSheet$:           Observable<Object>;
  @Input() symbols$:               Observable<MySymbol[]>;

  @Input()  flipTableState: boolean;
  @Output() flipTableStateChange = new EventEmitter<boolean>();

  @Output() answerSelected = new EventEmitter<Answer>();


  constructor( private dialog: MatDialog ) { }

  ngOnInit() {
  }


  flipTable() {
    this.flipTableStateChange.emit( !this.flipTableState );
  }

  answerOnSelect( answer: Answer ) {
    this.answerSelected.emit( answer );
  }

  commentOnClick( comment: string ) {
    const dialogRef = this.dialog.open( AlertDialogComponent );
    dialogRef.componentInstance.message = comment;
  }

  average        = getAverageScore;
  iconName       = getIconName;
  toYMD          = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;
  toHM           = utils.date.toHM;

}
