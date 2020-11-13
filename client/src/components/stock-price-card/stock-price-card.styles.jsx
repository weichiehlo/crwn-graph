import styled from 'styled-components';


export const StockPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
  background-image: linear-gradient(to bottom right, ${props => props.color1}, ${props => props.color2});
  align-items:center;
  border-radius: 25px;

`;

export const RobotInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1px 2px;
  margin-top: 10px;
  text-shadow: 2px 2px 5px ${props => props.color1};

`;


export const RobotImage = styled.img`
  width: 100%;
`;

export const RobotTitle = styled.h1`
  color: black;
  padding: 1px 15px;
  border-bottom: 5px solid red;
`;

