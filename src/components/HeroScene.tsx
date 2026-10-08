import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`

const vertex = /* glsl */ `
uniform float uTime;
uniform float uHover;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;
${noise}
void main(){
  float n  = snoise(normal * 1.6 + uTime * 0.22);
  float n2 = snoise(normal * 4.0 - uTime * 0.38) * 0.28;
  float n3 = snoise(normal * 0.8 + uTime * 0.12) * 0.15;
  float d  = (n + n2 + n3) * (0.20 + uHover * 0.22);
  vNoise = n;
  vec3 pos = position + normal * d;
  vec4 mv  = modelViewMatrix * vec4(pos, 1.0);
  vNormal  = normalize(normalMatrix * normal);
  vView    = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

const fragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uTime;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.8);
  float t    = smoothstep(-0.6, 0.9, vNoise);
  vec3 col   = mix(uA, uB, t);
  col        = mix(col, uC, smoothstep(0.5, 1.0, t) * 0.35);
  col        = col * (0.22 + 0.6 * smoothstep(-0.3, 1.0, vNoise))
             + fres * mix(uB, vec3(1.0), 0.4) * 1.4;
  // subtle time-based shimmer
  col       += 0.03 * sin(uTime * 2.0 + vNoise * 8.0);
  gl_FragColor = vec4(col, 1.0);
}`

function Orb({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uTime:  { value: 0 },
      uHover: { value: 0 },
      uA: { value: new THREE.Color('#4c1d95') },   // deep purple
      uB: { value: new THREE.Color('#7c3aed') },   // violet
      uC: { value: new THREE.Color('#06b6d4') },   // cyan accent
    }),
    [],
  )
  useFrame((state, dt) => {
    const p = pointer.current!
    uniforms.uTime.value += dt
    const dist = Math.min(1, Math.hypot(p.x, p.y))
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, 1 - dist * 0.6, 0.06)
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.1
      mesh.current.rotation.z += dt * 0.03
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, p.y * 0.45, 0.05)
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, p.x * 0.35, 0.05)
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, p.y * 0.15, 0.04)
    }
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, p.x * 0.5, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, p.y * 0.35, 0.04)
    state.camera.lookAt(0, 0, 0)
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.38, 80]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  )
}

/** Outer halo ring that slowly rotates around the orb */
function Ring() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.15
      ref.current.rotation.z += dt * 0.08
    }
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.8, 0, 0]}>
      <torusGeometry args={[2.1, 0.008, 8, 120]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
    </mesh>
  )
}

/** Second faint ring, slower, different plane */
function Ring2() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.06
      ref.current.rotation.x += dt * 0.04
    }
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 5, 0.4, 0]}>
      <torusGeometry args={[2.55, 0.005, 8, 120]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.22} />
    </mesh>
  )
}

function Particles({ count = 2200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 4.5
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t)
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.55
      arr[i * 3 + 2] = r * Math.cos(p)
    }
    return arr
  }, [count])
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y -= dt * 0.025
      ref.current.rotation.z += dt * 0.012
    }
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color="#c4b5fd" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function HeroScene({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 44 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <Orb pointer={pointer} />
      <Ring />
      <Ring2 />
      <Particles />
    </Canvas>
  )
}
