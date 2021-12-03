import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToDo } from '@api';
import { ToDoStore } from '@core';
import { Action } from '@core/abstractions/action';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDosComponent {

  private readonly _actionStream: BehaviorSubject<Action<ToDo>> = new BehaviorSubject({
    type: 'default',
    payload: null
  });

  private readonly _action$ = this._actionStream.asObservable();

  public vm$ = of(undefined)
  .pipe(
    switchMap(_ => combineLatest([
      this._toDoStore.getToDos(),
      this._toDoStore.select(x => x.toDo),
      this._action$.pipe(
        tap(action => {
          switch(action.type) {
            case 'cancel':
            case 'create':
              this._toDoStore.setState((state) => ({...state, toDo: null }));
              break;

            case 'select':
              this._toDoStore.setState((state) => ({...state, toDo: action.payload }));
              break;

            case 'default':
              break;
          }
        })
      )
    ])
    .pipe(
      map(([toDos,toDo]) => {
        return {
          toDos,
          toDo
        };
      })
    ))
  )

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
    this._actionStream.next({ payload: null, type: 'cancel' });
  }

  public handleSelect(toDo: ToDo) {
    this._actionStream.next({ payload: toDo, type: 'select' });
  }

  createToDo() {
    this._actionStream.next({ payload: null, type: 'create' });
  }

}
