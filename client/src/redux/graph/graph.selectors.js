import { createSelector } from 'reselect';

const graph = state => state.graph;

export const selectGraph = createSelector(
  [graph],
  data => data.graph
);


export const selectIsGraphFetching = createSelector(
  [graph],
  data => data.isFetching
);


