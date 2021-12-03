import { Component } from '@angular/core';
import { ToDo } from '@api';
import { ToDoStore } from '@core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss']
})
export class ToDosComponent {

  private _createToDoActionStream: Subject<void> = new Subject();

  createToDo$ = this._createToDoActionStream.asObservable();

  private _selectToDoActionStream: Subject<string> = new Subject();

  selectToDo$ = this._selectToDoActionStream.asObservable();

  public vm$ = combineLatest([
    this._toDoStore.getToDos(),
    this._toDoStore.select(x => x.toDo)
  ])
  .pipe(
    map(([toDos,toDo]) => ({
      toDos,
      toDo
    }))
  );

  constructor(
    private readonly _toDoStore: ToDoStore
  ) { }

  public handleSave(toDo: ToDo) {
    if(toDo.toDoId) {
      this._toDoStore.updateToDo(toDo);
    } else {
      this._toDoStore.createToDo(toDo);
    }
  }

  public handleCancel() {
    this._createToDoActionStream.next();
  }

  public selectToDo(toDoId: string) {
    this._selectToDoActionStream.next(toDoId);
  }

  createToDo() {
    this._createToDoActionStream.next();
  }

}
