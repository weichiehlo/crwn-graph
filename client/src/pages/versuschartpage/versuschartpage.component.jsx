import React, {useState,useEffect} from 'react';
import VersusChartComponent from '../../components/versus-chart/versus-chart.component'
import { FormContainer, VersusChartPageContainer, Warning} from './versuschartpage.styles'
import { FormInput, FormSelect} from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import { fetchPgStart } from '../../redux/pg/pg.actions'
import { setUserGraph } from '../../redux/graph/graph.actions'
import { selectPg, selectIsPgFetching, selectPgSql } from '../../redux/pg/pg.selectors';
import { selectUserGraph } from '../../redux/graph/graph.selectors'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Spinner from '../../components/spinner/spinner.component';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker  } from 'react-date-range';
import { formatDate } from '../../utils/inputs.utils'
import { convertGraphDataForVersus } from '../../utils/graph.utils'
import { getCurrentUser,loadGraphFromFireStore } from '../../firebase/firebase.utils'





const VersusChartPage = ({fetchPgStart,pg,isFetching,setUserGraph, userGraph}) => {

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
 


  useEffect(() => {
    const helper = async()=>{
       //fetch the name of the databases
       await fetchPgStart({title:'databaseModel', query:`SELECT datname FROM pg_database WHERE datname != 'template1' AND datname != 'template0' AND datname != 'postgres'`, database: ''})
      //load graph
      if(!Object.keys(userGraph.versus.graphData).length)
      {
        const user = await getCurrentUser();
        const firebaseGraphs = await loadGraphFromFireStore(user)

        if(firebaseGraphs && !Array.isArray(firebaseGraphs)){
          for(let element in firebaseGraphs.sql){
            await fetchPgStart({title: firebaseGraphs.sql[element].title, query: firebaseGraphs.sql[element].query, database: firebaseGraphs.sql[element].database})
          }
          setUserGraph({
            composed: userGraph.composed,
            pie: userGraph.pie,
            versus: firebaseGraphs.versus
          })
        }

      }
    
      
      }
    helper();
  }, []);

  useEffect(() => {

    const loadSensorUnits = async()=>{
     
          for(let model of pg['databaseModel'].map(el=>el.datname).filter(el=>el.length===6)){
            await fetchPgStart({title:`${model}_databaseSensor`, query:`SELECT * FROM "sensor_to_unit"`, database: model})
          }
    }
    if(pg['databaseModel']) loadSensorUnits();
     
  }, [pg['databaseModel']]);

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
        Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
      let temp = graphInfo['range'];
      temp[0]['endDate'] = new Date(pg['databaseMaxDate'][0]['max']).addDays(1);
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
    setUserGraph({
      composed: userGraph.composed,
      pie: userGraph.pie,
      versus: {...userGraph.versus,all:[...userGraph.versus.all,tableName]}
    })
    
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

  const handleGraph = async(event) =>{

    event.preventDefault(userGraph.versus['percision'])

    
    let raw = {};
    let xUnit, yUnit;
    for(let table of userGraph.versus['selected']){
      raw[table] = pg[table]
    }

    let convertedData = convertGraphDataForVersus(raw,userGraph.versus['percision']);
    let convertedDataWithUnit = {}

    for(let table of userGraph.versus.selected){
      xUnit = pg[`${table.slice(0,6)}_databaseSensor`].find(el=>el['sensor_name'] === table.split(" vs ")[0].slice(7))['unit']
      yUnit = pg[`${table.slice(0,6)}_databaseSensor`].find(el=>el['sensor_name'] === table.split(" vs ")[1])['unit']
      convertedDataWithUnit[table] = {'data':convertedData[table],'xUnit':xUnit,'yUnit':yUnit}
    }
    setUserGraph({
      composed: userGraph.composed,
      pie: userGraph.pie,
      versus: {...userGraph.versus,graphData:convertedDataWithUnit}
    })

    console.log(convertedDataWithUnit)
    
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
              pg[`${graphInfo['model']}_databaseSensor`]?
                <div>
                  <FormSelect
                  label='X Sensor'
                  placeholder=""
                  value={{value:graphInfo['xTable'],label:graphInfo['xTable']}}
                  options={pg[`${graphInfo['model']}_databaseSensor`].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
                  onChange={(el)=>handleChange({...el,name:'xTable'})}
                  required
                  />

                  <FormSelect
                  label='Y Sensor'
                  placeholder=""
                  value={{value:graphInfo['yTable'],label:graphInfo['yTable']}}
                  options={pg[`${graphInfo['model']}_databaseSensor`].map((el)=>({value:el['sensor_name'],label:el['sensor_name']}))}
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
            graphInfo['xTable'] === graphInfo['yTable']?
            <Warning>X sensor cannot be the same as Y sensor</Warning>
            :
            <CustomButton type='submit'>Add to Graph</CustomButton>
          :
            <Spinner/>
        :
        <div/>
      }
      </FormContainer>

      {
        userGraph.versus['all'].length?
        <FormContainer onSubmit={handleGraph}>
          <FormSelect
                  label='User Tables'
                  placeholder="Select Tables"
                  isMulti
                  name="userTable"
                  value={userGraph.versus.selected.map((el)=>({value:el,label:el}))}
                  options={userGraph.versus.all.map((el)=>({value:el,label:el}))}
                  onChange={(el)=>(el?
                    setUserGraph({
                      composed: userGraph.composed,
                      pie: userGraph.pie,
                      versus: {...userGraph.versus,selected:el.map(el=>el.value)}
                    })
                    :
                    setUserGraph({
                      composed: userGraph.composed,
                      pie: userGraph.pie,
                      versus: {...userGraph.versus,selected:[]}
                    })
                    
                    )
                  }

                  required
                  />
          <FormSelect
                  label='Percision'
                  placeholder=""
                  value={{value:userGraph.versus['percision'],label:userGraph.versus['percision']}}
                  options={[...new Array(10).keys()].map(el=>({value:el+1,label:el+1}))}
                  onChange={(el)=>
                    setUserGraph({
                      composed: userGraph.composed,
                      pie: userGraph.pie,
                      versus: {...userGraph.versus,percision:el.value}
                    })
                  }
                  required
                  />
          {
            userGraph.versus.selected.length && ! isFetching?
            <CustomButton>Graph Selected</CustomButton>
            :
            <div/>
          }
        </FormContainer>
        
        :
        <div/>
      }
      {
        Object.keys(userGraph.versus['graphData']).length?
        <VersusChartComponent data={userGraph.versus['graphData']}/>
        :
        <div/>
      }
      
    </VersusChartPageContainer>
    
  );
}


const mapStateToProps = createStructuredSelector({
  pg: selectPg,
  isFetching: selectIsPgFetching,
  userGraph: selectUserGraph,
  sql: selectPgSql
});

const mapDispatchToProps = dispatch => ({
  fetchPgStart: (info) => dispatch(fetchPgStart(info)),
  setUserGraph: (userGraph) => dispatch(setUserGraph(userGraph))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VersusChartPage);
