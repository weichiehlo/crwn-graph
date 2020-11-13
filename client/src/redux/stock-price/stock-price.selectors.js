import { createSelector } from 'reselect';

const selectStockPrice = state => state.stockPrice;

export const selectStockPrices = createSelector(
  [selectStockPrice],
  stockPrice => stockPrice.stockPrices
);

export const selectStockNames = createSelector(
  [selectStockPrice],
  stockPrice => Object.keys(stockPrice.stockPrices)
  
);

export const selectIsStockPriceFetching = createSelector(
  [selectStockPrice],
  stockPrice => stockPrice.isFetching
);
