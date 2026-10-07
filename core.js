(function(root){
'use strict';
const axes=['Northing','Easting','RL'];
const limits=[400,400,200];
const headers=['Location','Time','Date','excavator','Shot','Survey Northing','Survey Easting','Survey RL','Excavator Northing','Excavator Easting','Excavator RL'];
function mm(value){if(!/^-?\d+(?:\.\d{1,3})?$/.test(String(value)))throw Error('Enter a coordinate with up to 3 decimal places.');const number=Number(value);const result=Math.round(number*1000);if(!Number.isSafeInteger(result))throw Error('Coordinate is too large.');return result;}
function check(row){return axes.map((name,i)=>{const delta=mm(row.survey[i])-mm(row.excavator[i]);return {name,delta,pass:Math.abs(delta)<=limits[i],limit:limits[i]};});}
function averages(rows){if(!rows.length)throw Error('No calibrations yet.');return axes.map((name,i)=>({name,delta:rows.reduce((sum,row)=>sum+check(row)[i].delta,0)/rows.length}));}
function csv(jobs){const escape=value=>'"'+String(value).replaceAll('"','""')+'"';return '\ufeff'+[headers,...jobs.flatMap(job=>job.rows.map(row=>[job.location,job.time,job.date,job.excavator,job.shot,...row.survey.map(v=>Number(v).toFixed(3)),...row.excavator.map(v=>Number(v).toFixed(3))]))].map(row=>row.map(escape).join(',')).join('\r\n')+'\r\n';}
function timestamp(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Australia/Perth',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));return {date:`${parts.day}/${parts.month}/${parts.year}`,time:`${parts.hour}:${parts.minute}:${parts.second}`};}
const api={axes,limits,headers,mm,check,averages,csv,timestamp};if(typeof module!=='undefined')module.exports=api;else root.Calibration=api;
})(globalThis);
