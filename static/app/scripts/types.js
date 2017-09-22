/* @flow */

export type RootState = {};

export type Action<T> = {
  type: string,
  payload: T
};
