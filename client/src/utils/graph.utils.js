
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

export const convertGraphData = (data,percision)=>{

    let graphingData = [];
    let currentRange, maxRange;
    let totalReading = [];
    let interval;
    let digit = 0;
    let serialNumber = {};


    for(let table in data){
        totalReading = [...totalReading,...data[table].map(el=>el['reading'])]
        
    }
    totalReading.sort((a,b)=>a-b)
    
    currentRange = totalReading[0];
    maxRange = totalReading[totalReading.length-1];


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
    console.log(interval)
    

    while(currentRange < maxRange){
        let temp = {};
        temp['name'] = `${currentRange.toFixed(digit)}-${(currentRange+interval).toFixed(digit)}`
        
        for(let table in data){
            serialNumber[table + "-" + temp['name']] = [];
            temp[table] = 0;
            for(let i=0; i<data[table].length;i++){
                if(data[table][i]['reading']>=currentRange && data[table][i]['reading'] <= (currentRange+interval)){
                    serialNumber[table + "-" + temp['name']].push(data[table][i]['serial_number']);
                    temp[table]++;
                }
            }
        }
        graphingData.push(temp)
        currentRange += interval
    }


    return {processeData:graphingData,serialNumber:serialNumber}

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

export const deleteDuplicate = (array) =>{
    return [...new Set(array)]
}


