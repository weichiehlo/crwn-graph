import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { stockPricesSagas } from './stock-price/stock-price.sagas'
import { stockNewsSagas } from './stock-news/stock-news.sagas'
import { pgSagas } from './pg/pg.sagas'

export default function* rootSaga() {
  yield all([ call(userSagas), call(stockPricesSagas), call(stockNewsSagas), call(pgSagas)]);
}
