import StockNewsActionTypes from './stock-news.type';

const INITIAL_STATE = {
    stockNews:{},
    isFetching: false,
    errorMessage:undefined
};

const stockNewsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case StockNewsActionTypes.FETCH_STOCK_NEWS_START:
        return {
          ...state,
          isFetching: true
        };
      case StockNewsActionTypes.FETCH_STOCK_NEWS_SUCCESS:
        return {
          ...state,
          isFetching: false,
          stockNews: {...state.stockNews,...action.payload}
        };
      case StockNewsActionTypes.FETCH_STOCK_NEWS_FAILURE:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.payload
        };
      default:
        return state;
    }
  };
  
  export default stockNewsReducer;
  