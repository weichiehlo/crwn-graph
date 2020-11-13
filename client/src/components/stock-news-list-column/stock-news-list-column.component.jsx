import React from 'react'
import StockNewsList from '../stock-news-list/stock-news-list.component'
import { StockPriceListColumnContainer } from './stock-news-list-column.styles'

const StockNewsListColoumn = function ({StocknewsInfo}){
    return(
        <StockPriceListColumnContainer>
            {
                Object.keys(StocknewsInfo).map((name, i) => {
                    return <StockNewsList key= {i} symbol={name} Stocknews={StocknewsInfo[name]}/>
                    })
            }  
        </StockPriceListColumnContainer>
    );
} 

export default StockNewsListColoumn