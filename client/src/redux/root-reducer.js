import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import directoryReducer from './directory/directory.reducer';
import pgReducer from './pg/pg.reducer'
import graphReducer from './graph/graph.reducer'


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart']
};

const rootReducer = combineReducers({
  user: userReducer,
  directory: directoryReducer,
  pg: pgReducer,
  graph: graphReducer
});

export default persistReducer(persistConfig, rootReducer);
