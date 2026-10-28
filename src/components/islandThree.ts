// Lightweight procedural Three.js scene. Loaded only when the island game opens.
// Three.js is delivered as a pinned ES module; the rest of AlexViet has no 3D download.
type SceneApi = { setBuilt:(ids:number[])=>void; zoom:(delta:number)=>void; reset:()=>void; dispose:()=>void };
export async function mountIsland(canvas:HTMLCanvasElement, initial:number[]):Promise<SceneApi>{
 const moduleUrl = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
 const THREE:any = await import(/* @vite-ignore */ moduleUrl);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#8ed8f6');scene.fog=new THREE.Fog('#8ed8f6',28,60);
 const camera=new THREE.PerspectiveCamera(42,1,.1,100);let azimuth=.65,elevation=.82,distance=19;
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene.add(new THREE.HemisphereLight('#ffffff','#3b775b',2.4));
 const sun=new THREE.DirectionalLight('#fff4cc',3.2);sun.position.set(-7,14,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=13;sun.shadow.camera.bottom=-13;scene.add(sun);
 const mat=(color:string,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness});
 const sand=mat('#e9ce86'),grass=mat('#65b64f'),wood=mat('#99623d'),leaf=mat('#27864e'),roof=mat('#e46c54'),white=mat('#fff3d6'),stone=mat('#9c9b89'),blue=mat('#4aaed3'),pink=mat('#f27a9d');
 function mesh(g:any,m:any,x=0,y=0,z=0,parent:any=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 const box=(w:number,h:number,d:number,m:any,x:number,y:number,z:number,p:any=scene)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);
 const ball=(r:number,m:any,x:number,y:number,z:number,p:any=scene)=>mesh(new THREE.IcosahedronGeometry(r,1),m,x,y,z,p);
 const cylinder=(top:number,bottom:number,h:number,m:any,x:number,y:number,z:number,p:any=scene)=>mesh(new THREE.CylinderGeometry(top,bottom,h,8),m,x,y,z,p);
 const island=new THREE.Group();scene.add(island);
 // Layered island silhouette and elevated grassy top.
 const base=mesh(new THREE.CylinderGeometry(6.9,6.2,1.35,56),sand,0,-.7,0,island);base.scale.z=.82;
 const top=mesh(new THREE.CylinderGeometry(6.25,6.7,.35,56),grass,0,.12,0,island);top.scale.z=.79;
 const water=mesh(new THREE.CylinderGeometry(35,35,.1,64),mat('#20a9cb',.28),0,-1.65,0);water.receiveShadow=false;
 Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;const ring=mesh(new THREE.TorusGeometry(8+i*.32,.025,4,80),mat(i%2?'#b6f7ec':'#8bdce7'),0,-1.55,0);ring.rotation.x=-Math.PI/2;ring.scale.y=.76;return ring});
 // Stone path and small landscape details.
 for(let i=0;i<12;i++){const a=i*.38;box(.72,.06,.54,sand,-3.4+i*.55,.36,Math.sin(a)*.35,island)}
 function palm(x:number,z:number,scale=1,parent:any=island){const g=new THREE.Group();g.position.set(x,.32,z);g.scale.setScalar(scale);parent.add(g);const trunk=cylinder(.12,.22,2.1,wood,0,1.05,0,g);trunk.rotation.z=.1;for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const f=mesh(new THREE.ConeGeometry(.45,2.2,5),leaf,Math.cos(a)*.65,2.2,Math.sin(a)*.65,g);f.rotation.z=Math.PI/2;f.rotation.y=-a;}ball(.34,leaf,0,2.2,0,g);return g}
 function tree(x:number,z:number,scale=1,parent:any=island){const g=new THREE.Group();g.position.set(x,.32,z);g.scale.setScalar(scale);parent.add(g);cylinder(.14,.21,1.25,wood,0,.63,0,g);ball(.85,leaf,0,1.62,0,g);ball(.54,mat('#49a75d'),.35,1.55,.15,g);return g}
 function house(x:number,z:number,scale=1,color=roof){const g=new THREE.Group();g.position.set(x,.34,z);g.scale.setScalar(scale);island.add(g);box(1.65,1.35,1.45,white,0,.7,0,g);const r=mesh(new THREE.ConeGeometry(1.38,.9,4),color,0,1.75,0,g);r.rotation.y=Math.PI/4;box(.4,.72,.07,wood,0,.4,.76,g);box(.32,.35,.08,blue,-.52,1,.75,g);box(.32,.35,.08,blue,.52,1,.75,g);return g}
 function flower(x:number,z:number){const g=new THREE.Group();g.position.set(x,.36,z);island.add(g);for(let i=0;i<8;i++){const a=i*Math.PI/4;ball(.22,i%2?pink:mat('#ffd36c'),Math.cos(a)*.65,.2,Math.sin(a)*.65,g)}return g}
 function school(){const g=house(-1.1,-2.7,1.3,mat('#4d8dcf'));box(1,.2,.1,white,0,2.6,.98,g);return g}
 function car(){const g=new THREE.Group();g.position.set(-1.2,.48,2.7);island.add(g);box(1.2,.45,.65,mat('#efb33b'),0,.25,0,g);box(.7,.37,.55,blue,-.1,.62,0,g);for(const x of [-.38,.38])for(const z of [-.36,.36]){const wheel=cylinder(.17,.17,.09,stone,x,.12,z,g);wheel.rotation.x=Math.PI/2}return g}
 function people(){const g=new THREE.Group();g.position.set(-3.4,.36,1.2);island.add(g);for(let i=0;i<3;i++){const x=i*.42;ball(.19,mat('#f0c69a'),x,1.05,0,g);cylinder(.17,.22,.65,i===0?blue:i===1?pink:roof,x,.52,0,g)}return g}
 function boat(){const g=new THREE.Group();g.position.set(5.3,-1.42,3.7);scene.add(g);box(1.4,.25,.6,wood,0,.05,0,g);cylinder(.035,.035,1.8,white,0,.9,0,g);const sail=mesh(new THREE.ConeGeometry(.7,1.35,3),white,.28,1.08,0,g);sail.rotation.z=.3;return g}
 const objects:any[]=[house(-2.8,-.4),tree(-4.1,-2,1.1),boat(),flower(.5,2.5),palm(3.3,-2.2,1.1),house(2.1,-.2,.7,mat('#6a98d7')),school(),car(),people(),house(3.5,1.9,1.45,mat('#d7a258'))];
 // Decorative palms always visible, to make the empty island a destination.
 palm(-4.7,1.6,.8);palm(4.3,.2,.8);tree(.8,-3.3,.8);
 function setBuilt(ids:number[]){objects.forEach((o,i)=>{o.visible=ids.includes(i)})}setBuilt(initial);
 function updateCamera(){const horizontal=distance*Math.cos(elevation);camera.position.set(Math.sin(azimuth)*horizontal,distance*Math.sin(elevation),Math.cos(azimuth)*horizontal);camera.lookAt(0,0,0)}
 updateCamera();
 let pointer:{x:number;y:number}|null=null;
 const down=(e:PointerEvent)=>{pointer={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)};
 const move=(e:PointerEvent)=>{if(!pointer)return;azimuth-=(e.clientX-pointer.x)*.008;elevation=Math.max(.32,Math.min(1.4,elevation+(e.clientY-pointer.y)*.006));pointer={x:e.clientX,y:e.clientY};updateCamera()};
 const up=()=>{pointer=null};const wheel=(e:WheelEvent)=>{e.preventDefault();distance=Math.max(10,Math.min(27,distance+e.deltaY*.015));updateCamera()};
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('wheel',wheel,{passive:false});
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 let frame=0,active=true;function animate(){if(!active)return;frame=requestAnimationFrame(animate);renderer.render(scene,camera)}animate();
 return {setBuilt,zoom(delta){distance=Math.max(10,Math.min(27,distance+delta));updateCamera()},reset(){azimuth=.65;elevation=.82;distance=19;updateCamera()},dispose(){active=false;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('wheel',wheel);scene.traverse((o:any)=>{o.geometry?.dispose?.();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach((m:any)=>m.dispose?.())}});renderer.dispose()}};
}
