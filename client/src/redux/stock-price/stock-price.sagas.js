import { call, put, all, takeEvery } from 'redux-saga/effects';

import {APIKEY} from './key.js'

import {
  fetchStockPricesSuccess,
  fetchStockPricesFailure
} from './stock-price.actions'

import { convertStockData } from './stock-price.utils'

import StockPricesActionTypes from './stock-price.types';

export function* fetchStockPricesAsync({payload}) {
  try {
    const rawData = yield fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${payload}&interval=5min&apikey=${APIKEY}`, {
      method: 'get',
      })
    const unprocessedData = yield rawData.json()

    const processedData = yield call(
      convertStockData,
      unprocessedData
    );

    yield put(fetchStockPricesSuccess(processedData));
  } catch (error) {
    yield put(fetchStockPricesFailure(error.message));
  }
}

export function* fetchStockPricesStart() {
  yield takeEvery(
    StockPricesActionTypes.FETCH_STOCK_PRICES_START,
    fetchStockPricesAsync
  );
}

export function* stockPricesSagas() {
  yield all([call(fetchStockPricesStart)]);
}
