import { call, put, all, takeEvery } from 'redux-saga/effects';


import {
  fetchPgSuccess,
  fetchPgFailure
} from './pg.actions'

import PgActionTypes from './pg.type';
import axios from 'axios';


export function* fetchPgAsync({payload}) {
  const {title, query, database} = payload
  try {
    const response = yield axios({
      url:'http://192.168.1.160:5000/query',
      method: 'post', 
      data: { query: query,
              database: database}});
    yield put(fetchPgSuccess({data:{[title]:response.data},sql:{[title]:payload}}));

  } catch (error) {
    yield put(fetchPgFailure(error.message));
  }
}

export function* fetchPgStart() {
  yield takeEvery(
    PgActionTypes.FETCH_PG_START,
    fetchPgAsync
  );
}

export function* pgSagas() {
  yield all([call(fetchPgStart)]);
}
