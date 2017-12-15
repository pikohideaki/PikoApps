import { Injectable } from '@angular/core';

import { LambdaEvaluatorService } from './lambda-evaluator.service';

@Injectable()
export class LambdaPrintService {

  constructor(
    private evaluator: LambdaEvaluatorService,
  ) { }


  termToString( term ) {
    if ( this.hasShortcut( term ) ) return this.toShortcutString( term );
    if ( this.evaluator.isVariable( term ) ) return term;
    if ( this.evaluator.isApplication( term ) ) {
      return `(${this.termToString(term[0])} ${this.termToString( term[1] )})`;
    }
    if ( this.evaluator.isAbstraction( term ) ) {
      return `(lambda ${term[1]}. ${this.termToString( term[2] )})`;
    }
  }


  hasShortcut( term ): boolean {
    // ToDo
    return false;
  }

  toShortcutString( term ): string {
    // ToDo
    return '+';
  }

}
