import { Component, OnInit, Input } from '@angular/core';

import { utils } from '../../../../my-own-library/utilities';

@Component({
  selector: 'app-set-time-dialog',
  template: `
    <div mat-dialog-content>
      <mat-form-field class="hours-selector">
        <mat-select placeholder="hours" [(value)]="selectedHours">
          <mat-option *ngFor="let hours of hoursList" [value]="hours">
            {{ hours }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      :
      <mat-form-field class="minutes-selector">
        <mat-select placeholder="minutes" [(value)]="selectedMinutes">
          <mat-option *ngFor="let minutes of minutesList" [value]="minutes">
            {{ minutes }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div mat-dialog-actions class="actionButtons">
      <span class="margined-element">
        <button mat-raised-button
          [mat-dialog-close]="{ hours: selectedHours, minutes: selectedMinutes }"
          color='primary'>
          OK
        </button>
      </span>
      <span class="margined-element">
        <button mat-raised-button
          [mat-dialog-close]="{ hours: selectedHours, minutes: selectedMinutes }">
          Cancel
        </button>
      </span>
    </div>
  `,
  styles: [`
    .actionButtons { justify-content: center; }
    .hours-selector,.minutes-selector { width: 50px; }
  `]
})
export class SetTimeDialogComponent implements OnInit {

  hoursList   = utils.number.seq0(24);
  minutesList = utils.number.seq0(60);

  selectedHours   = 0;
  selectedMinutes = 0;


  @Input() date: Date = new Date();


  constructor() { }

  ngOnInit() {
    this.selectedHours   = this.date.getHours();
    this.selectedMinutes = this.date.getMinutes();
  }

}
