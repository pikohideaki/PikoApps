import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-password',
  template: `
    <div class="margined-element">
      <mat-slide-toggle
          class="margined-element"
          [checked]="enabled"
          (change)="enablePassword( $event.checked )">
        イベント編集用のパスワードを設定する
      </mat-slide-toggle>
      <mat-form-field *ngIf="enabled">
        <input matInput placeholder="Password"
            [value]="password || ''"
            (change)="passwordOnChange( $event.target.value )" >
      </mat-form-field>
    </div>
  `,
  styles: [],
})
export class PasswordComponent implements OnInit {

  @Input()  password: string = '';
  @Output() passwordChange = new EventEmitter<string>();
  @Input()  enabled = false;
  @Output() enabledChange = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }


  passwordOnChange( value: string ) {
    this.password = value;
    this.passwordChange.emit( this.password );
  }

  enablePassword( value: boolean ) {
    this.enabled = value;
    this.enabledChange.emit( this.enabled );
  }
}
