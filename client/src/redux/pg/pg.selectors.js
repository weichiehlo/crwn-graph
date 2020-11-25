import { createSelector } from 'reselect';

const pg = state => state.pg;

export const selectPg = createSelector(
  [pg],
  data => data.pg_data
);


export const selectIsPgFetching = createSelector(
  [pg],
  data => data.isFetching
);


