import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToDosRoutingModule } from './to-dos-routing.module';
import { ToDosComponent } from './to-dos.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ToDoDetailComponent } from './to-do-detail/to-do-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ToDosComponent,
    ToDoListComponent,
    ToDoDetailComponent
  ],
  imports: [
    CommonModule,
    ToDosRoutingModule,
    ReactiveFormsModule
  ]
})
export class ToDosModule { }
