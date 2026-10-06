import * as THREE from 'three';

export function mountBooth(host, hero) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const lightweight = mobile || (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  const renderer = new THREE.WebGLRenderer({alpha:true, antialias:!lightweight, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, lightweight ? 1 : 1.5));
  renderer.setClearColor(0, 0);
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(8, 6, 10); camera.lookAt(0, 1.2, 0);
  const group = new THREE.Group(); scene.add(group);
  // Platform, rear wall, portal columns/canopy, display and counter.
  const specs = [
    [[6,.14,4],[0,0,0]], [[6,2.8,.12],[0,1.5,-1.9]],
    [[.12,3.3,.12],[-2.85,1.7,1.8]], [[.12,3.3,.12],[2.85,1.7,1.8]],
    [[6,.3,.35],[0,3.45,1.8]], [[.25,.3,4],[-2.85,3.45,0]], [[.25,.3,4],[2.85,3.45,0]],
    [[2.2,1.2,.16],[.7,1.9,-1.78]], [[1.7,.95,.75],[1.25,.6,.9]],
    [[.9,1.7,.5],[-1.8,.93,-.9]], [[2,.08,1],[-.7,.85,-.4]]
  ];
  const parts = specs.map(([size,pos], i) => {
    const geometry = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Group(); mesh.position.set(...pos); group.add(mesh);
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    geometry.dispose();
    const edges = new THREE.LineSegments(edgeGeometry,new THREE.LineBasicMaterial({color:0x363a3b,transparent:true,opacity:0})); mesh.add(edges);
    return {mesh,edges,pos:new THREE.Vector3(...pos),delay:i===0?0:i<7?.1:.28};
  });
  let seed=27; const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const count=lightweight?260:1300, positions=new Float32Array(count*3), targets=new Float32Array(count*3), scatter=new Float32Array(count*3), colors=new Float32Array(count*3), velocity=new Float32Array(count*3);
  for(let i=0;i<count;i++) {
    const [size,pos]=specs[i%specs.length]; const axis=i%3;
    for(let a=0;a<3;a++){const k=i*3+a;targets[k]=pos[a]+size[a]*(a===axis?random()-.5:(random()>.5?.5:-.5));scatter[k]=(random()-.5)*(a===1?6:9)+(a===1?1.5:0);positions[k]=scatter[k];}
    const c=new THREE.Color(i%19===0?0x202223:0x55595b);c.toArray(colors,i*3);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const particles=new THREE.Points(geometry,new THREE.PointsMaterial({size:mobile?.042:.035,vertexColors:true,transparent:true,opacity:.7,depthWrite:false}));group.add(particles);
  const nodes=new THREE.InstancedMesh(new THREE.SphereGeometry(.045,6,4),new THREE.MeshBasicMaterial({color:0x26292a,transparent:true,opacity:.5}),8);group.add(nodes);
  const nodePositions=[[-2.85,3.45,1.8],[2.85,3.45,1.8],[-2.85,3.45,-1.8],[2.85,3.45,-1.8],[-3,0,2],[3,0,2],[-3,0,-2],[3,0,-2]];
  const matrix=new THREE.Matrix4();nodePositions.forEach((p,i)=>nodes.setMatrixAt(i,matrix.makeTranslation(...p)));
  const pointer=new THREE.Vector2(5,5), hover=new THREE.Vector3(), projected=new THREE.Vector3();let inside=false,visible=true,frame=0,last=0,elapsed=0,disposed=false;
  function move(event){const r=host.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);inside=pointer.x>=-1&&pointer.x<=1&&pointer.y>=-1&&pointer.y<=1;}
  function leave(){inside=false;pointer.set(5,5);}
  if(!mobile){hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave);}
  const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;const distance=Math.max(15, 4.7/(Math.tan(THREE.MathUtils.degToRad(17))*camera.aspect));camera.position.set(8,6,10).sub(new THREE.Vector3(0,1.2,0)).normalize().multiplyScalar(distance).add(new THREE.Vector3(0,1.2,0));camera.lookAt(0,1.2,0);camera.updateProjectionMatrix();});resize.observe(host);
  const visibility=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible) resume();});visibility.observe(hero);
  function resume(){if(!frame&&!disposed&&!document.hidden&&visible){last=0;frame=requestAnimationFrame(tick);}}
  function onVisibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();}document.addEventListener('visibilitychange',onVisibility);
  const smooth=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  function tick(now){frame=0;if(disposed||!visible||document.hidden)return;if(last&&now-last<33){frame=requestAnimationFrame(tick);return;}const dt=last?Math.min((now-last)/1000,.06):.033;last=now;elapsed+=dt;
    const rect=hero.getBoundingClientRect();const scroll=THREE.MathUtils.clamp(-rect.top/Math.max(1,rect.height-innerHeight*.2),0,1);
    const cycle=elapsed%24;const loop=smooth(0,7,cycle)*(1-smooth(19,24,cycle));const formation=Math.max(loop, smooth(0,.85,scroll));
    const explode=Math.sin(Math.PI*smooth(.38,.75,formation))*.24*(1-smooth(.75,1,formation));
    group.rotation.y=THREE.MathUtils.damp(group.rotation.y,inside?pointer.x*.105:Math.sin(elapsed*.12)*.025,4,dt);
    group.rotation.x=THREE.MathUtils.damp(group.rotation.x,inside?-pointer.y*.07:0,4,dt);
    parts.forEach(({mesh,edges,pos,delay},i)=>{const built=smooth(delay,.65+delay,formation);mesh.position.copy(pos);mesh.position.y+=(i===0?-.15:.4+i*.035)*explode;mesh.scale.setScalar(.92+.08*built);edges.material.opacity=built*.88;});
    group.updateMatrixWorld();
    // Map the cursor to the local booth plane, then damp nearby particles back home.
    hover.set(pointer.x,pointer.y,.5).unproject(camera);const direction=hover.sub(camera.position).normalize();const planeDistance=(1.5-camera.position.y)/direction.y;const cursorValid=inside&&Number.isFinite(planeDistance)&&planeDistance>0&&planeDistance<50;hover.copy(camera.position).addScaledVector(direction,cursorValid?planeDistance:0);group.worldToLocal(hover);
    const step=dt*30;
    for(let i=0;i<count;i++){const k=i*3;const mix=smooth((i%specs.length)*.015,.8,formation);const dx=positions[k]-hover.x,dy=positions[k+1]-hover.y,dz=positions[k+2]-hover.z;const distance=dx*dx+dy*dy+dz*dz;const force=cursorValid&&distance<1.6?(1-distance/1.6)*.045:0;
      for(let a=0;a<3;a++){const j=k+a;const target=scatter[j]*(1-mix)+targets[j]*mix+Math.sin(elapsed*.35+i+a)*.055*(1-mix);const displacement=a===0?dx:a===1?dy:dz;velocity[j]=(velocity[j]+(target-positions[j])*.06*step+displacement*force*step)*Math.pow(.76,step);positions[j]+=velocity[j]*step;}
    }
    geometry.attributes.position.needsUpdate=true;particles.material.opacity=.85-.18*smooth(.75,1,formation);
    nodes.material.opacity=smooth(.4,.9,formation)*.85;
    let highlighted=false;nodePositions.forEach((p,i)=>{projected.set(...p).applyMatrix4(group.matrixWorld).project(camera);const near=inside&&Math.hypot(projected.x-pointer.x,projected.y-pointer.y)<.15;highlighted ||= near;matrix.compose(new THREE.Vector3(...p),new THREE.Quaternion(),new THREE.Vector3().setScalar(near?1.9:1));nodes.setMatrixAt(i,matrix);});nodes.instanceMatrix.needsUpdate=true;if(highlighted)nodes.material.opacity=.95;
    renderer.render(scene,camera);host.classList.add('booth-ready');frame=requestAnimationFrame(tick);
  }
  renderer.domElement.addEventListener('webglcontextlost',lost);function lost(event){event.preventDefault();cleanup();}
  function cleanup(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',onVisibility);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [].concat(o.material))m.dispose();}});renderer.dispose();renderer.domElement.remove();host.classList.remove('booth-ready');}
  resume();return cleanup;
}
