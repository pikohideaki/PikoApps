import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';
import { MyOwnLibraryModule } from '../my-own-library/my-own-library.module';

import { SchedulingModule } from './scheduling/scheduling.module';

@NgModule({
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    MyOwnLibraryModule,
    SchedulingModule,
  ],
  exports: [
    SchedulingModule,
  ],
  declarations: []
})
export class PikoAppsModule { }
