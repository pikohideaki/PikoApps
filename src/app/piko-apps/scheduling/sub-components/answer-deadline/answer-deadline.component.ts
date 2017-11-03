import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-answer-deadline',
  templateUrl: './answer-deadline.component.html',
  styleUrls: ['./answer-deadline.component.css']
})
export class AnswerDeadlineComponent implements OnInit {

  @Input()  private answerDeadlineInit$: Observable<Date> = Observable.from([]);
  answerDeadline: Date;
  @Output() answerDeadlineChange = new EventEmitter<Date>();



  constructor() { }

  ngOnInit() {
    this.answerDeadlineInit$.subscribe( val => this.answerDeadline = val );
  }


  sinceToday( date: Date ): boolean {
    if ( !date ) return false;
    const today = new Date();
    if ( date.getFullYear() > today.getFullYear() ) return true;
    if ( date.getFullYear() < today.getFullYear() ) return false;
    if ( date.getMonth()    > today.getMonth()    ) return true;
    if ( date.getMonth()    < today.getMonth()    ) return false;
    if ( date.getDate()     > today.getDate()     ) return true;
    if ( date.getDate()     < today.getDate()     ) return false;
    return true;
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
