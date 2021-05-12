import React, {useState} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter } from 'recharts';
import { ComposedChartContainer, Title, RevealContainer,ChartSNContainer, ChartRevealContainer, ChartInfoContainer } from './black-list.styles'
import { getChartColor } from '../../utils/graph.utils'
import  CoordinateInfo  from '../coordinate-info/coordinate-info.component'
import Checkbox from 'rc-checkbox';


const BlacklistComposedChartComponent = function(props){


    

    let {data,type} = props
    
    const graphingData = (getChartColor(Object.keys(data.processedData[0])))

    const [displayDetail, setdisplayDetail] = useState(false);

    const timeRe = /(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)/;


    return(
        <ComposedChartContainer>

            <Title>{type} Chart</Title>
            <ChartSNContainer>
                <ChartRevealContainer>
                    <ComposedChart
                    width={1100}
                    height={400}
                    data={data.processedData}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                    >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis type="number"/>
                    <Tooltip/>
                    <Legend />
                    {
                        graphingData.map((entry)=>{
                            switch(type){
                                case 'Area':
                                    return (<Area key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                case 'Bar':
                                    return (<Bar key={entry.id} type="monotone"  dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                case 'Line': 
                                    return (<Line key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                case 'Scatter':
                                    return (<Scatter key={entry.id} type="monotone" dataKey={entry.name} fill={entry.color}  stroke={entry.color} unit="%"/>)
                                default:
                                    return (<div/>)
                            }
                        })
                        
                    }
                    </ComposedChart>

                    <RevealContainer>
                        <span>Reveal Detail</span>
                        <Checkbox
                            onChange={(event)=>setdisplayDetail(event.target.checked)}
                        />
                    </RevealContainer>
                </ChartRevealContainer>

                {
                    displayDetail?
                    <ChartInfoContainer>
                        {
                            Object.keys(data.detail).map((el,id)=>(
                                <CoordinateInfo key={id} title ={el} serialNumber={[...new Set(data.detail[el].map(item=>item.serial_number+'('+timeRe.exec(item.test_date)[1]+" "+timeRe.exec(item.test_date)[2]+')'))] } color={graphingData.find(blacklist=>blacklist.name === el)['color']}/>
                            ))
                        }
                    </ChartInfoContainer>
                    :
                    <React.Fragment/>
    
                }
            </ChartSNContainer>
        </ComposedChartContainer>
    )
}



export default BlacklistComposedChartComponent