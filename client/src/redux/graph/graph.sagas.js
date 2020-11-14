import { call, put, all, takeLatest } from 'redux-saga/effects';

import {
  fetchGraphSuccess,
  fetchGraphFailure
} from './graph.actions'

import GraphActionTypes from './graph.type';
import axios from 'axios';


export function* fetchGraphAsync({payload}) {
  const {title, query, database} = payload
  try {
    const response = yield axios({
      url:'query',
      method: 'post', 
      data: { query: query,
              database: database}});
    yield put(fetchGraphSuccess({[title]:response.data}));

  } catch (error) {
    yield put(fetchGraphFailure(error.message));
  }
}

export function* fetchGraphStart() {
  yield takeLatest(
    GraphActionTypes.FETCH_GRAPH_START,
    fetchGraphAsync
  );
}

export function* graphSagas() {
  yield all([call(fetchGraphStart)]);
}
