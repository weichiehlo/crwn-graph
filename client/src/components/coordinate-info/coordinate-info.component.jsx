import React from 'react';
import {
  ScrollContainer,
  CoordinateInfoContainer,
  InfoContainer,
  Info
} from './coordinate-info.styles';

const CoordinateInfo = ({ title, serialNumber, color}) => {


  title = title.split('-');
  let model = title[0],
      sensor = title[1],
      range = title[2]
  

  return(
  <CoordinateInfoContainer>
    <InfoContainer>
      <Info color={color}>{model}</Info>
      <Info color={color}>{sensor}</Info>
      <Info color={color}>{range}</Info>
    </InfoContainer>
    <ScrollContainer>
        {
          serialNumber.map((el,id)=>(
            <div key = {id}>{el}</div>
          ))
        }
    </ScrollContainer>
  </CoordinateInfoContainer>)
  };


export default CoordinateInfo
