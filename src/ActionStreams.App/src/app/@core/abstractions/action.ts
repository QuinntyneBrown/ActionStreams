export type ActionType = 'select' | 'create' | 'update' | 'delete' | 'default';

export type Action<T> = {
  type: ActionType,
  payload: T
}
