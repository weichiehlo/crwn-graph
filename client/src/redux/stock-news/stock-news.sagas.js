import { call, put, all, takeLatest } from 'redux-saga/effects';

import {
  fetchStockNewsSuccess,
  fetchStockNewsFailure
} from './stock-news.actions'

import StockNewsActionTypes from './stock-news.type';
import { loadStockNewsFromFireStore } from '../../firebase/firebase.utils'


export function* fetchStockNewsAsync({payload}) {

  try {
    const stockNews = yield loadStockNewsFromFireStore(payload)
    yield put(fetchStockNewsSuccess({[payload]:stockNews}));

  } catch (error) {
    yield put(fetchStockNewsFailure(error.message));
  }
}

export function* fetchStockNewsStart() {
  yield takeLatest(
    StockNewsActionTypes.FETCH_STOCK_NEWS_START,
    fetchStockNewsAsync
  );
}

export function* stockNewsSagas() {
  yield all([call(fetchStockNewsStart)]);
}
