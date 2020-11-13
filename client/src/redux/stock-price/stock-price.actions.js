import StockPricesActionTypes from './stock-price.types';

export const fetchStockPricesStart = (Symbol) => ({
  type: StockPricesActionTypes.FETCH_STOCK_PRICES_START,
  payload: Symbol
});

export const fetchStockPricesSuccess = prices => ({
  type: StockPricesActionTypes.FETCH_STOCK_PRICES_SUCCESS,
  payload: prices
});

export const fetchStockPricesFailure = errorMessage => ({
  type: StockPricesActionTypes.FETCH_STOCK_PRICES_FAILURE,
  payload: errorMessage
});

