import PgActionTypes from './pg.type';

export const fetchPgStart = (info) => ({
  type: PgActionTypes.FETCH_PG_START,
  payload: info
});

export const fetchPgSuccess = data => ({
  type: PgActionTypes.FETCH_PG_SUCCESS,
  payload: data
});

export const fetchPgFailure = errorMessage => ({
  type: PgActionTypes.FETCH_PG_FAILURE,
  payload: errorMessage
});

