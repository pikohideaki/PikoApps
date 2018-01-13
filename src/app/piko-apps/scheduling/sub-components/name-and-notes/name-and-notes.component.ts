import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-name-and-notes',
  templateUrl: './name-and-notes.component.html',
  styleUrls: ['./name-and-notes.component.css']
})
export class NameAndNotesComponent implements OnInit {

  @Input()  private titleInit$: Observable<string> = Observable.from([]);
  title: string = '';
  @Output() titleChange = new EventEmitter<string>();

  @Input()  private notesInit$: Observable<string> = Observable.from([]);
  notes: string = '';
  @Output() notesChange = new EventEmitter<string>();


  constructor() {}

  ngOnInit() {
    this.titleInit$.subscribe( val => this.title = val );
    this.notesInit$.subscribe( val => this.notes = val );
  }


  titleOnChange( value: string ) {
    this.title = value;
    this.titleChange.emit( this.title );
  }

  notesOnChange( value: string ) {
    this.notes = value;
    this.notesChange.emit( this.notes );
  }
}
