import styled from 'styled-components';

export const StockNewsContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  border-radius:25px;
  cursor: pointer;
  background-color:gray;
  
`;


export const NewsImage = styled.img`
  width: 100%;
`;

export const NewsTitle = styled.h2`
  color: black;
  padding: 1px 15px;
  font-size: 2rem;
`;


export const NewsFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.7rem;
`;
