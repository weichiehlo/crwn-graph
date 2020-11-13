import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectIsStockPriceFetching } from '../../redux/stock-price/stock-price.selectors';
import WithSpinner from '../with-spinner/with-spinner.component';
import StockPriceCardList from './stock-price-card-list.component';

const mapStateToProps = createStructuredSelector({
  isLoading: selectIsStockPriceFetching
});

const StockPriceCardListContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(StockPriceCardList);

export default StockPriceCardListContainer;
