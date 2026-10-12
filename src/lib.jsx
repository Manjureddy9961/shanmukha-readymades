import {createClient} from '@supabase/supabase-js';import {createContext,useContext,useEffect,useRef,useState} from 'react';import {motion,useInView} from 'framer-motion';
export const sb=createClient(import.meta.env.VITE_SUPABASE_URL||'http://x',import.meta.env.VITE_SUPABASE_ANON_KEY||'x');
export const PHONE=import.meta.env.VITE_SHOP_PHONE||'919999999999';
export const ADDRESS='Shanmukha Readymades, Kamsala Street, Rayachoty, Annamayya District, 516269';
export const ACCENT={Kids:'#FFC93C',Boys:'#4DB6E8',Men:'#1E2A5A',Girls:'#FF6B6B'};
export const inr=n=>'₹'+Number(n||0).toLocaleString('en-IN');
export const device=()=>{let d=localStorage.getItem('sd');if(!d){d=crypto.randomUUID();localStorage.setItem('sd',d)}return d};
const shrink=f=>new Promise(r=>{if(!f.type.startsWith('image/')||f.type==='image/svg+xml'||f.size<400*1024)return r(f);const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>r(b?new File([b],f.name.replace(/\.\w+$/,'')+'.jpg',{type:'image/jpeg'}):f),'image/jpeg',.82)};im.onerror=()=>r(f);im.src=u});
export const upload=async(bucket,file0)=>{const file=await shrink(file0);const p=crypto.randomUUID()+'-'+file.name.replace(/\s/g,'_');const{error}=await sb.storage.from(bucket).upload(p,file);if(error)throw error;return sb.storage.from(bucket).getPublicUrl(p).data.publicUrl};
export function useData(fn,deps=[]){const[d,setD]=useState(null);const load=()=>fn().then(r=>setD(r.data||[]));useEffect(()=>{load()},deps);return[d,load]}
export function useSettings(){const[l,load]=useData(()=>sb.from('settings').select('*'));return[Object.fromEntries((l||[]).map(x=>[x.key,x.value])),load]}
export const WishCtx=createContext();export const useWish=()=>useContext(WishCtx);
export function useLongPress(cb,ms=3000){const t=useRef(),f=useRef(false);const stop=()=>clearTimeout(t.current);return{onPointerDown:()=>{f.current=false;t.current=setTimeout(()=>{f.current=true;cb()},ms)},onPointerUp:stop,onPointerLeave:stop,onPointerCancel:stop,onContextMenu:e=>e.preventDefault(),onClickCapture:e=>{if(f.current){e.preventDefault();e.stopPropagation();f.current=false}}}}
export const Reveal=({children,d=0,className=''})=><motion.div className={className} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.6,delay:d}}>{children}</motion.div>;
export function Counter({to,suffix=''}){const r=useRef(),v=useInView(r,{once:true}),[n,setN]=useState(0);useEffect(()=>{if(!v)return;let i=0;const id=setInterval(()=>{i++;setN(Math.round(to*i/40));if(i>=40)clearInterval(id)},35);return()=>clearInterval(id)},[v]);return <span ref={r}>{n}{suffix}</span>}
let _logo;const logoP=()=>(_logo=_logo||sb.from('settings').select('value').eq('key','logo_url').then(r=>r.data?.[0]?.value||''));
export function Logo({size=48,draw}){const[u,setU]=useState('');useEffect(()=>{logoP().then(setU)},[]);if(u)return <img src={u} alt="Shanmukha Readymades logo" style={{height:size,maxWidth:size*3}} className="w-auto object-contain"/>;return <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Shanmukha Readymades logo"><circle cx="50" cy="50" r="47" fill="#1E2A5A" stroke="#FFC93C" strokeWidth="4"/>
<motion.path d="M50 36c0-6 8-6 8-13a8 8 0 1 0-16 0M50 36L18 64h64z" fill="none" stroke="#FFC93C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={draw?{pathLength:0}:false} animate={{pathLength:1}} transition={{duration:1.8}}/>
<motion.circle cx="76" cy="74" r="9" fill="#FF6B6B" initial={draw?{scale:0}:false} animate={{scale:1}} transition={{delay:1.6,type:'spring'}}/></svg>}

export const CartCtx=createContext();export const useCart=()=>useContext(CartCtx);