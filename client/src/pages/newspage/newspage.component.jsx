import React, {useState} from 'react';

// import StockNewsList from '../../components/stock-news-list/stock-news-list.component'
import StockNewsListColoumn from '../../components/stock-news-list-column/stock-news-list-column.component'

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchStockNewsStart } from '../../redux/stock-news/stock-news.actions'

import { NewsPageContainer,NewsPageHeaderContainer,NewPageTitle } from './newspage.styles';
import { selectStockNews } from '../../redux/stock-news/stock-news.selectors'
import AddStockForm from '../../components/add-stock-form/add-stock-form.component';

const NewsPage = ({fetchStockNewsStart,stockNews}) => {

  const [addField, setAddField] = useState("")

  const onChange = (event)=>{
    setAddField(event.target.value.toUpperCase())
  }

  const onSubmit = async(event)=>{
    event.preventDefault();
    await fetchStockNewsStart(addField);
  }

  return (
    <NewsPageContainer>
        <NewsPageHeaderContainer>
          <NewPageTitle>
            Stock News
          </NewPageTitle>
        </NewsPageHeaderContainer>
        <AddStockForm onChange={onChange} onSubmit={onSubmit} value={addField}/>
        <StockNewsListColoumn StocknewsInfo = {stockNews}/>
        
       
    </NewsPageContainer>
  );
}

const mapStateToProps = createStructuredSelector({
    stockNews: selectStockNews
  });
  
  const mapDispatchToProps = dispatch => ({
    fetchStockNewsStart: (symbol) => dispatch(fetchStockNewsStart(symbol))
  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewsPage);
