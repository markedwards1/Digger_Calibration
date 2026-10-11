/* PDF generation stays entirely on the device. pdf-lib is bundled locally. */
(function(root){
'use strict';
async function create(job,options={}){
 const lib=options.pdfLib||root.PDFLib,C=options.calibration||root.Calibration;
 if(!job?.rows?.length)throw Error('This job has no calibration records.');
 const {PDFDocument,StandardFonts,rgb}=lib;
 const doc=await PDFDocument.create();doc.setTitle(`Ore Digging Checklist ${job.excavator} Shot ${job.shot}`);doc.setAuthor('Digger Calibration');doc.setSubject('Excavator GPS calibration');
 const normal=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
 const logoBytes=options.logoBytes||await fetch('./ozland-logo.png').then(r=>{if(!r.ok)throw Error('Report logo unavailable. Reopen online to finish the offline setup.');return r.arrayBuffer();});
 const logo=await doc.embedPng(logoBytes);const W=595.28,H=841.89,M=40,TW=W-2*M,black=rgb(0,0,0),grey=rgb(.84,.84,.84),shade=rgb(.95,.95,.95),red=rgb(.65,.05,.09);
 // Standard PDF fonts cover Western European names; substitute unsupported glyphs predictably.
 const clean=v=>Array.from(String(v??'')).map(c=>{try{normal.encodeText(c);return c;}catch{return '?';}}).join('');
 function text(page,value,x,y,size=10,font=normal,color=black){page.drawText(clean(value),{x,y:H-y-size,size,font,color});}
 function lines(value,width,size=10,font=normal){const words=clean(value).split(/\s+/);let result=[],line='';for(const word of words){if(font.widthOfTextAtSize(word,size)>width){if(line){result.push(line);line='';}let part='';for(const ch of word){if(font.widthOfTextAtSize(part+ch,size)>width){result.push(part);part='';}part+=ch;}line=part;continue;}const candidate=line?line+' '+word:word;if(font.widthOfTextAtSize(candidate,size)>width){result.push(line);line=word;}else line=candidate;}if(line)result.push(line);return result.length?result:[''];}
 function rect(page,x,y,w,h,fill){page.drawRectangle({x,y:H-y-h,width:w,height:h,borderWidth:.6,borderColor:grey,...(fill?{color:fill}:{})});}
 function cell(page,value,x,y,w,h,opts={}){rect(page,x,y,w,h,opts.fill);const font=opts.bold?bold:normal,size=opts.size||10;const ls=lines(value,w-14,size,font);ls.forEach((line,i)=>text(page,line,x+7,y+(h-ls.length*(size+3))/2+i*(size+3),size,font,opts.color));}
 function section(page,title,y){rect(page,M,y,TW,25,grey);text(page,title,M+8,y+6,11,bold);return y+25;}
 function header(page,continued=false){rect(page,M,35,TW,52);page.drawImage(logo,{x:M+6,y:H-35-35,width:145,height:33.55});text(page,'ORE DIGGING CHECKLIST',M+172,51,12,bold);text(page,'OZL-MIN-FRM-XXX',W-M-113,54,9,bold);if(continued)text(page,`${job.excavator} | ${job.location} | Shot ${job.shot} | ${job.date} ${job.time}`,M,99,9);}
 const first=doc.addPage([W,H]);header(first);let y=112;y=section(first,'DETAILS',y);
 const data=[['Operator Name',job.operatorName,'Date',job.date],['Equipment ID',job.excavator,'Location',job.location],['Bench/Flitch',job.benchFlitch,'R/L',job.rl],['Shot Number',job.shot,'Block ID',job.blockId]];
 const widths=[95,150,82,TW-327];
 for(const values of data){const height=Math.max(31,...values.map((v,i)=>lines(v||'',widths[i]-14,10,i%2?normal:bold).length*13+12));let x=M;values.forEach((v,i)=>{cell(first,v||'',x,y,widths[i],height,{bold:i%2===0,fill:i%2===0?shade:undefined});x+=widths[i];});y+=height;}
 y+=18;y=section(first,'CHECKLIST',y);
 let group='';for(const item of C.checklistItems){if(item.group!==group){group=item.group;y=section(first,group,y);}const h=Math.max(34,lines(item.label,TW-113,10).length*13+12);cell(first,item.label,M,y,TW-100,h);cell(first,job.checklist?.[item.id]||'Not recorded',M+TW-100,y,100,h,{bold:true});y+=h;}
 y+=18;y=section(first,'ACKNOWLEDGEMENT',y);
 for(const [role,label,name] of [['surveyor','Surveyor',job.surveyorName],['operator','Operator',job.operatorName]]){const sig=job.signatures?.[role];const nameLines=lines(name||'Name not recorded',142,10);const h=Math.max(64,nameLines.length*13+28);cell(first,label+': '+(name||'Name not recorded'),M,y,155,h);rect(first,M+155,y,TW-155,h);if(sig?.status==='signed'&&sig.strokes?.length){const points=sig.strokes.flat(),minX=Math.min(...points.map(p=>p[0]*900)),maxX=Math.max(...points.map(p=>p[0]*900)),minY=Math.min(...points.map(p=>p[1]*420)),maxY=Math.max(...points.map(p=>p[1]*420));const scale=Math.min((TW-175)/Math.max(1,maxX-minX),(h-28)/Math.max(1,maxY-minY)),x=M+165,top=y+6;for(const stroke of sig.strokes)for(let i=1;i<stroke.length;i++)first.drawLine({start:{x:x+(stroke[i-1][0]*900-minX)*scale,y:H-top-(stroke[i-1][1]*420-minY)*scale},end:{x:x+(stroke[i][0]*900-minX)*scale,y:H-top-(stroke[i][1]*420-minY)*scale},thickness:1,color:black});text(first,`Signed ${sig.date||''} ${sig.time||''}`,M+165,y+h-16,8);}else text(first,C.signatureStatus(sig)==='Skipped'?'Signature skipped':'Not signed',M+165,y+22,10);y+=h;}
 const chunks=[];for(let i=0;i<job.rows.length;i+=6)chunks.push(job.rows.slice(i,i+6));
 chunks.forEach((rows,chunk)=>{const page=doc.addPage([W,H]);header(page,true);let y=119;y=section(page,'CALIBRATION POINTS',y);text(page,'At 90 degrees apart, in line and to side of tracks (if no ore mark up done).',M+7,y+7,9);y+=28;const widths=[105,(TW-105)/3,(TW-105)/3,(TW-105)/3];let x=M;['Calibration','North ±0.4 m','East ±0.4 m','RL ±0.2 m'].forEach((v,i)=>{cell(page,v,x,y,widths[i],28,{bold:true,fill:shade});x+=widths[i];});y+=28;
 rows.forEach((row,i)=>{const checks=C.check(row);const index=chunk*6+i+1;const vals=[[`Survey GPS ${index}`,...row.survey.map(v=>Number(v).toFixed(3))],['Excavator GPS',...row.excavator.map(v=>Number(v).toFixed(3))],['Difference',...checks.map(r=>(r.delta>0?'+':'')+(r.delta/1000).toFixed(3)+' '+(r.pass?'PASS':'FAIL'))]];vals.forEach((values,k)=>{let x=M;values.forEach((v,col)=>{cell(page,v,x,y,widths[col],25,{bold:k===2,color:k===2&&col>0&&!checks[col-1].pass?red:black,fill:k===2?shade:undefined,size:10});x+=widths[col];});y+=25;});});
 y+=12;text(page,'Differences = Survey GPS - Excavator GPS (metres).',M,y,9);y+=18;const allPass=job.rows.every(row=>C.check(row).every(r=>r.pass));text(page,'Individual calibration checks: '+(allPass?'ALL PASS':'FAIL - one or more values outside tolerance'),M,y,10,bold,allPass?black:red);
 });
 const pages=doc.getPages();pages.forEach((page,i)=>{rect(page,M,H-52,TW,24);text(page,'Issued: 13/03/2024 | Version: 02 | Digger Calibration v1.1.0',M+7,H-45,8);text(page,`Page ${i+1} of ${pages.length}`,W-M-64,H-45,8);text(page,'© Ozland Mining Services. Printed copies are not controlled.',M,H-22,7);});
 return doc.save();
}
const api={create};if(typeof module!=='undefined')module.exports=api;else root.CalibrationReport=api;
})(globalThis);
