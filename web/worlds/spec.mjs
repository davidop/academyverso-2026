// WorldSpecV1: deterministic, declarative, no generated code or external asset URLs.
export const TYPES=['planeta','estrella','luna','agujero-negro','estacion','asteroide'];
export const FEATURES=['ocean','volcano','floating_city','moon','dome','ring','craters','satellite','aurora','forest'];
export const ARCHETYPES=['terrestrial','ocean','volcanic','ice','star','moon','station','asteroid','black_hole'];
const HEX=/^#[0-9a-fA-F]{6}$/;
const plain=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function numberHash(input){let h=2166136261;for(const c of String(input)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const palettes=[['#277FBA','#B57FF5','#4AD6F0'],['#4F9D96','#8FCBFF','#F5A5CA'],['#B76D6E','#F2C486','#E18D6F'],['#758BCC','#EAA1F8','#79F2DD'],['#A7B3C9','#F5D38B','#FA86B4'],['#6A9FC5','#B2DBEE','#DB9CF6']];
export function fallbackWorldSpec(obj){
 const type=TYPES.includes(obj?.type)?obj.type:'planeta',description=plain(obj?.description);
 const seed=numberHash(String(obj?.issue_number??0)+'|'+String(obj?.name??'')+'|'+type),p=palettes[seed%palettes.length],features=[];
 const add=(kind,yes,count=1)=>{if(yes&&!features.some(f=>f.kind===kind))features.push({kind,count})};
 add('ocean',/oceano|mar|agua|acuatic|ocean/.test(description));
 add('volcano',/volcan|lava|erupc|fuego/.test(description),/tres volcan|3 volcan/.test(description)?3:1);
 add('floating_city',/ciudad|rascaciel|colonia|metropol|edifici|avenida|city/.test(description),/ciudades|multiple|varias/.test(description)?2:1);
 add('moon',/luna|satelite natural|moon/.test(description),/tres luna|3 luna/.test(description)?3:/dos luna|2 luna/.test(description)?2:1);
 add('dome',/cupula|domo|invernadero|dome/.test(description),2);
 const hasRing=/anillo|ring/.test(description);
 const ringGlow=hasRing&&/brilla|brillante|glow|luminous/.test(description)&&/amanecer|alba|dawn|sunrise/.test(description);
 const ringFinish=hasRing&&/dorado|dorada|oro|golden|gold/.test(description);
 if(hasRing&&!features.some(f=>f.kind==='ring'))features.push({kind:'ring',count:1,...(ringFinish?{finish:'gold'}:{}),...(ringGlow?{glow:'dawn'}:{})});
 add('craters',/crater|meteorito/.test(description),3);
 add('satellite',/nave|dron|orbital|antena/.test(description),2);
 add('aurora',/aurora|atmosfera violeta|neon/.test(description));
 add('forest',/bosque|vegetacion|selva|arbol/.test(description),2);
 if(type==='planeta'&&!features.length)features.push({kind:'ocean',count:1},{kind:'moon',count:1});
 if(type==='luna'&&!features.length)features.push({kind:'craters',count:4});
 if(type==='estacion'&&!features.length)features.push({kind:'satellite',count:2});
 if(type==='agujero-negro')features.splice(0,features.length,{kind:'ring',count:3});
 if(type==='estrella')features.splice(0,features.length,{kind:'aurora',count:1});
 const archetype=type==='planeta'?(/hielo|glaciar|nieve/.test(description)?'ice':features.some(f=>f.kind==='volcano')?'volcanic':features.some(f=>f.kind==='ocean')?'ocean':'terrestrial'):({estrella:'star',luna:'moon',estacion:'station',asteroide:'asteroid','agujero-negro':'black_hole'})[type];
 const primary=/rojo|carmesi/.test(description)?'#DB626E':/verde|bosque/.test(description)?'#58B58C':p[0];
 return {schemaVersion:1,seed,archetype,palette:{primary,secondary:p[1],emissive:p[2]},features:features.slice(0,12),atmosphere:{color:p[1],intensity:type==='planeta'?0.45:0.25},animation:'static'};
}
export function validateWorldSpec(value){
 const x=typeof value==='string'?JSON.parse(value):value;
 if(!x||typeof x!=='object'||Array.isArray(x))throw Error('WorldSpec must be an object');
 if(Object.keys(x).some(k=>!['schemaVersion','seed','archetype','palette','features','atmosphere','animation'].includes(k)))throw Error('Unknown WorldSpec field');
 if(x.schemaVersion!==1||!Number.isSafeInteger(x.seed)||x.seed<0||x.seed>4294967295||!ARCHETYPES.includes(x.archetype))throw Error('Invalid metadata');
 if(!x.palette||Object.keys(x.palette).some(k=>!['primary','secondary','emissive'].includes(k))||!['primary','secondary','emissive'].every(k=>HEX.test(x.palette[k])))throw Error('Invalid palette');
 if(!Array.isArray(x.features)||x.features.length>12)throw Error('Invalid feature array');
 // A ring may opt into a dawn halo; keep all render effects finite and explicit.
 for(const f of x.features){
  const keys=f?.kind==='ring'?['kind','count','glow','finish']:['kind','count'];
  if(!f||Object.keys(f).some(k=>!keys.includes(k))||!FEATURES.includes(f.kind)||!Number.isInteger(f.count)||f.count<1||f.count>4)throw Error('Invalid feature');
  if(Object.hasOwn(f,'glow')&&f.glow!=='dawn')throw Error('Invalid feature glow');
  if(Object.hasOwn(f,'finish')&&f.finish!=='gold')throw Error('Invalid feature finish');
 }
 if(!x.atmosphere||Object.keys(x.atmosphere).some(k=>!['color','intensity'].includes(k))||!HEX.test(x.atmosphere.color)||!Number.isFinite(x.atmosphere.intensity)||x.atmosphere.intensity<0||x.atmosphere.intensity>1)throw Error('Invalid atmosphere');
 if(!['slow-orbit','static'].includes(x.animation))throw Error('Invalid animation');
 return x;
}
export function resolvedWorldSpec(obj){
 try{if(obj?.world_spec)return {spec:validateWorldSpec(obj.world_spec),source:'persisted'}}catch(_){}
 return {spec:fallbackWorldSpec(obj),source:'fallback'};
}
