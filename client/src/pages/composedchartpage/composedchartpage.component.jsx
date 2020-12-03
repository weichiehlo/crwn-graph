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
import { formatDate } from '../../utils/inputs.utils'
import { convertGraphData } from '../../utils/graph.utils'



const ComposedChartPage = ({fetchPgStart,pg,isFetching}) => {

    const initialState = {
      model: '',
      table: '',
      testType: '',
      lowerSN: '',
      upperSN: '',
      range:[{
        startDate: '',
        endDate: '',
        key: 'selection'
      }],
      percision:3
    }
    
    const [graphInfo, setgraphInfo] = useState(initialState);
    const [userTable, setUserTable] = useState({
      all:[],
      selected:[]});


  useEffect(() => {
    const helper = async()=>{
       //fetch the name of the databases
       await fetchPgStart({title:'databaseModel', query:`SELECT datname FROM pg_database WHERE datname != 'template1' AND datname != 'template0' AND datname != 'postgres'`, database: ''})
    }
    helper();
  }, []);

  useEffect(() => {
    let info = {};
    if(graphInfo['table'])
    {
      if(pg['databaseTestType']){
        info = {...info, 'testType': pg['databaseTestType'].map((el)=>el['test_type'])}
      }
      if(pg['databaseMinSN']){
        info = {...info, 'lowerSN': pg['databaseMinSN'][0]['min']}
      }
      if(pg['databaseMaxSN']){
        info = {...info, 'upperSN': pg['databaseMaxSN'][0]['max']}
      }
      if(pg['databaseMinDate']){
        let temp = graphInfo['range'];
        temp[0]['startDate'] = new Date(pg['databaseMinDate'][0]['min']);
        info = {...info, 'range': temp};
      }
      if(pg['databaseMaxDate']){
        let temp = graphInfo['range'];
        temp[0]['endDate'] = new Date(pg['databaseMaxDate'][0]['max']);
        info = {...info, 'range':  temp};
      }
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
   
    // console.log(graphInfo)
    console.log('----------')
    const {model,
    table,
    testType,
    lowerSN,
    upperSN,
    percision} = graphInfo
    const startDate = formatDate(graphInfo['range'][0]['startDate']);
    const endDate = formatDate(graphInfo['range'][0]['endDate']);
    const tableName = model + "_" + table

    console.log(model, table, testType, lowerSN,upperSN,startDate,endDate,percision)
    

    await fetchPgStart({title:tableName,
    query:`SELECT * FROM "${table}" WHERE test_date >= '${startDate}' AND test_date <= '${endDate}'
    AND serial_number >= '${lowerSN}' AND serial_number <= '${upperSN}' 
    AND test_type = 'ITS' OR test_type = 'IQC' ORDER BY reading`,
    database: model})
    setUserTable({...userTable,all:[...userTable.all,tableName]})
    
  };


  const handleChange = async(event) => {
    const { name, value } = event.target? event.target:event;
    setgraphInfo({ ...graphInfo, [name]: value });
    switch(name){
      case 'model':
        if(graphInfo['table']) setgraphInfo({...initialState,'model':value});
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

  const handleGraph = () =>{
    console.log(userTable)

    // convertGraphData(pg[userTable[0]].map((el)=>el.reading),graphInfo['percision'])
  }
 
  
  return (
    <ComposedChartPageContainer>
      <FormContainer onSubmit={handleSubmit}>
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
                value={{value:graphInfo['table'],label:graphInfo['table']}}
                options={pg['databaseSensor'].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
                onChange={(el)=>handleChange({...el,name:'table'})}
                required
                />
              :
              <Spinner/>
            }
            
            {
              graphInfo['testType']&&graphInfo['lowerSN']&&graphInfo['upperSN']&&graphInfo['range'][0]['startDate'] && graphInfo['range'][0]['endDate']?
                <div>
                  <FormSelect
                  label='Test Type'
                  placeholder="Select Test Type"
                  isMulti
                  name="testType"
                  value={graphInfo['testType'].map((el)=>({value:el,label:el}))}
                  options={pg['databaseTestType'].map((el)=>({value:el['test_type'],label:el['test_type']}))}
                  onChange={(el)=>handleChange({value:el.map(el=>el.value),name:'testType'})}
                  required
                  />
                  <FormInput
                    type='text'
                    name='lowerSN'
                    value={graphInfo.lowerSN}
                    onChange={handleChange}
                    label='Lower Serial Number'
                  />

                  <FormInput
                  type='text'
                  name='upperSN'
                  value={graphInfo.upperSN}
                  onChange={handleChange}
                  label='Upper Serial Number'
                  />
                  <DateRangePicker
                  onChange={item => setgraphInfo({ ...graphInfo, range: [item.selection] })}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={graphInfo['range']}
                  direction="horizontal"
                  />
                  <FormSelect
                  label='Percision'
                  placeholder=""
                  value={{value:graphInfo['percision'],label:graphInfo['percision']}}
                  options={[...new Array(10).keys()].map(el=>({value:el+1,label:el+1}))}
                  onChange={(el)=>handleChange({...el,name:'percision'})}
                  required
                  />
              
                </div>
              :
              graphInfo['table']?
              <Spinner/>
              :
              <div/>
            }
            
          </div>
          :
          <div/>    
          }
      
      {
        graphInfo['table']?
        < CustomButton type='submit'>Add to Graph</CustomButton>
        :
        <div/>
      }
      </FormContainer>
      {
        userTable['all'].length?
        <div>
          <FormSelect
                  label='User Tables'
                  placeholder="Select Tables"
                  isMulti
                  name="userTable"
                  value={userTable.selected.map((el)=>({value:el,label:el}))}
                  options={userTable.all.map((el)=>({value:el,label:el}))}
                  onChange={(el)=>(el?setUserTable({...userTable,selected:el.map(el=>el.value)}):setUserTable({...userTable,selected:[]}))}
                  required
                  />
          < CustomButton onClick={handleGraph}>Graph Selected</CustomButton>
        </div>
        
        :
        <div/>
      }
      <ComposedChartComponent data={data}/>
    </ComposedChartPageContainer>
    
  );
}


const mapStateToProps = createStructuredSelector({
  pg: selectPg,
  isFetching: selectIsPgFetching
});

const mapDispatchToProps = dispatch => ({
  fetchPgStart: (info) => dispatch(fetchPgStart(info))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposedChartPage);
