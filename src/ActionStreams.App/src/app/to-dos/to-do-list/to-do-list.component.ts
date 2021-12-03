import { Component, Input } from '@angular/core';
import { ToDo } from '@api';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent {
  @Input() toDos!: ToDo[];
}