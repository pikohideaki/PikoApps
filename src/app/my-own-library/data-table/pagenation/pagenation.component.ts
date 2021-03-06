
import {combineLatest as observableCombineLatest,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { utils } from '../../utilities';


@Component({
  selector: 'app-data-table--pagenation',
  templateUrl: './pagenation.component.html',
  styleUrls: ['./pagenation.component.css']
})
export class PagenationComponent implements OnInit {

  @Input()  selectedPageIndex$: Observable<number>;
  @Output() selectedPageIndexChange = new EventEmitter<number>();

  @Input() itemsPerPage$: Observable<number>;
  @Input() dataSize$: Observable<number>;

  rangeStart$: Observable<number>;
  rangeEnd$:   Observable<number>;
  pageLength$: Observable<number>;
  pageIndice$: Observable<number[]>;


  constructor(
  ) {
  }

  ngOnInit() {
    this.pageLength$ = observableCombineLatest(
        this.itemsPerPage$,
        this.dataSize$,
        (itemsPerPage, dataSize) => Math.ceil( dataSize / itemsPerPage ) );

    this.pageIndice$
      = this.pageLength$.pipe(map( len => utils.number.seq0( len ) ));

    this.rangeStart$ = observableCombineLatest(
        this.itemsPerPage$,
        this.selectedPageIndex$,
        (itemsPerPage, selectedPageIndex) =>
          itemsPerPage * selectedPageIndex + 1 );

    this.rangeEnd$ = observableCombineLatest(
        this.itemsPerPage$,
        this.selectedPageIndex$,
        this.dataSize$,
        (itemsPerPage, idx, dataSize) =>
          Math.min( dataSize, (itemsPerPage * (idx + 1)) ) );
  }

  setSelectedPageIndex( idx: number ) {
    this.selectedPageIndexChange.emit( idx );
  }
}



export function getDataAtPage<T>(
  data: Array<T>,
  itemsPerPage: number,
  selectedPageIndex: number
): Array<T> {
  return data.slice( itemsPerPage * selectedPageIndex, itemsPerPage * (selectedPageIndex + 1) );
}
