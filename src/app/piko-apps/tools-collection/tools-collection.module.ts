import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOwnCustomMaterialModule } from '../../my-own-custom-material.module';
import { MyOwnLibraryModule } from '../../my-own-library/my-own-library.module';

import { ToolsCollectionComponent } from './tools-collection.component';
import { Tsv2jsonComponent } from './tsv2json/tsv2json.component';
import { JsonPrettyPrintComponent } from './json-pretty-print/json-pretty-print.component';
import { Json2tsvComponent } from './json2tsv/json2tsv.component';



@NgModule({
  imports: [
    CommonModule,
    MyOwnCustomMaterialModule,
    MyOwnLibraryModule,
  ],
  declarations: [
    Tsv2jsonComponent,
    ToolsCollectionComponent,
    JsonPrettyPrintComponent,
    Json2tsvComponent,
  ]
})
export class ToolsCollectionModule { }
