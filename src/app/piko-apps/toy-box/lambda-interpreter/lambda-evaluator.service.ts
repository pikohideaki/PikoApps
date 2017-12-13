import { Injectable } from '@angular/core';

import { UtilitiesService } from '../../../my-own-library/utilities.service';
import { submatch } from '../../../my-own-library/utilities';


type Variable = string;


@Injectable()
export class LambdaEvaluatorService {

  MAX_STEPS = 100;  // reduction再帰の回数上限
  ALPHABETS
    = [].concat(
          this.utils.getAlphabets('lower'),
          this.utils.getAlphabets('upper') );

  constructor(
    private utils: UtilitiesService
  ) { }


  evalSequence( term ) {
    if ( !term || !this.isLambdaTerm( term ) ) return [];
    const seq = [];
    let curr = term;
    let prev = undefined;

    curr = term;
    seq.push( term );

    for ( let counter = this.MAX_STEPS; counter-- > 0; ) {
      const next = this.betaReduction1step( curr );
      if ( this.isEqual(next, curr) ) break;
      seq.push( next );
      prev = curr;
      curr = next;
    }
    return seq;
  }

  treeToString( term ) {
    if ( this.isVariable(term) ) return term;
    if ( this.isApplication(term) ) {
      return `(${this.treeToString(term[0])} ${this.treeToString(term[1])})`;
    }
    if ( this.isAbstraction(term) ) {
      return `(lambda ${term[1]}. ${this.treeToString(term[2])})`;
    }
  }


  isEqual( term1, term2 ): boolean {
    if ( this.isVariable(term1) && this.isVariable(term2) ) {
      return term1 === term2;
    }
    if ( this.isAbstraction(term1) && this.isAbstraction(term2) ) {
      return ( term1[1] === term2[1] && this.isEqual( term1[2], term2[2] ) );
    }
    if ( this.isApplication(term1) && this.isApplication(term2) ) {
      return ( this.isEqual( term1[0], term2[0] )
            && this.isEqual( term1[1], term2[1] ) );
    }
    return false;
  }


  isVariable( term ) {  /* "x" -> true, ["lambda", "x", "x"] -> false */
    if ( !term || term.length !== 1 ) return false;
    if ( typeof term !== 'string' ) return false;
    return !!( term.match(/[a-z]/i) );
  }

  isAbstraction( term ) {
    if ( !term || term.length !== 3 ) return false;
    return ( term[0] === 'lambda'
          && this.isVariable( term[1] )
          && this.isLambdaTerm( term[2] ) );
  }

  isApplication( term ) {
    if ( !term || term.length !== 2 ) return false;
    return this.isLambdaTerm( term[0] ) && this.isLambdaTerm( term[1] );
  }

  isLambdaTerm( term ) {
    return ( this.isVariable( term )
          || this.isAbstraction( term )
          || this.isApplication( term ) );
  }



  getFreeVariables( term ): string[] {
    if ( this.isVariable( term ) ) return [term];
    if ( this.isAbstraction( term ) ) {
      return this.getFreeVariables( term[2] ).filter( ch => ch !== term[1] );
    }
    if ( this.isApplication( term ) ) {
      return [].concat(
          this.getFreeVariables( term[0] ),
          this.getFreeVariables( term[1] ) );
    }
    return [];
  }


  alphaConversion( to: Variable, term ) {
    console.log( 'alphaConversion', to, term );
    if ( !this.isAbstraction( term ) ) return term;
    const from = term[1];
    const sub = (t) => {
      if ( this.isVariable(t) )    return ( t === from ? to : t );
      if ( this.isApplication(t) ) return [ sub(t[0]), sub(t[1]) ];
      if ( this.isAbstraction(t) ) return ( t[1] === from ? t : ['lambda', t[1], sub(t[2])] );
      return t;  // dummy
    };
    return ['lambda', to, sub( term[2] ) ];
  }


  /**
   * @description
   * If {@param term} != (M N) then {@param term}.
   * Otherwise:
   *   if {@param term} = (λx. M)N then M[x := N].
   *   else proceed beta-reduction for M or N of (M N).
   */
  betaReduction1step( term ) {
    if ( !this.isApplication(term) ) return term;
    const left  = term[0];
    const right = term[1];
    console.log(term, left, right);
    if ( this.isAbstraction(left) ) {
      console.log( 'result', this.substitute( right, left[1], left[2] ) );
      return this.substitute( right, left[1], left[2] );
    } else {
      const leftAfter1step = this.betaReduction1step( left );
      if ( !this.isEqual( leftAfter1step, left ) ) {
        return [ leftAfter1step, right ];
      } else {
        return [ left, this.betaReduction1step( right ) ];
      }
    }
  }

  /**
   * @desc substitute term2 for x in formula term1 in capture-avoiding manner.
   * formally:
   * x[x := N]       = N
   * y[x := N]       = y, if x ≠ y
   * (M1 M2)[x := N] = (M1[x := N]) (M2[x := N])
   * (λx.M)[x := N]  = λx.M
   * (λy.M)[x := N]  = λy.(M[x := N]), if x ≠ y, provided y ∉ FV(N)
   * if y ∈ FV(N) then
   */
  substitute( to, from, term ) {
    console.log( 'substitute', to, from, term );
    if ( this.isVariable(term) ) {
      return ( term === from ? to : term );
    }
    if ( this.isApplication(term) ) {
      return [
        this.substitute( to, from, term[0] ),
        this.substitute( to, from, term[1] ) ];
    }
    if ( this.isAbstraction(term) ) {
      const arg     = term[1];
      const subTerm = term[2];

      if ( arg === from ) return term;

      const freeVariables = this.getFreeVariables(to);
      if ( !freeVariables.includes( arg ) ) {
        return [ 'lambda', arg, this.substitute( to, from, subTerm ) ];
      } else {
        const availableVariables
          = this.ALPHABETS.filter( e => !freeVariables.includes(e) );
        if ( availableVariables.length < 1 ) console.error('alphabets exhausted');
        const v = availableVariables[0];  // pick up one available
        // return this.substitute( to, v, this.alphaConversion( v, term ) );
        return this.alphaConversion( v, term );
      }
    }
    console.error(`Syntax error: "${term}" is not lambda term.`);
    return term;
  }

}
