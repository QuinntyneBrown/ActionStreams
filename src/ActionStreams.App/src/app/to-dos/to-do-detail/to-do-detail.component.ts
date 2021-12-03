import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToDo } from '@api';

@Component({
  selector: 'app-to-do-detail',
  templateUrl: './to-do-detail.component.html',
  styleUrls: ['./to-do-detail.component.scss']
})
export class ToDoDetailComponent {

  form: FormGroup = new FormGroup({
    toDoId: new FormControl(null,[]),
    description: new FormControl(null, [Validators.required]),
    status: new FormControl(null,[])
  });

  @Input("toDo") set toDo(toDo: ToDo) {
    if(toDo) {
      this.form.setValue(toDo);
    } else {
      this.form.reset();
    }
  }

  @Output() public save: EventEmitter<ToDo> = new EventEmitter();

  @Output() public cancel: EventEmitter<void> = new EventEmitter();
}
