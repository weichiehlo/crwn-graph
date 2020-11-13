import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectIsStockNewsFetching } from '../../redux/stock-news/stock-news.selectors';
import WithSpinner from '../with-spinner/with-spinner.component';
import StockNewsListColoumn from './stock-news-list-column.component';

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsStockNewsFetching
});

const StockNewsListColoumnContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(StockNewsListColoumn);

export default StockNewsListColoumnContainer;
