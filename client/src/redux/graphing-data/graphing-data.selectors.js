import { createSelector } from 'reselect';

const selectNews = state => state.stockNews;

export const selectStockNews = createSelector(
  [selectNews],
  stockNews => stockNews.stockNews
);


export const selectIsStockNewsFetching = createSelector(
  [selectNews],
  stockNews => stockNews.isFetching
);


