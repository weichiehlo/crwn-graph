import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { pgSagas } from './pg/pg.sagas'

export default function* rootSaga() {
  yield all([ call(userSagas), call(pgSagas)]);
}
