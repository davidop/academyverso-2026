// Pure easing math, testable without WebGL.
export const birthProgress=(elapsed,duration=1250)=>{
 if(!Number.isFinite(elapsed))return 1;
 const t=Math.max(0,Math.min(1,elapsed/Math.max(1,duration)));
 return t*t*(3-2*t);
};
export const birthScale=(elapsed,duration=1250)=>0.08+0.92*birthProgress(elapsed,duration);
export function createBirthParticles(THREE,size,seed){
 const count=48,coords=[];
 for(let i=0;i<count;i++){
  const a=i*2.39996+seed*.001,r=size*(1.3+(i%7)*.12);
  coords.push(Math.cos(a)*r,Math.sin(a*.9)*size*.9,Math.sin(a)*r);
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
 return new THREE.Points(geometry,new THREE.PointsMaterial({color:0x95F4EC,size:.38,transparent:true,opacity:.9,sizeAttenuation:true,depthWrite:false}));
}
