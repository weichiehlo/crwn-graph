
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
    console.log(data)
    let graphingData = [];
    let currentRange, maxRange;
    let totalReading = [];
    let interval;
    let digit = 0;

    for(let table in data){
        totalReading = [...totalReading,...data[table]]
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
    

    while(currentRange < maxRange){
        let temp = {};
        temp['name'] = `${currentRange.toFixed(digit)}-${(currentRange+interval).toFixed(digit)}`
        for(let table in data){
            temp[table] = data[table].filter((el)=>el >=currentRange && el <= (currentRange+interval)).length
        }
        graphingData.push(temp)
        currentRange += interval
    }
    
    return graphingData

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


