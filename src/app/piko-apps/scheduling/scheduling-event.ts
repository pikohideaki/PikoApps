import { utils } from '../../my-own-library/utilities';

export class SchedulingEvent {
  databaseKey:       string     = '';
  title:             string     = '';
  notes:             string     = '';
  selectedDatetimes: Date[]     = [];
  answerDeadline:    Date       = new Date();
  symbols:           MySymbol[] = [];
  answers:           Answer[]   = [];
  password:          string     = '';

  constructor( databaseKey?: string, initObj?: {
      title:                       string,
      notes:                       string,
      selectedDatetimesTimeStamps: number[],
      answerDeadlineTimeStamp:     number,
      symbols:                     MySymbol[],
      answers:                     Answer[],
      password:                    string,
  }) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.title = ( initObj.title || '' );
    this.notes = ( initObj.notes || '' );
    this.selectedDatetimes = (initObj.selectedDatetimesTimeStamps || []).map( e => new Date( e || 0 ) );
    this.answerDeadline = new Date( initObj.answerDeadlineTimeStamp || 0 );
    this.symbols = ( initObj.symbols || [] );
    this.answers = ( utils.object.entries( initObj.answers ).map( e => new Answer( e.key, e.value ) ) || [] );
    this.password = ( initObj.password || '' );
  }
}


export class MySymbol {
  id:          string;
  useThis:     boolean;
  iconName:    string;
  description: string;
  score:       number;

  constructor() {}
}


export class Answer {
  databaseKey: string = '';
  userName:    string = '';  /* 回答者名 */
  comment:     string = '';
  selection:   { date: Date, symbolID: string }[] = [];

  constructor( databaseKey?: string, initObj?: {
    userName: string,
    comment: string,
    selection: { dateValue: number, symbolID: string }[],
  }) {
    this.databaseKey = ( databaseKey || '' );

    if ( !initObj ) return;
    this.userName = ( initObj.userName || '' );
    this.comment  = ( initObj.comment  || '' );
    this.selection = ( (initObj.selection || []).map( e => ({
                          date     : new Date( e.dateValue ),
                          symbolID : e.symbolID,
                        })) || [] );
  }
}
