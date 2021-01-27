import * as d3 from 'd3-scale-chromatic'
const calculatePoint = (i, intervalSize, colorRangeInfo) =>{
    let { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
      ? (colorEnd - (i * intervalSize))
      : (colorStart + (i * intervalSize)));
  }

const interpolateColors = (dataLength, colorScale, colorRangeInfo)=>{
    let { colorStart, colorEnd } = colorRangeInfo;
    let colorRange = colorEnd - colorStart;
    let intervalSize = colorRange / dataLength;
    let i, colorPoint;
    let colorArray = [];

    for (i = 0; i < dataLength; i++) {
        colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
        colorArray.push(colorScale(colorPoint));
    }

    return colorArray;
}  

export const getChartColor = (data)=>{
    let colorArray = interpolateColors(data.length,d3.interpolateViridis,{
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: false,
    });
    let colorMapping = [];
    for(let i=0; i<colorArray.length;i++){
        colorMapping.push({id:i,name:data[i],color:colorArray[i]})
    }
    return colorMapping
}

export const convertGraphDataForComposed = (data,percision)=>{

    let graphingData = [];
    let currentRange, maxRange;
    let totalReading = [];
    let interval;
    let digit = 0;
    let serialNumber = {};
    let sensorTotalCount = {};
    let average = {};

    for(let table in data){
        totalReading = [...totalReading,...data[table].map(el=>el['reading'])];
        sensorTotalCount[table] = 0
    }


    totalReading.sort((a,b)=>a-b)
    
    currentRange = totalReading[0];
    maxRange = totalReading[totalReading.length-1];


    //to decode the decimal place
    let temp = 1;
    let dif = maxRange-currentRange;
    for(let i=0; i<5; i++){
        if(temp > dif)
        {
            temp /= 10
            digit++
        }else{
            break
        }
        
    }
    digit++
    

    interval = parseFloat(parseFloat((totalReading[totalReading.length-1]-totalReading[0])/percision).toFixed(digit));

    for(let reading in data){
        average[reading] = (data[reading].reduce((a,el)=>a+el.reading,0)/data[reading].length).toFixed(digit)
    }
  
    

    while(currentRange <= maxRange){
        let temp = {};
        temp['name'] = `${currentRange.toFixed(digit)}-${(currentRange+interval).toFixed(digit)}`
        
        for(let table in data){
            serialNumber[table + "-" + temp['name']] = [];
            temp[table] = 0;
            for(let i=0; i<data[table].length;i++){
                if(data[table][i]['reading']>=currentRange && data[table][i]['reading'] <= (currentRange+interval)){
                    serialNumber[table + "-" + temp['name']].push(data[table][i]['serial_number']);
                    temp[table]++;
                    sensorTotalCount[table]++
                }
            }
        }
        graphingData.push(temp)
        currentRange += interval
    }


    //convert the raw data into percentage
    for(let point of graphingData){
        for(let table in sensorTotalCount){
            point[table] = ((point[table] / sensorTotalCount[table])*100).toFixed(2)
        }
    }


    return {processeData:graphingData,serialNumber:serialNumber,average:average}

}

export const convertGraphDataForPie = (data,percision)=>{

    let graphingData = [];
    let currentRange, maxRange;
    let totalReading = [];
    let interval;
    let digit = 0;
    let serialNumber = {};
    let sensorTotalCount = {};
    let average = {};

    for(let table in data){
        totalReading = [...totalReading,...data[table].map(el=>el['reading'])];
        sensorTotalCount[table] = 0
    }


    totalReading.sort((a,b)=>a-b)
    
    currentRange = totalReading[0];
    maxRange = totalReading[totalReading.length-1];


    //to decode the decimal place
    let temp = 1;
    let dif = maxRange-currentRange;
    for(let i=0; i<5; i++){
        if(temp > dif)
        {
            temp /= 10
            digit++
        }else{
            break
        }
        
    }
    digit++
    

    interval = parseFloat(parseFloat((totalReading[totalReading.length-1]-totalReading[0])/percision).toFixed(digit));

    for(let reading in data){
        average[reading] = (data[reading].reduce((a,el)=>a+el.reading,0)/data[reading].length).toFixed(digit)
    }
  
    

    while(currentRange <= maxRange){
        let temp = {};
        temp['name'] = `${currentRange.toFixed(digit)}-${(currentRange+interval).toFixed(digit)}`
        
        for(let table in data){
            serialNumber[table + "-" + temp['name']] = [];
            temp[table] = 0;
            for(let i=0; i<data[table].length;i++){
                if(data[table][i]['reading']>=currentRange && data[table][i]['reading'] <= (currentRange+interval)){
                    serialNumber[table + "-" + temp['name']].push(data[table][i]['serial_number']);
                    temp[table]++;
                    sensorTotalCount[table]++
                }
            }
        }
        graphingData.push(temp)
        currentRange += interval
    }

    //convert the data for pie
    const sensorList = Object.keys(graphingData[0]).filter(el=>el !== 'name');
    let pieGraphingData = {};
    for(let sensor of sensorList){
        pieGraphingData[sensor] = []
    }
    for(let interval of graphingData){
        for(let sensor of sensorList){
            pieGraphingData[sensor].push({name:interval['name'], value:interval[sensor]})
        }
    }

    return {processeData:pieGraphingData,serialNumber:serialNumber,average:average}

}

export const convertGraphDataForVersus = (data,percision)=>{

   let processedData = {};

   for(let table in data){
    let xReading = data[table].map(el=>el.X_reading).sort((a,b)=>a-b)
    let yReading = data[table].map(el=>el.Y_reading).sort((a,b)=>a-b)
    let xCurrentRange = xReading[0]
    let xMaxRange = xReading[xReading.length-1]
    let yCurrentRange = yReading[0]
    let yMaxRange = yReading[yReading.length-1]
    let xInterval = (xMaxRange - xCurrentRange)/percision 
    let yInterval = (yMaxRange - yCurrentRange)/percision
    let xDigit = 0, yDigit = 0
    let xRange = [], yRange = [] 

    //to decode the decimal place
    let temp = 1;
    let dif = xMaxRange-xCurrentRange;
    for(let i=0; i<5; i++){
        if(temp > dif)
        {
            temp /= 10
            xDigit++
        }else{
            break
        }
        
    }
    xDigit++

    temp = 1;
    dif = yMaxRange-yCurrentRange;
    for(let i=0; i<5; i++){
        if(temp > dif)
        {
            temp /= 10
            yDigit++
        }else{
            break
        }
        
    }
    yDigit++

    // console.log(xReading)
    // console.log(xMaxRange)
    // console.log(yReading)
    // console.log(yMaxRange)

    while(xCurrentRange <= xMaxRange){
        xRange.push(xCurrentRange)
        yRange.push(yCurrentRange)
        xCurrentRange += xInterval
        yCurrentRange += yInterval
    }
    
    // console.log(xRange)
    // console.log(yRange)

    // processedData[table] = {};

    // console.log(data[table].length)
    
    let tempArray = [];
    for(let i=0; i<xRange.length-1;i++){
        let temp = {}
        temp['name'] = `${xRange[i].toFixed(xDigit)}-${xRange[i+1].toFixed(xDigit)}`
        for(let j=0; j<yRange.length-1;j++){
            let tempCount = 0;
            for(let entry of data[table]){
                if(entry['X_reading'] >= xRange[i] && entry['X_reading'] < xRange[i+1] && entry['Y_reading'] >= yRange[j] && entry['Y_reading'] < yRange[j+1]){
                    tempCount++
                }
            }
            temp[`${yRange[j].toFixed(yDigit)}-${yRange[j+1].toFixed(yDigit)}`] = tempCount
        }
        // console.log(temp)
        tempArray.push(temp);
        
    }
    processedData[table] = tempArray

   }
    
//    console.log('--------')
//    console.log(processedData)
//    console.log('--------')
   return processedData
}

export const compareUnit = (sensors,table)=>{
    
    let unit = table.find(el=>el['sensor_name'] === sensors[0])['unit']
    try{
        for(let sensor of sensors){
            if(table.find(el=>el['sensor_name'] === sensor)['unit']!== unit){
                return false
            }
        }
        
        return true
    }catch{
        return false
    }
    
}


