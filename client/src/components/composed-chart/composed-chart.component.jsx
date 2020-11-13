import React, {useState,useEffect} from 'react'
import { Area, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Scatter } from 'recharts';
import { ComposedChartContainer, Title, FormContainer} from './composed-chart.styles'
import { getChartColor } from '../../utils/graph.utils'
import axios from 'axios';
import { FormInput, FormSelect } from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

const ComposedChartComponent = function({data}){

    const [sensor, setSensor] = useState(false);
    useEffect(() => {
    let helper = async()=>{
      await getSensor("PS1 Temp 1");
      await getSensor("PS1 Temp 2");
    }
    helper();
    }, []);   
    const getSensor = async(name) =>{
        const response = await axios({
            url:'query',
            method: 'post', 
            data: { query: `SELECT * FROM \"${name}\"` }});
        console.log(response)
        setSensor(JSON.stringify(response.data))
    }
    //get sensor name
    const sensorNames = Object.keys(data[0]).filter((el)=>el !=='name')
    const graphingData = (getChartColor(sensorNames))

    const handleSubmit = async event => {
        event.preventDefault();
    
        console.log("SuBMIT")
      };
    const handleChange = event => {

    console.log(event)
    };

    return(
        <ComposedChartContainer>

            <FormContainer onSubmit={handleSubmit}>
                <FormInput
                type='text'
                name='displayName'
                value={"3"}
                onChange={handleChange}
                label='Display Name'
                required
             />
             <FormSelect defaultValue={[options[0]]}
                    label='Food!!!'
                    placeholder="Select a food"
                    isMulti
                    name="colors"
                    options={options}
                    onChange={handleChange}
                    />
             <CustomButton type='submit'>Graph</CustomButton>
            </FormContainer>

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