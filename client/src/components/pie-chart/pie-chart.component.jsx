import React, {useState} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter,PieChart, Pie, Cell, Sector  } from 'recharts';
import { PieChartContainer, Title, RevealContainer,ChartSNContainer, ChartRevealContainer, ChartInfoContainer, GraphTitle, Average, SinglePieContainer, GraphContainer} from './pie-chart.styles'
import { getChartColor } from '../../utils/graph.utils'
import  CoordinateInfo  from '../coordinate-info/coordinate-info.component'
import Checkbox from 'rc-checkbox';
import * as d3 from 'd3-scale-chromatic'


const PieChartComponent = function(props){

    let {data,serialNumber,average,type} = props
    //get sensor name
    const sensorNames = Object.keys(data)
    const graphingData = (getChartColor(sensorNames))
    const [displaySN, setdisplaySN] = useState(false);
    const [activeIndex, setactiveIndex] = useState(1);

    const onPieEnter = (data, index)=>{
        setactiveIndex(index)
    }

    

    // to eliminate the empty serial number list
    for(let point in serialNumber){
        if(serialNumber[point].length === 0){
            delete serialNumber[point]
        }
    }

    //Pie Calculation
    const COLORS = d3.schemeSet3;
    const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    
    return (
        <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize="30px">{payload.name}</text>
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
        <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Count ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
            {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
        </g>
    );
    };
                  
    //

    return(
        <PieChartContainer>

            <Title>{type} Chart</Title>
            <ChartSNContainer>
                <ChartRevealContainer>
    
                        {
                            Object.keys(data).map((entry,index)=>{
                                switch(type){
                                    case 'Pie':
                                        return (
                                            <SinglePieContainer>
                                            <GraphTitle color= {graphingData[index].color}>{entry}</GraphTitle>
                                            <GraphContainer>
                                            <PieChart width={800} height={800} key={index}>
                                            <Pie 
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape} 
                                                data={data[entry]} 
                                                cx={400} 
                                                cy={400} 
                                                innerRadius={120}
                                                outerRadius={160} 
                                                fill="#cfb997"
                                                onMouseEnter={onPieEnter}
                                                dataKey="value"
                                            >
                                            {
                                                data[entry].map((entry, index) => <Cell fill={COLORS[index % COLORS.length] } key={index}/>)
                                            }
                                            </Pie>
                                            </PieChart>
                                            </GraphContainer>
                                            <Average color= {graphingData[index].color} key={index}> {graphingData[index].name.slice(0,graphingData[index].name.indexOf('('))} Average: {average[graphingData[index].name]} {graphingData[index].name.split(' ')[graphingData[index].name.split(' ').length-1]}</Average>
                                            </SinglePieContainer>)
                                            
                                    case 'Bar':
                                        return (<Bar key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                    case 'Line': 
                                        return (<Line key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                    case 'Scatter':
                                        return (<Scatter key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                    default:
                                        return (<div/>)
                                }
                            })
                            
                        }
                        
                    <RevealContainer>
                        <span>Reveal SN</span>
                        <Checkbox
                            onChange={(event)=>setdisplaySN(event.target.checked)}
                        />
                    </RevealContainer>
                </ChartRevealContainer>

                {
                    displaySN?
                    <ChartInfoContainer>
                        {
                            Object.keys(serialNumber).map((el,id)=>(
                                <CoordinateInfo key={id} title ={el} serialNumber={[...new Set(serialNumber[el])] } color={graphingData.find(sensor=>sensor.name === el.split('-').slice(0,el.split('-').length-2).join('-'))['color']}/>
                            ))
                        }
                    </ChartInfoContainer>
                    :
                    <React.Fragment/>
    
                }
            </ChartSNContainer>
        </PieChartContainer>
    )
}



export default PieChartComponent