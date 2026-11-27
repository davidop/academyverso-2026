const rotationStep=0.0025;
export function advanceWorldMotion(world,now,focused=false){
 if(world.animation!=='slow-orbit')return;
 if(!focused)world.group.rotation.y+=rotationStep;
 world.group.position.y=world.baseY+Math.sin(now/1100+world.phase)*.14;
}
