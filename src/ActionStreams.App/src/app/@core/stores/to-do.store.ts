import { Injectable } from "@angular/core";
import { ToDo, ToDoService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, filter, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";
import { isNonNull } from "./abstractions/is-non-null";


export interface ToDoStoreState {
  toDos?: ToDo[],
  toDo?: ToDo
}

@Injectable({
  providedIn: "root"
})
export class ToDoStore extends ComponentStore<ToDoStoreState> {

  constructor(
    private readonly _toDoService: ToDoService
  ) {
    super({ })
  }

  public getToDos() {
    return of(undefined)
    .pipe(
      tap(_ => this._getToDos()),
      switchMap(_ => this.select(x => x.toDos)),
      shareReplay(1)
    )
  }

  public getToDoById(toDoId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getToDoById(toDoId)),
      switchMap(_ => this.select(x => x.toDo)),
      shareReplay(1)
    );
  }

  private readonly _getToDos = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.toDos).pipe(first())
      .pipe(
        switchMap(toDos => {
          if(toDos === undefined) {
            return this._toDoService.get()
            .pipe(
              tap(toDos => this.setState((state) => ({...state, toDos }))),
            );
          }
          return of(toDos);
        }),
        filter(isNonNull)
      ))
    ));

  private _getToDoById = this.effect<string>(toDoId$ =>
    toDoId$.pipe(
      switchMapByKey(toDoId => toDoId, toDoId => {
        return this.select(x => x.toDo).pipe(first())
        .pipe(
          switchMap(toDo => {
            if(toDo?.toDoId == toDoId) {
              return of(toDo);
            }
            return this._toDoService.getById({ toDoId })
            .pipe(
              tap((toDo:ToDo) => this.setState((state) => ({ ...state, toDo })))
            )
          }),
          filter(isNonNull)
        );
      })
    ))

  readonly createToDo = this.effect<ToDo>(toDo$ => toDo$.pipe(
    mergeMap(toDo => {
      return this._toDoService.create({ toDo })
      .pipe(
        tap({
          next:({ toDo }) => {
            this.setState((state) => ({...state, toDo }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateToDo = this.effect<ToDo>(toDo$ => toDo$.pipe(
    mergeMap(toDo => {
      return this._toDoService.update({ toDo })
      .pipe(
        tap({
          next: ({ toDo }) => {
            this.setState((state) => ({...state, toDo }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeToDo = this.effect<ToDo>(toDo$ => toDo$.pipe(
    mergeMap(toDo => {
      return this._toDoService.remove({ toDo })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, toDo: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}