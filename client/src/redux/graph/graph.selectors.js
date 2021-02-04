import { createSelector } from 'reselect';

const selectGraph = state => state.graph;

export const selectUserGraph = createSelector(
  [selectGraph],
  graph => graph
);

