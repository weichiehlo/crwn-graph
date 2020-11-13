import React from 'react'
import {StockNewsContainer,NewsImage,NewsTitle,NewsFooter} from  './stock-news.styles'

const StockNews = function({news_url, image_url, title, text, source_name, date}){
    return(
        <StockNewsContainer onClick={()=>window.open(news_url, '_blank')}>
            <NewsTitle>{title}</NewsTitle>
            <NewsImage src={image_url} alt='NewsImages'></NewsImage>
            <p>{text}</p>
            <NewsFooter>
                <span>Source: {source_name}</span>
                <span>Date: {date}</span>
            </NewsFooter>
        </StockNewsContainer>
    )
}

export default StockNews