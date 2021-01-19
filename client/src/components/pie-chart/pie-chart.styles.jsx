import styled from 'styled-components';

export const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
  align-items:center;
  border-radius: 25px;
`;


export const Title = styled.h1`
  color: black;
  padding: 1px 15px;
  border-bottom: 5px solid red;
  width: 100%;
  margin-bottom: 50px;
`;

export const RevealContainer = styled.div`
 display: flex;
 flex-direction: row;
`;

export const ChartRevealContainer = styled.div`
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
`;

export const ChartSNContainer = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 gap: 50px;
`;

export const ChartInfoContainer = styled.div`
 display: flex;
 flex-direction: row;
 gap: 12px;
 padding: 20px;
 overflow-x: scroll;
 width: 40%;
`;

export const Average = styled.span`
 color:${props=>props.color};
`

export const GraphTitle = styled.h2`
 color:${props=>props.color};
`

export const SinglePieContainer = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: center;
 gap: 50px;
`;

export const GraphContainer = styled.div`

`;


