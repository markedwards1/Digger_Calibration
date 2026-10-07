const {test}=require('node:test');const assert=require('node:assert/strict');const C=require('../core.js');
const row=(n,e,r)=>({survey:['7073217.322','646455.400','495.040'],excavator:[(7073217.322-n).toFixed(3),(646455.4-e).toFixed(3),(495.04-r).toFixed(3)]});
test('inclusive limits without floating point boundary errors',()=>assert.deepEqual(C.check(row(.4,-.4,.2)).map(r=>r.pass),[true,true,true]));
test('one millimetre outside tolerance fails',()=>assert.deepEqual(C.check(row(.401,-.401,-.201)).map(r=>r.pass),[false,false,false]));
test('survey minus excavator signs',()=>assert.deepEqual(C.check(row(.125,-.223,.019)).map(r=>r.delta),[125,-223,19]));
test('signed averages',()=>assert.deepEqual(C.averages([row(.2,-.4,.1),row(-.1,.2,-.1)]).map(r=>r.delta),[50,-100,0]));
test('invalid coordinates rejected',()=>{for(const value of ['', '123x','12.1234','Infinity'])assert.throws(()=>C.mm(value));});
test('CSV exact order, all jobs, fixed precision and escaping',()=>{const base={location:'Crown Prince Pit',time:'08:00:00',date:'07/10/2026',excavator:'EX12',shot:'5',rows:[row(.1,.2,.03)]};const text=C.csv([base,{...base,excavator:'EX13',rows:[row(0,0,0),row(.4,.4,.2)]}]);assert.equal(text.split('\r\n').length,5);assert.equal(text.charCodeAt(0),0xfeff);assert.ok(text.includes('"Survey Easting"'));assert.ok(text.includes('"7073217.322","646455.400","495.040"'));assert.equal(C.headers.length,11);});
test('Perth date and time captured consistently',()=>assert.deepEqual(C.timestamp(new Date('2026-10-06T16:04:31Z')),{date:'07/10/2026',time:'00:04:31'}));
