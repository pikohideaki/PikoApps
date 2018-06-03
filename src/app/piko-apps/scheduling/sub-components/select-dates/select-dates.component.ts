import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { utils } from '../../../../my-own-library/utilities';

import { SetTimeDialogComponent } from './set-time-dialog.component';


@Component({
  selector: 'app-select-dates',
  templateUrl: './select-dates.component.html',
  styleUrls: ['./select-dates.component.css']
})
export class SelectDatesComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() selectedDatetimesInit: Date[] = [];

  @Output() selectedDatetimesChange = new EventEmitter<Date[]>();

  defaultDatetime = new Date( ( new Date() ).setHours(19, 0, 0, 0) );  // 19:00 by default

  selectedDatesInit$: Observable<Date[]>;


  private selectedDatesSource = new BehaviorSubject<Date[]>([]);

  private dateToTime = new Map<number, Date[]>();  /* date-value -> datetime */
  private dateToTimeChangedSource = new BehaviorSubject<number>(0);
  /** example of dateToTime
   * 2017/10/27 => [2017/10/27 12:00, 2017/10/27 19:00],
   * 2017/10/28 => [2017/10/28 13:00, 2017/10/28 18:00, 2017/10/28 20:00],
   * 2017/10/29 => [2017/10/29 19:00],
   */

  selectedDatetimesGrouped: Date[][] = [];
  /** example of selectedDatetimesGrouped
   * [ [2017/10/27 12:00, 2017/10/27 19:00],
   *   [2017/10/28 13:00, 2017/10/28 18:00, 2017/10/28 20:00],
   *   [2017/10/29 19:00] ]
   */

  selectedDatetimes: Date[];  /* flattened selectedDates table */


  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    // this.selectedDatesInit$
    //   = this.selectedDatetimesInit$
    //       .map( selectedDatetimesInit =>
    //         utils.array.uniq(
    //           selectedDatetimesInit
    //             .map( e => utils.date.toMidnight(e) )
    //             .map( e => e.valueOf() ) ) );

    // this.selectedDatetimesInit$.subscribe( selectedDatetimesInit => {
    //   selectedDatetimesInit.forEach( date => {
    //     const date0 = utils.date.toMidnight(date).valueOf();
    //     if ( this.dateToTime.has( date0 ) ) {
    //       this.dateToTime.get( date0 ).push( date );
    //     } else {
    //       this.dateToTime.set( date0, [date] );
    //     }
    //   });
    //   this.dateToTimeChangedSource.next(0);
    // });

    // const selectedDatetimesGrouped$
    //   = Observable.combineLatest(
    //       this.selectedDatesSource.asObservable(),
    //       this.dateToTimeChangedSource.asObservable(),
    //       (selectedDates) => selectedDates.map( date => {
    //         if ( !this.dateToTime.has( date.valueOf() ) ) {
    //           const dateWithDefaultTime = new Date(date);
    //           dateWithDefaultTime.setHours  ( this.defaultDatetime.getHours()   );
    //           dateWithDefaultTime.setMinutes( this.defaultDatetime.getMinutes() );
    //           this.dateToTime.set( date.valueOf(), [dateWithDefaultTime] );
    //         }
    //         return this.dateToTime.get( date.valueOf() ).sort( utils.date.compare );
    //       } ) );

    // const selectedDatetimes$
    //   = selectedDatetimesGrouped$.map( e => [].concat( ...e ) );

    // selectedDatetimesGrouped$
    //   .takeWhile( () => this.alive )
    //   .subscribe( val => this.selectedDatetimesGrouped = val );

    // selectedDatetimes$
    //   .takeWhile( () => this.alive )
    //   .subscribe( val => {
    //     this.selectedDatetimes = val;
    //     this.selectedDatetimesChange.emit( this.selectedDatetimes );
    //   });
  }

  ngOnDestroy() {
    this.alive = false;
  }


  selectedDatesOnChange( value: Date[] ) {
    this.selectedDatesSource.next( value );
  }


  laterToday( date: Date ): boolean {
    if ( !date ) return false;
    const today = new Date( (new Date(      ).setHours(0, 0, 0, 0) ) );
    const date0 = new Date( (new Date( date ).setHours(0, 0, 0, 0) ) );
    return date0.getTime() >= today.getTime();
  }


  edit( date: Date ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnight(date).valueOf() );
    if ( !datetimes || datetimes.length === 0 ) return;
    const dateInArray = datetimes.find( e => e.valueOf() === date.valueOf() );
    const dialogRef = this.dialog.open( SetTimeDialogComponent, { disableClose: true } );
    dialogRef.componentInstance.date = dateInArray;
    dialogRef.afterClosed().subscribe( time => {
      dateInArray.setHours  ( time.hours   );
      dateInArray.setMinutes( time.minutes );
      this.dateToTimeChangedSource.next( Date.now() );
    });
  }

  copy( date: Date ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnight(date).valueOf() );
    if ( !datetimes || datetimes.length === 0 ) return;
    const dateCopy = new Date( date );
    datetimes.push( dateCopy );
    this.dateToTimeChangedSource.next( Date.now() );
  }

  remove( date: Date ) {
    const datetimes = this.dateToTime.get( utils.date.toMidnight(date).valueOf() );
    if ( !datetimes || datetimes.length === 0 ) return;
    utils.array.removeIf( datetimes, ( e => e.valueOf() === date.valueOf() ) );
    this.dateToTimeChangedSource.next( Date.now() );
  }


  changeDatetimeAll() {
    const dialogRef = this.dialog.open( SetTimeDialogComponent, { disableClose: true } );
    dialogRef.componentInstance.date = this.defaultDatetime;
    dialogRef.afterClosed().subscribe( time => {
      this.defaultDatetime.setHours  ( time.hours   );
      this.defaultDatetime.setMinutes( time.minutes );
      /* reset all dates in this.dateToTime */
      this.dateToTime.forEach( dates => dates.forEach( d => {
        d.setHours  ( time.hours   );
        d.setMinutes( time.minutes );
      }));
      this.dateToTimeChangedSource.next( Date.now() );
    });
  }

  toHM           = utils.date.toHM;
  toYMD          = utils.date.toYMD;
  getDayStringJp = utils.date.getDayStringJp;

}
