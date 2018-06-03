import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-name-and-notes',
  template: `
    <div class="margined-element">
      <mat-form-field>
        <input matInput placeholder="イベント名"
            [value]="title || ''"
            (change)="titleOnChange( $event.target.value )"
            required>
      </mat-form-field>
    </div>
    <div class="margined-element">
      <mat-form-field>
        <textarea matInput placeholder="ノート"
            [value]="notes || ''"
            (change)="notesOnChange( $event.target.value )" >
        </textarea>
      </mat-form-field>
    </div>
  `,
  styles: [],
})
export class NameAndNotesComponent implements OnInit {

  @Input() title: string = '';
  @Output() titleChange = new EventEmitter<string>();

  @Input() notes: string = '';
  @Output() notesChange = new EventEmitter<string>();


  constructor() {}

  ngOnInit() {
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
