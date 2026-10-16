import {test,expect} from '@playwright/test';
async function installed(page:import('@playwright/test').Page){
 await page.route('**/vendor/xr8/manifest.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({enabled:true,licenseAccepted:true,script:'/vendor/xr8/xr.js'})}));
 await page.route('**/vendor/xr8/xr.js',r=>r.fulfill({contentType:'application/javascript',body:'/* Test fixture; no SDK is downloaded. */'}));
}
test('missing runtime stays disabled and never requests vendor code or camera',async({page})=>{
 await page.route('**/vendor/xr8/manifest.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({enabled:false,licenseAccepted:false,script:'/vendor/xr8/xr.js'})}));
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/');await expect(page.getByRole('button',{name:'Probar AR sin marcador',exact:true})).toBeDisabled();
 await expect(page.getByText('Motor pendiente de activar para esta prueba local.')).toBeVisible();
 expect(requests.some(url=>url.endsWith('/vendor/xr8/xr.js'))).toBe(false);
 await page.getByRole('button',{name:'¡A jugar! · 60 segundos'}).click();await expect(page.getByTestId('timer')).toBeVisible();
});
test('SDK contract: placement, tracking loss, recovery, orientation and exit',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await installed(page);
 await page.addInitScript(()=>{
  const state={normal:true,x:0,z:1,rotate:false,stopped:0,removed:false,initialized:false};(window as unknown as {slamTest:typeof state}).slamTest=state;
  let modules:{name:string;onStart?:()=>void;onUpdate?:(frame:unknown)=>void;onDeviceOrientationChange?:()=>void}[]=[],timer:ReturnType<typeof setInterval>|undefined;
  const runtime={
   initialize:async()=>{state.initialized=true;},isInitialized:()=>state.initialized,
   addCameraPipelineModules:(m:typeof modules)=>{modules=m;},removeCameraPipelineModules:()=>{state.removed=true;modules=[];},
   run:()=>{if(!state.initialized)throw new Error('WASM initialization required');modules.forEach(m=>m.onStart?.());timer=setInterval(()=>{if(state.rotate){state.rotate=false;modules.forEach(m=>m.onDeviceOrientationChange?.());}modules.forEach(m=>m.onUpdate?.({processCpuResult:{reality:{position:{x:state.x,y:1.6,z:state.z},rotation:{x:0,y:0,z:0,w:1},intrinsics:[1,0,0,0,0,1,0,0,0,0,-1,-1,0,0,-.02,0],trackingStatus:state.normal?'NORMAL':'LIMITED'}}}));},30);},
   stop:()=>{clearInterval(timer);state.stopped++;},
   GlTextureRenderer:{pipelineModule:()=>({name:'test-video'})},XrConfig:{device:()=>({MOBILE:'mobile'}),camera:()=>({BACK:'back'})},
   XrController:{configure:(config:{scale:string})=>{if(config.scale!=='responsive')throw new Error('Unverified metric scale');},pipelineModule:()=>({name:'test-slam'}),updateCameraProjectionMatrix:()=>{},hitTest:()=>[{type:'FEATURE_POINT',position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0,w:1},distance:2}]},
  };
  Object.defineProperty(window,'XR8',{value:runtime});
 });
 await page.goto('/');await page.getByRole('button',{name:'Probar AR sin marcador',exact:true}).click();
 await expect(page.getByText('AR sin marcador',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'¡A jugar! · 60 segundos'})).toBeHidden();
 await page.screenshot({path:'test-results/world-placement-contract.png',fullPage:true});
 await page.getByRole('button',{name:'Colocar granja aquí'}).click();
 await expect(page.getByRole('button',{name:'Colocar granja aquí'})).toHaveCount(0);
 await page.getByText('Ajustar granja',{exact:true}).click();
 await page.getByRole('slider',{name:'Tamaño',exact:true}).fill('0.5');
 await page.getByRole('slider',{name:'Posición X',exact:true}).fill('0.25');
 await page.getByRole('slider',{name:'Giro',exact:true}).fill('90');
 await expect(page.getByRole('slider',{name:'Giro',exact:true})).toHaveValue('90');
 await page.getByRole('button',{name:'Restablecer ajustes'}).click();
 await expect(page.getByRole('slider',{name:'Tamaño',exact:true})).toHaveValue('1');
 await page.screenshot({path:'test-results/world-adjustments.png',fullPage:true});
 await page.getByText('Ajustar granja',{exact:true}).click();
 await page.getByRole('button',{name:'¡A jugar! · 60 segundos'}).click();
 await expect(page.getByRole('button',{name:'Servir en el explorador'})).toBeEnabled();
 for(const position of [{x:1.7,z:0},{x:-1.7,z:0},{x:0,z:1.7},{x:0,z:-1.7}]){
  await page.evaluate(p=>Object.assign((window as unknown as {slamTest:{x:number;z:number}}).slamTest,p),position);
  await expect(page.locator('.status.OUTSIDE')).toHaveText('Fuera del área virtual');
  await expect(page.getByRole('button',{name:'Servir en el explorador'})).toBeEnabled();
 }
 await page.evaluate(()=>Object.assign((window as unknown as {slamTest:{x:number;z:number}}).slamTest,{x:0,z:0}));
 await expect(page.locator('.status.SAFE')).toHaveText('Todo bien por acá');
 await page.evaluate(()=>{(window as unknown as {slamTest:{normal:boolean}}).slamTest.normal=false;});
 await expect(page.getByRole('button',{name:'Servir en el explorador'})).toBeDisabled();
 const time=await page.getByTestId('timer').innerText();await page.waitForTimeout(1200);await expect(page.getByTestId('timer')).toHaveText(time);
 await page.evaluate(()=>{(window as unknown as {slamTest:{normal:boolean}}).slamTest.normal=true;});
 await expect(page.getByRole('button',{name:'Servir en el explorador'})).toBeEnabled();
 await page.evaluate(()=>{(window as unknown as {slamTest:{rotate:boolean}}).slamTest.rotate=true;});
 await expect(page.getByRole('button',{name:'Colocar granja aquí'})).toBeVisible();
 await page.getByRole('button',{name:'Salir de AR',exact:true}).click();
 await expect(page.getByText('Demo virtual',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>(window as unknown as {slamTest:{stopped:number;removed:boolean}}).slamTest)).toMatchObject({removed:true});
 expect(errors).toEqual([]);
});
test('failed SDK camera startup restores virtual mode',async({page})=>{
 await installed(page);await page.addInitScript(()=>{Object.defineProperty(window,'XR8',{value:{addCameraPipelineModules:()=>{},removeCameraPipelineModules:()=>{},stop:()=>{},run:()=>{throw new Error('Permiso de cámara rechazado.');},GlTextureRenderer:{pipelineModule:()=>({name:'video'})},XrConfig:{device:()=>({MOBILE:'mobile'}),camera:()=>({BACK:'back'})},XrController:{configure:()=>{},pipelineModule:()=>({name:'tracker'}),updateCameraProjectionMatrix:()=>{}}}});});
 await page.goto('/');await page.getByRole('button',{name:'Probar AR sin marcador',exact:true}).click();
 await expect(page.getByText('Permiso de cámara rechazado.',{exact:true})).toBeVisible();
 await expect(page.getByText('Demo virtual',{exact:true})).toBeVisible();
});
