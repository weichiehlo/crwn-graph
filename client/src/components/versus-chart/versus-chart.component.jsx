import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { VersusChartContainer, Title, XChartContainer, YChartContainer} from './versus-chart.styles'
import * as d3 from 'd3-scale-chromatic'



const VersusChartComponent = function(props){

    let {data} = props
    const sensorNames = Object.keys(data);
    const COLORS = d3.schemePaired;

    console.log(data)
    console.log(sensorNames)

    return(
        <VersusChartContainer>
            {
                sensorNames.map((entry,index)=>{
                    return(
                        <div key={index}>
                            <Title>{entry} Chart</Title>
                            <XChartContainer>
                                <h2>{entry.split(" vs ")[0] + `(${data[entry]['xUnit']})`}</h2>
                                <YChartContainer>
                                    <BarChart width={1100}
                                    height={400}
                                    data={data[entry]['data']}
                                    margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                    layout="vertical"
                                    >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" width={150} padding={{ left: 20 }} dataKey="name"/>
                                    <Tooltip/>
                                    <Legend />
                                    {
                                        Object.keys(data[entry]['data'][0]).filter((el)=>el !=='name').map((point,i)=>{
                                            console.log(point)
                                            return <Bar key={i} dataKey= {point} stackId={index} fill={COLORS[i] } unit="%" />
                                        })
                                    }
                                    </BarChart>
                                    <h2>{entry.split(" vs ")[1] + `(${data[entry]['yUnit']})`}</h2>  
                                </YChartContainer>
                            </XChartContainer>                   
                        </div>
                    )
                    
                }
                    )

            }

        </VersusChartContainer>
    )
}



export default VersusChartComponent