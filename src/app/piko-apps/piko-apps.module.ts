import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOwnCustomMaterialModule } from '../my-own-custom-material.module';
import { MyOwnLibraryModule } from '../my-own-library/my-own-library.module';

import { SchedulingModule      } from './scheduling/scheduling.module';
import { ToyBoxModule          } from './toy-box/toy-box.module';
import { ToolsCollectionModule } from './tools-collection/tools-collection.module';

@NgModule({
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    MyOwnLibraryModule,
    SchedulingModule,
    ToyBoxModule,
    ToolsCollectionModule,
  ],
  exports: [
    SchedulingModule,
    ToyBoxModule,
    ToolsCollectionModule,
  ],
  declarations: []
})
export class PikoAppsModule { }
