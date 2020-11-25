import React, {useState,useEffect} from 'react';
import ComposedChartComponent from '../../components/composed-chart/composed-chart.component'
import { FormContainer, ComposedChartPageContainer} from './composedchartpage.styles'
import { FormInput, FormSelect} from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import { fetchPgStart } from '../../redux/pg/pg.actions'
import { selectPg, selectIsPgFetching } from '../../redux/pg/pg.selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Spinner from '../../components/spinner/spinner.component';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker  } from 'react-date-range';


const ComposedChartPage = ({fetchPgStart,pg,fetching}) => {

    
    const [graphInfo, setgraphInfo] = useState({
      model: '',
      table: '',
      testType: '',
      lowerSN: '',
      upperSN: '',
      lowerDate:'',
      upperDate:'',
      percision:1
    });

    useEffect(() => {
    let helper = async()=>{
       //fetch the name of the databases
       await fetchPgStart({title:'databaseModel', query:`SELECT datname FROM pg_database WHERE datname != 'template1' AND datname != 'template0' AND datname != 'postgres'`, database: ''})
       
    }
    helper();
  }, []);

  useEffect(() => {
    let info = {};

    if(pg['databaseMinSN']){
      info = {...info, 'lowerSN': pg['databaseMinSN'][0]['min']}
    }
    if(pg['databaseMaxSN']){
      info = {...info, 'upperSN': pg['databaseMaxSN'][0]['max']}
    }
    if(pg['databaseMinDate']){
      info = {...info, 'lowerDate': pg['databaseMinDate'][0]['min']};
    }
    if(pg['databaseMaxDate']){
      info = {...info, 'upperDate':  pg['databaseMaxDate'][0]['max']};
    }
    setgraphInfo({ ...graphInfo, ...info });
     
  }, [pg]);

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
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(fetching)
    console.log("SuBMIT")
    console.log(graphInfo)
    // await fetchPgStart({title:'MyGraphTitle', query:`SELECT * FROM \"PS1 Temp 1"`, database: 'FG181F'})
    // setModelList(pg['databaseModel'].map((el)=>el['datname']));
    // await fetchPgStart({title:'databaseModel', query:`SELECT datname FROM pg_database WHERE datname != 'template1' AND datname != 'template0' AND datname != 'postgres'`, database: 'FG181F'})
  };


  const handleChange = async(event) => {
    const { name, value } = event.target? event.target:event;
    setgraphInfo({ ...graphInfo, [name]: value });
    switch(name){
      case 'model':
        await fetchPgStart({title:'databaseSensor', query:`SELECT sensor_name FROM "sensor_to_unit"`, database: value})
        break;
      case 'table':
        await fetchPgStart({title:'databaseTestType', query:`SELECT DISTINCT (test_type) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMinSN', query:`SELECT MIN (serial_number) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMaxSN', query:`SELECT MAX (serial_number) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMinDate', query:`SELECT MIN (test_date) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMaxDate', query:`SELECT MAX (test_date) FROM "${value}"`, database: graphInfo['model']});
        break;
        default:
    }

  };
  const handleSelect = (range)=>{
    console.log(range); // native Date object
  }
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }
  return (
    <ComposedChartPageContainer>
      <FormContainer onSubmit={handleSubmit}>
        <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
        />
        {pg['databaseModel']?
          <FormSelect
          label='Model'
          placeholder=""
          options={pg['databaseModel'].map((el)=>({value:el['datname'],label:el['datname']}))}
          onChange={(el)=>handleChange({...el,name:'model'})}
          required
        />
        :
         <Spinner/>
        }
        {
        graphInfo['model']?
          <div>
            {
                pg['databaseSensor']?
                <FormSelect
                label='Sensor'
                placeholder=""
                options={pg['databaseSensor'].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
                onChange={(el)=>handleChange({...el,name:'table'})}
                required
                />
              :
               <div/>
            }
            
            {
              pg['databaseTestType']?
                <FormSelect
                label='Test Type'
                placeholder="Select Test Type"
                isMulti
                name="testType"
                options={pg['databaseTestType'].map((el)=>({value:el['test_type'],label:el['test_type']}))}
                onChange={(el)=>handleChange({value:el.map(el=>el.value),name:'testType'})}
            />
              :

              <div/>
            }
            {
              pg['databaseTestType']?
              <FormInput
              type='text'
              name='lowerSN'
              value={graphInfo.lowerSN}
              onChange={handleChange}
              label='Lower Serial Number'
            />
              :

              <div/>
            }
            {
              pg['databaseTestType']?
              <FormInput
              type='text'
              name='upperSN'
              value={graphInfo.upperSN}
              onChange={handleChange}
              label='Upper Serial Number'
            />
              :

              <div/>
            }
            {/* {
              graphInfo['lowerDate']?
              <DatePicker selected={Date.parse(graphInfo['lowerDate'])}  onChange={(el)=>handleChange({...el,name:'lowerDate'})} />
              :

              <div/>
    
            } */
            
            }
        
          </div>
          
          :
          <div/>
          }
      
    
          <CustomButton type='submit'>Graph</CustomButton>
      </FormContainer>
      <ComposedChartComponent data={data}/>
    </ComposedChartPageContainer>
    
  );
}


const mapStateToProps = createStructuredSelector({
  pg: selectPg,
  fetching: selectIsPgFetching
});

const mapDispatchToProps = dispatch => ({
  fetchPgStart: (info) => dispatch(fetchPgStart(info))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposedChartPage);
