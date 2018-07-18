import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { MySymbol } from '../../scheduling-event';


@Component({
  selector: 'app-symbol-settings',
  templateUrl: './symbol-settings.component.html',
  styleUrls: ['./symbol-settings.component.css']
})
export class SymbolSettingsComponent implements OnInit {

  @Input() symbols: MySymbol[] = [];
  @Output() symbolsChange = new EventEmitter<MySymbol[]>();

  // defaultSymbols:  MySymbol[] = [];
  // optionalSymbols: MySymbol[] = [];



  constructor() { }

  ngOnInit() {
    // this.defaultSymbols  = this.symbols.filter( e =>  e.id.match(/^(ok|maybe|ng)$/) );
    // this.optionalSymbols = this.symbols.filter( e => !e.id.match(/^(ok|maybe|ng)$/) );
  }


  symbolChecked( id: string, value: boolean ) {
    ( this.symbols.find( e => e.id === id ) || new MySymbol() ).useThis = value;
    this.symbolsChange.emit( this.symbols );
  }

  symbolDescriptionChange( id: string, value: string ) {
    ( this.symbols.find( e => e.id === id ) || new MySymbol() ).description = value;
    this.symbolsChange.emit( this.symbols );
  }

  symbolScoreChange( id: string, value: number ) {
    ( this.symbols.find( e => e.id === id ) || new MySymbol() ).score = value;
    this.symbolsChange.emit( this.symbols );
  }

}
