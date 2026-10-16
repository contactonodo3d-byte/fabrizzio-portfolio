import {useState} from 'react';
import type {WorldTrackingAdapter} from '../ar/WorldTrackingAdapter';
export function PlacementControls({adapter,onReposition}:{adapter:WorldTrackingAdapter;onReposition:()=>void}){
 const [values,setValues]=useState({...adapter.placement});
 const change=(key:keyof typeof values,value:number)=>{adapter.setPlacement({[key]:value});setValues({...adapter.placement});};
 const controls=[['scale','Tamaño',.25,3,.05],['x','Posición X',-3,3,.05],['z','Posición Z',-3,3,.05],['y','Altura',-3,3,.05],['yaw','Giro',-180,180,5]] as const;
 return <details className="placement-controls"><summary>Ajustar granja</summary><div className="placement-body"><p>Ajustá la maqueta sobre el suelo. Estos valores son relativos; todavía no miden metros reales.</p>
 {controls.map(([key,label,min,max,step])=><label key={key}>{label}<output>{values[key].toFixed(key==='yaw'?0:2)}{key==='scale'?'×':key==='yaw'?'°':''}</output><input name={key} aria-label={label} type="range" min={min} max={max} step={step} value={values[key]} onChange={e=>change(key,Number(e.target.value))}/></label>)}
 <div className="placement-actions"><button onClick={()=>{adapter.resetTransform();setValues({...adapter.placement});}}>Restablecer ajustes</button><button onClick={onReposition}>Volver a colocar</button></div></div></details>;
}
