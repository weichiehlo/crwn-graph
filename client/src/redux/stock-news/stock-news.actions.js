import StockNewsActionTypes from './stock-news.type';

export const fetchStockNewsStart = (Symbol) => ({
  type: StockNewsActionTypes.FETCH_STOCK_NEWS_START,
  payload: Symbol
});

export const fetchStockNewsSuccess = news => ({
  type: StockNewsActionTypes.FETCH_STOCK_NEWS_SUCCESS,
  payload: news
});

export const fetchStockNewsFailure = errorMessage => ({
  type: StockNewsActionTypes.FETCH_STOCK_NEWS_FAILURE,
  payload: errorMessage
});

