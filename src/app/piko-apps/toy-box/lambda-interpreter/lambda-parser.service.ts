import { Injectable } from '@angular/core';

@Injectable()
export class LambdaParserService {

  constructor() { }



  parse( input: string ): undefined|string|any[] {
    if ( input.length === 0 ) return undefined;
    const tokens = this.splitToTokens( input );
    const converted = this.expandShortcuts( tokens );
    if ( !this.isLambdaTerm( converted ) ) return undefined;
    return this.getParseTree( converted );
  }


  expandShortcuts( tokens: string[] ): string[] {
    const expanded = [];
    tokens.forEach( token => {
      if ( !isNaN( parseInt( token, 10 ) ) ) {
        const num = parseInt( token, 10 );
        /* 3 => (lambda s. (lambda z. (s(s(s z))))) */
        const churchNumber = `(lambda s.(lambda z. ${'(s'.repeat(num)} z${')'.repeat(num)}))`;
        expanded.push( ...this.splitToTokens( churchNumber ) );
        return;
      }
      switch (token) {
        case 'SUCC' :
          const SUCC = '(lambda n.(lambda s.(lambda z.(s((n s)z)))))';
          expanded.push( ...this.splitToTokens( SUCC ) );
          return;
        case 'PLUS' :
        case '+' :
          const PLUS = '(lambda m.(lambda n.(lambda s.(lambda z.((m s) ((n s)z))))))';
          expanded.push( ...this.splitToTokens( PLUS ) );
          return;
        default:
          expanded.push( token );
          return;
      }
    });
    return expanded;
  }


  splitToTokens( input: string ): string[] {
    let spaceInserted = '';
    for ( let i = 0; i < input.length; ++i ) {
      const char = input.charAt(i);
      switch ( char ) {
        case '(':
        case ')':
        case '.':
        case '+':
        case '-':
        case '*':
          spaceInserted += ' ' + char + ' ';
          break;

        case '\t':
        case '\n':
          spaceInserted += ' ';
          break;

        default:
          spaceInserted += char;
          break;
      }
    }
    return spaceInserted.split(' ').filter( e => e.length > 0 );
  }


  /**
   * e ::= x | (lambda x.e) | (e e)
   * */
  getParseTree( tokens: string[] ) {
    if ( !tokens || tokens.length < 1 ) {
      console.error(`invalid tokens passed: "${JSON.stringify(tokens)}"`);
      return undefined;
    }

    /* x? */
    if ( tokens.length === 1 ) return tokens[0];

    /* (lambda x.e)? */
    if (    tokens[0] === '('
         && tokens[1] === 'lambda'
         && this.isVariable( tokens[2] )
         && tokens[3] === '.'
         && this.isLambdaTerm( tokens.slice( 4, tokens.length - 1 ) )
         && tokens[tokens.length - 1] === ')'
    ) {
      return ['lambda', tokens[2], this.getParseTree( tokens.slice( 4, tokens.length - 1 ) )];
    }

    /* (e e)? */
    if ( tokens[0] === '(' && tokens[tokens.length - 1] === ')' ) {
      for ( let sep = 1; sep < tokens.length - 1; ++sep ) {
        const leftTokens  = tokens.slice( 1, sep );
        const rightTokens = tokens.slice( sep, tokens.length - 1 );
        if ( this.isLambdaTerm( leftTokens )
          && this.isLambdaTerm( rightTokens )
        ) {
          return [
            this.getParseTree( leftTokens ),
            this.getParseTree( rightTokens )
          ];
        }
      }
    }

    return tokens;
  }



  isVariable( char: string ): boolean {
    if ( !char ) return false;
    if ( typeof char !== 'string' ) return false;
    return char.length === 1 && !!(char.match(/[a-z]/));
  }

  isLambdaTerm( tokens: string[] ): boolean {
    /* e ::= x | (lambda x.e) | (e e) */
    if ( !tokens || tokens.length < 1 ) return false;

    /* x? */
    if ( tokens.length === 1 ) return this.isVariable( tokens[0] );

    /* (lambda x.e)? */
    if (    tokens[0] === '('
         && tokens[1] === 'lambda'
         && this.isVariable( tokens[2] )
         && tokens[3] === '.'
         && this.isLambdaTerm( tokens.slice( 4, tokens.length - 1 ) )
         && tokens[tokens.length - 1] === ')'
        ) return true;

    /* (e e)? */
    if ( tokens[0] === '(' && tokens[tokens.length - 1] === ')' ) {
      for ( let sep = 1; sep < tokens.length - 1; ++sep ) {
        if ( this.isLambdaTerm( tokens.slice( 1, sep ) )
          && this.isLambdaTerm( tokens.slice( sep, tokens.length - 1 ) ) ) return true;
      }
      return false;
    }

    return false;
  }
}
