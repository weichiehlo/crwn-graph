import React, {useState} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter,PieChart, Pie, Cell, Sector, ReferenceLine  } from 'recharts';
import { PieChartContainer, Title, RevealContainer,ChartSNContainer, ChartRevealContainer, ChartInfoContainer, AverageContainer, Average} from './pie-chart.styles'
import { getChartColor } from '../../utils/graph.utils'
import  CoordinateInfo  from '../coordinate-info/coordinate-info.component'
import Checkbox from 'rc-checkbox';


const PieChartComponent = function(props){

    console.log(props)

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
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const data5 = [{name: 'Group As', value: 7}, {name: 'Group Bs', value: 15},
                  {name: 'Group Cs', value: 30}, {name: 'Group Ds', value: 21}, {name: 'Group SSs', value: 210}];
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


    console.log(data5)
    console.log('---------')
    console.log(data)
    
    return (
        <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
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
                                        return (<PieChart width={800} height={400} key={index}>
                                            <Pie 
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape} 
                                                data={data[entry]} 
                                                cx={300} 
                                                cy={200} 
                                                innerRadius={60}
                                                outerRadius={80} 
                                                fill="#cfb997"
                                                onMouseEnter={onPieEnter}
                                                dataKey="value"
                                            >
                                            {
                                                data[entry].map((entry, index) => <Cell fill={COLORS[index % COLORS.length] } key={index}/>)
                                            }
                                            </Pie>
                                            </PieChart>)
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
                        

                    <AverageContainer>
                        {
                            graphingData.map((entry)=>{
                                return<Average color= {entry.color} key={entry.id}> {entry.name.slice(0,entry.name.indexOf('('))} Average: {average[entry.name]} {entry.name.split(' ')[entry.name.split(' ').length-1]}</Average>
                                
                            })
                            
                        }
                    </AverageContainer>
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