import React from 'react'
import {StockPriceContainer, RobotImage, RobotInfo,RobotTitle} from './stock-price-card.styles.jsx'




const StockPriceCard = function({id, name, price, average, max, min}){
    const color1= '#'+Math.floor(Math.random()*16777215).toString(16)
    const color2= '#'+Math.floor(Math.random()*16777215).toString(16)
    return(
        
        <StockPriceContainer color1={color1} color2={color2}>
            <RobotTitle>{name}</RobotTitle>
            <RobotImage src={`https://robohash.org/${id}?200x200`} alt='robots'></RobotImage>
            <RobotInfo color1={color1}>
                <p>Current Price ${price}</p>
                <p>Daily Average Price ${average}</p>
                <p>Daily High ${max}</p>
                <p>Daily Low ${min}</p>
            </RobotInfo>
        </StockPriceContainer>
    )
}

export default StockPriceCard