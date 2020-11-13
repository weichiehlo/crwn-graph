import React from 'react'
import StockNews from  '../stock-news/stock-news.component'
import {StockNewsListContainer,StockNewsListTitle,StockNewsListCollections} from './stock-news-list.styles'

const StockNewsList = function({symbol, Stocknews}){
    return(
        <StockNewsListContainer>
            <StockNewsListTitle>Stock News for {symbol}</StockNewsListTitle>
            <StockNewsListCollections>
            {
                Stocknews.map((news,index)=>{
                    const {news_url, image_url, title, text, source_name, date} = news;
                    return (
                        <StockNews key = {index} news_url={news_url} image_url={image_url} 
                        title={title} text={text} source_name={source_name} date={date}/>
                    )
                })
            }
            </StockNewsListCollections>
        </StockNewsListContainer>
    )
}

export default StockNewsList