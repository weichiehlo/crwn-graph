import React, {useState,useEffect} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter  } from 'recharts';
import { ComposedChartContainer, Title} from './composed-chart.styles'
import { getChartColor } from '../../utils/graph.utils'
import  CoordinateInfo  from '../coordinate-info/coordinate-info.component'
import Checkbox from 'rc-checkbox';


function onChange(e) {
    console.log('Checkbox checked:', (e.target.checked));
  }

const ComposedChartComponent = function(props){

    const {data,serialNumber} = props
    //get sensor name
    const sensorNames = Object.keys(data[0]).filter((el)=>el !=='name')
    const graphingData = (getChartColor(sensorNames))
    const [displaySN, setdisplaySN] = useState(false);

    console.log(serialNumber)
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

            <Checkbox
                onChange={(event)=>setdisplaySN(event.target.checked)}
              />

            {
                displaySN?
                Object.keys(serialNumber).map((el,id)=>(
                    <CoordinateInfo key={id} title ={el} value={serialNumber[el].length} serialNumber={serialNumber[el]}/>
                ))
                :
                <div/>

            }
            

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