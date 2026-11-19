/**
 * GitHub Issues forms allow URL query parameters matching field IDs in
 * .github/ISSUE_TEMPLATE/crear-objeto.yml.
 * This is a fallback only: the user must sign in and confirm submission.
 */
const allowedTypes=new Set(['planeta','estrella','luna','agujero-negro','estacion','asteroide']);
export function issueDraftUrl(fields,repo='davidop/academyverso-2026'){
  if(!/^[-\w]+\/[-\w.]+$/.test(repo))throw new Error('Repositorio inválido');
  const type=String(fields.type??'').trim().toLowerCase();
  if(!allowedTypes.has(type))throw new Error('Tipo de objeto no permitido');
  const alias=String(fields.alias??'').trim().slice(0,28);
  const nombre=String(fields.name??'').trim().slice(0,48);
  const descripcion=String(fields.description??'').trim().slice(0,280);
  if(alias.length<2||nombre.length<3||descripcion.length<8)throw new Error('Completa los campos del formulario');
  const params=new URLSearchParams({
    template:'crear-objeto.yml',
    title:'Nuevo objeto cósmico: '+nombre,
    tipo:type,
    alias,
    nombre,
    descripcion
  });
  return 'https://github.com/'+repo+'/issues/new?'+params.toString();
}
