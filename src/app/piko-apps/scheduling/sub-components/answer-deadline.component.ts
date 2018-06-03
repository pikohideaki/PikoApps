import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-answer-deadline',
  template: `
    回答期限：
    <mat-form-field>
      <input matInput [matDatepickerFilter]="laterToday"
          readonly
          (focus)="answerDeadlinePicker.open()"
          (click)="answerDeadlinePicker.open()"
          required
          [matDatepicker]="answerDeadlinePicker"
          [value]="answerDeadline || ''"
          placeholder="Choose a date"
          (dateInput)="answerDeadlineOnInput( $event.target.value )"
          (dateChange)="answerDeadlineOnChange( $event.target.value )">
      <mat-datepicker-toggle matSuffix [for]="answerDeadlinePicker"></mat-datepicker-toggle>
      <mat-datepicker #answerDeadlinePicker></mat-datepicker>
    </mat-form-field>
  `,
  styles: []
})
export class AnswerDeadlineComponent implements OnInit {

  @Input() answerDeadline: Date = new Date();
  @Output() answerDeadlineChange = new EventEmitter<Date>();


  constructor() { }

  ngOnInit() {
  }


  laterToday( date: Date ): boolean {
    if ( !date ) return false;
    const today = new Date( (new Date()).setHours( 0, 0, 0, 0 ) );
    const date0 = new Date( (date      ).setHours( 0, 0, 0, 0 ) );
    return date0.getTime() >= today.getTime();
  }


  answerDeadlineOnInput( value ) {
    this.answerDeadline = value;
    this.answerDeadlineChange.emit( this.answerDeadline );
  }

  answerDeadlineOnChange( value ) {
    this.answerDeadline = value;
    this.answerDeadlineChange.emit( this.answerDeadline );
  }

}
