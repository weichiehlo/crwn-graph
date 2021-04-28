import React, {useState,useEffect} from 'react';
import ComposedChartComponent from '../../components/composed-chart/composed-chart.component'
import { FormContainer, ComposedChartPageContainer, Description, Title, ComposedChartGraphButtonsContainer} from './black-list-page.styles'
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
import { convertGraphDataForComposed } from '../../utils/graph.utils'




const ComposedChartPage = ({fetchPgStart,pg,isFetching,setUserGraph, userGraph, selectPgSql}) => {

    const graphType = ['Area', 'Bar', 'Line', 'Scatter'];

    const initialState = {
      model: '',
      table: '',
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
    }
    helper();
    // eslint-disable-next-line
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
        // eslint-disable-next-line
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
     // eslint-disable-next-line
  }, [pg]);
  
  const handleSubmit = async event => {
    event.preventDefault();
    const {model,
    table,
    testType,
    lowerSN,
    upperSN} = graphInfo
    const startDate = formatDate(graphInfo['range'][0]['startDate']);
    const endDate = formatDate(graphInfo['range'][0]['endDate']);
    const tableName = model + "-" + table
    let testTypeString = ""
    if(testType.length === 1){
      testTypeString = "AND test_type = '"+testType[0]+"'"
    }else{
      testTypeString = "AND (test_type = '"+testType[0]+"'"
      for(let i=1; i<testType.length; i++){
        testTypeString += " OR test_type = '"+ testType[i]+"'"
      }
      testTypeString += ")"
    }

    await fetchPgStart({title:tableName,
    query:`SELECT * FROM "${table}" WHERE test_date >= '${startDate}' AND test_date <= '${endDate}'
    AND serial_number >= '${lowerSN}' AND serial_number <= '${upperSN}' 
    ${testTypeString} ORDER BY reading`,
    database: model})
    
    setUserGraph({
      composed: {...userGraph.composed,all:[...new Set([...userGraph.composed.all,tableName])]},
      pie: userGraph.pie,
      versus: userGraph.versus
    })
    
  };


  const handleChange = async(event) => {
    const { name, value } = event.target? event.target:event;
    setgraphInfo({ ...graphInfo, [name]: value });
    switch(name){
      case 'model':
        setgraphInfo({
          model: value,
          table: '',
          testType: [],
          lowerSN: '',
          upperSN: '',
          range:[{
            startDate: '',
            endDate: '',
            key: 'selection'
          }]
        })
        await fetchPgStart({title:`${value}_databaseBlacklist`, query:`SELECT * FROM "main_blacklist"`, database: value})
        
        break
        
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

  const handleGraph = (event) =>{

    event.preventDefault()
    let raw = {};
    for(let table of userGraph.composed.selected){
      console.log(table)
    }

    console.log(pg)

    let graphData = convertGraphDataForComposed(raw,userGraph.composed['percision']);
    
      // setUserGraph({
      //   composed: {...userGraph.composed,graphData:graphData.processeData,serialNumber:graphData.serialNumber,average:graphData.average},
      //   pie: userGraph.pie,
      //   versus: userGraph.versus
      // })
    
    
  }

  const handleGrapgDelete = () =>{

    let all = userGraph.composed.all;
    for(let table of userGraph.composed.selected){
      all.splice(all.indexOf(table),1);
    }

    setUserGraph({
      composed: {...userGraph.composed,all:all,selected:[],graphData:[]},
      pie: userGraph.pie,
      versus: userGraph.versus
    })
  }
 
  
  return (
    <ComposedChartPageContainer>
      <Title> BLACKLIST CHART</Title>
      <Description>
        BLACKLIST CHART shows how are the blacklisted keywords are distributed.
      </Description>
      <FormContainer onSubmit={handleSubmit}>
        { pg['databaseModel']?
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
                pg[`${graphInfo['model']}_databaseBlacklist`]?
                <FormSelect
                label='Keywords'
                placeholder=""
                value={{value:graphInfo['table'],label:graphInfo['table']}}
                options={pg[`${graphInfo['model']}_databaseBlacklist`].map((el)=>({value:el['name'],label:el['name']}))}
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
              graphInfo['table']?
              <Spinner/>
              :
              <React.Fragment/>
            }
            
          </div>
          :
          <div/>    
          }
      
        {
          graphInfo['table']?
            !isFetching?
            <CustomButton type='submit'> Add to Graph </CustomButton>
            :
            <Spinner/>
          :
          <div/>
        }

      </FormContainer>

      
      {
        userGraph.composed['all'].length?
        <FormContainer onSubmit={handleGraph}>
          <FormSelect
                  label='User Tables'
                  placeholder="Select Tables"
                  isMulti
                  name="userTable"
                  value={userGraph.composed.selected.map((el)=>({value:el,label:el}))}
                  options={userGraph.composed.all.map((el)=>({value:el,label:el}))}
                  onChange={(el)=>(el?setUserGraph({
                    composed: {...userGraph.composed,selected:el.map(el=>el.value)},
                    pie: userGraph.pie,
                    versus: userGraph.versus
                  }):
                  setUserGraph({
                    composed: {...userGraph.composed,selected:[]},
                    pie: userGraph.pie,
                    versus: userGraph.versus
                  })
                  )}
                  required
                  />
          <FormSelect
                  label='Percision'
                  placeholder=""
                  value={{value:userGraph.composed['percision'],label:userGraph.composed['percision']}}
                  options={[...new Array(10).keys()].map(el=>({value:el+1,label:el+1}))}
                  onChange={(el)=>(setUserGraph({
                    composed: {...userGraph.composed,percision:el.value},
                    pie: userGraph.pie,
                    versus: userGraph.versus
                  })
                  )}
                  required
                  />
          <FormSelect
                  label='graphType'
                  placeholder=""
                  value={{value:userGraph.composed['type'],label:userGraph.composed['type']}}
                  options={graphType.map(el=>({value:el,label:el}))}
                  onChange={(el)=>(setUserGraph({
                    composed: {...userGraph.composed,type:el.value},
                    pie: userGraph.pie,
                    versus: userGraph.versus
                  })
                  )}
                  required
                  />
          {
            userGraph.composed.selected.length && ! isFetching?
            <ComposedChartGraphButtonsContainer>
            <CustomButton>Graph Selected</CustomButton>
            <CustomButton
              type='button'
              onClick={() => { if (window.confirm('Are you sure you wish to delete selected table(s)?')) handleGrapgDelete() }}
              isDeleteWarning
              >
              DELETE SELECTED
            </CustomButton>
            </ComposedChartGraphButtonsContainer>
              
            :
            <div/>
          }

        </FormContainer>
        
        :
        <div/>
      }
      {
        userGraph.composed['graphData'] && userGraph.composed['graphData'].length?
        <ComposedChartComponent data={ userGraph.composed['graphData']} serialNumber={ userGraph.composed['serialNumber'] } average={ userGraph.composed['average'] } type= {userGraph.composed['type']}/>
        :
        <div/>
      }
      
    </ComposedChartPageContainer>
    
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
)(ComposedChartPage);
