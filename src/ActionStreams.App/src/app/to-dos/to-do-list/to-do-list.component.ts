import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ToDo } from '@api';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDoListComponent {
  @Input() toDos: ToDo[] = [];

  @Input() toDo: ToDo;

  @Output() public select: EventEmitter<ToDo> = new EventEmitter();
}
