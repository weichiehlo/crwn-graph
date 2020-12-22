import React from 'react';
import {
  ScrollContainer
} from './coordinate-info.styles';

const CoordinateInfo = ({ title,  value, serialNumber}) => (
  <div>
    <h3>title:{title}</h3>
    <h4>value:{value}</h4>
    <ScrollContainer>
        {
          serialNumber.map((el,id)=>(
            <div key = {id}>{el}</div>
          ))
        }
    </ScrollContainer>
  </div>
);


export default CoordinateInfo
