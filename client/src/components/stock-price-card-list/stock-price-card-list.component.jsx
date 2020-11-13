import React from 'react'
import StockPriceCard from '../stock-price-card/stock-price-card.component'
import { StockPriceListContainer } from './stock-price-card-list.styles.jsx'

const StockPriceCardList = function ({stocks}){
    return(
        <StockPriceListContainer>
            {
                Object.keys(stocks).map((name, i) => {
                    return <StockPriceCard key= {i} id ={i} name={stocks[name].symbol} price={stocks[name].price} average={stocks[name].average} max={stocks[name].max} min={stocks[name].min}/>
                    })
            }  
        </StockPriceListContainer>
    );
} 

export default StockPriceCardList