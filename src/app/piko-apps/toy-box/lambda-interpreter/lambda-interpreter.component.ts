import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LambdaMacroService     } from './lambda-macro.service';
import { LambdaParserService    } from './lambda-parser.service';
import { LambdaEvaluatorService } from './lambda-evaluator.service';
import { LambdaPrintService     } from './lambda-print.service';



@Component({
  providers: [
      LambdaMacroService,
      LambdaParserService,
      LambdaEvaluatorService,
      LambdaPrintService
    ],
  selector: 'app-lambda-interpreter',
  templateUrl: './lambda-interpreter.component.html',
  styleUrls: [
    './lambda-interpreter.component.css'
  ]
})
export class LambdaInterpreterComponent implements OnInit {

  private inputSource  = new BehaviorSubject<string>('');
  private input$: Observable<string>
    = this.inputSource.asObservable().debounceTime( 300 /* ms */ );

  private parseTree$: Observable<undefined|string|any[]>
    = this.input$.map( input => this.parser.parse( input ) );
  parseTreeToStr$: Observable<string>
    = this.parseTree$.map( tree => this.print.termToString(tree) );
  private evalSequence$: Observable<any[]>
    = this.parseTree$.map( t => this.evaluator.evalSequence(t) );

  private evalSeqToStr$: Observable<string[]>
    = this.evalSequence$.map( seq => seq.map( tree => this.print.termToString( tree ) ) );
  output$: Observable<string>
    = this.evalSeqToStr$.map( seq => seq.map( (s, i) => `${i}.\t${s}` ).join('\n') );

  isLambdaTerm$: Observable<boolean>
    = this.input$
        .map( input => this.parser.splitToTokens( input ) )
        .map( tokens => this.parser.isLambdaTerm( tokens ) );




  constructor(
    private parser:    LambdaParserService,
    private evaluator: LambdaEvaluatorService,
    private print:     LambdaPrintService,
  ) { }

  ngOnInit() {
  }

  inputTextOnChange( value: string ) {
    this.inputSource.next( value );
  }

}
