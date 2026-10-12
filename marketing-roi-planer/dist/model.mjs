export const VERSION=1;
export const names=['Social media','WWW i SEO','Reklama w wyszukiwarkach','Radio','Telewizja','Outdoor','E-mail marketing','Targi i wydarzenia','Inne'];
export const uid=()=>crypto.randomUUID();
export const normalize=s=>s.trim().replace(/\s+/g,' ').toLocaleLowerCase('pl');
export function decimal(s,min,max,optional=false){
 if(typeof s!=='string')throw Error('Wartość musi być tekstem dziesiętnym.');
 s=s.replace(/[\s\u00a0\u202f]/g,'').replace(',','.');
 if(!s&&optional)s='0';
 if(!/^-?\d+(\.\d{1,2})?$/.test(s))throw Error('Wpisz liczbę z maks. 2 miejscami po przecinku.');
 let neg=s[0]==='-',parts=s.replace('-','').split('.'),v=BigInt(parts[0])*100n+BigInt((parts[1]||'').padEnd(2,'0'));if(neg)v=-v;
 if(v<BigInt(min)*100n||v>BigInt(max)*100n)throw Error(`Dozwolony zakres: ${min}–${max}.`);
 return v;
}
export const canonical=v=>(v<0n?'-':'')+(v<0n?-v:v)/100n+'.'+((v<0n?-v:v)%100n).toString().padStart(2,'0');
export function fresh(){let now=new Date().toISOString();return {schemaVersion:1,id:uid(),name:'',currency:'PLN',annualBudget:'0',categories:names.map(name=>({id:uid(),name,allocationPercent:'0',expectedRoiPercent:'0'})),createdAt:now,updatedAt:now};}
export function validate(s,save=false){let errors={},b=0n,total=0n,rows=[];
 const get=(v,min,max,key,opt)=>{try{return decimal(v,min,max,opt)}catch(e){errors[key]=e.message;return 0n}};
 if(!s||!Array.isArray(s.categories))return {errors:{structure:'Niepoprawna struktura scenariusza.'}};
 if(save&&(typeof s.name!=='string'||s.name.trim().length<1||s.name.trim().length>80))errors.name='Nazwa musi mieć 1–80 znaków.';
 if(!['PLN','EUR','USD'].includes(s.currency))errors.currency='Wybierz PLN, EUR lub USD.';
 b=get(s.annualBudget,0,1000000000,'annualBudget');
 if(s.categories.length>30)errors.categories='Maksymalnie 30 kategorii.';
 let seen=new Set();
 s.categories.forEach((c,i)=>{let key=normalize(typeof c.name==='string'?c.name:'');if(!key||c.name.trim().length>60)errors[`c${i}name`]='Nazwa: 1–60 znaków.';else if(seen.has(key))errors[`c${i}name`]='Ta nazwa kategorii już istnieje.';seen.add(key);
 let p=get(c.allocationPercent,0,100,`c${i}allocationPercent`),r=get(c.expectedRoiPercent,-100,10000,`c${i}expectedRoiPercent`,p===0n);total+=p;
 // Fixed point: all monetary values have denominator 10^10. No intermediate rounding.
 let investment=b*p*10000n,profit=b*p*r;rows.push({...c,p,r,investment,profit,recovered:investment+profit});});
 if(total>10000n)errors.total=`Przekroczono budżet o ${formatRatio(total-10000n,100n)} p.p. Zmniejsz udziały.`;
 return {errors,b,total,rows};
}
export function calculate(s){let v=validate(s);if(Object.keys(v.errors).length)return v;let investment=v.rows.reduce((a,c)=>a+c.investment,0n),profit=v.rows.reduce((a,c)=>a+c.profit,0n),budget=v.b*100000000n;return {...v,budget,investment,profit,reserve:budget-investment,recovered:investment+profit,final:budget+profit,roi:investment===0n?null:{n:profit*100n,d:investment},budgetRoi:budget===0n?null:{n:profit*100n,d:budget}};}
export function roundRatio(n,d){if(d<=0n)throw Error('Invalid denominator');let sign=n<0n?-1n:1n;n=n<0n?-n:n;return sign*((n*2n+d)/(2n*d));}
export function formatRatio(n,d,places=2){let scale=10n**BigInt(places),v=roundRatio(n*scale,d),negative=v<0n;v=negative?-v:v;let int=(v/scale).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0');return (negative?'−':'')+int+(places?','+(v%scale).toString().padStart(places,'0'):'');}
export const money=(v,currency)=>formatRatio(v,10000000000n)+' '+currency;
export const percent=r=>r===null?'Nie dotyczy':formatRatio(r.n,r.d)+'%';
export function snapshot(s,newId=false){let v=validate(s,true);if(Object.keys(v.errors).length)throw Error(Object.values(v.errors)[0]);let now=new Date().toISOString();return {...s,schemaVersion:1,id:newId?uid():s.id,name:s.name.trim(),annualBudget:canonical(v.b),createdAt:newId?now:s.createdAt,updatedAt:now,categories:v.rows.map(c=>({id:newId?uid():c.id,name:c.name.trim().replace(/\s+/g,' '),allocationPercent:canonical(c.p),expectedRoiPercent:canonical(c.r)}))};}
export function readBackup(text,regenerate=true){if(new TextEncoder().encode(text).length>1048576)throw Error('Plik przekracza 1 MB.');let data;try{data=JSON.parse(text)}catch{throw Error('Plik nie zawiera poprawnego JSON.')}if(!data||data.schemaVersion!==1||!Array.isArray(data.scenarios))throw Error('Nieobsługiwana wersja lub struktura kopii.');if(data.scenarios.length>100)throw Error('Maksymalnie 100 scenariuszy w imporcie.');let seen=new Set();return data.scenarios.map((s,i)=>{try{if(!s||s.schemaVersion!==1||typeof s.id!=='string'||!s.id||seen.has(s.id)||typeof s.createdAt!=='string'||typeof s.updatedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(s.createdAt)||!/^\d{4}-\d{2}-\d{2}T/.test(s.updatedAt)||!Number.isFinite(Date.parse(s.createdAt))||!Number.isFinite(Date.parse(s.updatedAt)))throw Error('Niepoprawne ID, daty lub wersja.');seen.add(s.id);let ids=new Set();if(!Array.isArray(s.categories))throw Error('Brak kategorii.');s.categories.forEach(c=>{if(typeof c.id!=='string'||!c.id||ids.has(c.id))throw Error('Niepoprawne ID kategorii.');ids.add(c.id)});return snapshot(s,regenerate)}catch(e){throw Error(`Scenariusz ${i+1}: ${e.message}`)}});}
