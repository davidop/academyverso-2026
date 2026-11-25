// Releases the GPU resources of a world (or portal) group, testable without WebGL.
// Called when the renderer rebuilds a world (new version or quality level) or drops it.
export function disposeGroup(scene,group){
 scene.remove(group);
 group.traverse(child=>{
  child.geometry?.dispose?.();
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const material of materials){
   if(!material)continue;
   // Textures are not disposed by their material; release any the builder may add later.
   for(const value of Object.values(material))if(value?.isTexture)value.dispose();
   material.dispose?.();
  }
 });
}
