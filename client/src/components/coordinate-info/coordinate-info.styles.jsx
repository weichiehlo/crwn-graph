import styled from 'styled-components';

export const ScrollContainer = styled.div`
  overflow-y: scroll;
  border: 1px solid black;
  height: 100px;
`;

export const CoordinateInfoContainer = styled.div`
 display: flex;
 flex-direction: column;
 border-left: solid grey 3px;
 padding:20px;
`;

export const InfoContainer = styled.div`
 display:flex;
 flex-direction:column;
 justify-content:center;
 align-items:center;
`

export const Info = styled.span`
 color:${props=>props.color};
`
