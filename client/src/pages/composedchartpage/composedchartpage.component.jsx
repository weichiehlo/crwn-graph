import React from 'react';
import ComposedChartComponent from '../../components/composed-chart/composed-chart.component'

const ComposedChartPage = () => {
  const data = [
    {
      name: 'Page A', "FAN1(RPM)": 590, "FAN2(RPM)": 800, "FAN3(RPM)": 700,
    },
    {
      name: 'Page B', "FAN1(RPM)": 868, "FAN2(RPM)": 967, "FAN3(RPM)": 800,
    },
    {
      name: 'Page C', "FAN1(RPM)": 1397, "FAN2(RPM)": 1098, "FAN3(RPM)": 1200,
    },
    {
      name: 'Page D', "FAN1(RPM)": 1480, "FAN2(RPM)": 1200, "FAN3(RPM)": 900,
    },
    {
      name: 'Page E', "FAN1(RPM)": 1520, "FAN2(RPM)": 1108, "FAN3(RPM)": 1800,
    },
    {
      name: 'Page F', "FAN1(RPM)": 1400, "FAN2(RPM)": 680, "FAN3(RPM)": 800,
    },
  ];
  return (
    <ComposedChartComponent data={data}/>
  );
}



export default ComposedChartPage;
