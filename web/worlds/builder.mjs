// Procedural Three.js renderer: closed WorldSpec catalog, no user-provided code or URLs.
const pi=Math.PI;
function vecOnSphere(THREE,r,theta,phi){return new THREE.Vector3(Math.sin(theta)*Math.cos(phi),Math.cos(theta),Math.sin(theta)*Math.sin(phi)).multiplyScalar(r)}
function rand(seed,n){let x=(seed^(n*0x9e3779b9))>>>0;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return ((x^(x>>>16))>>>0)/4294967296}
export function buildWorld(THREE,obj,spec,mission=null,quality='high'){
 const group=new THREE.Group(),clickables=[],seed=spec.seed>>>0;
 const detail=quality==='low'?.55:quality==='medium'?.78:1;
 const sphere=(r,w=32,h=24,...args)=>new THREE.SphereGeometry(r,Math.max(12,Math.round(w*detail)),Math.max(8,Math.round(h*detail)),...args);
 const archetype=spec.archetype,size=archetype==='star'?7:archetype==='station'?4:archetype==='asteroid'?3.7:archetype==='moon'?3.8:6;
 const primary=new THREE.Color(mission?(mission.id==='vice-nebula'?'#EE78B8':'#4EDFC4'):spec.palette.primary);
 const secondary=new THREE.Color(spec.palette.secondary),emissive=new THREE.Color(spec.palette.emissive);
 const metal=(archetype==='station')?.65:.12;
 const std=(color,opts={})=>new THREE.MeshStandardMaterial({color,roughness:.64,metalness:metal,...opts});
 function add(geometry,material,parent=group,interactive=false){
  const mesh=new THREE.Mesh(geometry,material);parent.add(mesh);if(interactive)clickables.push(mesh);return mesh;
 }
 function glow(radius,color,opacity){
  add(sphere(radius,24,16),new THREE.MeshBasicMaterial({color,side:THREE.BackSide,transparent:true,opacity,depthWrite:false}));
 }
 function ring(radius,tube,color,rot=1.12){
  const m=add(new THREE.TorusGeometry(radius,tube,8,64),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false}));
  m.rotation.x=rot;return m;
 }
 function pillarSurface(kind,index,total){
  const theta=.62+rand(seed,index+11)*1.7,phi=2*pi*(index/Math.max(total,1)+rand(seed,index+31)*.1);
  const normal=vecOnSphere(THREE,1,theta,phi).normalize();
  const base=new THREE.Group();base.position.copy(normal.clone().multiplyScalar(size*1.025));
  base.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);
  group.add(base);
  if(kind==='volcano'){
   const cone=add(new THREE.ConeGeometry(.8+size*.03,1.9,9),std('#5D4C5B',{flatShading:true}),base,true);cone.position.y=.7;cone.userData.poi={kind:'volcano',title:'Volcán activo',description:'Estructura volcánica generada de forma procedural para este mundo.'};
   const lava=add(sphere(.34,10,6),new THREE.MeshBasicMaterial({color:'#FF7045'}),base);lava.position.y=1.6;
  }else if(kind==='floating_city'){
   const platform=add(new THREE.CylinderGeometry(1.7,1.2,.32,12),std('#3E4C73',{metalness:.72}),base,true);platform.position.y=1.2;platform.userData.poi={kind:'floating_city',title:'Ciudad flotante',description:'Plataforma orbital y edificios ligeros creados a partir de la descripción del mundo.'};
   for(let j=0;j<5;j++){const h=1.05+rand(seed,index*17+j+40)*1.8;const tower=add(new THREE.BoxGeometry(.35,h,.35),std(j%2?'#B1E6F6':'#8F6CB7',{emissive:emissive,emissiveIntensity:.24}),base,true);tower.position.set(Math.cos(j*pi*2/5)*.95,1.4+h/2,Math.sin(j*pi*2/5)*.95)}
   const thruster=add(new THREE.CylinderGeometry(.32,.6,.7,10),new THREE.MeshBasicMaterial({color:emissive}),base);thruster.position.y=.7;
  }else if(kind==='dome'){
   const dome=add(sphere(1.15,16,10,0,pi*2,0,pi/2),std('#68C5D8',{transparent:true,opacity:.62,side:THREE.DoubleSide,metalness:.45}),base,true);dome.position.y=.1;dome.userData.poi={kind:'dome',title:'Cúpula de la colonia',description:'Cúpula protectora transparente de una colonia futurista.'};
   const edge=add(new THREE.TorusGeometry(1.15,.11,6,28),new THREE.MeshBasicMaterial({color:emissive}),base);edge.rotation.x=pi/2;
  }else if(kind==='forest'){
   for(let j=0;j<6;j++){const tree=add(new THREE.ConeGeometry(.23,.85,5),std(j%2?'#57CEAB':'#53A1B6',{flatShading:true}),base);tree.position.set((rand(seed,index+j+78)-.5)*1.9,.43,(rand(seed,index+j+125)-.5)*1.9)}
  }
 }
 if(archetype==='station'){
  const core=add(new THREE.CylinderGeometry(size*.7,size*.7,size*1.1,12),std('#A6CADB',{metalness:.78}),group,true);core.rotation.z=pi/2;
  for(let i=-1;i<=1;i+=2){
   const wing=add(new THREE.BoxGeometry(size*1.6,.13,size*.6),std('#275F8F',{metalness:.62,emissive:'#123A6C',emissiveIntensity:.22}),group,true);wing.position.x=i*size*1.55;
   add(new THREE.BoxGeometry(.22,.4,size*.65),new THREE.MeshBasicMaterial({color:emissive}),wing);
  }
  ring(size*.93,.15,emissive,pi/2);
  add(sphere(size*.25,20,12),new THREE.MeshBasicMaterial({color:primary}),group,true);
 }else if(archetype==='black_hole'){
  add(sphere(size*.82,28,20),std('#03040D',{metalness:.1,roughness:1}),group,true);
  for(let j=0;j<3;j++)ring(size*(1.18+j*.32),.18+j*.035,j%2?primary:emissive,1.08+j*.16);
  glow(size*1.05,emissive,.14);
 }else if(archetype==='star'){
  add(new THREE.IcosahedronGeometry(size,3),new THREE.MeshBasicMaterial({color:primary}),group,true);
  glow(size*1.21,emissive,.13);glow(size*1.5,secondary,.075);
  const starLight=new THREE.PointLight(primary,400,75);group.add(starLight);
  ring(size*1.13,.08,secondary,.6);
 }else if(archetype==='asteroid'){
  const geom=new THREE.IcosahedronGeometry(size,1),p=geom.attributes.position;
  for(let i=0;i<p.count;i++){const n=1+(rand(seed,i%15+4)-.5)*.31;p.setXYZ(i,p.getX(i)*n,p.getY(i)*n,p.getZ(i)*n)}
  geom.computeVertexNormals();
  add(geom,std(primary,{flatShading:true,roughness:1}),group,true);
 }else{
  const g=sphere(size,32,24).toNonIndexed();
  const positions=g.getAttribute('position'),colors=[];
  const ocean=spec.features.some(f=>f.kind==='ocean'),ice=archetype==='ice';
  const sea=new THREE.Color(ice?'#9CBFD5':'#0B6296');
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
   const noise=Math.sin(x*1.47+seed*.0001)*Math.cos(z*1.07)+.6*Math.sin(y*2.13-z*.52);
   const c=ocean&&noise<.25?sea.clone():primary.clone().lerp(secondary,Math.max(0,Math.min(1,(noise+1)/5)));
   if(archetype==='moon')c.lerp(new THREE.Color('#969AAE'),.5);
   if(ice)c.lerp(new THREE.Color('#E0F1FF'),.58);
   colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  add(g,std('#FFFFFF',{vertexColors:true,roughness:archetype==='moon'?.96:.74}),group,true);
  if(archetype==='moon'){
   for(let j=0;j<6;j++){const normal=vecOnSphere(THREE,size,rand(seed,j+60)*pi,rand(seed,j+90)*2*pi);const crater=add(sphere(.35+rand(seed,j+40)*.45,10,6),std('#5B657D',{roughness:1}),group,true);crater.position.copy(normal.multiplyScalar(1.004))}
  }
  if(spec.atmosphere.intensity>.1)glow(size*1.09,spec.atmosphere.color,Math.min(.21,spec.atmosphere.intensity*.33));
 }
 if(['planet','terrestrial','ocean','volcanic','ice','moon'].includes(archetype)){
  for(const f of spec.features){
   const count=Math.min(f.count,4);
   if(['volcano','floating_city','dome','forest'].includes(f.kind)){for(let i=0;i<count;i++)pillarSurface(f.kind,i+f.kind.length*10,count)}
   else if(f.kind==='moon'){
    for(let i=0;i<count;i++){const body=add(sphere(.9+i*.13,12,8),std('#B8C8E2',{roughness:1}),group,true);const a=2*pi*i/count+.3;body.position.set(Math.cos(a)*size*(2.3+i*.17),Math.sin(a*2)*size*.33,Math.sin(a)*size*(2.3+i*.17))}
   }else if(f.kind==='ring')ring(size*1.45,.2,secondary);
   else if(f.kind==='aurora')ring(size*1.23,.08,emissive,.9);
   else if(f.kind==='satellite'){
    for(let i=0;i<count;i++){const satellite=add(new THREE.BoxGeometry(.4,.28,.55),std('#8AB3D3',{metalness:.6}),group,true);satellite.position.set(size*1.75*(i%2?1:-1),size*.3*i,size*1.1);const panel=add(new THREE.BoxGeometry(1.8,.04,.55),std('#3D83B1',{metalness:.4}),satellite);panel.position.x=.9}
   }
  }
 }
 if(archetype==='station'&&spec.features.some(f=>f.kind==='satellite'))ring(size*1.65,.08,secondary,.8);
 return {group,size,clickables};
}
