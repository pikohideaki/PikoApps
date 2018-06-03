import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Feature Modules */
import { ClipboardModule } from 'ngx-clipboard';

import { MyOwnCustomMaterialModule } from '../../my-own-custom-material.module';
import { MyOwnLibraryModule } from '../../my-own-library/my-own-library.module';

import { SchedulingComponent } from './scheduling.component';
import { AnswerPageComponent } from './answer-page/answer-page.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { SpreadsheetComponent } from './answer-page/spreadsheet/spreadsheet.component';
import { AnswerFormComponent } from './answer-page/answer-form/answer-form.component';
import { EditPasswordDialogComponent } from './answer-page/edit-password-dialog.component';
import { DateUserTableComponent } from './answer-page/spreadsheet/date-user-table/date-user-table.component';
import { UserDateTableComponent } from './answer-page/spreadsheet/user-date-table/user-date-table.component';

import { AnswerDeadlineComponent } from './sub-components/answer-deadline.component';
import { NameAndNotesComponent } from './sub-components/name-and-notes.component';
import { PasswordComponent } from './sub-components/password.component';
import { SetTimeDialogComponent } from './sub-components/select-dates/set-time-dialog.component';
import { SelectDatesComponent } from './sub-components/select-dates/select-dates.component';
import { SymbolSettingsComponent } from './sub-components/symbol-settings/symbol-settings.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    MyOwnCustomMaterialModule,
    MyOwnLibraryModule,
  ],
  exports: [
    SchedulingComponent,
    SetTimeDialogComponent,
    AnswerPageComponent,
  ],
  declarations: [
    SchedulingComponent,
    SetTimeDialogComponent,
    AnswerPageComponent,
    NameAndNotesComponent,
    SelectDatesComponent,
    AnswerDeadlineComponent,
    SymbolSettingsComponent,
    EditEventComponent,
    SpreadsheetComponent,
    AnswerFormComponent,
    PasswordComponent,
    EditPasswordDialogComponent,
    DateUserTableComponent,
    UserDateTableComponent,
  ],
  entryComponents: [
    SetTimeDialogComponent,
    EditPasswordDialogComponent,
  ],
})
export class SchedulingModule { }
