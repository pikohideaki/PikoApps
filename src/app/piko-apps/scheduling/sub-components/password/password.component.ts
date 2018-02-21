import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  @Input()  private passwordInit$: Observable<string> = Observable.from([]);
  password: string = '';
  @Output() passwordChange = new EventEmitter<string>();
  enabled = false;

  constructor() { }

  ngOnInit() {
    this.passwordInit$.subscribe( val => {
      this.password = val;
      this.enabled = !!this.password;
    });
  }


  passwordOnChange( value: string ) {
    this.password = value;
    this.passwordChange.emit( this.password );
  }

  check( value ) {
    this.enabled = value;
    if ( !this.enabled ) this.passwordOnChange('');
  }
}
