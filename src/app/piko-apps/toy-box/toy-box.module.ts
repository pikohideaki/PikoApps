import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOwnCustomMaterialModule } from '../../my-own-custom-material.module';
import { MyOwnLibraryModule } from '../../my-own-library/my-own-library.module';

import { ToyBoxComponent } from './toy-box.component';
import { LambdaInterpreterComponent } from './lambda-interpreter/lambda-interpreter.component';



@NgModule({
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    MyOwnLibraryModule,
  ],
  declarations: [
    ToyBoxComponent,
    LambdaInterpreterComponent,
  ]
})
export class ToyBoxModule { }
