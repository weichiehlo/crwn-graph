import React from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter } from 'recharts';
import { ComposedChartContainer, Title} from './composed-chart.styles'
import { getChartColor } from '../../utils/graph.utils'




const ComposedChartComponent = function({data}){

    //get sensor name
    const sensorNames = Object.keys(data[0]).filter((el)=>el !=='name')
    const graphingData = (getChartColor(sensorNames))

    

    return(
        <ComposedChartContainer>
            <Title>Area Chart</Title>
            <ComposedChart
                width={500}
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
                        return<Area key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} />
                    })
                }
            </ComposedChart>  

            <Title>Bar Chart</Title>
            <ComposedChart
                width={500}
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
                width={500}
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
                width={500}
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