import StockPricesActionTypes from './stock-price.types';

const INITIAL_STATE = {
  stockPrices: {},
  isFetching: false,
  errorMessage: undefined
};

const stockPricesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case StockPricesActionTypes.FETCH_STOCK_PRICES_START:
      return {
        ...state,
        isFetching: true
      };
    case StockPricesActionTypes.FETCH_STOCK_PRICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        stockPrices: {...state.stockPrices,...action.payload}
      };
    case StockPricesActionTypes.FETCH_STOCK_PRICES_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default stockPricesReducer;
