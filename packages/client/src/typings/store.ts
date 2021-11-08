import { Component, Page } from './board';

export type Board = {
  selected: Array<number>;
  data: Array<Component>;
};

export type Snapshot = {
  index: number;
  data: Array<{ page: Page; selected: number[] }>;
};

export type RootStateType = {
  board: Board;
  snapshot: Snapshot;
};
