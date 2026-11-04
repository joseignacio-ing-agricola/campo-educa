/* Dibujos vectoriales originales CAMPO EDUCA. Esquemas didácticos, no a escala. */
export function illustrationEngine(){
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const scenes={
 suelo:['Perfil del suelo','Superficie y cobertura','Horizontes del perfil','Raíces en profundidad'],
 raices:['Exploración de las raíces','Cuello de la planta','Raíces laterales','Volumen de suelo explorado'],
 riego:['Agua en el sistema suelo-planta','Entrada de agua','Zona de raíces','Drenaje bajo las raíces'],
 goteo:['Distribución del agua por goteo','Línea lateral','Emisor','Zona humedecida esquemática'],
 filtro:['Revisión del cabezal de riego','Agua de entrada','Elemento filtrante','Agua hacia los laterales'],
 nutricion:['Ruta de los nutrientes','Solución del suelo','Absorción por raíces','Transporte hacia el follaje'],
 ph:['Medición de la solución','Muestra identificada','Electrodo de medición','Lectura y registro'],
 semilla:['Establecimiento de una plántula','Semilla','Emergencia','Desarrollo de hojas'],
 poda:['Estructura y corte de referencia','Rama principal','Rama lateral','Zona de observación del corte'],
 injerto:['Unión entre patrón y variedad','Variedad o púa','Zona de unión','Patrón con raíces'],
 canopia:['Distribución del follaje','Entrada de luz','Disposición de hojas','Circulación del aire'],
 vid:['Estructura de la vid','Brotes y hojas','Racimos','Tronco y brazos'],
 palto:['Estructura de un frutal','Copa y hojas','Frutos','Tronco y raíces'],
 flor:['Órganos florales de referencia','Pétalos','Centro floral','Tallo y hojas'],
 cosecha:['Secuencia de cosecha y registro','Producto cosechado','Recipiente de recolección','Identificación del lote'],
 maleza:['Rasgos para observar una maleza','Disposición de hojas','Tallo','Sistema radical'],
 plaga:['Observación sanitaria','Órgano observado','Detalle con lupa','Registro del hallazgo'],
 satelite:['Observación remota de una parcela','Sensor satelital','Radiación representada','Parcela de estudio'],
 ndvi:['Comparación de bandas espectrales','Banda roja','Infrarrojo cercano','Combinación de bandas'],
 mapa:['Organización espacial de datos','Capas de información','Límite de la parcela','Puntos de observación'],
 muestreo:['Recorrido de muestreo','Límite de la unidad','Puntos distribuidos','Muestra identificada'],
 costos:['Registro económico del cultivo','Labores e insumos','Registro de costos','Resultado a evaluar'],
 registro:['Observación y trazabilidad','Observación de campo','Ficha con fecha y lote','Revisión de antecedentes'],
 compost:['Transformación de residuos orgánicos','Materiales de entrada','Pila de compostaje','Material en transformación'],
 hidro:['Recirculación hidropónica esquemática','Canal y plantas','Retorno de solución','Depósito y bomba'],
 ciclo:['Seguimiento del desarrollo vegetal','Establecimiento','Crecimiento','Estado reproductivo']
 };
 const rules=[
 ['ndvi',/ndvi|infrarrojo|banda roja|indice espectral/],['satelite',/satelit|sentinel|teledeteccion|reflectancia/],['mapa',/qgis|cartograf|raster|vectorial|georrefer|coordenad|sistema de referencia|\bcapas?\b|geoproceso/],
 ['injerto',/injert|portainjert|patron y|cambium|pua/],['poda',/poda|\bcortes?\b|piton|cargador|herramientas de corte/],['filtro',/filtr|cabezal|obtur|\bpresion|manomet|perdida de carga/],['goteo',/goteo|emisor|gotero|lateral|uniformidad|caudal|tuberia|sectorizacion/],
 ['ph',/\bph\b|conductividad|electrodo|salinidad|\bce\b/],['muestreo',/muestreo|muestra|calicata|representativ|monitoreo|diagnostico/],['compost',/compost|residuo|materia organica|lombr|mineralizacion/],['nutricion',/nutri|fertiliz|nitrogen|fosfor|potasio|deficiencia|dosis|abon/],
 ['plaga',/plaga|enfermed|sanidad|sanitari|patogeno|botrytis|lobesia|oidi|mildiu|fitosan|control biologico/],['cosecha',/cosecha|vendimia|poscosecha|postcosecha|madurez|brix|recoleccion|logistica/],['costos',/costo|presupuesto|rentab|margen|precio|comercial|venta|econom/],
 ['registro',/fuentes|referencias|bibliograf|trazabilidad|bitacora|portafolio|registro|proyecto|plan de accion|evidencia|evaluacion|aprendido|repaso/],['canopia',/canopia|follaje|microclima|desbrote|deshoje|luz|radiacion|fotoperiod/],['raices',/raiz|raices|radical|radicular/],
 ['suelo',/suelo|textura|estructura del suelo|horizonte|compactacion|drenaje|erosion|cobertura/],['riego',/riego|agua|hidric|evapotranspir|lamina|balance|humedad/],['semilla',/semilla|siembra|almacigo|germin|plantula|trasplante|propagacion|plantacion/],['ciclo',/fenolog|ciclo|floracion|cuaja|envero|crecimiento|grados dia/],
 ['hidro',/hidropon|recircul|nft|raiz flotante|solucion nutritiva/],['maleza',/maleza|herbicid|identificacion|gramine|latifoli/],['flor',/flor|petalo|ornamental|bulbo|ramo/],['vid',/\bvid\b|vinifer|\bvino\b|vinedo|cepa|\buva|racimo/],['palto',/palto|palta|frutal|arbol|copa/]
 ];
 const defaults={'agricultura-regenerativa':'suelo','riego-agricola':'riego','malezas-chile':'maleza','mi-primera-huerta':'semilla','fertilizacion-nutricion':'nutricion','poda-injertos':'poda','goteo-instalacion':'goteo','cultivo-paltos':'palto','qgis-ndvi':'mapa','hidroponia-practica':'hidro','floricultura-practica':'flor','viticultura-uva-vino':'vid'};
 function select(deck,slide){
  const title=norm(slide.title),topic=norm(deck.title),body=norm((slide.paragraphs||[]).join(' '));
  if(deck.course==='qgis-ndvi'){if(/ndvi|infrarrojo|banda roja/.test(title))return 'ndvi';if(/satelit|sentinel|teledeteccion|reflectancia/.test(title))return 'satelite';if(/muestreo|muestra|terreno/.test(title))return 'muestreo';return 'mapa';}
  if(deck.course==='floricultura-practica'&&/flor.*corte/.test(title))return 'flor';
  let match=rules.find(([,r])=>r.test(title));if(match)return match[0];
  match=rules.find(([,r])=>r.test(topic));if(match)return match[0];
  match=rules.find(([,r])=>r.test(body));return match?.[0]||defaults[deck.course]||'registro';
 }
 function svg(key,index=0){
  if(!scenes[key])key='registro';const labels=scenes[key];let art='';
  const path=(d,color='#285846',width=4,fill='none',extra='')=>`<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const rect=(x,y,w,h,fill='#e2edc9',radius=12)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="#285846" stroke-width="3"/>`;
  const circle=(x,y,r,fill='#f4be57')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#285846" stroke-width="3"/>`;
  const leaf=(x,y,flip=1)=>`<g transform="translate(${x} ${y}) scale(${flip} 1)">${path('M0 0 Q-30 -55 -75 -28 Q-60 12 0 0','#2e7254',3,'#8cb968')}${path('M0 0 L-50 -20','#42744b',2)}</g>`;
  const ground=()=>rect(40,228,490,96,'#dec6a1',4)+path('M40 228 Q160 216 280 228 T530 228','#8b6b43',4);
  const root=(x=285,y=225)=>path(`M${x} ${y} v76 m0 -58 l-38 38 m38 -28 l40 40 m-40 -30 l-22 38 m22 -22 l22 26`,'#986e46',4);
  const plant=(x=285,y=225)=>path(`M${x} ${y} v-110`)+leaf(x,y-65)+leaf(x,y-105,-1);
  const badge=(n,x,y)=>circle(x,y,16,'#fffaf0')+`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="18" font-weight="700">${n}</text>`;
  const arrow=(x1,y1,x2,y2,color='#408bb2')=>path(`M${x1} ${y1} L${x2} ${y2}`,color,4)+path(`M${x2-7} ${y2-11} L${x2} ${y2} L${x2+7} ${y2-11}`,color,4);
  if(['suelo','raices','riego','nutricion'].includes(key)){
   art=ground()+plant()+root();
   if(key==='suelo'){art+=path('M40 259 H530 M40 295 H530','#b89567',2);for(let j=0;j<10;j++)art+=path(`M${58+j*45} 217 l13 -8`,'#89a65d',5);}
   if(key==='riego'){art+=circle(95,92,28,'#f4c562');for(let j=0;j<4;j++)art+=arrow(110+j*38,153,110+j*38,218);art+=arrow(360,258,360,319);}
   if(key==='nutricion'){['N','P','K'].forEach((v,j)=>{art+=circle(160+j*105,278,18,'#d9e7b4')+`<text x="${160+j*105}" y="284" text-anchor="middle" font-size="17">${v}</text>`;});art+=arrow(300,220,300,172,'#c08542');}
   art+=key==='suelo'?badge(1,110,212)+badge(2,440,266)+badge(3,315,298):key==='raices'?badge(1,315,223)+badge(2,235,268)+badge(3,405,298):key==='riego'?badge(1,110,170)+badge(2,315,268)+badge(3,390,319):badge(1,160,308)+badge(2,260,245)+badge(3,325,172);
  }else if(key==='goteo'){
   art=ground()+path('M50 181 H520','#364e4a',14);for(let j=0;j<3;j++){const x=130+j*150;art+=rect(x-12,175,24,25,'#4e9ab4',4)+`<ellipse cx="${x}" cy="270" rx="58" ry="42" fill="#8fc8d5" opacity=".65"/>`+path(`M${x} 206 v26`,'#3c8eac',5)+plant(x,175);}art+=badge(1,62,158)+badge(2,300,188)+badge(3,447,286);
  }else if(key==='filtro'){
   art=path('M45 180 H190 M365 180 H520','#498aa6',18)+rect(190,104,175,160,'#e9f1ec')+rect(248,116,56,136,'#d9dcb4',3);for(let j=0;j<5;j++)art+=path(`M252 ${132+j*23} h48`,'#8a9e78',2);art+=circle(420,116,30,'#fff')+path('M420 116 l14 -13 M420 146 v24');art+=badge(1,100,154)+badge(2,278,180)+badge(3,490,155);
  }else if(key==='ph'){
   art=rect(150,160,180,154,'#d9edf0',9)+path('M146 162 h188 M165 225 Q235 214 320 225','#428ba7',4)+rect(360,90,125,90,'#e8edd7')+rect(375,107,95,40,'#c9dbb8',4)+path('M365 160 C310 155 280 149 270 188 L270 269','#556c5d',7)+rect(260,246,20,47,'#9aadb1',4);art+=badge(1,184,210)+badge(2,285,275)+badge(3,460,133);
  }else if(['semilla','ciclo'].includes(key)){
   art=path('M45 270 H525','#9e7750',5)+circle(95,253,17,'#b79757')+plant(280,267)+plant(468,267)+root(95,270)+root(280,270)+root(468,270);art+=circle(468,130,24,'#e8ad87')+badge(1,100,202)+badge(2,280,85)+badge(3,475,84);
  }else if(['poda','injerto'].includes(key)){
   art=ground()+root()+path('M285 227 V113 M285 172 L209 111 M285 150 L356 91','#9a754a',18)+leaf(355,91,-1)+leaf(209,111);
   if(key==='poda'){art+=path('M207 111 L175 78','#9a754a',16)+path('M176 116 L226 91','#cf654b',6)+circle(189,147,10,'#e0e5dc')+circle(219,151,10,'#e0e5dc')+path('M192 139 L227 93 M215 142 L184 97','#7c8985',5);}
   else art+=path('M285 190 V125','#dcad76',20)+path('M270 174 L300 183 M270 185 L300 194 M270 196 L300 205','#e3d9ba',7);
   art+=key==='poda'?badge(1,316,205)+badge(2,358,114)+badge(3,172,91):badge(1,325,110)+badge(2,250,187)+badge(3,320,280);
  }else if(['canopia','vid','palto','flor','maleza'].includes(key)){
   art=ground()+root()+path('M285 226 V96', '#8e704d',key==='maleza'?5:13);
   for(let j=0;j<4;j++){const y=113+j*24;art+=leaf(285,y,j%2?1:-1);}
   if(key==='vid'){art+=path('M80 178 H495','#8fa093',3)+path('M285 192 H415','#8e704d',9);for(let j=0;j<10;j++)art+=circle(340+(j%3)*17,155+Math.floor(j/3)*15,11,'#9582aa');}
   if(key==='palto')for(let j=0;j<3;j++)art+=`<ellipse cx="${200+j*82}" cy="${145+(j%2)*30}" rx="16" ry="23" fill="#67944d" stroke="#285846" stroke-width="3"/>`;
   if(key==='flor'){for(let j=0;j<6;j++){let a=j*Math.PI/3;art+=circle(285+Math.cos(a)*25,85+Math.sin(a)*25,20,['#efa9a3','#edbb5f','#c7abda'][index%3]);}art+=circle(285,85,18,'#ecbd51');}
   if(key==='canopia'){art+=circle(100,86,30,'#edc563')+arrow(142,100,198,165,'#c9a850')+path('M380 230 C440 195 450 155 510 168','#61a8be',5);}
   const pins={vid:[[285,87],[397,180],[317,220]],flor:[[346,68],[285,85],[315,190]],palto:[[350,95],[205,145],[325,264]],maleza:[[350,130],[312,208],[321,280]],canopia:[[100,86],[300,153],[475,194]]};pins[key].forEach(([x,y],j)=>art+=badge(j+1,x,y));
  }else if(key==='cosecha'){
   art=rect(56,170,140,128,'#dfbd86',4)+rect(237,170,140,128,'#dfbd86',4)+rect(423,134,104,165,'#fff9e8',4);for(let j=0;j<6;j++)art+=circle(80+j%3*40,205+Math.floor(j/3)*44,16,'#a6bb72');art+=path('M438 168 h73 m-73 29 h57 m-57 28 h67 m-67 28 h42','#8b9a83',4)+badge(1,122,125)+badge(2,307,125)+badge(3,477,100);
  }else if(key==='plaga'){
   art=leaf(265,200,-2)+circle(341,159,62,'#edf2d5')+path('M386 205 l66 65','#678674',17)+circle(332,153,15,'#d2a663')+path('M315 142 l-15 -10 m15 20 l-19 3 m19 7 l-13 16 M347 141 l14 -13 m-12 24 l21 2 m-22 11 l15 15','#7b654e',3)+rect(68,246,155,72,'#fff8e6');art+=badge(1,188,158)+badge(2,353,90)+badge(3,128,280);
  }else if(['satelite','ndvi','mapa','muestreo'].includes(key)){
   art=rect(74,145,385,174,'#ebefd9',4);for(let j=0;j<5;j++)for(let k=0;k<3;k++)art+=rect(85+j*72,157+k*50,64,42,['#e5cf86','#b4ca8c','#78a47a'][(j+k+index)%3],2);
   if(key==='satelite'){art+=rect(252,55,66,46,'#8ea5b0',5)+rect(181,60,63,32,'#abc6dc',2)+rect(325,60,63,32,'#abc6dc',2)+path('M285 105 L140 294 M285 105 L427 294','#b7c8c0',2);}
   if(key==='ndvi'){art+=path('M155 117 L255 58','#ce775d',5)+path('M355 117 L285 58','#8c7ba5',5)+`<text x="145" y="103" font-size="17">Rojo</text><text x="350" y="104" font-size="17">NIR</text>`;}
   if(key==='mapa')art+=rect(455,83,59,97,'#f8eed5',4)+path('M467 101 h34 m-34 21 h34 m-34 21 h34','#82a583',5)+path('M100 277 L190 176 L300 264 L422 182','#e28e58',4);
   if(key==='muestreo'){const pts=[[110,180],[200,250],[294,190],[390,280]];art+=path('M110 180 L200 250 L294 190 L390 280','#916a44',3);pts.forEach(([x,y])=>art+=circle(x,y,8,'#c88665'));art+=rect(470,217,45,96,'#e5eff0',5);}
   const pins={ndvi:[[152,119],[377,119],[285,240]],satelite:[[285,78],[285,129],[482,278]],mapa:[[485,115],[90,305],[316,264]],muestreo:[[90,140],[217,250],[493,254]]};pins[key].forEach(([x,y],j)=>art+=badge(j+1,x,y));
  }else if(['costos','registro'].includes(key)){
   art=rect(124,74,310,248,'#fffaf0',8)+rect(207,57,145,35,'#b5c6ac',5);for(let j=0;j<5;j++)art+=path(`M152 ${120+j*37} H408`,'#bbc7b1',3);art+=path('M158 280 V225 H207 V280 M235 280 V180 H284 V280 M312 280 V146 H361 V280','#799d79',4,key==='costos'?'#c6d5ad':'none');art+=badge(1,93,141)+badge(2,466,192)+badge(3,279,291);
  }else if(key==='compost'){
   art=path('M72 300 Q110 150 265 116 Q426 141 501 300 Z','#886b48',4,'#b99c70');for(let j=0;j<8;j++)art+=leaf(150+j*38,220+(j%3)*20,j%2?1:-1);art+=path('M240 98 q-18 -18 0 -36 M290 92 q-18 -18 0 -36 M340 98 q-18 -18 0 -36','#a8aca0',4)+badge(1,120,128)+badge(2,320,140)+badge(3,445,283);
  }else if(key==='hidro'){
   art=rect(67,177,445,52,'#c6d9cd',5)+path('M80 209 H490','#63a2b8',7);for(let j=0;j<3;j++){art+=plant(145+j*150,176)+root(145+j*150,180);}art+=rect(333,270,176,65,'#bfdde4',5)+path('M505 228 V285 M337 296 H72 V204','#5b91a7',8)+circle(356,299,15,'#8fa5a8')+badge(1,170,135)+badge(2,526,245)+badge(3,413,303);
  }
  const legend=labels.slice(1).map((s,i)=>`<g>${badge(i+1,606,127+i*78)}<text x="636" y="133" transform="translate(0 ${i*78})" font-size="18">${esc(s)}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 390" role="img" aria-label="${esc(labels[0])}"><title>${esc(labels[0])}</title><desc>${esc(labels.slice(1).join('. '))}. Dibujo esquemático, sin escala.</desc><rect width="1000" height="390" rx="20" fill="#fbf6e9"/><g fill="#285846" font-family="Arial, sans-serif"><text x="34" y="38" font-size="23" font-weight="700">${esc(labels[0])}</text>${art}<path d="M565 78 V332" stroke="#dedac9" stroke-width="2"/>${legend}<text x="34" y="367" fill="#6c7868" font-size="14">CAMPO EDUCA · Ilustración didáctica original · Esquema sin escala</text></g></svg>`;
 }
 function compose(key,index,url,title,withDrawing=true){
  const wrap=(value,x,y,width=27,size=27,line=35,color='#285846')=>{const lines=[];let row='';for(const word of String(value).split(/\s+/)){if(row&&(row+' '+word).length>width){lines.push(row);row=word;}else row+=(row?' ':'')+word;}if(row)lines.push(row);return lines.map((v,i)=>`<text x="${x}" y="${y+i*line}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${esc(v)}</text>`).join('');};
  const labels=scenes[key]||scenes.registro;
  const original=withDrawing?'<image x="16" y="135" width="1435" height="810" preserveAspectRatio="xMidYMid meet" href="'+esc(url)+'"/>':'<image width="1920" height="1080" preserveAspectRatio="xMidYMid meet" href="'+esc(url)+'"/>';
  let panel='';if(withDrawing){
   let drawing=svg(key,index).replace('viewBox="0 0 1000 390"','x="1468" y="190" width="436" height="310" viewBox="0 0 565 390"').replace(/<text x="34" y="38"[^>]*>.*?<\/text>/,'').replace(/<text x="34" y="367"[^>]*>.*?<\/text>/,'');
   panel='<rect x="1467" width="453" height="1080" fill="#fbf6e9"/><path d="M1467 0 V1080" stroke="#d4decf" stroke-width="3"/>'+wrap(labels[0],1494,76,25,31,40)+drawing;
   panel+=labels.slice(1).map((label,j)=>{const y=555+j*125;return '<circle cx="1504" cy="'+(y-10)+'" r="20" fill="#fffaf0" stroke="#285846" stroke-width="3"/><text x="1504" y="'+(y-1)+'" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#285846">'+(j+1)+'</text>'+wrap(label,1541,y,23,26,35);}).join('');
   panel+=wrap('Dibujo de apoyo · Sin escala',1494,990,30,19,27,'#66725f')+wrap('CAMPO EDUCA',1494,1032,30,19,27,'#66725f');
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" class="campo-composite-slide" width="1920" height="1080" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(title+(withDrawing?'. Dibujo integrado: '+labels[0]:''))+'"><title>'+esc(title)+'</title><rect width="1920" height="1080" fill="#f9faf5"/>'+original+panel+'</svg>';
 }
 function install(){
  function ready(){
   const stage=document.querySelector('.slide-stage'),player=document.getElementById('presentation-player'),image=document.getElementById('presentation-image');if(!stage||!player||!image||document.getElementById('campo-drawing'))return;
   const style=document.createElement('style');style.textContent=`.slide-stage.campo-composite-stage{display:grid!important;place-items:center;aspect-ratio:16/9;overflow:hidden;background:#f9faf5;min-width:0;min-height:0}.campo-composite-stage #presentation-image{display:none!important}.campo-composite-stage .campo-slide-view{width:100%;height:100%;min-height:0;display:grid;place-items:center;overflow:hidden}.campo-composite-stage .campo-composite-slide{display:block;width:100%;height:100%;max-height:100%;aspect-ratio:16/9}.campo-composite-stage #presentation-error:not([hidden]){position:absolute;inset:auto 0 0;background:#fff7e8;margin:0;padding:12px;z-index:2}.campo-drawing{margin:0;padding:10px 12px;background:#eef3e7;color:#244737;font:14px/1.4 Arial,sans-serif;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.campo-drawing p{margin:0}.campo-drawing-tools{display:flex;flex-wrap:wrap;gap:8px}.campo-drawing button{min-height:42px;padding:8px 12px;background:white;border:1px solid #a9bca0;border-radius:7px;color:#244737;font:inherit;cursor:pointer}.campo-drawing button:focus-visible{outline:3px solid #bd921c;outline-offset:3px}.campo-drawing button:disabled{opacity:.65;cursor:wait}.campo-drawing-status{font-size:12px;width:100%}.campo-drawing-status:empty{display:none}.presentation-player:fullscreen,.presentation-expanded{display:flex!important;flex-direction:column!important;overflow:hidden!important}.presentation-player:fullscreen .campo-composite-stage,.presentation-expanded .campo-composite-stage{flex:1 1 0!important;min-height:0!important;aspect-ratio:auto!important;width:100%;background:#182d20}.presentation-player:fullscreen .campo-drawing,.presentation-expanded .campo-drawing{flex:0 0 auto;padding:6px 10px}.presentation-player:fullscreen .campo-drawing button,.presentation-expanded .campo-drawing button{min-height:36px;font-size:12px;padding:5px 9px}.presentation-player:fullscreen .campo-drawing>p,.presentation-expanded .campo-drawing>p{font-size:12px}.presentation-player:fullscreen .presentation-controls,.presentation-expanded .presentation-controls{flex:0 0 auto}.presentation-player:fullscreen .slide-status,.presentation-expanded .slide-status{flex:0 0 auto;margin:0}@media(max-width:600px){.campo-drawing{padding:8px}.campo-drawing>p{font-size:12px}.campo-drawing-tools{width:100%}.campo-drawing button{flex:1;font-size:12px}}`;
   document.head.append(style);stage.classList.add('campo-composite-stage');
   const view=document.createElement('div');view.className='campo-slide-view';stage.append(view);
   const toolbar=document.createElement('div');toolbar.id='campo-drawing';toolbar.className='campo-drawing';toolbar.innerHTML='<p>Contenido y dibujo en una sola diapositiva</p><div class="campo-drawing-tools"><button type="button" data-action="toggle" aria-pressed="false">Ver sin dibujo</button><button type="button" data-action="download">Descargar diapositiva PNG</button></div><span class="campo-drawing-status" role="status" aria-live="polite"></span>';stage.after(toolbar);
   let last=null,withDrawing=true,markup='',filename='diapositiva-ilustrada',currentSource='';const download=toolbar.querySelector('[data-action="download"]'),status=toolbar.querySelector('[role="status"]');
   function redraw(){if(!last)return;currentSource=image.getAttribute('src')||'';if(!currentSource)return;markup=compose(last.key,last.index,currentSource,last.slide.title,withDrawing);view.innerHTML=markup;}
   const render=(deck,slide,index,topic=0)=>{deck={...deck,course:deck.course||window.PRIVATE_PROFILE?.course};last={key:select(deck,slide),slide,index};filename='campo-educa-'+(deck.course||'curso')+'-tema-'+(topic+1)+'-diapo-'+(index+1);redraw();};
   toolbar.querySelector('[data-action="toggle"]').onclick=e=>{withDrawing=!withDrawing;e.currentTarget.textContent=withDrawing?'Ver sin dibujo':'Ver con dibujo';e.currentTarget.setAttribute('aria-pressed',String(!withDrawing));redraw();};
   new MutationObserver(redraw).observe(image,{attributes:true,attributeFilter:['src']});
   download.onclick=async()=>{
    const snapshot={source:currentSource,markup,filename};if(!snapshot.source||!snapshot.markup)return;download.disabled=true;status.textContent='Preparando la diapositiva completa…';let svgUrl;
    try{
     const response=await fetch(snapshot.source);if(!response.ok)throw Error('No se pudo obtener la imagen. Renueva el acceso al material.');
     const blob=await response.blob();const embedded=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('No se pudo leer la imagen.'));reader.readAsDataURL(blob);});
     const full=snapshot.markup.replace('href="'+esc(snapshot.source)+'"','href="'+esc(embedded)+'"');
     svgUrl=URL.createObjectURL(new Blob([full],{type:'image/svg+xml;charset=utf-8'}));const bitmap=new Image();bitmap.src=svgUrl;await bitmap.decode();const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;const context=canvas.getContext('2d');if(!context)throw Error('No se pudo preparar la imagen.');context.drawImage(bitmap,0,0);
     const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('No se pudo exportar la imagen.')),'image/png'));const url=URL.createObjectURL(png),a=document.createElement('a');a.href=url;a.download=snapshot.filename+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='Diapositiva completa preparada en PNG (1920 × 1080).';
    }catch(e){status.textContent=e.message||'No se pudo descargar la diapositiva. Puedes seguir proyectando desde el visor.';}
    finally{download.disabled=false;if(svgUrl)URL.revokeObjectURL(svgUrl);}
   };
   window.campoDrawings={render};
   if(typeof learningPresentations!=='undefined'&&typeof currentPresentationIndex!=='undefined'){const d=learningPresentations[currentPresentationIndex];render(d,d.slides[currentSlideIndex],currentSlideIndex,currentPresentationIndex);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 }
 return {select,svg,compose,install,scenes};
}
