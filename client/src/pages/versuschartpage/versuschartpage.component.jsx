import React, {useState,useEffect} from 'react';
import ComposedChartComponent from '../../components/composed-chart/composed-chart.component'
import { FormContainer, VersusChartPageContainer, Warning} from './versuschartpage.styles'
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
import { convertGraphDataForVersus } from '../../utils/graph.utils'




const VersusChartPage = ({fetchPgStart,pg,isFetching}) => {

    const graphType = ['Area', 'Bar', 'Line', 'Scatter'];

    const initialState = {
      model: '',
      xTable: '',
      yTable: '',
      testType: [],
      lowerSN: '',
      upperSN: '',
      range:[{
        startDate: '',
        endDate: '',
        key: 'selection'
      }]
    }
    
    const [graphInfo, setgraphInfo] = useState(initialState);
    const [userTable, setUserTable] = useState({
      all:[],
      selected:[],
      graphData:[],
      serialNumber:{},
      average:{},
      percision:3,
      type:'Area',
      isSameUnit:true});


  useEffect(() => {
    const helper = async()=>{
       //fetch the name of the databases
       await fetchPgStart({title:'databaseModel', query:`SELECT datname FROM pg_database WHERE datname != 'template1' AND datname != 'template0' AND datname != 'postgres'`, database: ''})
    }
    helper();
  }, []);

  useEffect(() => {
    let info = {};
    if(graphInfo['xTable']|| graphInfo['yTable'])
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
  
  const handleSubmit = async event => {
    event.preventDefault();
   
    
    const {model,
    xTable,
    yTable,
    testType,
    lowerSN,
    upperSN} = graphInfo
    const startDate = formatDate(graphInfo['range'][0]['startDate']);
    const endDate = formatDate(graphInfo['range'][0]['endDate']);
    const tableName = model + "-" + xTable + " vs " +yTable
    let testTypeString = ""
    if(testType.length === 1){
      testTypeString = `AND "${xTable}".test_type = '${testType[0]}'`
    }else{
      testTypeString = `AND ("${xTable}".test_type = '${testType[0]}'`
      for(let i=1; i<testType.length; i++){
        testTypeString += ` OR "${xTable}".test_type = '${testType[i]}'`
      }
      testTypeString += ")"
    }

  
    await fetchPgStart({title:tableName,
    query:`SELECT "${xTable}".reading AS "X_reading","${yTable}".reading AS "Y_reading"
    FROM "${xTable}" INNER JOIN "${yTable}" ON "${xTable}".serial_number = "${yTable}".serial_number
    AND "${xTable}".ref_line_number = "${yTable}".ref_line_number
    AND "${xTable}".test_date = "${yTable}".test_date 
    WHERE "${xTable}".test_date >= '${startDate}' AND "${xTable}".test_date <= '${endDate}'
    AND "${xTable}".serial_number >= '${lowerSN}' AND "${xTable}".serial_number <= '${upperSN}' 
      ${testTypeString}`,
    database: model})
    setUserTable({...userTable,all:[...userTable.all,tableName]})
    
  };


  const handleChange = async(event) => {
    const { name, value } = event.target? event.target:event;
    setgraphInfo({ ...graphInfo, [name]: value });
    switch(name){
      case 'model':
        if(graphInfo['xTable'] || graphInfo['yTable']) setgraphInfo({...initialState,'model':value});
        await fetchPgStart({title:'databaseSensor', query:`SELECT * FROM "sensor_to_unit"`, database: value})
        break;
      case 'xTable':
      case 'yTable':
        await fetchPgStart({title:'databaseTestType', query:`SELECT DISTINCT (test_type) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMinSN', query:`SELECT MIN (serial_number) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMaxSN', query:`SELECT MAX (serial_number) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMinDate', query:`SELECT MIN (test_date) FROM "${value}"`, database: graphInfo['model']});
        await fetchPgStart({title:'databaseMaxDate', query:`SELECT MAX (test_date) FROM "${value}"`, database: graphInfo['model']});
        break;
      default:
    }

  };

  const handleGraph = (event) =>{

    event.preventDefault(userTable['percision'])

    
    let raw = {};
    let xUnit, yUnit;
    for(let table of userTable.selected){
      raw[table] = pg[table]
    }

    console.log(raw)

    let graphData = convertGraphDataForVersus(raw,userTable['percision']);
    

    for(let table of userTable.selected){

      xUnit = pg['databaseSensor'].find(el=>el['sensor_name'] === table.split(" vs ")[0].slice(7))['unit']
      yUnit = pg['databaseSensor'].find(el=>el['sensor_name'] === table.split(" vs ")[1])['unit']
      console.log(xUnit)
      console.log(yUnit)
    }

    
    // setUserTable({...userTable,graphData:graphData.processeData,isSameUnit:true,serialNumber:graphData.serialNumber,average:graphData.average})
    
    
    // let unit = pg['databaseSensor'].find(el=>el['sensor_name'] === userTable.selected[0].slice(7))['unit']
    // for(let table of userTable.selected){
    //   unit = pg['databaseSensor'].find(el=>el['sensor_name'] === table.slice(7))['unit']
    //   raw[`${table} (${unit})`] = pg[table].map((el)=>({reading:el['reading'],serial_number:el['serial_number']}))
    // }

    // let graphData = convertGraphDataForComposed(raw,userTable['percision']);
    // if(compareUnit(userTable.selected.map(el=>el.slice(7)),pg['databaseSensor'])){
    //   setUserTable({...userTable,graphData:graphData.processeData,isSameUnit:true,serialNumber:graphData.serialNumber,average:graphData.average})
    // }else{
    //   setUserTable({...userTable,isSameUnit:false})
    // }


    


  }
 
  
  return (
    <VersusChartPageContainer>
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
                <div>
                  <FormSelect
                  label='X Sensor'
                  placeholder=""
                  value={{value:graphInfo['xTable'],label:graphInfo['xTable']}}
                  options={pg['databaseSensor'].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
                  onChange={(el)=>handleChange({...el,name:'xTable'})}
                  required
                  />

                  <FormSelect
                  label='Y Sensor'
                  placeholder=""
                  value={{value:graphInfo['yTable'],label:graphInfo['yTable']}}
                  options={pg['databaseSensor'].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
                  onChange={(el)=>handleChange({...el,name:'yTable'})}
                  required
                  />
                </div>
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
                  onChange={(el)=>(el? handleChange({value:el.map(el=>el.value),name:'testType'}): handleChange({value:[],name:'testType'}))}
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
              
                </div>
              :
              graphInfo['xTable']|| graphInfo['yTable']?
              <Spinner/>
              :
              <React.Fragment/>
            }
            
          </div>
          :
          <div/>    
          }
      
      {
        graphInfo['xTable'] || graphInfo['yTable']?
        !isFetching?
        < CustomButton type='submit'>Add to Graph</CustomButton>
        :
        <Spinner/>
        :
        <div/>
      }
      </FormContainer>

      {
        userTable['all'].length?
        <FormContainer onSubmit={handleGraph}>
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
          <FormSelect
                  label='Percision'
                  placeholder=""
                  value={{value:userTable['percision'],label:userTable['percision']}}
                  options={[...new Array(10).keys()].map(el=>({value:el+1,label:el+1}))}
                  onChange={(el)=>setUserTable({...userTable,percision:el.value})}
                  required
                  />
          <FormSelect
                  label='graphType'
                  placeholder=""
                  value={{value:userTable['type'],label:userTable['type']}}
                  options={graphType.map(el=>({value:el,label:el}))}
                  onChange={(el)=>setUserTable({...userTable,type:el.value})}
                  required
                  />
          {
            userTable.selected.length && ! isFetching?
            < CustomButton>Graph Selected</CustomButton>
            :
            <div/>
          }
          {
            userTable.isSameUnit?
            <div/>
            :
            <Warning>Please make sure the units are the same</Warning>
          }
        </FormContainer>
        
        :
        <div/>
      }
      {
        userTable['graphData'].length?
        <ComposedChartComponent data={userTable['graphData']} serialNumber={userTable['serialNumber'] } average={userTable['average'] } type={userTable['type']}/>
        :
        <div/>
      }
      
    </VersusChartPageContainer>
    
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
)(VersusChartPage);
