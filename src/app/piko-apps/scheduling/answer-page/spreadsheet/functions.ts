import { SchedulingEvent, Answer, MySymbol } from "../../scheduling-event";
import { utils } from '../../../../my-own-library/utilities';

/* for print */
export const getAverageScore = (
    event: SchedulingEvent,
    date: Date
  ): number => {
    const symbolIdsOfDate
      = event.answers
          .map( ans => ans.selection )
          .map( selections => selections.find( e => e.date.valueOf() === date.valueOf() ) )
          .filter( e => e !== undefined )
          .map( e => e.symbolID );
    const scores = symbolIdsOfDate.map( id =>
        (event.symbols.find( e => e.id === id ) || new MySymbol() ).score );
    return utils.number.roundAt( utils.array.average( scores ), 1 );
  }

export const getIconName = (
  answer: Answer,
  date: Date,
  symbols: MySymbol[]
): string => {
  const selection = answer.selection.find( e => e.date.valueOf() === date.valueOf() );
  if ( !selection ) return '';
  const symbol = symbols.find( e => e.id === selection.symbolID );
  return ( !!symbol ? symbol.iconName : '' );
};


