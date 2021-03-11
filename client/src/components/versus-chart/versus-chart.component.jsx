import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { VersusChartContainer, Title, XChartContainer, YChartContainer} from './versus-chart.styles'



const VersusChartComponent = function(props){

    let {data} = props
    const sensorNames = Object.keys(data);
    const COLORS = [
    "#422f83",
    "#3888f9",
    "#5efc74",
    "#9ff84b",
    "#c1ed3d",
    "#f5c72b",
    "#ffad25",
    "#ff721b",
    "#d5380f",
    "#910c00",];

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