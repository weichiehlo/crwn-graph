import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import directoryReducer from './directory/directory.reducer';
import stockPricesReducer from './stock-price/stock-price.reducer'
import stockNewsReducer from './stock-news/stock-news.reducer'
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
  stockPrice: stockPricesReducer,
  stockNews: stockNewsReducer,
  pg: pgReducer,
  graph: graphReducer
});

export default persistReducer(persistConfig, rootReducer);
