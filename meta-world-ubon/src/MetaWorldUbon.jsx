// ████████████████████████████████████████████████████████████████████
//  META WORLD UBON RATCHATHANI — MMORPG EDITION v7.0
//  Physics · Jump · Mobile Joystick · 3D Avatar · Graphics Settings
//  Story Mode · Province Map · AI NPC + Thai TTS · IoT · Quests
// ████████████████████████████████████████████████████████████████████
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════ CLAUDE AI
async function askNPC(history, place = "Meta World อุบลราชธานี") {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 700,
        system: `คุณคือ "แม่หญิงอุบล" ไกด์ AI ประจำ Meta World อุบลราชธานี อบอุ่น เป็นกันเอง พูดสำเนียงอีสาน เช่น "เด้อ" "สิ" "แม่นบ่" ตอนนี้อยู่ที่: ${place} ตอบ 2-3 ประโยค ใส่ emoji`,
        messages: history,
      }),
    });
    const d = await res.json();
    return d.content?.[0]?.text ?? "ขอโทษนะคะ 🙏";
  } catch { return "ขอโทษนะคะ ไม่มีการเชื่อมต่อค่ะ 🙏"; }
}

// ═══════════════════════════════════════════ TTS
function useTTS() {
  const speak = useCallback((text, opts = {}) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "th-TH"; u.rate = opts.rate || 0.88; u.pitch = opts.pitch || 1.05;
    const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("th"));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }, []);
  const stop = useCallback(() => window.speechSynthesis.cancel(), []);
  return { speak, stop };
}

// ═══════════════════════════════════════════ DATA
const OUTFITS = [
  { id:"monk",    label:"นักบวช",       color:"#f59e0b", emoji:"🧘", bodyColor:0xf59e0b },
  { id:"local",   label:"ชาวบ้าน",      color:"#34d399", emoji:"👘", bodyColor:0x34d399 },
  { id:"tourist", label:"นักท่องเที่ยว",color:"#38bdf8", emoji:"🧳", bodyColor:0x38bdf8 },
  { id:"warrior", label:"นักรบขอม",     color:"#f87171", emoji:"⚔️", bodyColor:0xf87171 },
  { id:"dancer",  label:"นางรำ",        color:"#a78bfa", emoji:"💃", bodyColor:0xa78bfa },
  { id:"pilot",   label:"นักบิน",       color:"#60a5fa", emoji:"🦅", bodyColor:0x60a5fa },
];
const SKIN_COLORS  = ["#d4956a","#c68642","#8d5524","#f1c27d","#e8beac","#A0522D"];
const HAIR_STYLES  = [{id:"short",l:"สั้น",e:"✂️",h:0.3},{id:"long",l:"ยาว",e:"💁",h:0.6},{id:"curly",l:"หยิก",e:"🌀",h:0.4},{id:"bun",l:"มวย",e:"🎀",h:0.25},{id:"bald",l:"โกน",e:"🧑‍🦲",h:0}];
const HAIR_COLORS  = ["#1a0a00","#4a2c0a","#8B4513","#D4A04A","#C0C0C0","#FF4500","#000","#4169E1"];
const EYE_COLORS   = ["#4a2c0a","#1a3a5c","#2d5a27","#1a1a1a","#7a5c2a","#4a1a4a"];

const PLACES = [
  {id:"wat",    name:"วัดสิรินธรวรารามภูพร้าว",short:"วัดเรืองแสง", cat:"temple",  color:"#f59e0b",emoji:"🛕"},
  {id:"pha",    name:"ผาแต้ม",                  short:"ผาแต้ม",       cat:"nature",  color:"#34d399",emoji:"🏞️"},
  {id:"samphan",name:"สามพันโบก",               short:"สามพันโบก",   cat:"nature",  color:"#38bdf8",emoji:"🪨"},
  {id:"mekong", name:"แม่น้ำโขง",               short:"แม่น้ำโขง",   cat:"river",   color:"#06b6d4",emoji:"🌊"},
  {id:"chi",    name:"แม่น้ำชี",                short:"แม่น้ำชี",    cat:"river",   color:"#22d3ee",emoji:"💧"},
  {id:"mun",    name:"แม่น้ำมูล",               short:"แม่น้ำมูล",   cat:"river",   color:"#67e8f9",emoji:"🛶"},
  {id:"market", name:"ตลาดใหญ่อุบล",           short:"ตลาดใหญ่",    cat:"culture", color:"#f87171",emoji:"🏪"},
  {id:"festival",name:"ทุ่งศรีเมือง",           short:"แห่เทียน",    cat:"festival",color:"#fbbf24",emoji:"🕯️"},
  {id:"dam",    name:"เขื่อนสิรินธร",           short:"เขื่อน",       cat:"nature",  color:"#4ade80",emoji:"🏔️"},
  {id:"museum", name:"พิพิธภัณฑ์อุบล",         short:"พิพิธภัณฑ์",  cat:"history", color:"#fb923c",emoji:"🏛️"},
  {id:"fabric", name:"ผ้ากาบบัว",               short:"ผ้ากาบบัว",   cat:"culture", color:"#a78bfa",emoji:"🎨"},
  {id:"songsi", name:"แม่น้ำสองสี",             short:"สองสี",        cat:"nature",  color:"#60a5fa",emoji:"🎨"},
];
const FOODS = [
  {id:"guay",   name:"เกี่ยวจั๊บ",   emoji:"🍜",desc:"เส้นก๋วยจั๊บ น้ำซุปใสหอม",price:"45฿",color:"#f59e0b"},
  {id:"mooyoh", name:"หมูยอ",         emoji:"🥩",desc:"หมูยอสดหมักเครื่องเทศ",    price:"30฿",color:"#f87171"},
  {id:"plara",  name:"ปลาร้า",        emoji:"🐟",desc:"ปลาร้าหมักดองแบบโบราณ",    price:"20฿",color:"#34d399"},
  {id:"somtam", name:"ส้มตำ",         emoji:"🥗",desc:"รสเปรี้ยวเผ็ดจัด",          price:"35฿",color:"#a78bfa"},
  {id:"laab",   name:"ลาบอีสาน",      emoji:"🥘",desc:"ลาบหมู ข้าวคั่ว มะนาว",    price:"50฿",color:"#38bdf8"},
  {id:"rice",   name:"ข้าวเหนียว",    emoji:"🍚",desc:"ข้าวเหนียวนึ่งหอมนุ่ม",     price:"10฿",color:"#fbbf24"},
  {id:"gang",   name:"แกงอ่อม",       emoji:"🍲",desc:"แกงพื้นเมือง ผักหลายชนิด", price:"55฿",color:"#4ade80"},
  {id:"grilled",name:"ปลาเผา",        emoji:"🐠",desc:"ปลาสดจากโขง เผาไฟอ่อน",    price:"60฿",color:"#fb923c"},
  {id:"satay",  name:"หมูปิ้ง",       emoji:"🍢",desc:"หมูหมักปิ้งไฟอ่อน",         price:"25฿",color:"#60a5fa"},
  {id:"khaopun",name:"ข้าวปุ้น",      emoji:"🍝",desc:"เส้นกลม น้ำยาปลา",          price:"35฿",color:"#fbbf24"},
  {id:"bamboo", name:"หน่อไม้ดอง",    emoji:"🎋",desc:"ดองเปรี้ยว ปรุงรสสมุนไพร", price:"30฿",color:"#34d399"},
  {id:"namprik",name:"น้ำพริกปลาทู", emoji:"🌶️",desc:"น้ำพริกสูตรโบราณ",          price:"40฿",color:"#f87171"},
];
const TRADITIONS = [
  {id:"candle", name:"แห่เทียนพรรษา", emoji:"🕯️",color:"#fbbf24",month:"ก.ค."},
  {id:"boat",   name:"ไหลเรือไฟ",      emoji:"🛶", color:"#f87171",month:"ต.ค."},
  {id:"loykra", name:"ลอยกระทง",       emoji:"🪷", color:"#a78bfa",month:"พ.ย."},
  {id:"khaosal",name:"บุญข้าวสาก",     emoji:"🍱", color:"#34d399",month:"ก.ย."},
  {id:"songkran",name:"สงกรานต์",       emoji:"💦", color:"#38bdf8",month:"เม.ย."},
  {id:"bunkun", name:"บุญคูนลาน",      emoji:"🌾", color:"#f59e0b",month:"ม.ค."},
];
const STORIES = [
  {id:"naga",    title:"ตำนานพญานาคแห่งโขง",   char:{name:"พญานาค",emoji:"🐉",color:"#06b6d4"},accent:"#06b6d4",bg:"linear-gradient(135deg,#020c1b,#0a2040)",
    chapters:[{title:"กำเนิดพญานาค",text:"ณ ห้วงลึกแห่งแม่น้ำโขง มีพญานาคผู้ยิ่งใหญ่สถิตอยู่ มีพลังเหนือธรรมชาติ เกล็ดสีทองอร่ามราวแสงดวงอาทิตย์",scene:"🌊"},{title:"บั้งไฟพญานาค",text:"ทุกวันออกพรรษา ลูกไฟสีชมพูพุ่งขึ้นจากแม่น้ำโขงอย่างลึกลับ นั่นคือพลังพญานาคที่ยังคงดำรงอยู่",scene:"🔥"},{title:"ผู้พิทักษ์นิรันดร์",text:"ชาวอีสานเชื่อว่าพญานาคยังสถิตอยู่ในโขงจนถึงทุกวันนี้ ท่านคือสัญลักษณ์ความอุดมสมบูรณ์และความศักดิ์สิทธิ์",scene:"✨"}],
    reward:{xp:200,item:"เกราะพญานาค 🐉"}},
  {id:"phataem", title:"ผาแต้ม บันทึกแห่งกาลเวลา",char:{name:"ปู่ชีมน",emoji:"🧙",color:"#f59e0b"},accent:"#f59e0b",bg:"linear-gradient(135deg,#1a0a00,#3d1a00)",
    chapters:[{title:"มนุษย์ยุคดึกดำบรรพ์",text:"เมื่อ 3,000-4,000 ปีก่อน มนุษย์ยุคก่อนประวัติศาสตร์วาดภาพบนผาหินริมโขง บันทึกชีวิต การล่าสัตว์ และพิธีกรรม",scene:"🏔️"},{title:"ชมพระอาทิตย์ขึ้นลำดับแรก",text:"ผาแต้มเป็นจุดชมพระอาทิตย์ขึ้นลำดับแรกของไทย แสงสีทองสาดส่องผาหิน สวยราวภาพวาดของพระเจ้า",scene:"🌅"},{title:"มรดกโลก",text:"อุทยานแห่งชาติผาแต้มได้รับการขึ้นทะเบียนเป็นมรดกโลกทางธรรมชาติ นักท่องเที่ยวจากทั่วโลกมาเยือน",scene:"🌍"}],
    reward:{xp:180,item:"แผนที่โบราณ 🗺️"}},
  {id:"candle",  title:"กำเนิดแห่เทียนพรรษา",  char:{name:"นางสาวทิพย์",emoji:"💃",color:"#fbbf24"},accent:"#fbbf24",bg:"linear-gradient(135deg,#1a1000,#3d2a00)",
    chapters:[{title:"ต้นกำเนิด",text:"ในสมัยโบราณ ชาวอุบลนำเทียนถวายพระก่อนเข้าพรรษา พระสงฆ์มีแนวคิดแกะสลักเทียนให้สวยงาม เพื่อถวายเป็นพุทธบูชา",scene:"🕯️"},{title:"ขบวนแห่ยิ่งใหญ่",text:"ทุกปีเดือนกรกฎาคม ขบวนแห่เทียนพรรษาเดินผ่านใจกลางเมืองอุบล นางรำงดงาม ดนตรีพื้นเมือง แสงสีตระการตา",scene:"🎊"},{title:"มรดกแห่งอุบลฯ",text:"ประเพณีแห่เทียนอุบลได้รับการยกย่องว่าสวยงามที่สุดในประเทศไทย เป็นความภาคภูมิใจของชาวอุบลฯ",scene:"🏆"}],
    reward:{xp:200,item:"เทียนทอง 🕯️"}},
];
const MAIN_Q = [
  {id:"mq1",title:"นักสำรวจมือใหม่",  desc:"เยี่ยมชม 5 สถานที่",    xp:100,max:5, icon:"🗺️",color:"#38bdf8"},
  {id:"mq2",title:"ผู้รู้อุบลฯ",       desc:"คุย AI Guide 10 ครั้ง",  xp:150,max:10,icon:"📚",color:"#a78bfa"},
  {id:"mq3",title:"นักชิมตัวจริง",     desc:"ลองอาหาร 8 อย่าง",      xp:180,max:8, icon:"🍜",color:"#fb923c"},
  {id:"mq4",title:"ราชาประเพณี",       desc:"เข้าร่วมประเพณี 4 อย่าง",xp:250,max:4, icon:"🎭",color:"#fbbf24"},
  {id:"mq5",title:"นักอ่านตำนาน",      desc:"อ่านเรื่องราว 3 เรื่อง", xp:300,max:3, icon:"📖",color:"#f59e0b"},
  {id:"mq6",title:"ผู้เดินทางไกล",     desc:"เดินสะสม 300 ก้าว",      xp:200,max:300,icon:"👣",color:"#34d399"},
];
const DAILY_Q = [
  {id:"dq1",title:"นักสำรวจประจำวัน",desc:"วาร์ปไป 3 สถานที่",   xp:30,max:3,icon:"🗺️"},
  {id:"dq2",title:"นักชิมอีสาน",      desc:"ลองอาหาร 2 อย่าง",   xp:25,max:2,icon:"🍜"},
  {id:"dq3",title:"เพื่อน AI",         desc:"คุย AI Guide 3 ครั้ง",xp:20,max:3,icon:"🤖"},
  {id:"dq4",title:"นักกระโดด",         desc:"กระโดด 10 ครั้ง",     xp:15,max:10,icon:"⬆️"},
  {id:"dq5",title:"เรียนรู้ตำนาน",    desc:"อ่านเรื่อง 1 บท",     xp:35,max:1,icon:"📖"},
];
const GRAPHICS_PRESETS = {
  low:    { pixelRatio:0.75, shadows:false, trees:20,  buildings:40,  fog:0.012, label:"LOW 🟢",    desc:"สำหรับมือถือเก่า" },
  medium: { pixelRatio:1,    shadows:true,  trees:35,  buildings:70,  fog:0.010, label:"MEDIUM 🟡", desc:"แนะนำสำหรับมือถือ" },
  high:   { pixelRatio:2,    shadows:true,  trees:55,  buildings:100, fog:0.008, label:"HIGH 🔴",   desc:"สำหรับ PC สเปคสูง" },
};

// ═══════════════════════════════════════════ IOT
function useIoT() {
  const [sensors,setSensors]=useState(PLACES.map((p,i)=>({id:`esp32_${p.id}`,place:p.short,temp:parseFloat((28+i*0.7).toFixed(1)),hum:60+i*2,light:400+i*70,visitors:40+i*28,online:i!==6})));
  const [hist,setHist]=useState(()=>Array.from({length:20},(_,i)=>({t:i,temp:31+Math.sin(i*0.5)*2,hum:65+Math.cos(i*0.4)*8})));
  useEffect(()=>{const id=setInterval(()=>{setSensors(p=>p.map(s=>({...s,temp:parseFloat((s.temp+(Math.random()-0.5)*0.4).toFixed(1)),hum:Math.min(99,Math.max(30,Math.round(s.hum+(Math.random()-0.5)*2))),light:Math.max(0,Math.round(s.light+(Math.random()-0.5)*40)),visitors:Math.max(0,s.visitors+Math.round((Math.random()-0.3)*4))})));setHist(p=>{const l=p[p.length-1];return[...p.slice(-24),{t:l.t+1,temp:parseFloat((l.temp+(Math.random()-0.5)*0.5).toFixed(1)),hum:Math.min(99,Math.max(30,Math.round(l.hum+(Math.random()-0.5)*3)))}];});},2000);return()=>clearInterval(id);},[]);
  return {sensors,hist};
}
function Spark({data,color,h=45}){if(!data.length)return null;const w=200,mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1,pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*h}`).join(" ");return(<svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2"/><polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.12"/></svg>);}

// ═══════════════════════════════════════════ BUILD 3D AVATAR GROUP
function buildAvatarGroup(skinHex, hairHex, hairStyleIdx, bodyColorHex, scene) {
  const group = new THREE.Group();
  const skinC = parseInt(skinHex.replace("#","0x"));
  const hairC = parseInt(hairHex.replace("#","0x"));
  const bodyC = parseInt(bodyColorHex.replace("#","0x"));
  const skinMat = new THREE.MeshStandardMaterial({color:skinC});
  const hairMat = new THREE.MeshStandardMaterial({color:hairC});
  const bodyMat = new THREE.MeshStandardMaterial({color:bodyC, emissive:bodyC, emissiveIntensity:0.2});
  const eyeMat  = new THREE.MeshStandardMaterial({color:0x111111});
  const haloMat = new THREE.MeshStandardMaterial({color:bodyC, emissive:bodyC, emissiveIntensity:3});

  // HEAD
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38,16,16), skinMat);
  head.position.y = 1.68; head.castShadow = true; group.add(head);
  // EYES
  [-0.13,0.13].forEach(x=>{
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055,8,8), eyeMat);
    eye.position.set(x, 1.72, 0.34); group.add(eye);
  });
  // HAIR
  const hs = HAIR_STYLES[hairStyleIdx];
  if (hs.h > 0) {
    const hairGeo = hairStyleIdx===1 ? new THREE.CylinderGeometry(0.38,0.36,hs.h*1.5,10) :
                    hairStyleIdx===2 ? new THREE.SphereGeometry(0.42,8,8) :
                    hairStyleIdx===3 ? new THREE.SphereGeometry(0.22,8,8) :
                    new THREE.BoxGeometry(0.78,hs.h,0.78);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = hairStyleIdx===1 ? 2.1 : hairStyleIdx===3 ? 2.12 : 1.98;
    group.add(hair);
  }
  // NECK
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.14,0.18,8), skinMat);
  neck.position.y = 1.36; group.add(neck);
  // TORSO
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72,0.72,0.38), bodyMat);
  torso.position.y = 0.95; torso.castShadow = true; group.add(torso);
  // HIPS
  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.62,0.26,0.36), bodyMat);
  hips.position.y = 0.55; group.add(hips);
  // ARMS
  const armGeo = new THREE.CylinderGeometry(0.1,0.09,0.6,8);
  const armL = new THREE.Mesh(armGeo, bodyMat); armL.position.set(-0.46,0.95,0); armL.rotation.z=0.25; armL.castShadow=true; group.add(armL);
  const armR = new THREE.Mesh(armGeo, bodyMat); armR.position.set( 0.46,0.95,0); armR.rotation.z=-0.25; armR.castShadow=true; group.add(armR);
  // FOREARMS
  const faGeo = new THREE.CylinderGeometry(0.085,0.08,0.52,8);
  const faL = new THREE.Mesh(faGeo, skinMat); faL.position.set(-0.52,0.56,0); faL.rotation.z=0.15; group.add(faL);
  const faR = new THREE.Mesh(faGeo, skinMat); faR.position.set( 0.52,0.56,0); faR.rotation.z=-0.15; group.add(faR);
  // HANDS
  [-0.56,0.56].forEach(x=>{const h=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,8),skinMat);h.position.set(x,0.3,0);group.add(h);});
  // LEGS
  const legGeo = new THREE.CylinderGeometry(0.12,0.11,0.62,8);
  const legL = new THREE.Mesh(legGeo, bodyMat); legL.position.set(-0.18,0.12,0); legL.castShadow=true; group.add(legL);
  const legR = new THREE.Mesh(legGeo, bodyMat); legR.position.set( 0.18,0.12,0); legR.castShadow=true; group.add(legR);
  // SHINS
  const shinGeo = new THREE.CylinderGeometry(0.1,0.09,0.56,8);
  const shinL = new THREE.Mesh(shinGeo, skinMat); shinL.position.set(-0.18,-0.42,0); group.add(shinL);
  const shinR = new THREE.Mesh(shinGeo, skinMat); shinR.position.set( 0.18,-0.42,0); group.add(shinR);
  // FEET
  [-0.18,0.18].forEach(x=>{const f=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.1,0.28),new THREE.MeshStandardMaterial({color:0x222222}));f.position.set(x,-0.72,0.04);group.add(f);});
  // HALO
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.52,0.04,8,32),haloMat);
  halo.rotation.x=Math.PI/2; halo.position.y=2.2; group.add(halo);

  // Store refs for animation
  group.userData = { head,armL,armR,faL,faR,legL,legR,shinL,shinR,halo };
  return group;
}

// ═══════════════════════════════════════════ THREE.JS ENGINE
function buildScene({canvas, onPortal, festivalMode, flyMode, avatarConfig, graphics}) {
  const gfx = GRAPHICS_PRESETS[graphics] || GRAPHICS_PRESETS.medium;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  const renderer = new THREE.WebGLRenderer({canvas, antialias: graphics!=="low"});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, gfx.pixelRatio));
  renderer.shadowMap.enabled = gfx.shadows;
  if (gfx.shadows) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = flyMode?2.0:festivalMode?1.7:1.3;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(flyMode?0x030c1e:festivalMode?0x090400:0x020812);
  scene.fog = new THREE.FogExp2(scene.background.getHex(), gfx.fog);

  const camera = new THREE.PerspectiveCamera(65, W/H, 0.1, 500);
  scene.add(new THREE.AmbientLight(festivalMode?0x331100:0x112255, 1.3));
  const sun = new THREE.DirectionalLight(festivalMode?0xff8800:0xffeedd, 2.2);
  sun.position.set(30,60,20); sun.castShadow=gfx.shadows;
  sun.shadow.mapSize.set(gfx.shadows?2048:512, gfx.shadows?2048:512); scene.add(sun);

  // GROUND
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600,600,80,80),
    new THREE.MeshStandardMaterial({color:flyMode?0x0a1520:festivalMode?0x0c0400:0x040f1e, roughness:0.95}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  scene.add(new THREE.GridHelper(600,80,0x1a0d00,0x060e1a));

  // PATHS
  if (!flyMode) {
    const pm = new THREE.MeshStandardMaterial({color:0x1a2a3a,roughness:0.8});
    [[0,0,80,4],[0,0,4,80],[-18,0,4,45],[18,0,4,45],[0,0,55,3,Math.PI/4]].forEach(([x,y,w,l,r=0])=>{
      const p=new THREE.Mesh(new THREE.PlaneGeometry(w,l),pm);p.rotation.x=-Math.PI/2;p.rotation.z=r;p.position.set(x,0.01,y);scene.add(p);
    });
  }

  // RIVERS
  if (flyMode) {
    [[-45,0x0ea5e9,18,0],[5,0x22d3ee,10,Math.PI/6],[32,0x67e8f9,12,-Math.PI/8]].forEach(([x,c,w,rz])=>{
      const r=new THREE.Mesh(new THREE.PlaneGeometry(w,500),new THREE.MeshStandardMaterial({color:c,roughness:0.05,transparent:true,opacity:0.82}));
      r.rotation.x=-Math.PI/2;r.rotation.z=rz;r.position.set(x,0.15,0);scene.add(r);
      const l=new THREE.PointLight(c,3,50);l.position.set(x,5,0);scene.add(l);
    });
  }

  // TEMPLE
  const temple=new THREE.Group();
  const wm=new THREE.MeshStandardMaterial({color:0xf0f4ff,roughness:0.25,emissive:0x4466aa,emissiveIntensity:0.18});
  const gm=new THREE.MeshStandardMaterial({color:0xffd700,roughness:0.08,metalness:0.96,emissive:0xffaa00,emissiveIntensity:0.75});
  [8,6.5,5,3.5].forEach((s,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(s,1.6,s),wm);m.position.y=i*1.6+0.8;m.castShadow=gfx.shadows;temple.add(m);});
  const spire=new THREE.Mesh(new THREE.ConeGeometry(1.2,9.5,12),gm);spire.position.y=4*1.6+4.75;temple.add(spire);
  [-3,3].forEach(x=>[-3,3].forEach(z=>{const s=new THREE.Mesh(new THREE.ConeGeometry(0.28,2.5,8),gm);s.position.set(x,4*1.6+1.25,z);temple.add(s);}));
  [7,5.5].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.08,16,80),new THREE.MeshStandardMaterial({color:0x38bdf8,emissive:0x38bdf8,emissiveIntensity:2+i}));ring.rotation.x=Math.PI/2;ring.position.y=2.2;ring.userData.ri=i;temple.add(ring);});
  scene.add(temple);
  const tLight=new THREE.PointLight(0x38bdf8,4.5,30);tLight.position.set(0,10,0);scene.add(tLight);

  // PORTALS
  const pCols=[0xf59e0b,0xa78bfa,0x34d399,0xf87171,0x06b6d4,0x22d3ee,0x67e8f9,0x60a5fa,0xfbbf24,0x4ade80,0xfb923c,0x818cf8];
  const portals=PLACES.map(({name},i)=>{const g=new THREE.Group(),a=(i/PLACES.length)*Math.PI*2,c=pCols[i%pCols.length],R=flyMode?60:28;
    g.position.set(Math.cos(a)*R,0,Math.sin(a)*R);g.userData={name,isPortal:true};
    g.add(new THREE.Mesh(new THREE.TorusGeometry(2.8,0.15,16,80),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2.2})));
    g.add(new THREE.Mesh(new THREE.CircleGeometry(2.7,32),new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:0.13,side:THREE.DoubleSide})));
    const pl=new THREE.PointLight(c,2.8,14);g.add(pl);scene.add(g);return{group:g,light:pl};});

  // STARS
  const sp=new Float32Array(5000*3);for(let i=0;i<sp.length;i++)sp[i]=(Math.random()-0.5)*700;
  const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));
  scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:0.5,transparent:true,opacity:0.88})));

  // FIREFLIES
  const FFN=150,fp=new Float32Array(FFN*3);
  for(let i=0;i<FFN;i++){fp[i*3]=(Math.random()-0.5)*120;fp[i*3+1]=Math.random()*16+1;fp[i*3+2]=(Math.random()-0.5)*120;}
  const fg=new THREE.BufferGeometry();fg.setAttribute("position",new THREE.BufferAttribute(fp,3));
  scene.add(new THREE.Points(fg,new THREE.PointsMaterial({color:festivalMode?0xff9900:0xffd700,size:0.7,transparent:true,opacity:1})));

  // FESTIVAL
  const fElems=[];
  if(festivalMode){
    for(let i=0;i<36;i++){const a=(i/36)*Math.PI*2,r=14+(i%3)*2,g=new THREE.Group();g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);
      const b=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,2.8,8),new THREE.MeshStandardMaterial({color:0xfffde7}));b.position.y=1.4;g.add(b);
      const f=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,8),new THREE.MeshStandardMaterial({color:0xff6600,emissive:0xff4400,emissiveIntensity:5,transparent:true,opacity:0.92}));f.position.y=2.9;g.add(f);
      const fl=new THREE.PointLight(0xff8800,1.4,7);fl.position.y=2.9;g.add(fl);scene.add(g);fElems.push({f,fl,ph:Math.random()*Math.PI*2});}
    for(let i=0;i<25;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.38,8,8),new THREE.MeshStandardMaterial({color:0xff9900,emissive:0xff6600,emissiveIntensity:3.5,transparent:true,opacity:0.88}));l.position.set((Math.random()-0.5)*90,8+Math.random()*22,(Math.random()-0.5)*90);l.userData={by:l.position.y,ph:Math.random()*Math.PI*2,hs:(Math.random()-0.5)*0.016};scene.add(l);fElems.push({l,isL:true});}
  }

  // TREES
  if (!flyMode) {
    for(let i=0;i<gfx.trees;i++){const a=Math.random()*Math.PI*2,d=Math.random()*40+15;
      const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.3,2.5,8),new THREE.MeshStandardMaterial({color:0x4a2c0a}));tr.position.set(Math.cos(a)*d,1.25,Math.sin(a)*d);scene.add(tr);
      const fo=new THREE.Mesh(new THREE.SphereGeometry(1.4+Math.random()*0.5,8,8),new THREE.MeshStandardMaterial({color:0x0d4a0a,roughness:0.9}));fo.position.set(Math.cos(a)*d,3.5+Math.random(),Math.sin(a)*d);fo.castShadow=gfx.shadows;scene.add(fo);}
  }
  // BUILDINGS
  for(let i=0;i<gfx.buildings;i++){const a=Math.random()*Math.PI*2,d=Math.random()*80+45,h=Math.random()*14+2,w=Math.random()*2.8+1;
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({color:[0x0a1f3d,0x0d2a4a,0x091828,0x122a44][i%4],roughness:0.8}));
    m.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);m.castShadow=gfx.shadows;scene.add(m);}

  // ── PLAYER AVATAR (full 3D)
  const playerGroup = buildAvatarGroup(
    avatarConfig?.skin||"#d4956a",
    avatarConfig?.hairCol||"#1a0a00",
    avatarConfig?.hair||0,
    avatarConfig?.outfit?.color||"#38bdf8",
    scene
  );
  if (flyMode) {
    const wm2=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.7,transparent:true,opacity:0.85,side:THREE.DoubleSide});
    const wL=new THREE.Mesh(new THREE.ConeGeometry(0,4.5,3),wm2);wL.rotation.z=-Math.PI/2.2;wL.position.set(-2.8,0.6,0);playerGroup.add(wL);
    const wR=new THREE.Mesh(new THREE.ConeGeometry(0,4.5,3),wm2);wR.rotation.z=Math.PI/2.2;wR.position.set(2.8,0.6,0);playerGroup.add(wR);
    playerGroup.userData.wingL=wL; playerGroup.userData.wingR=wR;
  }
  playerGroup.position.set(0, flyMode?35:0, 0); scene.add(playerGroup);
  const pLight=new THREE.PointLight(parseInt((avatarConfig?.outfit?.color||"#38bdf8").replace("#","0x")),2.5,10); scene.add(pLight);

  // NPC WALKERS
  const npcs=[0xff6b6b,0x4ecdc4,0xffe66d,0xa8e6cf,0xf8a5c2].map((c,i)=>{
    const g=new THREE.Group();
    const b=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,1.4,8),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.3}));
    const hd=new THREE.Mesh(new THREE.SphereGeometry(0.4,12,12),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.4}));hd.position.y=1.3;
    const hl=new THREE.Mesh(new THREE.TorusGeometry(0.52,0.04,8,30),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:3}));hl.rotation.x=Math.PI/2;hl.position.y=1.9;
    g.add(b,hd,hl);g.userData={angle:(i/5)*Math.PI*2,radius:flyMode?22+i*5:12+i*4,speed:0.16+i*0.04};g.position.y=flyMode?30:0.7;scene.add(g);return g;});

  // ── CAMERA STATE (Third-person free look)
  let camYaw=0, camPitch=0.4, camDist=flyMode?16:8;
  let isDrag=false, prev={x:0,y:0};
  const onMD=e=>{isDrag=true;prev={x:e.clientX,y:e.clientY};};
  const onMU=()=>{isDrag=false;};
  const onMM=e=>{if(!isDrag)return;camYaw-=(e.clientX-prev.x)*0.005;camPitch=Math.max(0.05,Math.min(1.4,camPitch+(e.clientY-prev.y)*0.005));prev={x:e.clientX,y:e.clientY};};
  const onWH=e=>{camDist=Math.max(3,Math.min(flyMode?80:30,camDist+e.deltaY*0.03));};
  canvas.addEventListener("mousedown",onMD);canvas.addEventListener("mouseup",onMU);canvas.addEventListener("mousemove",onMM);canvas.addEventListener("wheel",onWH);
  // TOUCH for camera rotate
  let tPrev=null;
  const onTS=e=>{if(e.touches.length===2){tPrev={x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2};}};
  const onTM=e=>{if(e.touches.length===2&&tPrev){const cx=(e.touches[0].clientX+e.touches[1].clientX)/2,cy=(e.touches[0].clientY+e.touches[1].clientY)/2;camYaw-=(cx-tPrev.x)*0.005;camPitch=Math.max(0.05,Math.min(1.4,camPitch+(cy-tPrev.y)*0.005));tPrev={x:cx,y:cy};}};
  canvas.addEventListener("touchstart",onTS,{passive:true});canvas.addEventListener("touchmove",onTM,{passive:true});

  // PORTAL CLICK
  const ray=new THREE.Raycaster(),m2=new THREE.Vector2();
  canvas.addEventListener("click",e=>{const rect=canvas.getBoundingClientRect();m2.x=((e.clientX-rect.left)/rect.width)*2-1;m2.y=-((e.clientY-rect.top)/rect.height)*2+1;ray.setFromCamera(m2,camera);for(const hit of ray.intersectObjects(scene.children,true)){let obj=hit.object;while(obj.parent&&!obj.userData.isPortal)obj=obj.parent;if(obj.userData.isPortal){onPortal(obj.userData.name);break;}}});

  const clock=new THREE.Clock();let animId;
  const tRings=temple.children.filter(c=>c.userData.ri!==undefined);
  // State shared with React
  const state={pos:{x:0,z:0},velY:0,onGround:true,isMoving:false,yaw:0,jumpCount:0};

  function animate(){
    animId=requestAnimationFrame(animate);const t=clock.getElapsedTime(),dt=Math.min(clock.getDelta(),0.05);
    // Temple
    tRings.forEach((r,i)=>{r.rotation.z=t*(0.4+i*0.3);});spire.rotation.y=t*0.5;tLight.intensity=3.5+Math.sin(t*1.5)*0.9;
    // Portals
    portals.forEach(({group,light},i)=>{group.rotation.y=t*(0.25+i*0.04);group.position.y=Math.sin(t*0.5+i*1.1)*0.6+(flyMode?3.5:3);light.intensity=2.2+Math.sin(t*1.8+i)*0.7;});
    // Festival
    fElems.forEach(e=>{if(e.isL){e.l.position.y=e.l.userData.by+Math.sin(t*0.3+e.l.userData.ph)*1.6;e.l.position.x+=e.l.userData.hs;if(Math.abs(e.l.position.x)>55)e.l.userData.hs*=-1;}else if(e.f){e.f.scale.setScalar(1+Math.sin(t*8+e.ph)*0.14);e.fl.intensity=1.4+Math.sin(t*7+e.ph)*0.45;}});
    // Fireflies
    const ff=fg.attributes.position.array;for(let i=0;i<FFN;i++){ff[i*3]+=Math.sin(t*0.3+i*0.7)*0.04;ff[i*3+1]=Math.sin(t*0.4+i*0.5)*(flyMode?10:5)+(flyMode?15:5);ff[i*3+2]+=Math.cos(t*0.3+i*0.6)*0.04;}fg.attributes.position.needsUpdate=true;
    // NPCs
    npcs.forEach(p=>{p.userData.angle+=p.userData.speed*0.01;p.position.x=Math.cos(p.userData.angle)*p.userData.radius;p.position.z=Math.sin(p.userData.angle)*p.userData.radius;p.rotation.y=-p.userData.angle+Math.PI/2;p.position.y=flyMode?30:0.7;});

    // ── PHYSICS (gravity + jump)
    const GRAVITY=-22, JUMP_FORCE=9.5, GROUND_Y=0;
    if (!flyMode) {
      if (!state.onGround) state.velY+=GRAVITY*dt;
      const newY=playerGroup.position.y+state.velY*dt;
      if(newY<=GROUND_Y){playerGroup.position.y=GROUND_Y;state.velY=0;state.onGround=true;}else{playerGroup.position.y=newY;state.onGround=false;}
    } else {
      playerGroup.position.y=35+Math.sin(t*1.2)*1.5;
    }

    // ── PLAYER MOVEMENT (camera-relative)
    playerGroup.position.x+=(state.pos.x-playerGroup.position.x)*0.2;
    playerGroup.position.z+=(state.pos.z-playerGroup.position.z)*0.2;
    playerGroup.rotation.y=state.yaw;

    // ── AVATAR ANIMATION
    const ud=playerGroup.userData;
    if(state.isMoving){
      if(ud.legL){ud.legL.rotation.x=Math.sin(t*7)*0.5;ud.legR.rotation.x=Math.sin(t*7+Math.PI)*0.5;}
      if(ud.shinL){ud.shinL.rotation.x=Math.max(0,Math.sin(t*7+0.5))*0.4;ud.shinR.rotation.x=Math.max(0,Math.sin(t*7+Math.PI+0.5))*0.4;}
      if(ud.armL){ud.armL.rotation.x=Math.sin(t*7+Math.PI)*0.4;ud.armR.rotation.x=Math.sin(t*7)*0.4;}
    } else {
      if(ud.legL){ud.legL.rotation.x=0;ud.legR.rotation.x=0;}
      if(ud.armL){ud.armL.rotation.x=0;ud.armR.rotation.x=0;}
    }
    if(!state.onGround&&!flyMode){if(ud.legL){ud.legL.rotation.x=-0.5;ud.legR.rotation.x=0.4;}if(ud.armL){ud.armL.rotation.x=-0.6;ud.armR.rotation.x=-0.6;}}
    if(flyMode&&ud.wingL){ud.wingL.rotation.z=-(Math.PI/2.2+Math.sin(t*4)*0.35);ud.wingR.rotation.z=Math.PI/2.2+Math.sin(t*4)*0.35;}
    if(ud.halo) ud.halo.rotation.z=t*0.8;
    pLight.position.copy(playerGroup.position);pLight.position.y+=2;

    // ── CAMERA FOLLOW (third-person)
    const camTarget=new THREE.Vector3(playerGroup.position.x,playerGroup.position.y+(flyMode?2:1.2),playerGroup.position.z);
    const cx=camTarget.x+Math.sin(camYaw)*Math.sin(camPitch)*camDist;
    const cy=camTarget.y+Math.cos(camPitch)*camDist;
    const cz=camTarget.z+Math.cos(camYaw)*Math.sin(camPitch)*camDist;
    camera.position.lerp(new THREE.Vector3(cx,Math.max(flyMode?8:0.5,cy),cz),0.12);
    camera.lookAt(camTarget);
    renderer.render(scene,camera);
  }
  animate();
  const onResize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  window.addEventListener("resize",onResize);

  return {
    dispose:()=>{cancelAnimationFrame(animId);["mousedown","mouseup","mousemove","wheel"].forEach(ev=>canvas.removeEventListener(ev,ev==="mousedown"?onMD:ev==="mouseup"?onMU:ev==="mousemove"?onMM:onWH));window.removeEventListener("resize",onResize);renderer.dispose();},
    jump:()=>{if(state.onGround&&!flyMode){state.velY=JUMP_FORCE;state.onGround=false;state.jumpCount++;}},
    getJumpCount:()=>state.jumpCount,
    move:(dx,dz,isMoving)=>{
      const SPEED=flyMode?0.28:0.14;
      const fwd=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw)).multiplyScalar(-dz*SPEED);
      const right=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw)).multiplyScalar(dx*SPEED);
      state.pos.x+=fwd.x+right.x; state.pos.z+=fwd.z+right.z;
      if(dx!==0||dz!==0) state.yaw=Math.atan2(fwd.x+right.x,fwd.z+right.z);
      state.isMoving=isMoving;
    },
    getCamYaw:()=>camYaw,
  };
}

// ═══════════════════════════════════════════ LOGIN SCREEN
function LoginScreen({onStart}){
  const [a,setA]=useState(false);
  useEffect(()=>{setTimeout(()=>setA(true),100);},[]);
  return(
    <div style={{height:"100vh",background:"#010812",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <style>{`@keyframes lgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes lgRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}@keyframes lgGlow{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes lgSlide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes lgPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}@keyframes lgSpin{to{transform:rotate(360deg)}}`}</style>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {Array.from({length:80}).map((_,i)=><div key={i} style={{position:"absolute",width:i%5===0?3:1.5,height:i%5===0?3:1.5,borderRadius:"50%",background:i%7===0?"#f59e0b":i%5===0?"#38bdf8":"white",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.5+0.15,animation:`lgPulse ${Math.random()*4+2}s ${Math.random()*3}s infinite`}}/>)}
        {[0,1,2,3].map(i=><div key={`o${i}`} style={{position:"absolute",width:80+i*40,height:80+i*40,borderRadius:"50%",background:`radial-gradient(circle,${["#f59e0b","#38bdf8","#a78bfa","#34d399"][i]}11,transparent 70%)`,top:`${[20,60,30,70][i]}%`,left:`${[15,70,45,25][i]}%`,animation:`lgFloat ${5+i*2}s ${i}s ease-in-out infinite`}}/>)}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:200,overflow:"hidden"}}>
          <svg viewBox="0 0 800 200" style={{width:"100%",height:"100%"}} preserveAspectRatio="none">
            <polygon points="360,200 360,70 380,50 400,10 420,50 440,70 440,200" fill="#0a1628" opacity="0.9"/>
            {[[50,175],[90,155],[130,135],[170,165],[480,160],[530,140],[570,165],[620,148],[670,172],[720,152],[760,178]].map(([x,y],i)=><rect key={i} x={x} y={y} width={25+i%3*10} height={200-y} fill="#060f1c"/>)}
            <rect x="0" y="185" width="800" height="15" fill="#06b6d408"/>
          </svg>
        </div>
      </div>
      <div style={{position:"relative",zIndex:10,textAlign:"center",opacity:a?1:0,transition:"opacity 1s ease"}}>
        <div style={{position:"relative",width:160,height:160,margin:"0 auto 24px"}}>
          {[160,130,100].map((s,i)=><div key={i} style={{position:"absolute",top:"50%",left:"50%",width:s,height:s,marginLeft:-s/2,marginTop:-s/2,borderRadius:"50%",border:`1.5px solid ${["#f59e0b","#38bdf8","#a78bfa"][i]}`,opacity:0.35+i*0.15,animation:`lgRing ${3+i*0.8}s ${i*0.4}s ease-out infinite`}}/>)}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#0d2040,#1a0a3d)",border:"2px solid #38bdf844",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,animation:"lgGlow 3s ease-in-out infinite",boxShadow:"0 0 40px #38bdf833"}}>🌏</div>
        </div>
        <div style={{marginBottom:6,animation:"lgSlide 0.8s 0.3s ease both"}}>
          <div style={{fontSize:11,letterSpacing:6,color:"#38bdf8",fontWeight:700,marginBottom:4}}>META WORLD</div>
          <div style={{fontSize:26,fontWeight:900,background:"linear-gradient(135deg,#fbbf24,#f59e0b,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>UBON RATCHATHANI</div>
          <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginTop:4}}>อุบลราชธานี เมต้าเวิร์ด</div>
        </div>
        <div style={{color:"#64748b",fontSize:11,marginBottom:28,lineHeight:1.9,animation:"lgSlide 0.8s 0.5s ease both"}}>
          เมืองดอกบัวงาม แม่น้ำสามสาย งามวิไล หลายวัฒนธรรม
        </div>
        <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:28,flexWrap:"wrap",animation:"lgSlide 0.8s 0.6s ease both"}}>
          {[["🌏","โลก 3D"],["🏃","Physics"],["📱","Mobile"],["🤖","AI Guide"],["📖","เรื่องราว"],["⚙️","Graphics"]].map(([e,l],i)=><div key={i} style={{background:"#0d1f35",border:"1px solid #1e3a5a",borderRadius:20,padding:"4px 10px",display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:11}}>{e}</span><span style={{color:"#64748b",fontSize:9}}>{l}</span></div>)}
        </div>
        <div style={{animation:"lgSlide 0.8s 0.8s ease both"}}>
          <button onClick={onStart} style={{background:"linear-gradient(135deg,#1d4ed8,#38bdf8)",border:"none",borderRadius:14,color:"white",padding:"16px 48px",fontSize:16,fontWeight:900,cursor:"pointer",letterSpacing:1,boxShadow:"0 0 30px #38bdf833",position:"relative",overflow:"hidden",marginBottom:10}}>
            <span style={{position:"relative",zIndex:1}}>⚔️ เข้าสู่โลกเสมือน</span>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)",animation:"lgSpin 3s linear infinite"}}/>
          </button>
          <div style={{color:"#334155",fontSize:9}}>v7.0 MMORPG Edition · Senior Project · CPAI Year 4</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════ AVATAR CREATOR
function AvatarCreator({onComplete}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [outfit,setOutfit]=useState(0);
  const [skin,setSkin]=useState("#d4956a");
  const [hair,setHair]=useState(0);
  const [hairCol,setHairCol]=useState("#1a0a00");
  const [eye,setEye]=useState("#4a2c0a");
  const o=OUTFITS[outfit];
  const steps=["ชื่อ","ชุด","ผิว/ผม","ตา"];
  return(
    <div style={{height:"100vh",background:"linear-gradient(135deg,#010812,#0a1628)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <style>{`@keyframes avUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes avPul{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden"}}>{Array.from({length:40}).map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",background:"white",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.4,animation:`avPul ${Math.random()*3+2}s infinite`}}/>)}</div>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:460}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:36,marginBottom:4}}>🌏</div>
          <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#f59e0b,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>สร้างอวาตาร์ 3D ของคุณ</div>
          <div style={{color:"#475569",fontSize:10,marginTop:2}}>Meta World Ubon · MMORPG Edition</div>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:14,justifyContent:"center"}}>{steps.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:22,height:22,borderRadius:"50%",background:step>=i?"#38bdf8":"#1e293b",border:`2px solid ${step>=i?"#38bdf8":"#334155"}`,color:step>=i?"#fff":"#475569",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{step>i?"✓":i+1}</div><span style={{color:step>=i?"#38bdf8":"#475569",fontSize:9}}>{s}</span>{i<3&&<div style={{width:8,height:1,background:step>i?"#38bdf8":"#1e293b"}}/>}</div>)}</div>
        {/* LIVE 3D PREVIEW */}
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:6}}>
            {/* Body preview */}
            <div style={{width:70,height:130,position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
              {/* Hair */}
              {HAIR_STYLES[hair].h>0&&<div style={{width:46,height:HAIR_STYLES[hair].id==="long"?30:20,borderRadius:HAIR_STYLES[hair].id==="bun"?"50%":"8px 8px 0 0",background:hairCol,marginBottom:-4,zIndex:2}}/>}
              {/* Head */}
              <div style={{width:44,height:44,borderRadius:"50%",background:skin,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:`0 0 20px ${o.color}55`,border:`2px solid ${o.color}66`}}>
                <div style={{display:"flex",gap:10,position:"absolute",top:14}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:eye}}/>
                  <div style={{width:7,height:7,borderRadius:"50%",background:eye}}/>
                </div>
              </div>
              {/* Neck */}
              <div style={{width:14,height:10,background:skin,marginTop:-2}}/>
              {/* Torso */}
              <div style={{width:50,height:38,borderRadius:6,background:o.color,position:"relative",display:"flex",justifyContent:"center",alignItems:"flex-start",paddingTop:4}}>
                <span style={{fontSize:16}}>{o.emoji}</span>
                {/* Arms */}
                <div style={{position:"absolute",left:-12,top:4,width:10,height:28,borderRadius:5,background:o.color}}/>
                <div style={{position:"absolute",right:-12,top:4,width:10,height:28,borderRadius:5,background:o.color}}/>
              </div>
              {/* Hips */}
              <div style={{width:42,height:16,borderRadius:4,background:o.color,opacity:0.85}}/>
              {/* Legs */}
              <div style={{display:"flex",gap:4}}>
                <div style={{width:12,height:24,borderRadius:4,background:skin}}/>
                <div style={{width:12,height:24,borderRadius:4,background:skin}}/>
              </div>
            </div>
            <div style={{color:o.color,fontWeight:700,fontSize:12}}>{name||"ชื่อของคุณ"}</div>
            <div style={{color:"#64748b",fontSize:10}}>{o.desc}</div>
          </div>
        </div>
        {step===0&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:12,marginBottom:10}}>ตั้งชื่อในโลกเสมือนจริง</p>
          <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(1)} placeholder="เช่น นักรบอุบล, สาวโขงเจียม..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:13,outline:"none",marginBottom:10}}/>
          <button onClick={()=>name.trim()&&setStep(1)} style={{width:"100%",background:name.trim()?"linear-gradient(135deg,#1d4ed8,#38bdf8)":"#1e293b",border:"none",borderRadius:8,color:name.trim()?"white":"#475569",padding:"10px",fontSize:13,fontWeight:700,cursor:name.trim()?"pointer":"default"}}>ถัดไป →</button>
        </div>}
        {step===1&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:12,marginBottom:10}}>เลือกชุดอวาตาร์</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
            {OUTFITS.map((a,i)=><div key={a.id} onClick={()=>setOutfit(i)} style={{background:outfit===i?a.color+"20":"#1e293b",border:`2px solid ${outfit===i?a.color:"#334155"}`,borderRadius:9,padding:"10px 6px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:3}}>{a.emoji}</div>
              <div style={{color:outfit===i?a.color:"#94a3b8",fontWeight:700,fontSize:10}}>{a.label}</div>
            </div>)}
          </div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(0)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"9px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>setStep(2)} style={{flex:2,background:"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:8,color:"white",padding:"9px",fontSize:11,fontWeight:700,cursor:"pointer"}}>ถัดไป →</button></div>
        </div>}
        {step===2&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>สีผิว</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>{SKIN_COLORS.map(c=><div key={c} onClick={()=>setSkin(c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:`3px solid ${skin===c?"#38bdf8":"transparent"}`,cursor:"pointer"}}/>)}</div>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>ทรงผม</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{HAIR_STYLES.map((h,i)=><div key={h.id} onClick={()=>setHair(i)} style={{background:hair===i?"#1d4ed820":"#1e293b",border:`2px solid ${hair===i?"#38bdf8":"#334155"}`,borderRadius:7,padding:"5px 8px",cursor:"pointer",display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:12}}>{h.e}</span><span style={{color:hair===i?"#38bdf8":"#94a3b8",fontSize:9}}>{h.l}</span></div>)}</div>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>สีผม</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>{HAIR_COLORS.map(c=><div key={c} onClick={()=>setHairCol(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:`3px solid ${hairCol===c?"#a78bfa":"transparent"}`,cursor:"pointer",boxShadow:c==="#000"?"0 0 0 1px #334155":"none"}}/>)}</div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(1)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"8px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>setStep(3)} style={{flex:2,background:"linear-gradient(135deg,#34d399,#06b6d4)",border:"none",borderRadius:8,color:"white",padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>ถัดไป →</button></div>
        </div>}
        {step===3&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:9}}>สีตา</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{EYE_COLORS.map(c=><div key={c} onClick={()=>setEye(c)} style={{width:32,height:32,borderRadius:"50%",background:c,border:`3px solid ${eye===c?"#fbbf24":"transparent"}`,cursor:"pointer",boxShadow:eye===c?`0 0 10px ${c}88`:"none"}}/>)}</div>
          <div style={{background:"#1e293b",borderRadius:8,padding:11,marginBottom:12}}>
            {[["ชื่อ",name],["ชุด",o.label],["ผม",HAIR_STYLES[hair].l]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#64748b",fontSize:9}}>{k}</span><span style={{color:"#e2e8f0",fontSize:9}}>{v}</span></div>)}
          </div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(2)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"8px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>onComplete({name,outfit:o,skin,hair,hairCol,eye})} style={{flex:2,background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:8,color:"white",padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>🚀 เข้าสู่โลกเสมือน!</button></div>
        </div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════ WORLD VIEW (Physics + Joystick + Graphics)
function WorldView({avatar, festivalMode, flyMode, onPortal, onSteps, onJump, graphics}){
  const canvasRef=useRef(null), engineRef=useRef(null);
  const keysRef=useRef({}), onPortalRef=useRef(onPortal);
  const stepsRef=useRef(0), stepAccRef=useRef(0);
  const joystickRef=useRef({dx:0,dz:0,active:false});
  const isMobile=useRef("ontouchstart" in window);
  useEffect(()=>{onPortalRef.current=onPortal;},[onPortal]);

  // ── KEYBOARD
  useEffect(()=>{
    const kd=e=>{keysRef.current[e.code]=true;["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)&&e.preventDefault();if(e.code==="Space")engineRef.current?.jump();};
    const ku=e=>{keysRef.current[e.code]=false;};
    window.addEventListener("keydown",kd); window.addEventListener("keyup",ku);
    return()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku);};
  },[]);

  // ── MOVEMENT LOOP
  useEffect(()=>{
    let raf;
    const loop=()=>{
      raf=requestAnimationFrame(loop);
      const k=keysRef.current;
      const jx=joystickRef.current.dx, jz=joystickRef.current.dz;
      let dx=0,dz=0;
      if(k["KeyA"]||k["ArrowLeft"]) dx-=1;
      if(k["KeyD"]||k["ArrowRight"]) dx+=1;
      if(k["KeyW"]||k["ArrowUp"]) dz+=1;
      if(k["KeyS"]||k["ArrowDown"]) dz-=1;
      dx+=jx; dz+=jz;
      const moving=dx!==0||dz!==0;
      engineRef.current?.move(dx,dz,moving);
      if(moving){stepAccRef.current+=0.18;if(stepAccRef.current>1){stepsRef.current++;stepAccRef.current=0;onSteps(stepsRef.current);}}
    };
    loop(); return()=>cancelAnimationFrame(raf);
  },[flyMode,onSteps]);

  // ── BUILD SCENE
  useEffect(()=>{
    if(!canvasRef.current) return;
    const eng=buildScene({canvas:canvasRef.current,onPortal:n=>onPortalRef.current(n),festivalMode,flyMode,avatarConfig:avatar,graphics});
    engineRef.current=eng; return()=>eng.dispose();
  },[festivalMode,flyMode,graphics]);

  // ── JOYSTICK STATE
  const jsBaseRef=useRef(null), jsKnobRef=useRef(null);
  const handleTouchStart=useCallback(e=>{
    if(e.target.closest("[data-joy]")){return;}
    const t=e.touches[0];
    jsBaseRef.current={x:t.clientX,y:t.clientY};
    joystickRef.current={dx:0,dz:0,active:true};
  },[]);
  const handleTouchMove=useCallback(e=>{
    if(!jsBaseRef.current) return;
    const t=e.touches[0], base=jsBaseRef.current;
    const dx=t.clientX-base.x, dy=t.clientY-base.y;
    const dist=Math.sqrt(dx*dx+dy*dy), maxR=55;
    const nx=dx/Math.max(dist,1), ny=dy/Math.max(dist,1);
    const ratio=Math.min(dist/maxR,1);
    joystickRef.current={dx:nx*ratio, dz:-ny*ratio, active:true};
    if(jsKnobRef.current){jsKnobRef.current.style.transform=`translate(${nx*ratio*maxR*0.7}px,${ny*ratio*maxR*0.7}px)`;}
  },[]);
  const handleTouchEnd=useCallback(()=>{
    jsBaseRef.current=null; joystickRef.current={dx:0,dz:0,active:false};
    if(jsKnobRef.current) jsKnobRef.current.style.transform="translate(0,0)";
  },[]);

  const gfx=GRAPHICS_PRESETS[graphics]||GRAPHICS_PRESETS.medium;
  return(
    <div style={{position:"relative",width:"100%",height:"100%"}} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",cursor:"grab"}} tabIndex={0}/>
      {/* HUD */}
      <div style={{position:"absolute",top:10,left:10,display:"flex",flexDirection:"column",gap:4,pointerEvents:"none"}}>
        {flyMode?<div style={{background:"#06b6d420",border:"1px solid #06b6d466",color:"#06b6d4",borderRadius:7,padding:"4px 10px",fontSize:10,fontWeight:700}}>🦅 ปีกบิน — ชมแม่น้ำ 3 สาย</div>:<div style={{background:"#38bdf818",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:7,padding:"4px 10px",fontSize:10,fontWeight:700}}>🌏 Meta World อุบลราชธานี</div>}
        <div style={{background:"#34d39918",border:"1px solid #34d39944",color:"#34d399",borderRadius:7,padding:"3px 10px",fontSize:9}}>👥 Online: 5</div>
        {festivalMode&&<div style={{background:"#fbbf2418",border:"1px solid #fbbf2466",color:"#fbbf24",borderRadius:7,padding:"3px 10px",fontSize:9}}>🕯️ แห่เทียนพรรษา</div>}
        <div style={{background:"#1e293b88",borderRadius:6,padding:"3px 8px",fontSize:8,color:"#475569"}}>⚙️ {gfx.label}</div>
      </div>
      {/* Avatar Badge */}
      {avatar&&<div style={{position:"absolute",top:10,right:10,background:avatar.outfit.color+"18",border:`1px solid ${avatar.outfit.color}44`,borderRadius:8,padding:"6px 11px",display:"flex",gap:7,alignItems:"center",pointerEvents:"none"}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:avatar.skin,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,border:`2px solid ${avatar.outfit.color}`}}>{avatar.outfit.emoji}</div>
        <div><div style={{color:avatar.outfit.color,fontWeight:700,fontSize:11}}>{avatar.name}</div><div style={{color:"#64748b",fontSize:9}}>{avatar.outfit.label}</div></div>
      </div>}
      {/* PORTAL SHORTCUTS */}
      <div style={{position:"absolute",bottom:isMobile.current?120:50,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",maxWidth:"88%",pointerEvents:"auto"}}>
        {PLACES.slice(0,6).map(p=><button key={p.id} onClick={()=>onPortal(p.name)} style={{background:p.color+"22",border:`1px solid ${p.color}55`,color:p.color,borderRadius:6,padding:"3px 7px",fontSize:9,cursor:"pointer",fontWeight:600}}>{p.emoji} {p.short}</button>)}
      </div>
      {/* PC CONTROLS HINT */}
      {!isMobile.current&&<div style={{position:"absolute",bottom:10,right:10,background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:"8px 12px",pointerEvents:"none"}}>
        <div style={{color:"#475569",fontSize:8,fontWeight:700,marginBottom:4}}>🎮 CONTROLS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 8px"}}>
          {[["WASD/↑↓←→","เดิน"],["Space","กระโดด"],["🖱️ ลาก","กล้อง"],["Scroll","ซูม"]].map(([k,v],i)=><div key={i} style={{display:"flex",gap:3,alignItems:"center"}}><span style={{background:"#1e293b",borderRadius:2,padding:"1px 4px",color:"#38bdf8",fontSize:7,fontFamily:"monospace"}}>{k}</span><span style={{color:"#475569",fontSize:7}}>{v}</span></div>)}
        </div>
      </div>}
      {/* MOBILE JOYSTICK + JUMP */}
      {isMobile.current&&<>
        {/* Virtual Joystick */}
        <div data-joy="1" style={{position:"absolute",bottom:24,left:24,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",touchAction:"none"}}
          onTouchStart={e=>{e.stopPropagation();jsBaseRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
          onTouchMove={e=>{e.stopPropagation();handleTouchMove(e);}}
          onTouchEnd={e=>{e.stopPropagation();handleTouchEnd();}}>
          <div ref={jsKnobRef} style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#38bdf8,#1d4ed8)",boxShadow:"0 0 15px #38bdf866",transition:"transform 0.05s",willChange:"transform"}}/>
        </div>
        {/* Jump + Action buttons */}
        <div style={{position:"absolute",bottom:24,right:20,display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
          <button onTouchStart={e=>{e.stopPropagation();engineRef.current?.jump();onJump&&onJump();}} style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#34d399,#06b6d4)",border:"2px solid #34d39966",color:"white",fontSize:20,fontWeight:900,cursor:"pointer",boxShadow:"0 0 18px #34d39944"}}>⬆</button>
          <button onTouchStart={e=>{e.stopPropagation();onPortal("ทุ่งศรีเมือง");}} style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",border:"2px solid #fbbf2466",color:"white",fontSize:16,cursor:"pointer"}}>🕯️</button>
        </div>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════ GRAPHICS SETTINGS
function GraphicsSettings({current,onChange,onClose}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:18,padding:28,width:"100%",maxWidth:360}}>
        <div style={{color:"#e2e8f0",fontWeight:800,fontSize:17,marginBottom:4}}>⚙️ ตั้งค่ากราฟิก</div>
        <div style={{color:"#64748b",fontSize:11,marginBottom:20}}>ปรับประสิทธิภาพตามอุปกรณ์ของคุณ</div>
        {Object.entries(GRAPHICS_PRESETS).map(([key,gfx])=>(
          <div key={key} onClick={()=>onChange(key)} style={{background:current===key?"#1d4ed820":"#1e293b",border:`2px solid ${current===key?"#38bdf8":"#334155"}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",marginBottom:10,transition:"all 0.2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{color:current===key?"#38bdf8":"#e2e8f0",fontWeight:700,fontSize:14}}>{gfx.label}</span>
              {current===key&&<span style={{color:"#38bdf8",fontSize:11,fontWeight:700}}>✓ ใช้งานอยู่</span>}
            </div>
            <div style={{color:"#64748b",fontSize:11}}>{gfx.desc}</div>
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
              {[["เงา",gfx.shadows?"✓":"✗"],["ต้นไม้",gfx.trees],["อาคาร",gfx.buildings]].map(([l,v],i)=>(
                <span key={i} style={{background:"#0f172a",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#64748b"}}>{l}: <span style={{color:"#e2e8f0"}}>{v}</span></span>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onClose} style={{width:"100%",background:"linear-gradient(135deg,#1d4ed8,#38bdf8)",border:"none",borderRadius:10,color:"white",padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",marginTop:4}}>✓ บันทึก</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════ STORY MODE
function StoryMode({storyId,onClose,onComplete}){
  const {speak,stop}=useTTS();
  const story=STORIES.find(s=>s.id===storyId)||STORIES[0];
  const [ch,setCh]=useState(0);
  const [tIdx,setTIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const chapter=story.chapters[ch], fullText=chapter.text;
  useEffect(()=>{setTIdx(0);stop();},[ch]);
  useEffect(()=>{if(tIdx<fullText.length){const t=setTimeout(()=>setTIdx(p=>p+1),22);return()=>clearTimeout(t);}},[tIdx,fullText]);
  const doSpeak=()=>{setPlaying(true);speak(chapter.title+"... "+fullText,{rate:0.85,pitch:story.char.emoji==="🐉"?0.7:1.1});setTimeout(()=>setPlaying(false),(fullText.length/10)*1200);};
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:story.bg,position:"relative",overflow:"hidden"}}>
      <style>{`@keyframes stFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes stGlow{0%,100%{box-shadow:0 0 20px ${story.accent}44}50%{box-shadow:0 0 40px ${story.accent}88}}`}</style>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>{Array.from({length:25}).map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",background:story.accent,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.25,animation:`stFloat ${3+i*0.3}s ${i*0.2}s ease-in-out infinite`}}/>)}</div>
      <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",padding:"11px 16px",borderBottom:`1px solid ${story.accent}33`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:10}}>
        <div><div style={{color:story.accent,fontWeight:800,fontSize:14}}>{story.title}</div><div style={{color:"#64748b",fontSize:9}}>{story.char.name} · {story.chapters.length} บท</div></div>
        <button onClick={()=>{stop();onClose();}} style={{background:"transparent",border:`1px solid ${story.accent}44`,color:story.accent,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10}}>✕</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:22,zIndex:10}}>
        <div style={{fontSize:68,marginBottom:14,animation:"stFloat 4s ease-in-out infinite"}}>{chapter.scene}</div>
        <div style={{display:"flex",gap:12,alignItems:"center",background:"rgba(0,0,0,0.5)",borderRadius:14,padding:"12px 18px",marginBottom:18,border:`1px solid ${story.char.color}33`,backdropFilter:"blur(8px)",animation:"stGlow 3s ease-in-out infinite",maxWidth:480,width:"100%"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${story.char.color}22,${story.char.color}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px solid ${story.char.color}66`,flexShrink:0}}>{story.char.emoji}</div>
          <div><div style={{color:story.char.color,fontWeight:700,fontSize:12,marginBottom:2}}>{story.char.name}</div><div style={{color:"#94a3b8",fontSize:10}}>เรื่องราวแห่งอุบลฯ</div></div>
        </div>
        <div style={{color:story.accent,fontWeight:800,fontSize:15,marginBottom:8,textAlign:"center"}}>{chapter.title}</div>
        <div style={{color:"#e2e8f0",fontSize:12,lineHeight:1.9,textAlign:"center",maxWidth:460,background:"rgba(0,0,0,0.4)",borderRadius:12,padding:16,border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(8px)",minHeight:90}}>
          {fullText.substring(0,tIdx)}{tIdx<fullText.length&&<span style={{color:story.accent}}>|</span>}
        </div>
        <div style={{display:"flex",gap:6,marginTop:14}}>{story.chapters.map((_,i)=><div key={i} onClick={()=>{stop();setPlaying(false);setCh(i);}} style={{width:i===ch?18:7,height:7,borderRadius:3,background:i===ch?story.accent:"#1e293b",cursor:"pointer",transition:"all 0.3s"}}/>)}</div>
      </div>
      <div style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",padding:"12px 18px",borderTop:`1px solid ${story.accent}22`,display:"flex",gap:7,zIndex:10,flexShrink:0}}>
        <button onClick={()=>{stop();setPlaying(false);if(ch>0)setCh(p=>p-1);}} disabled={ch===0} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"8px 12px",fontSize:11,cursor:ch===0?"default":"pointer",opacity:ch===0?0.4:1}}>← ก่อนหน้า</button>
        {playing?<button onClick={()=>{stop();setPlaying(false);}} style={{background:"#ef444422",border:"1px solid #ef4444",color:"#ef4444",borderRadius:8,padding:"8px 12px",fontSize:10,cursor:"pointer",fontWeight:700}}>⏹ หยุด</button>:<button onClick={doSpeak} style={{background:story.accent+"22",border:`1px solid ${story.accent}`,color:story.accent,borderRadius:8,padding:"8px 12px",fontSize:10,cursor:"pointer",fontWeight:700}}>🔊 ฟังเสียงไทย</button>}
        <button onClick={()=>{stop();setPlaying(false);if(ch<story.chapters.length-1){setCh(p=>p+1);}else{onComplete(story);}}} style={{flex:1,background:`linear-gradient(135deg,${story.accent}44,${story.accent}22)`,border:`1px solid ${story.accent}`,color:story.accent,borderRadius:8,padding:"8px 12px",fontSize:11,cursor:"pointer",fontWeight:700}}>
          {ch<story.chapters.length-1?"บทถัดไป →":`✓ จบ (+${story.reward.xp} XP)`}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════ NPC CHAT
function NPCChat({place,onChat}){
  const {speak,stop}=useTTS();
  const [msgs,setMsgs]=useState([{role:"assistant",text:`สวัสดีค่ะ ยินดีต้อนรับสู่ Meta World อุบลราชธานีเด้อ! ตอนนี้อยู่ที่${place}ค่ะ มีอะไรอยากรู้ไหมคะ? 🌸`}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const scrollRef=useRef(null);
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[msgs,loading]);
  const send=async()=>{const t=input.trim();if(!t||loading)return;setInput("");const um={role:"user",text:t};setMsgs(p=>[...p,um]);setLoading(true);
    try{const h=[...msgs,um].map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));const r=await askNPC(h,place);setMsgs(p=>[...p,{role:"assistant",text:r}]);onChat();speak(r,{rate:0.88,pitch:1.1});}catch{setMsgs(p=>[...p,{role:"assistant",text:"ขอโทษนะคะ 🙏"}]);}setLoading(false);};
  const qs=["สถานที่นี้มีอะไรน่าสนใจ?","ตำนานพญานาคคืออะไร?","อาหารเด็ดอุบลมีอะไรบ้าง?","แห่เทียนพรรษาเป็นยังไง?"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#060e1c"}}>
      <div style={{background:"linear-gradient(135deg,#1a0a3d,#0d1128)",padding:"11px 15px",borderBottom:"1px solid #1e1b4b",display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
        <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 18px #7c3aed66"}}>🧕</div>
        <div style={{flex:1}}><div style={{color:"#a78bfa",fontWeight:800,fontSize:13}}>แม่หญิงอุบล</div><div style={{color:"#6d5ea8",fontSize:10}}>AI Guide · Claude AI · 🔊 เสียงภาษาไทย</div><div style={{color:"#475569",fontSize:9}}>📍 {place}</div></div>
        <button onClick={()=>stop()} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:6,padding:"3px 7px",fontSize:9,cursor:"pointer"}}>⏹</button>
      </div>
      <div style={{padding:"6px 10px",borderBottom:"1px solid #0f172a",display:"flex",gap:5,flexWrap:"wrap",flexShrink:0}}>{qs.map((q,i)=><button key={i} onClick={()=>setInput(q)} style={{background:"#1e1b4b",border:"1px solid #312e81",color:"#818cf8",borderRadius:20,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>{q}</button>)}</div>
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"10px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:5}}>
          {m.role==="assistant"&&<div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>🧕</div>}
          <div style={{background:m.role==="user"?"linear-gradient(135deg,#1d4ed8,#2563eb)":"#1a1f35",color:"#e2e8f0",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"8px 11px",maxWidth:"78%",fontSize:11,lineHeight:1.6,border:m.role==="assistant"?"1px solid #2d2f52":"none"}}>{m.text}</div>
          {m.role==="assistant"&&<button onClick={()=>speak(m.text)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:12,flexShrink:0}}>🔊</button>}
        </div>)}
        {loading&&<div style={{display:"flex",alignItems:"flex-end",gap:5}}><div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🧕</div><div style={{background:"#1a1f35",border:"1px solid #2d2f52",borderRadius:"14px 14px 14px 4px",padding:"9px 12px",display:"flex",gap:4}}>{[0,1,2].map(d=><div key={d} style={{width:5,height:5,borderRadius:"50%",background:"#a78bfa",animation:`avPul 0.8s ${d*0.15}s infinite`}}/>)}</div></div>}
      </div>
      <div style={{padding:"9px 10px",borderTop:"1px solid #1e1b4b",display:"flex",gap:6,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="ถามแม่หญิงอุบลได้เลยค่ะ..." style={{flex:1,background:"#1a1f35",border:"1px solid #312e81",borderRadius:9,padding:"8px 11px",color:"#e2e8f0",fontSize:11,outline:"none"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:loading?"#312e81":"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:9,color:"white",padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700,opacity:loading||!input.trim()?0.5:1}}>▶</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════ SIMPLE PANELS
function FoodPanel({onTry,tried}){return(<div style={{padding:16,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#fb923c",fontWeight:800,fontSize:17}}>🍜 อาหารของดีอุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>ลองแล้ว {tried.size}/{FOODS.length} อย่าง</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>{FOODS.map(f=>{const t=tried.has(f.id);return<div key={f.id} style={{background:t?f.color+"12":"#0f172a",border:`2px solid ${t?f.color:"#1e293b"}`,borderRadius:12,padding:13,position:"relative"}}>{t&&<div style={{position:"absolute",top:8,right:8,background:f.color,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✓</div>}<div style={{fontSize:28,marginBottom:6,textAlign:"center"}}>{f.emoji}</div><div style={{color:f.color,fontWeight:700,fontSize:12,marginBottom:3}}>{f.name}</div><div style={{color:"#64748b",fontSize:9,lineHeight:1.5,marginBottom:9}}>{f.desc}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#34d399",fontSize:10,fontWeight:700}}>{f.price}</span><button onClick={()=>onTry(f)} style={{background:t?f.color+"20":f.color,border:"none",borderRadius:5,color:t?"#888":"white",padding:"4px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>{t?"ลองแล้ว":"ลอง!"}</button></div></div>;})}</div></div>);}

function TradPanel({onJoin,joined}){const [sel,setSel]=useState(null);return(<div style={{padding:16,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#fbbf24",fontWeight:800,fontSize:17}}>🎊 ประเพณีอุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>เข้าร่วมแล้ว {joined.size}/{TRADITIONS.length}</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:11}}>{TRADITIONS.map((t,i)=>{const j=joined.has(t.id);return<div key={t.id} onClick={()=>setSel(sel===i?null:i)} style={{background:sel===i?t.color+"15":"#0f172a",border:`2px solid ${j?t.color:sel===i?t.color+"88":"#1e293b"}`,borderRadius:12,padding:15,cursor:"pointer",transition:"all 0.2s",position:"relative"}}>{j&&<div style={{position:"absolute",top:9,right:9,background:t.color,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✓</div>}<div style={{fontSize:26,marginBottom:7}}>{t.emoji}</div><div style={{color:t.color,fontWeight:700,fontSize:12,marginBottom:3}}>{t.name}</div><div style={{color:"#475569",fontSize:9,marginBottom:7}}>📅 {t.month}</div>{sel===i&&<button onClick={e=>{e.stopPropagation();onJoin(t);}} style={{width:"100%",background:`linear-gradient(135deg,${t.color},${t.color}99)`,border:"none",borderRadius:7,color:"white",padding:"7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{j?"✓ เข้าร่วมแล้ว":"🎉 เข้าร่วม"}</button>}</div>;})}</div></div>);}

function PlacesPanel({onGo,visited}){const [cat,setCat]=useState("all");const cats=["all",...new Set(PLACES.map(p=>p.cat))];const f=cat==="all"?PLACES:PLACES.filter(p=>p.cat===cat);return(<div style={{padding:16,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#e2e8f0",fontWeight:800,fontSize:17}}>🗺️ สถานที่อุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>เยี่ยมชมแล้ว {visited.size}/{PLACES.length}</div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{background:cat===c?"#38bdf8":"#1e293b",border:"none",borderRadius:20,color:cat===c?"#000":"#64748b",padding:"4px 10px",fontSize:9,cursor:"pointer",fontWeight:cat===c?700:400}}>{c==="all"?"ทั้งหมด":c}</button>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>{f.map(p=>{const v=visited.has(p.name);return<div key={p.id} onClick={()=>onGo(p.name)} style={{background:v?p.color+"12":"#0f172a",border:`2px solid ${v?p.color:"#1e293b"}`,borderRadius:12,padding:14,cursor:"pointer",position:"relative",transition:"all 0.2s"}}>{v&&<div style={{position:"absolute",top:9,right:9,background:p.color,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✓</div>}<div style={{fontSize:26,marginBottom:7}}>{p.emoji}</div><div style={{color:p.color,fontWeight:700,fontSize:11,marginBottom:4}}>{p.name}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{background:p.color+"20",color:p.color,borderRadius:4,padding:"2px 6px",fontSize:8,fontWeight:700}}>{p.cat}</span><span style={{color:p.color,fontSize:9}}>วาร์ป →</span></div></div>;})}</div></div>);}

function IoTDash(){const {sensors,hist}=useIoT();const [sel,setSel]=useState(0);const s=sensors[sel];return(<div style={{padding:16,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><div><div style={{color:"#f87171",fontWeight:800,fontSize:17}}>📡 IoT Live</div><div style={{color:"#64748b",fontSize:10}}>ESP32 · {sensors.filter(s=>s.online).length}/{sensors.length} Online</div></div><div style={{display:"flex",gap:4,alignItems:"center"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#34d399"}}/><span style={{color:"#34d399",fontSize:9}}>Live 2s</span></div></div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{sensors.map((s,i)=><button key={s.id} onClick={()=>setSel(i)} style={{background:sel===i?"#f8717118":"transparent",border:`1px solid ${sel===i?"#f87171":"#1e293b"}`,color:sel===i?"#f87171":"#64748b",borderRadius:6,padding:"4px 8px",fontSize:9,cursor:"pointer",fontWeight:sel===i?700:400}}>{s.online?"🟢":"🔴"} {s.place}</button>)}</div><div style={{background:"linear-gradient(135deg,#1e0f0f,#180a0a)",border:"1px solid #f8717130",borderRadius:12,padding:13}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10,alignItems:"center",flexWrap:"wrap",gap:6}}><div><div style={{color:"#f87171",fontWeight:800,fontSize:13}}>{s.place}</div></div><div style={{background:s.online?"#34d39922":"#f8717122",color:s.online?"#34d399":"#f87171",borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700}}>{s.online?"ONLINE":"OFFLINE"}</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:7}}>{[["🌡️",`${s.temp}°C`,"#f87171"],["💧",`${s.hum}%`,"#38bdf8"],["☀️",`${s.light}L`,"#fbbf24"],["👥",`${s.visitors}`,"#a78bfa"]].map(([ic,v,c],i)=><div key={i} style={{background:c+"10",border:`1px solid ${c}28`,borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{color:"#64748b",fontSize:11,marginBottom:2}}>{ic}</div><div style={{color:c,fontWeight:800,fontSize:15,fontFamily:"monospace"}}>{v}</div></div>)}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["🌡️ Temp",hist.map(h=>h.temp),"#f87171"],["💧 Humid",hist.map(h=>h.hum),"#38bdf8"]].map(([l,d,c],i)=><div key={i} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:9,padding:10}}><div style={{color:c,fontSize:9,fontWeight:600,marginBottom:5}}>{l}</div><Spark data={d} color={c}/></div>)}</div></div>);}

function QuestPanel({mainP,dailyP,xp}){const [tab,setTab]=useState("daily");return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div style={{padding:"14px 16px 0",flexShrink:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}><div><div style={{color:"#fbbf24",fontWeight:800,fontSize:17}}>⚔️ ภารกิจ</div><div style={{color:"#64748b",fontSize:10}}>สะสม XP อัพเลเวล</div></div><div style={{background:"linear-gradient(135deg,#92400e,#fbbf24)",borderRadius:20,padding:"5px 13px",display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:12}}>⭐</span><span style={{color:"#fff",fontWeight:800,fontSize:13}}>{xp} XP</span></div></div><div style={{background:"#1e293b",borderRadius:8,padding:10,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#94a3b8",fontSize:9}}>Lv.{Math.floor(xp/100)+1}</span><span style={{color:"#fbbf24",fontSize:9}}>{xp%100}/100</span></div><div style={{height:4,background:"#0f172a",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${xp%100}%`,background:"linear-gradient(90deg,#f59e0b,#fbbf24)",borderRadius:2,transition:"width 0.5s"}}/></div></div><div style={{display:"flex",gap:6,marginBottom:10}}>{[["daily","📅 รายวัน"],["main","🏆 หลัก"]].map(([t,l])=><button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?"#fbbf2420":"#1e293b",border:`1px solid ${tab===t?"#fbbf24":"#334155"}`,color:tab===t?"#fbbf24":"#64748b",borderRadius:7,padding:"6px",fontSize:10,cursor:"pointer",fontWeight:tab===t?700:400}}>{l}</button>)}</div></div><div style={{flex:1,overflowY:"auto",padding:"0 16px 16px"}}>{(tab==="daily"?DAILY_Q:MAIN_Q).map(q=>{const p=(tab==="daily"?dailyP:mainP)[q.id]||0,done=p>=q.max,pct=Math.min(100,(p/q.max)*100),c=q.color||"#fbbf24";return<div key={q.id} style={{background:done?c+"10":"#0f172a",border:`1px solid ${done?c:"#1e293b"}`,borderRadius:11,padding:13,marginBottom:8,transition:"all 0.3s"}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{fontSize:20,flexShrink:0}}>{q.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:done?c:"#e2e8f0",fontWeight:700,fontSize:11}}>{q.title}</span><span style={{background:done?c+"30":"#1e293b",color:done?c:"#64748b",borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>{done?"✓":`${p}/${q.max}`}</span></div><p style={{color:"#64748b",fontSize:9,marginBottom:6,lineHeight:1.4}}>{q.desc}</p><div style={{height:3,background:"#1e293b",borderRadius:2,overflow:"hidden",marginBottom:4}}><div style={{height:"100%",width:`${pct}%`,background:done?`linear-gradient(90deg,${c},${c}88)`:"linear-gradient(90deg,#334155,#475569)",borderRadius:2,transition:"width 0.5s"}}/></div><div style={{textAlign:"right"}}><span style={{color:"#fbbf24",fontSize:8}}>🏆 {q.xp} XP</span></div></div></div></div>;})}  </div></div>);}

// ═══════════════════════════════════════════ MAIN APP
const TABS=[
  {id:"world",    label:"🌏 โลก",       color:"#38bdf8"},
  {id:"stories",  label:"📖 ตำนาน",     color:"#f59e0b"},
  {id:"npc",      label:"🤖 AI",         color:"#a78bfa"},
  {id:"food",     label:"🍜 อาหาร",     color:"#fb923c"},
  {id:"traditions",label:"🎊 ประเพณี",  color:"#fbbf24"},
  {id:"places",   label:"📍 สถานที่",   color:"#f87171"},
  {id:"iot",      label:"📡 IoT",        color:"#f87171"},
  {id:"quest",    label:"⚔️ ภารกิจ",   color:"#f59e0b"},
];

export default function App(){
  const [screen,setScreen]=useState("login");
  const [avatar,setAvatar]=useState(null);
  const [page,setPage]=useState("world");
  const [activeStory,setActiveStory]=useState(null);
  const [popup,setPopup]=useState(null);
  const [fest,setFest]=useState(false);
  const [fly,setFly]=useState(false);
  const [graphics,setGraphics]=useState("medium");
  const [showGfx,setShowGfx]=useState(false);
  const [place,setPlace]=useState("Meta World อุบลราชธานี");
  const [visited,setVisited]=useState(new Set());
  const [tried,setTried]=useState(new Set());
  const [joined,setJoined]=useState(new Set());
  const [completedStories,setCompletedStories]=useState(new Set());
  const [xp,setXp]=useState(0);
  const [steps,setSteps]=useState(0);
  const [mainP,setMainP]=useState({mq1:0,mq2:0,mq3:0,mq4:0,mq5:0,mq6:0});
  const [dailyP,setDailyP]=useState({dq1:0,dq2:0,dq3:0,dq4:0,dq5:0});
  const [jumpCount,setJumpCount]=useState(0);

  const addXP=useCallback(n=>setXp(p=>p+n),[]);
  const upQ=useCallback((qs,set,id,amt=1)=>{set(prev=>{const q=qs.find(q=>q.id===id);if(!q)return prev;const cur=prev[id]||0;if(cur>=q.max)return prev;const next=Math.min(q.max,cur+amt);if(next===q.max&&cur<q.max)addXP(q.xp);return{...prev,[id]:next};});},[addXP]);
  const upM=useCallback((id,amt=1)=>upQ(MAIN_Q,setMainP,id,amt),[upQ]);
  const upD=useCallback((id,amt=1)=>upQ(DAILY_Q,setDailyP,id,amt),[upQ]);
  const showPop=useCallback((txt,icon="🌀")=>{setPopup({txt,icon});setTimeout(()=>setPopup(null),2800);},[]);

  const handlePortal=useCallback(name=>{setPlace(name);setVisited(p=>{const n=new Set(p);n.add(name);return n;});upM("mq1");upD("dq1");if(PLACES.find(p=>p.name===name)?.cat==="festival")setFest(true);showPop(name,"🌀");},[upM,upD,showPop]);
  const handleWarp=useCallback(name=>{setPage("world");handlePortal(name);},[handlePortal]);
  const handleFood=useCallback(f=>{setTried(p=>{const n=new Set(p);n.add(f.id);return n;});upM("mq3");upD("dq2");addXP(5);showPop(`อร่อย! ${f.name} ${f.emoji}`,"🍜");},[upM,upD,addXP,showPop]);
  const handleTrad=useCallback(t=>{setJoined(p=>{const n=new Set(p);n.add(t.id);return n;});upM("mq4");addXP(20);showPop(t.name,t.emoji);},[upM,addXP,showPop]);
  const handleChat=useCallback(()=>{upM("mq2");upD("dq3");},[upM,upD]);
  const handleSteps=useCallback(total=>{setSteps(total);upM("mq6",1);},[upM]);
  const handleJump=useCallback(()=>{setJumpCount(p=>{const n=p+1;upD("dq4");return n;});},[upD]);
  const handleStoryComplete=useCallback(story=>{setCompletedStories(p=>{const n=new Set(p);n.add(story.id);return n;});addXP(story.reward.xp);upM("mq5");upD("dq5");setActiveStory(null);showPop(`🏆 +${story.reward.xp} XP · ${story.reward.item}`,story.char.emoji);},[addXP,upM,upD,showPop]);

  if(screen==="login") return <LoginScreen onStart={()=>setScreen("avatar")}/>;
  if(screen==="avatar") return <AvatarCreator onComplete={av=>{setAvatar(av);addXP(20);setScreen("world");}}/>;

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#060d1a",color:"#e2e8f0",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
        @keyframes avPul{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes stFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes avUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes warpAnim{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.1)}}
        @keyframes lgPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}
        @keyframes lgSpin{to{transform:rotate(360deg)}}
        @keyframes lgRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes lgGlow{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes lgSlide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      {showGfx&&<GraphicsSettings current={graphics} onChange={g=>{setGraphics(g);}} onClose={()=>setShowGfx(false)}/>}
      {/* TOP NAV */}
      <div style={{background:"#020812",borderBottom:"1px solid #0d1f35",display:"flex",alignItems:"stretch",flexShrink:0,overflowX:"auto",padding:"0 7px"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginRight:7,flexShrink:0,padding:"5px 0"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>🌏</div>
          <div><div style={{color:"#e2e8f0",fontWeight:800,fontSize:8,lineHeight:1.1}}>META WORLD</div><div style={{color:"#38bdf8",fontSize:6,letterSpacing:1}}>UBON v7</div></div>
        </div>
        {TABS.map(t=><button key={t.id} onClick={()=>{setActiveStory(null);setPage(t.id);}} style={{background:"transparent",border:"none",borderBottom:`2px solid ${page===t.id?t.color:"transparent"}`,color:page===t.id?t.color:"#475569",padding:"0 6px",fontSize:9,cursor:"pointer",fontWeight:page===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}}>{t.label}</button>)}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,flexShrink:0,padding:"4px 0"}}>
          <button onClick={()=>setFly(p=>!p)} style={{background:fly?"#06b6d420":"#1e293b",border:`1px solid ${fly?"#06b6d4":"#334155"}`,color:fly?"#06b6d4":"#64748b",borderRadius:5,padding:"2px 6px",fontSize:8,cursor:"pointer",fontWeight:700}}>🦅</button>
          <button onClick={()=>setFest(p=>!p)} style={{background:fest?"#fbbf2420":"#1e293b",border:`1px solid ${fest?"#fbbf24":"#334155"}`,color:fest?"#fbbf24":"#64748b",borderRadius:5,padding:"2px 6px",fontSize:8,cursor:"pointer"}}>🕯️</button>
          <button onClick={()=>setShowGfx(true)} style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:5,padding:"2px 6px",fontSize:8,cursor:"pointer"}}>⚙️</button>
          <div style={{background:"#92400e22",border:"1px solid #f59e0b44",borderRadius:5,padding:"2px 6px",display:"flex",gap:2,alignItems:"center"}}><span style={{fontSize:8}}>⭐</span><span style={{color:"#fbbf24",fontWeight:700,fontSize:9}}>{xp}</span></div>
          {steps>0&&<div style={{background:"#34d39922",border:"1px solid #34d39944",borderRadius:5,padding:"2px 5px",display:"flex",gap:2,alignItems:"center"}}><span style={{fontSize:7}}>👣</span><span style={{color:"#34d399",fontSize:8,fontWeight:700}}>{steps}</span></div>}
          {avatar&&<div style={{background:"#1e293b",borderRadius:5,padding:"2px 6px",display:"flex",gap:3,alignItems:"center"}}><div style={{width:13,height:13,borderRadius:"50%",background:avatar.skin,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7}}>{avatar.outfit.emoji}</div><span style={{color:avatar.outfit.color,fontSize:8,fontWeight:600,maxWidth:45,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{avatar.name}</span></div>}
        </div>
      </div>
      {/* CONTENT */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}} key={page+(activeStory||"")+(graphics)}>
        {page==="world"      && <WorldView avatar={avatar} festivalMode={fest} flyMode={fly} onPortal={handlePortal} onSteps={handleSteps} onJump={handleJump} graphics={graphics}/>}
        {page==="stories"    && (activeStory?<StoryMode storyId={activeStory} onClose={()=>setActiveStory(null)} onComplete={handleStoryComplete}/>:
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}>
            <div><div style={{color:"#f59e0b",fontWeight:800,fontSize:17}}>📖 ตำนานและเรื่องราวแห่งอุบลฯ</div><div style={{color:"#64748b",fontSize:11}}>อ่านแล้ว {completedStories.size}/{STORIES.length}</div></div>
            {STORIES.map(s=>{const done=completedStories.has(s.id);return<div key={s.id} onClick={()=>setActiveStory(s.id)} style={{background:done?s.accent+"10":"#0f172a",border:`2px solid ${done?s.accent:"#1e293b"}`,borderRadius:14,padding:16,cursor:"pointer",transition:"all 0.2s"}}>
              <div style={{display:"flex",gap:13,alignItems:"flex-start"}}>
                <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${s.char.color}22,${s.char.color}44)`,border:`2px solid ${s.char.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.char.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{color:s.accent,fontWeight:800,fontSize:13,marginBottom:2}}>{s.title}</div>
                  <div style={{color:"#64748b",fontSize:10,marginBottom:6}}>{s.chapters.length} บท · {s.char.name}</div>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <span style={{background:s.accent+"20",color:s.accent,borderRadius:20,padding:"3px 9px",fontSize:9,fontWeight:700}}>🏆 {s.reward.xp} XP</span>
                    {done&&<span style={{color:s.accent,fontSize:9}}>✓ {s.reward.item}</span>}
                    <span style={{marginLeft:"auto",color:s.accent,fontSize:10,fontWeight:700}}>อ่านเรื่อง →</span>
                  </div>
                </div>
              </div>
              <div style={{marginTop:10,display:"flex",gap:5}}>{s.chapters.map((c,i)=><div key={i} style={{flex:1,background:s.accent+"15",borderRadius:4,padding:"4px 5px",textAlign:"center"}}><div style={{fontSize:14}}>{c.scene}</div><div style={{color:"#64748b",fontSize:7,marginTop:1}}>{c.title.substring(0,8)}...</div></div>)}</div>
            </div>;})}
          </div>)}
        {page==="npc"        && <NPCChat place={place} onChat={handleChat}/>}
        {page==="food"       && <FoodPanel onTry={handleFood} tried={tried}/>}
        {page==="traditions" && <TradPanel onJoin={handleTrad} joined={joined}/>}
        {page==="places"     && <PlacesPanel onGo={handleWarp} visited={visited}/>}
        {page==="iot"        && <IoTDash/>}
        {page==="quest"      && <QuestPanel mainP={mainP} dailyP={dailyP} xp={xp}/>}
        {/* POPUP */}
        {popup&&<div style={{position:"absolute",top:"50%",left:"50%",zIndex:100,textAlign:"center",animation:"warpAnim 2.8s ease forwards",pointerEvents:"none"}}><div style={{background:"rgba(0,0,0,0.92)",border:"2px solid #38bdf8",borderRadius:18,padding:"18px 30px",backdropFilter:"blur(16px)",minWidth:180}}><div style={{fontSize:34,marginBottom:5}}>{popup.icon}</div><div style={{color:"#38bdf8",fontWeight:800,fontSize:13,marginBottom:3}}>{popup.icon==="🌀"?"กำลังวาร์ป...":popup.icon==="🍜"?"อร่อยมาก!":"สำเร็จ!"}</div><div style={{color:"#e2e8f0",fontSize:11,lineHeight:1.5}}>{popup.txt}</div></div></div>}
      </div>
    </div>
  );
}
