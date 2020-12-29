import React, {useState} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter  } from 'recharts';
import { ComposedChartContainer, Title, RevealContainer,ChartSNContainer, ChartRevealContainer, ChartInfoContainer} from './composed-chart.styles'
import { getChartColor } from '../../utils/graph.utils'
import  CoordinateInfo  from '../coordinate-info/coordinate-info.component'
import Checkbox from 'rc-checkbox';


const ComposedChartComponent = function(props){

    const {data,serialNumber} = props
    //get sensor name
    const sensorNames = Object.keys(data[0]).filter((el)=>el !=='name')
    const graphingData = (getChartColor(sensorNames))
    const [displaySN, setdisplaySN] = useState(false);

    // const renderTooltip = (props)=> {
    //     if(props['active']){
        
        
    //     return (
    //         props['payload'].map((el,id)=>(
    //             <CoordinateInfo key={id} title ={el.dataKey} subtitle ={el.payload.name} value={el.payload[el.dataKey]} serialNumber={serialNumber[el.dataKey+"_"+el.payload.name]}/>
    //         )
    //         )
            
    //     )
    //     }
    //   }
    // <Tooltip content={renderTooltip} />

    

    return(
        <ComposedChartContainer>
            <Title>Area Chart</Title>
            <ChartSNContainer>
                <ChartRevealContainer>
                    <ComposedChart
                        width={1100}
                        height={400}
                        data={data}
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                        >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                        {
                            graphingData.map((entry)=>{
                                return<Area key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} />
                            })
                            
                        }
                    </ComposedChart>
                    <RevealContainer>
                        <span>Reveal SN</span>
                        <Checkbox
                            onChange={(event)=>setdisplaySN(event.target.checked)}
                        />
                    </RevealContainer>
                </ChartRevealContainer>
                <ChartInfoContainer>
                {
                    displaySN?
                    Object.keys(serialNumber).map((el,id)=>(
                        <CoordinateInfo key={id} title ={el} serialNumber={[...new Set(serialNumber[el])] } color={graphingData.find(sensor=>sensor.name === el.split('-').slice(0,el.split('-').length-2).join('-'))['color']}/>
                    ))
                    :
                    <div/>
    
                }
                </ChartInfoContainer>
                
            
            </ChartSNContainer>
            
            
            
            

            <Title>Bar Chart</Title>
            <ComposedChart
                width={1100}
                height={400}
                data={data}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
                >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    graphingData.map((entry)=>{
                        return<Bar key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} />
                    })
                }
            </ComposedChart>                           
            

            <Title>Line Chart</Title>
            <ComposedChart
                width={1100}
                height={400}
                data={data}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
                >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    graphingData.map((entry)=>{
                        return<Line key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} />
                    })
                }
            </ComposedChart>

            <Title>Scatter Chart</Title>
            <ComposedChart
                width={1100}
                height={400}
                data={data}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
                >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    graphingData.map((entry)=>{
                        return<Scatter key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} />
                    })
                }
            </ComposedChart>
        </ComposedChartContainer>
    )
}



export default ComposedChartComponent