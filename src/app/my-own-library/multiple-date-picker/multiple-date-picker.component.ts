
import {combineLatest as observableCombineLatest,  Observable ,  BehaviorSubject } from 'rxjs';

import {first, startWith, map, takeWhile} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';




import { utils } from '../utilities';


@Component({
  selector: 'app-multiple-date-picker',
  templateUrl: './multiple-date-picker.component.html',
  styleUrls: ['./multiple-date-picker.component.css']
})
export class MultipleDatePickerComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() width: number = 300;
  @Input() filterFunction = (e => true);
  @Input() dayLabelLanguage: 'eng'|'jp' = 'eng';
  @Input() initialDateList$: Observable<Date[]>;
  @Output() selectedDatesChange = new EventEmitter<Date[]>();

  dayStrings: string[];
  weeks$: Observable<{ date: Date, selected: boolean }[][]>;

  private currentYearSource  = new BehaviorSubject<number>( (new Date()).getFullYear() );
  private currentMonthSource = new BehaviorSubject<number>( (new Date()).getMonth() );
  currentYear$:  Observable<number> = this.currentYearSource .asObservable();
  currentMonth$: Observable<number> = this.currentMonthSource.asObservable();

  private selectedDateValuesSource = new BehaviorSubject<number[]>([]);
  private selectedDateValues$ = this.selectedDateValuesSource.asObservable().pipe(startWith([]));



  constructor(
  ) {
    this.weeks$ = observableCombineLatest(
        this.currentYear$,
        this.currentMonth$,
        this.selectedDateValues$,
        (year, month, selectedDates) => {
          const weeks: { date: Date, selected: boolean }[][] = [];
          utils.date.getAllDatesIn( year, month ).forEach( date => {
            const weekNumber = utils.date.weekNumber( date );
            if ( weeks.length < weekNumber + 1 ) {
              weeks.push( Array(7).fill({ date: undefined, selected: false }) );
            }
            weeks[ weekNumber ][ date.getDay() ] = {
              date     : date,
              selected : selectedDates.includes( date.valueOf() ),
            };
          });
          return weeks;
        } );

    this.selectedDateValues$.pipe(
      map( list => list.map( e => new Date(e) )
                        .sort( (a, b) => utils.date.compare(a, b) ) ),
      takeWhile( () => this.alive ),)
      .subscribe( val => this.selectedDatesChange.emit( val ) );
  }

  ngOnInit() {
    switch ( this.dayLabelLanguage ) {
      case 'jp' :
        this.dayStrings = ['日', '月', '火', '水', '木', '金', '土'];
        break;

      case 'eng' :
        this.dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
        break;
    }

    if ( !!this.initialDateList$ ) {
      this.initialDateList$.pipe(first()).subscribe( initialDateList => {
        const initialDateValuesUniq
          = utils.array.uniq(
              initialDateList
                .map( e => utils.date.toMidnight(e) )
                .map( e => e.valueOf() ) );
        this.selectedDateValuesSource.next( initialDateValuesUniq );
      });
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }


  goToPreviousMonth() {
    if ( this.currentMonthSource.getValue() > 0 ) {
      this.currentMonthSource.next( this.currentMonthSource.getValue() - 1 );
    } else {
      this.currentMonthSource.next( 11 );
      this.currentYearSource.next( this.currentYearSource.getValue() - 1 );
    }
  }

  goToNextMonth() {
    if ( this.currentMonthSource.getValue() < 11 ) {
      this.currentMonthSource.next( this.currentMonthSource.getValue() + 1 );
    } else {
      this.currentMonthSource.next( 0 );
      this.currentYearSource.next( this.currentYearSource.getValue() + 1 );
    }
  }

  goToToday() {
    this.currentMonthSource.next( (new Date()).getMonth() );
    this.currentYearSource .next( (new Date()).getFullYear() );
  }

  isToday( date: Date ) {
    if ( !date ) return false;
    return utils.date.isToday( date );
  }


  resetSelections() {
    this.selectedDateValuesSource.next([]);
  }

  dateOnSelectToggle( date: Date ) {
    if ( !date ) return;
    if ( !this.filterFunction( date ) ) return;
    const current = this.selectedDateValuesSource.getValue();
    if ( current.includes( date.valueOf() ) ) {
      utils.array.removeValue( current, date.valueOf() );
    } else {
      current.push( date.valueOf() );
    }
    this.selectedDateValuesSource.next( current );
  }

  selectToggleDayColumn( dayIndex: number ) {
    const current = this.selectedDateValuesSource.getValue();
    const month = this.currentMonthSource.getValue();
    const year  = this.currentYearSource.getValue();

    const datesOfDayColumn
      = utils.date.getAllDatesIn( year, month )
            .filter( date => date.getDay() === dayIndex )
            .filter( this.filterFunction );
    const datesInColumnAllSelected
      = datesOfDayColumn.every( e => current.includes( e.valueOf() ) );

    datesOfDayColumn.forEach( date => utils.array.remove( current, date.valueOf() ) );
    if ( !datesInColumnAllSelected ) {
      datesOfDayColumn.forEach( date => current.push( date.valueOf() ) );
    }
    this.selectedDateValuesSource.next( current );
  }
}
