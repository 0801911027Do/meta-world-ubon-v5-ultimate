// ████████████████████████████████████████████████████████████████████
//  META WORLD UBON RATCHATHANI — ULTIMATE SYSTEM v5.0
//  Epic Login · Province Map · Story Mode · TTS Thai Voice
//  Walking System · 3D World · AI NPC · IoT · Quests · Festival
// ████████████████████████████████████████████████████████████████████
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ══════════════════════════════════════════════════════ CLAUDE AI NPC
async function askNPC(history, place, charName = "แม่หญิงอุบล") {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 700,
        system: `คุณคือ "${charName}" ใน Meta World อุบลราชธานี อบอุ่น เป็นกันเอง พูดสำเนียงอีสาน เช่น "เด้อ" "สิ" "แม่นบ่" ตอนนี้อยู่ที่: ${place} ตอบ 2-3 ประโยค ใส่ emoji`,
        messages: history,
      }),
    });
    const d = await res.json();
    return d.content?.[0]?.text ?? "ขอโทษนะคะ ระบบขัดข้องชั่วคราวค่ะ 🙏";
  } catch { return "ขอโทษนะคะ ไม่สามารถเชื่อมต่อได้ค่ะ 🙏"; }
}

// ══════════════════════════════════════════════════════ TTS THAI VOICE
function useTTS() {
  const speak = useCallback((text, opts = {}) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "th-TH"; u.rate = opts.rate || 0.88; u.pitch = opts.pitch || 1.05; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const thVoice = voices.find(v => v.lang === "th-TH" || v.lang === "th");
    if (thVoice) u.voice = thVoice;
    window.speechSynthesis.speak(u);
  }, []);
  const stop = useCallback(() => window.speechSynthesis.cancel(), []);
  return { speak, stop };
}

// ══════════════════════════════════════════════════════ STORY DATA
const STORIES = [
  {
    id: "naga",
    title: "ตำนานพญานาคแห่งโขง",
    subtitle: "ผู้พิทักษ์แม่น้ำนานาชาติ",
    location: "แม่น้ำโขง · โขงเจียม",
    char: { name: "พญานาคเสรีนาคนาถ", emoji: "🐉", color: "#06b6d4", desc: "ผู้พิทักษ์แม่น้ำโขง" },
    bg: "linear-gradient(135deg,#020c1b 0%,#0a2040 50%,#020c1b 100%)",
    accent: "#06b6d4",
    chapters: [
      { title: "กำเนิดพญานาค", text: "กาลครั้งหนึ่ง... ณ ห้วงลึกแห่งแม่น้ำโขง มีพญานาคผู้ยิ่งใหญ่สถิตอยู่ มีพลังเหนือธรรมชาติ ร่างกายประดับด้วยเกล็ดสีทองอร่ามแวววาวดุจแสงแห่งดวงอาทิตย์", scene: "🌊" },
      { title: "พระราชานาคแห่งโขง", text: "พญานาคคือเจ้าแห่งแม่น้ำ ทรงปกปักรักษาชาวริมโขงมาหลายพันปี ทุกปีในวันออกพรรษา พญานาคจะพ่นบั้งไฟขึ้นสู่ท้องฟ้าเพื่อต้อนรับพระพุทธเจ้าเสด็จลงจากดาวดึงส์", scene: "🔥" },
      { title: "บั้งไฟพญานาค", text: "ปรากฏการณ์อันลึกลับ... ทุกวันออกพรรษาที่อำเภอโพนพิสัย หนองคาย ลูกไฟสีชมพูแดงจะพุ่งขึ้นจากแม่น้ำโขงอย่างลึกลับ นั่นคือพลังของพญานาคที่ยังคงดำรงอยู่", scene: "✨" },
      { title: "ตำนานยังคงอยู่", text: "ชาวอีสานเชื่อว่าพญานาคยังคงสถิตอยู่ในแม่น้ำโขงจนถึงทุกวันนี้ ท่านคือสัญลักษณ์แห่งความอุดมสมบูรณ์ ความคุ้มครอง และความศักดิ์สิทธิ์ของดินแดนอีสาน", scene: "🌟" },
    ],
    reward: { xp: 200, item: "เกราะพญานาค 🐉" },
  },
  {
    id: "phataem",
    title: "ผาแต้ม บันทึกแห่งกาลเวลา",
    subtitle: "ภาพเขียนสีอายุ 3,000-4,000 ปี",
    location: "ผาแต้ม · โขงเจียม",
    char: { name: "ปู่ชีมน นักพรตแห่งผา", emoji: "🧙", color: "#f59e0b", desc: "ผู้รักษาตำนานแห่งผาแต้ม" },
    bg: "linear-gradient(135deg,#1a0a00 0%,#3d1a00 50%,#1a0a00 100%)",
    accent: "#f59e0b",
    chapters: [
      { title: "มนุษย์ยุคดึกดำบรรพ์", text: "เมื่อ 3,000-4,000 ปีก่อน มนุษย์ยุคก่อนประวัติศาสตร์ได้วาดภาพบนผาหิน ริมฝั่งแม่น้ำโขง บันทึกชีวิตประจำวัน การล่าสัตว์ พิธีกรรม และความเชื่อของพวกเขา", scene: "🏔️" },
      { title: "ภาพเขียนอันลึกลับ", text: "ภาพวัวป่า ช้าง ปลา มือมนุษย์ และสัญลักษณ์ลึกลับ ถูกวาดด้วยสีแดงจากดินและเหล็กออกไซด์ ยังคงปรากฏชัดเจนจนถึงปัจจุบัน นับเป็นมรดกทางวัฒนธรรมอันล้ำค่า", scene: "🎨" },
      { title: "ชมพระอาทิตย์ขึ้นลำดับแรก", text: "ผาแต้มเป็นจุดชมพระอาทิตย์ขึ้นลำดับแรกของประเทศไทย ทุกวันเมื่อรุ่งอรุณ แสงสีทองจากท้องฟ้าตะวันออกจะสาดส่องลงมาบนหน้าผา สวยงามราวกับภาพวาดของพระเจ้า", scene: "🌅" },
      { title: "ผาแต้มวันนี้", text: "อุทยานแห่งชาติผาแต้มเป็นสถานที่ศักดิ์สิทธิ์ ปัจจุบันได้รับการขึ้นทะเบียนเป็นมรดกโลกทางธรรมชาติ มีนักท่องเที่ยวจากทั่วโลกมาเยือนเพื่อสัมผัสมนต์เสน่ห์แห่งประวัติศาสตร์", scene: "🌍" },
    ],
    reward: { xp: 180, item: "แผนที่โบราณ 🗺️" },
  },
  {
    id: "candle",
    title: "กำเนิดแห่เทียนพรรษา",
    subtitle: "งานบุญยิ่งใหญ่ที่สุดแห่งอุบลฯ",
    location: "ทุ่งศรีเมือง · เมืองอุบล",
    char: { name: "นางสาวทิพย์ ช่างแกะสลัก", emoji: "💃", color: "#fbbf24", desc: "ช่างแกะสลักเทียนมือหนึ่งแห่งอุบลฯ" },
    bg: "linear-gradient(135deg,#1a1000 0%,#3d2a00 50%,#1a1000 100%)",
    accent: "#fbbf24",
    chapters: [
      { title: "ต้นกำเนิดเทียนพรรษา", text: "ในสมัยโบราณ ชาวอุบลจะนำเทียนไปถวายพระก่อนเข้าพรรษา แต่พระสงฆ์ท่านหนึ่งมีแนวคิดแกะสลักเทียนให้สวยงาม เพื่อถวายเป็นพุทธบูชา นั่นคือจุดเริ่มต้นของประเพณีอันยิ่งใหญ่", scene: "🕯️" },
      { title: "ศิลปะแห่งการแกะสลัก", text: "ช่างแกะสลักใช้เวลาหลายเดือนในการสร้างต้นเทียน แต่ละต้นมีความสูงกว่า 3 เมตร แกะสลักลวดลายเรื่องราวในพระพุทธประวัติ ชาดก และวัฒนธรรมไทยอีสานอย่างวิจิตรบรรจง", scene: "🎭" },
      { title: "ขบวนแห่ยิ่งใหญ่", text: "ทุกปีในเดือนกรกฎาคม ขบวนแห่เทียนพรรษาจะเดินผ่านใจกลางเมืองอุบล นักท่องเที่ยวจากทั่วโลกมาชม มีนางรำงดงาม ดนตรีพื้นเมือง และแสงสีสวยงามตระการตา", scene: "🎊" },
      { title: "มรดกแห่งอุบลฯ", text: "ประเพณีแห่เทียนพรรษาอุบลราชธานีได้รับการยกย่องว่าสวยงามที่สุดในประเทศไทย และได้รับการขึ้นทะเบียนเป็นมรดกวัฒนธรรมแห่งชาติ เป็นความภาคภูมิใจของชาวอุบลฯ", scene: "🏆" },
    ],
    reward: { xp: 200, item: "เทียนแกะสลักทอง 🕯️" },
  },
  {
    id: "mekong",
    title: "แม่น้ำโขง สายน้ำนานาชาติ",
    subtitle: "แม่น้ำแห่งชีวิต 6 ประเทศ",
    location: "แม่น้ำโขง · สามพันโบก",
    char: { name: "หลวงปู่โขง ผู้เฒ่าริมน้ำ", emoji: "🧓", color: "#22d3ee", desc: "ผู้เฒ่าที่อยู่ริมโขงมากว่า 80 ปี" },
    bg: "linear-gradient(135deg,#020c1b 0%,#062040 50%,#020c1b 100%)",
    accent: "#22d3ee",
    chapters: [
      { title: "แม่น้ำแห่งชีวิต", text: "แม่น้ำโขงยาวกว่า 4,350 กิโลเมตร เป็นแม่น้ำที่ยาวที่สุดอันดับ 12 ของโลก ไหลผ่าน 6 ประเทศ จีน เมียนมา ลาว ไทย กัมพูชา และเวียดนาม หล่อเลี้ยงชีวิตผู้คนกว่า 70 ล้านคน", scene: "🌊" },
      { title: "สามพันโบก แกรนด์แคนยอนไทย", text: "ที่อำเภอโขงเจียม แม่น้ำโขงได้กัดเซาะหินทรายจนเกิดเป็นหลุมนับพันๆ หลุม เรียกว่า สามพันโบก ในภาษาอีสาน แปลว่า 3,000 หลุม สวยงามราวกับแกรนด์แคนยอนของอเมริกา", scene: "🪨" },
      { title: "แม่น้ำสองสี", text: "จุดบรรจบของแม่น้ำโขงและแม่น้ำมูลที่โขงเจียม เราสามารถมองเห็นน้ำสองสีชัดเจน สีน้ำตาลของมูลผสมกับสีเขียวใสของโขง เป็นปรากฏการณ์ทางธรรมชาติที่หาดูได้ยากในโลก", scene: "🎨" },
      { title: "ปลาบึก ราชาแห่งโขง", text: "ปลาบึกคือปลาน้ำจืดที่ใหญ่ที่สุดในโลก อาศัยอยู่ในแม่น้ำโขง หนักกว่า 300 กิโลกรัม ยาวกว่า 3 เมตร ปัจจุบันใกล้สูญพันธุ์และอยู่ในบัญชีสัตว์คุ้มครองระดับโลก", scene: "🐟" },
    ],
    reward: { xp: 160, item: "ครีบปลาบึกทอง 🐟" },
  },
  {
    id: "boatfire",
    title: "ไหลเรือไฟ ศรัทธาแห่งแม่น้ำมูล",
    subtitle: "ประเพณีออกพรรษาอันยิ่งใหญ่",
    location: "แม่น้ำมูล · วารินชำราบ",
    char: { name: "นางรำ สายน้ำ", emoji: "💃", color: "#a78bfa", desc: "นักแสดงประเพณีไหลเรือไฟแห่งอุบลฯ" },
    bg: "linear-gradient(135deg,#100820 0%,#2a1060 50%,#100820 100%)",
    accent: "#a78bfa",
    chapters: [
      { title: "วันออกพรรษา", text: "ในคืนวันออกพรรษา ชาวอุบลทุกคนจะมารวมตัวกันริมแม่น้ำมูล เพื่อร่วมประเพณีไหลเรือไฟ ประเพณีโบราณที่สืบทอดมาหลายร้อยปี แสงเทียนพันดวงสะท้อนบนสายน้ำ งดงามยามค่ำคืน", scene: "🌙" },
      { title: "เรือไฟแห่งศรัทธา", text: "เรือไฟแต่ละลำถูกสร้างจากกาบกล้วยและวัสดุธรรมชาติ ตกแต่งด้วยดอกไม้และเทียน เมื่อลอยออกไปกลางน้ำ เปลวไฟที่สว่างไสวสะท้อนบนผิวน้ำราวกับแม่น้ำลุกเป็นไฟ", scene: "🔥" },
      { title: "ความหมายแห่งการส่ง", text: "การลอยเรือไฟเป็นการส่งความทุกข์โศกและสิ่งไม่ดีออกไปกับสายน้ำ เป็นการขอบคุณพระแม่น้ำที่หล่อเลี้ยงชีวิตตลอดปี และเป็นการอุทิศบุญกุศลให้แก่ผู้ล่วงลับ", scene: "🪷" },
      { title: "เสน่ห์ที่ไม่เสื่อมคลาย", text: "ปัจจุบันประเพณีไหลเรือไฟอุบลราชธานีได้รับการยกย่องว่าสวยงามและยิ่งใหญ่ที่สุดในภาคอีสาน นักท่องเที่ยวจากทั่วประเทศและต่างประเทศต่างเดินทางมาชมความงดงามนี้", scene: "✨" },
    ],
    reward: { xp: 180, item: "เรือไฟจำลองทอง 🛶" },
  },
];

// ══════════════════════════════════════════════════════ UBON MAP DATA
const UBON_DISTRICTS = [
  { id:"muang",   name:"เมืองอุบลฯ",   x:220, y:240, r:42, color:"#f59e0b", emoji:"🏛️",
    landmarks:["ทุ่งศรีเมือง","พิพิธภัณฑ์อุบล","ตลาดใหญ่","วัดหนองป่าพง","สวนสาธารณะทุ่งศรีเมือง"],
    story:"ใจกลางเมืองอุบลฯ ศูนย์กลางวัฒนธรรมและประเพณีแห่เทียนพรรษา" },
  { id:"warin",   name:"วารินชำราบ",   x:210, y:295, r:32, color:"#67e8f9", emoji:"🛶",
    landmarks:["แม่น้ำมูล","วัดวารินทราราม","ตลาดวารินฯ","สะพานรัษฎาภิเษก"],
    story:"ริมแม่น้ำมูล ศูนย์กลางประเพณีไหลเรือไฟอันยิ่งใหญ่" },
  { id:"sirindhorn",name:"สิรินธร",    x:155, y:265, r:30, color:"#4ade80", emoji:"🏔️",
    landmarks:["เขื่อนสิรินธร","วัดสิรินธรวรารามภูพร้าว","อุทยานแห่งชาติสิรินธร"],
    story:"บ้านวัดเรืองแสงสีฟ้า และเขื่อนขนาดใหญ่ที่สวยงาม" },
  { id:"phibun",  name:"พิบูลมังสาหาร",x:205, y:335, r:28, color:"#38bdf8", emoji:"🏞️",
    landmarks:["ผาชัน","หาดวัดใหม่","แก่งสะพือ","ผ้ากาบบัว"],
    story:"ผาชันสามพันโบกเล็ก แหล่งผ้าทอกาบบัวอันลือชื่อ" },
  { id:"khemarat",name:"เขมราฐ",       x:290, y:175, r:28, color:"#f87171", emoji:"🌊",
    landmarks:["หาดเขมราฐ","วัดเขมรัฐสถิตย์","แก่งตะนะ"],
    story:"ริมฝั่งโขงที่สงบงาม หาดทรายสีทองยามเย็น" },
  { id:"khongjiam",name:"โขงเจียม",   x:355, y:245, r:35, color:"#06b6d4", emoji:"🎨",
    landmarks:["ผาแต้ม","สามพันโบก","แม่น้ำสองสี","ภูผาเทิบ"],
    story:"จุดตะวันออกสุดของไทย ผาแต้มและสามพันโบกริมโขง" },
  { id:"natarn",  name:"นาตาล",        x:310, y:155, r:22, color:"#a78bfa", emoji:"🌾",
    landmarks:["แก่งโดม","ป่าอุทยานฯ","ชุมชนดั้งเดิม"],
    story:"หมู่บ้านชาวอีสานดั้งเดิม ริมแม่น้ำโขงอันสงบงาม" },
  { id:"kantharalak",name:"กันทรลักษ์",x:230, y:380, r:26, color:"#fb923c", emoji:"🌿",
    landmarks:["อุทยานแห่งชาติเขาพระวิหาร","บ้านผาชัน","น้ำตกห้วยหลวง"],
    story:"ป่าเขาชายแดน อุทยานแห่งชาติเขาพระวิหารอันศักดิ์สิทธิ์" },
];

const RIVERS_SVG = [
  { name:"แม่น้ำโขง",  color:"#06b6d4", path:"M 340,130 Q 360,165 355,200 Q 350,230 355,245 Q 358,260 340,285 Q 320,310 295,340", width:4 },
  { name:"แม่น้ำมูล",  color:"#67e8f9", path:"M 80,265 Q 120,268 155,265 Q 185,262 210,265 Q 225,270 250,272 Q 280,275 310,268 Q 330,262 340,250", width:3 },
  { name:"แม่น้ำชี",   color:"#22d3ee", path:"M 80,210 Q 120,215 155,220 Q 185,224 210,228 Q 230,232 250,230", width:2.5 },
];

// ══════════════════════════════════════════════════════ GAME DATA
const OUTFITS = [
  {id:"monk",   label:"นักบวช",       color:"#f59e0b",emoji:"🧘",desc:"จีวรสีเหลือง"},
  {id:"local",  label:"ชาวบ้าน",      color:"#34d399",emoji:"👘",desc:"ชุดพื้นเมืองอีสาน"},
  {id:"tourist",label:"นักท่องเที่ยว",color:"#38bdf8",emoji:"🧳",desc:"ชุดนักท่องเที่ยว"},
  {id:"warrior",label:"นักรบขอม",     color:"#f87171",emoji:"⚔️",desc:"ชุดนักรบโบราณ"},
  {id:"dancer", label:"นางรำ",        color:"#a78bfa",emoji:"💃",desc:"ชุดฟ้อนอีสาน"},
  {id:"pilot",  label:"นักบิน",       color:"#60a5fa",emoji:"🦅",desc:"ชุดปีกบิน"},
];
const SKIN_COLORS = ["#d4956a","#c68642","#8d5524","#f1c27d","#e8beac","#A0522D"];
const HAIR_STYLES = [{id:"short",l:"สั้น",e:"✂️"},{id:"long",l:"ยาว",e:"💁"},{id:"curly",l:"หยิก",e:"🌀"},{id:"bun",l:"มวย",e:"🎀"},{id:"bald",l:"โกน",e:"🧑‍🦲"}];
const HAIR_COLORS = ["#1a0a00","#4a2c0a","#8B4513","#D4A04A","#C0C0C0","#FF4500","#000","#4169E1"];
const EYE_COLORS  = ["#4a2c0a","#1a3a5c","#2d5a27","#1a1a1a","#7a5c2a","#4a1a4a"];

const PLACES = [
  {id:"wat",    name:"วัดสิรินธรวรารามภูพร้าว",short:"วัดเรืองแสง", cat:"temple",  color:"#f59e0b",emoji:"🛕",  desc:"วัดเรืองแสง ตกแต่งหินอ่อนวิจิตร สว่างยามราตรี",district:"sirindhorn"},
  {id:"pha",    name:"ผาแต้ม",                  short:"ผาแต้ม",       cat:"nature",  color:"#34d399",emoji:"🏞️",desc:"ภาพเขียนสีโบราณ 3,000-4,000 ปี",district:"khongjiam"},
  {id:"samphan",name:"สามพันโบก",               short:"สามพันโบก",   cat:"nature",  color:"#38bdf8",emoji:"🪨", desc:"แกรนด์แคนยอนเมืองไทย ริมโขง",district:"khongjiam"},
  {id:"mekong", name:"แม่น้ำโขง",               short:"แม่น้ำโขง",   cat:"river",   color:"#06b6d4",emoji:"🌊",desc:"แม่น้ำนานาชาติ ยาว 4,350 กม.",district:"khongjiam"},
  {id:"chi",    name:"แม่น้ำชี",                short:"แม่น้ำชี",    cat:"river",   color:"#22d3ee",emoji:"💧",desc:"แม่น้ำยาวที่สุดในไทย 765 กม.",district:"muang"},
  {id:"mun",    name:"แม่น้ำมูล",               short:"แม่น้ำมูล",   cat:"river",   color:"#67e8f9",emoji:"🛶",desc:"ประเพณีไหลเรือไฟออกพรรษา",district:"warin"},
  {id:"songsi", name:"แม่น้ำสองสี",             short:"สองสี",        cat:"nature",  color:"#60a5fa",emoji:"🎨",desc:"จุดบรรจบโขง-มูล",district:"khongjiam"},
  {id:"market", name:"ตลาดใหญ่อุบล",           short:"ตลาดใหญ่",    cat:"culture", color:"#f87171",emoji:"🏪",desc:"ตลาดเก่าแก่ อาหารอีสาน",district:"muang"},
  {id:"fabric", name:"ผ้ากาบบัว",               short:"ผ้ากาบบัว",   cat:"culture", color:"#a78bfa",emoji:"🎨",desc:"ผ้าลายเอกลักษณ์อุบลฯ",district:"phibun"},
  {id:"festival",name:"ทุ่งศรีเมือง",           short:"แห่เทียน",    cat:"festival",color:"#fbbf24",emoji:"🕯️",desc:"ประเพณีแห่เทียนพรรษา",district:"muang"},
  {id:"dam",    name:"เขื่อนสิรินธร",           short:"เขื่อน",       cat:"nature",  color:"#4ade80",emoji:"🏔️",desc:"เขื่อนและวัดเรืองแสง",district:"sirindhorn"},
  {id:"museum", name:"พิพิธภัณฑ์อุบล",         short:"พิพิธภัณฑ์",  cat:"history", color:"#fb923c",emoji:"🏛️",desc:"ประวัติศาสตร์และโบราณวัตถุ",district:"muang"},
];
const FOODS = [
  {id:"guay",   name:"เกี่ยวจั๊บ",    emoji:"🍜",desc:"เส้นก๋วยจั๊บ น้ำซุปใสหอม หมูสามชั้น",price:"45฿",color:"#f59e0b"},
  {id:"mooyoh", name:"หมูยอ",          emoji:"🥩",desc:"หมูยอสดหมักเครื่องเทศ นุ่มเด้ง",        price:"30฿",color:"#f87171"},
  {id:"plara",  name:"ปลาร้า",         emoji:"🐟",desc:"ปลาร้าหมักดองแบบโบราณ หัวใจอีสาน",    price:"20฿",color:"#34d399"},
  {id:"somtam", name:"ส้มตำ",          emoji:"🥗",desc:"รสเปรี้ยวเผ็ดจัด น้ำปลาร้าแท้",        price:"35฿",color:"#a78bfa"},
  {id:"laab",   name:"ลาบอีสาน",       emoji:"🥘",desc:"ลาบหมู ข้าวคั่ว มะนาว เครื่องเทศ",    price:"50฿",color:"#38bdf8"},
  {id:"rice",   name:"ข้าวเหนียว",     emoji:"🍚",desc:"ข้าวเหนียวนึ่งหอมนุ่ม อาหารหลักอีสาน",price:"10฿",color:"#fbbf24"},
  {id:"gang",   name:"แกงอ่อม",        emoji:"🍲",desc:"แกงพื้นเมือง ผักหลายชนิด หอมตะไคร้",  price:"55฿",color:"#4ade80"},
  {id:"grilled",name:"ปลาเผา",         emoji:"🐠",desc:"ปลาสดจากโขง เผาไฟอ่อน น้ำจิ้มแซ่บ",   price:"60฿",color:"#fb923c"},
  {id:"satay",  name:"หมูปิ้ง",        emoji:"🍢",desc:"หมูหมักเครื่องเทศ ปิ้งไฟอ่อน",          price:"25฿",color:"#60a5fa"},
  {id:"khaopun",name:"ข้าวปุ้น",       emoji:"🍝",desc:"เส้นกลม น้ำยาปลา สีเหลืองสวย",         price:"35฿",color:"#fbbf24"},
  {id:"bamboo", name:"หน่อไม้ดอง",     emoji:"🎋",desc:"ดองเปรี้ยว ปรุงรสสมุนไพร",              price:"30฿",color:"#34d399"},
  {id:"namprik",name:"น้ำพริกปลาทู",  emoji:"🌶️",desc:"น้ำพริกสูตรโบราณ รสเผ็ดจัด",           price:"40฿",color:"#f87171"},
];
const TRADITIONS = [
  {id:"candle", name:"แห่เทียนพรรษา", emoji:"🕯️",color:"#fbbf24",month:"ก.ค.",  desc:"งานบุญยิ่งใหญ่ที่สุด เทียนแกะสลักวิจิตร"},
  {id:"boat",   name:"ไหลเรือไฟ",      emoji:"🛶", color:"#f87171",month:"ต.ค.",  desc:"วันออกพรรษา ปล่อยเรือไฟลอยตามแม่น้ำมูล"},
  {id:"loykra", name:"ลอยกระทง",       emoji:"🪷", color:"#a78bfa",month:"พ.ย.",  desc:"ลอยกระทง ขอขมาพระแม่คงคา ปล่อยโคม"},
  {id:"khaosal",name:"บุญข้าวสาก",     emoji:"🍱", color:"#34d399",month:"ก.ย.",  desc:"บุญสารทอีสาน แจกข้าวสาก แบ่งปัน"},
  {id:"songkran",name:"สงกรานต์",       emoji:"💦", color:"#38bdf8",month:"เม.ย.",desc:"สรงน้ำพระ รดน้ำดำหัวผู้ใหญ่"},
  {id:"bunkun", name:"บุญคูนลาน",      emoji:"🌾", color:"#f59e0b",month:"ม.ค.",  desc:"บุญเกี่ยวข้าว ขอบคุณพระแม่โพสพ"},
  {id:"bunkao", name:"บุญข้าวจี่",      emoji:"🔥", color:"#f87171",month:"ก.พ.",  desc:"ย่างข้าวเหนียวบนไฟ บุญเดือนสาม"},
  {id:"phimai", name:"บุญพระเวส",       emoji:"📜", color:"#fb923c",month:"มี.ค.", desc:"เทศน์มหาชาติ 13 กัณฑ์ตลอดคืน"},
];
const DAILY_Q = [
  {id:"dq1",title:"นักสำรวจประจำวัน",  desc:"วาร์ปไป 3 สถานที่",        xp:30,max:3,icon:"🗺️"},
  {id:"dq2",title:"นักชิมอีสาน",        desc:"ลองอาหารอุบล 2 อย่าง",     xp:25,max:2,icon:"🍜"},
  {id:"dq3",title:"เพื่อนแม่หญิงอุบล", desc:"คุย AI Guide 3 ครั้ง",      xp:20,max:3,icon:"🤖"},
  {id:"dq4",title:"นักบินสายฟ้า",       desc:"บินชมแม่น้ำ 1 ครั้ง",      xp:40,max:1,icon:"🦅"},
  {id:"dq5",title:"เรียนรู้เรื่องราว",  desc:"อ่านเรื่องราว 1 บท",        xp:35,max:1,icon:"📖"},
];
const MAIN_Q = [
  {id:"mq1",title:"นักสำรวจมือใหม่",    desc:"เยี่ยมชมสถานที่ 5 แห่ง",    xp:100,max:5, icon:"🗺️",color:"#38bdf8"},
  {id:"mq2",title:"ผู้รู้อุบลฯ",         desc:"คุยกับ AI Guide 10 ครั้ง",   xp:150,max:10,icon:"📚",color:"#a78bfa"},
  {id:"mq3",title:"นักบินสามสาย",        desc:"บินชมแม่น้ำ 3 สาย",          xp:200,max:3, icon:"🦅",color:"#06b6d4"},
  {id:"mq4",title:"ราชาประเพณี",         desc:"เข้าร่วมประเพณี 4 อย่าง",    xp:250,max:4, icon:"🎭",color:"#fbbf24"},
  {id:"mq5",title:"นักชิมตัวจริง",       desc:"ลองอาหารอุบลฯ 8 อย่าง",     xp:180,max:8, icon:"🍜",color:"#fb923c"},
  {id:"mq6",title:"นักอ่านตำนาน",        desc:"อ่านเรื่องราวครบ 5 เรื่อง",  xp:300,max:5, icon:"📖",color:"#f59e0b"},
  {id:"mq7",title:"ผู้เดินทางไกล",       desc:"เดินสะสม 500 ก้าว",          xp:200,max:500,icon:"👣",color:"#34d399"},
];

// ══════════════════════════════════════════════════════ IOT HOOK
function useIoT() {
  const [sensors,setSensors]=useState(PLACES.map((p,i)=>({id:`esp32_${p.id}`,place:p.short,temp:parseFloat((28+i*0.7).toFixed(1)),hum:60+i*2,light:400+i*70,visitors:40+i*28,online:i!==6})));
  const [hist,setHist]=useState(()=>Array.from({length:20},(_,i)=>({t:i,temp:31+Math.sin(i*0.5)*2,hum:65+Math.cos(i*0.4)*8})));
  useEffect(()=>{const id=setInterval(()=>{setSensors(p=>p.map(s=>({...s,temp:parseFloat((s.temp+(Math.random()-0.5)*0.4).toFixed(1)),hum:Math.min(99,Math.max(30,Math.round(s.hum+(Math.random()-0.5)*2))),light:Math.max(0,Math.round(s.light+(Math.random()-0.5)*40)),visitors:Math.max(0,s.visitors+Math.round((Math.random()-0.3)*4))})));setHist(p=>{const l=p[p.length-1];return[...p.slice(-24),{t:l.t+1,temp:parseFloat((l.temp+(Math.random()-0.5)*0.5).toFixed(1)),hum:Math.min(99,Math.max(30,Math.round(l.hum+(Math.random()-0.5)*3)))}];});},2000);return()=>clearInterval(id);},[]);
  return {sensors,hist};
}
function Spark({data,color,h=45}){if(!data.length)return null;const w=200,mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1,pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-mn)/rng)*h}`).join(" ");return(<svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2"/><polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.12"/></svg>);}

// ══════════════════════════════════════════════════════ THREE.JS ENGINE
function buildScene({canvas,onPortal,festivalMode,flyMode,walkPos,walkAngle,avatarColor}){
  const W=canvas.clientWidth,H=canvas.clientHeight;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=flyMode?2.0:festivalMode?1.7:1.3;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(flyMode?0x030c1e:festivalMode?0x090400:0x020812);
  scene.fog=new THREE.FogExp2(scene.background.getHex(),flyMode?0.005:0.009);
  const camera=new THREE.PerspectiveCamera(65,W/H,0.1,600);
  scene.add(new THREE.AmbientLight(festivalMode?0x331100:flyMode?0x102040:0x112255,1.3));
  const sun=new THREE.DirectionalLight(flyMode?0xaaccff:festivalMode?0xff8800:0xffeedd,2.2);
  sun.position.set(30,60,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600,80,80),new THREE.MeshStandardMaterial({color:flyMode?0x0a1520:festivalMode?0x0c0400:0x040f1e,roughness:0.95}));
  ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  scene.add(new THREE.GridHelper(600,80,0x1a0d00,0x060e1a));
  // PATHS
  if(!flyMode){const pm=new THREE.MeshStandardMaterial({color:0x1a2a3a,roughness:0.8});[[0,0,80,4],[0,0,4,80]].forEach(([x,y,w,l])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,l),pm);p.rotation.x=-Math.PI/2;p.position.set(x,0.01,y);scene.add(p);});}
  // RIVERS (fly mode)
  if(flyMode){[[-45,0x0ea5e9,18,0],[5,0x22d3ee,10,Math.PI/6],[32,0x67e8f9,12,-Math.PI/8]].forEach(([x,c,w,rz])=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:0.05,transparent:true,opacity:0.82});const r=new THREE.Mesh(new THREE.PlaneGeometry(w,500),m);r.rotation.x=-Math.PI/2;r.rotation.z=rz;r.position.set(x,0.15,0);scene.add(r);const l=new THREE.PointLight(c,3,50);l.position.set(x,5,0);scene.add(l);});}
  // TEMPLE
  const temple=new THREE.Group();
  const wm=new THREE.MeshStandardMaterial({color:0xf0f4ff,roughness:0.25,emissive:0x4466aa,emissiveIntensity:0.18});
  const gm=new THREE.MeshStandardMaterial({color:0xffd700,roughness:0.08,metalness:0.96,emissive:0xffaa00,emissiveIntensity:0.75});
  [8,6.5,5,3.5].forEach((s,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(s,1.6,s),wm);m.position.y=i*1.6+0.8;m.castShadow=true;temple.add(m);});
  const spire=new THREE.Mesh(new THREE.ConeGeometry(1.2,9.5,12),gm);spire.position.y=4*1.6+4.75;temple.add(spire);
  [-3,3].forEach(x=>[-3,3].forEach(z=>{const s=new THREE.Mesh(new THREE.ConeGeometry(0.28,2.5,8),gm);s.position.set(x,4*1.6+1.25,z);temple.add(s);}));
  [7,5.5].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.08,16,100),new THREE.MeshStandardMaterial({color:0x38bdf8,emissive:0x38bdf8,emissiveIntensity:2.2+i}));ring.rotation.x=Math.PI/2;ring.position.y=2.2;ring.userData.ri=i;temple.add(ring);});
  scene.add(temple);
  const tLight=new THREE.PointLight(0x38bdf8,4.5,30);tLight.position.set(0,10,0);scene.add(tLight);
  // PORTALS
  const pColors=[0xf59e0b,0xa78bfa,0x34d399,0xf87171,0x06b6d4,0x22d3ee,0x67e8f9,0x60a5fa,0xfbbf24,0x4ade80,0xfb923c,0x818cf8];
  const portals=PLACES.map(({name},i)=>{const g=new THREE.Group(),a=(i/PLACES.length)*Math.PI*2,c=pColors[i%pColors.length],R=flyMode?60:28;g.position.set(Math.cos(a)*R,0,Math.sin(a)*R);g.userData={name,isPortal:true};g.add(new THREE.Mesh(new THREE.TorusGeometry(2.8,0.15,16,80),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2.2})));g.add(new THREE.Mesh(new THREE.CircleGeometry(2.7,32),new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:0.13,side:THREE.DoubleSide})));const pl=new THREE.PointLight(c,2.8,14);g.add(pl);scene.add(g);return{group:g,light:pl};});
  // STARS
  const sPos=new Float32Array(5000*3);for(let i=0;i<sPos.length;i++)sPos[i]=(Math.random()-0.5)*700;const sGeo=new THREE.BufferGeometry();sGeo.setAttribute("position",new THREE.BufferAttribute(sPos,3));scene.add(new THREE.Points(sGeo,new THREE.PointsMaterial({color:0xffffff,size:0.5,transparent:true,opacity:0.88})));
  // FIREFLIES
  const FFN=200,ffPos=new Float32Array(FFN*3);for(let i=0;i<FFN;i++){ffPos[i*3]=(Math.random()-0.5)*120;ffPos[i*3+1]=Math.random()*16+1;ffPos[i*3+2]=(Math.random()-0.5)*120;}
  const ffGeo=new THREE.BufferGeometry();ffGeo.setAttribute("position",new THREE.BufferAttribute(ffPos,3));scene.add(new THREE.Points(ffGeo,new THREE.PointsMaterial({color:festivalMode?0xff9900:0xffd700,size:0.72,transparent:true,opacity:1})));
  // FESTIVAL
  const festElems=[];
  if(festivalMode){for(let i=0;i<40;i++){const a=(i/40)*Math.PI*2,r=14+(i%3)*2.2,g=new THREE.Group();g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);const body=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,2.8,8),new THREE.MeshStandardMaterial({color:0xfffde7}));body.position.y=1.4;g.add(body);const flame=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,8),new THREE.MeshStandardMaterial({color:0xff6600,emissive:0xff4400,emissiveIntensity:5,transparent:true,opacity:0.92}));flame.position.y=2.9;g.add(flame);const fl=new THREE.PointLight(0xff8800,1.4,7);fl.position.y=2.9;g.add(fl);scene.add(g);festElems.push({flame,light:fl,phase:Math.random()*Math.PI*2});}for(let i=0;i<30;i++){const lant=new THREE.Mesh(new THREE.SphereGeometry(0.38,8,8),new THREE.MeshStandardMaterial({color:0xff9900,emissive:0xff6600,emissiveIntensity:3.5,transparent:true,opacity:0.88}));lant.position.set((Math.random()-0.5)*90,8+Math.random()*22,(Math.random()-0.5)*90);lant.userData={baseY:lant.position.y,ph:Math.random()*Math.PI*2,hs:(Math.random()-0.5)*0.016};scene.add(lant);festElems.push({lant,isLant:true});}}
  // BUILDINGS
  for(let i=0;i<100;i++){const a=Math.random()*Math.PI*2,d=Math.random()*80+45,h=Math.random()*14+2,w=Math.random()*2.8+1;const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({color:[0x0a1f3d,0x0d2a4a,0x091828,0x122a44][i%4],roughness:0.8}));m.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);m.castShadow=true;scene.add(m);}
  // TREES
  if(!flyMode){for(let i=0;i<50;i++){const a=Math.random()*Math.PI*2,d=Math.random()*40+15;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.3,2.5,8),new THREE.MeshStandardMaterial({color:0x4a2c0a}));trunk.position.set(Math.cos(a)*d,1.25,Math.sin(a)*d);scene.add(trunk);const foliage=new THREE.Mesh(new THREE.SphereGeometry(1.4+Math.random()*0.6,8,8),new THREE.MeshStandardMaterial({color:0x0d4a0a,roughness:0.9}));foliage.position.set(Math.cos(a)*d,3.5+Math.random(),Math.sin(a)*d);scene.add(foliage);}}
  // PLAYER AVATAR
  const pGroup=new THREE.Group();
  const col=parseInt(avatarColor.replace("#","0x"));
  const pBodyMat=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:0.3});
  const pBody=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,1.5,10),pBodyMat);pBody.position.y=0.75;pBody.castShadow=true;pGroup.add(pBody);
  const pHead=new THREE.Mesh(new THREE.SphereGeometry(0.48,16,16),new THREE.MeshStandardMaterial({color:0xd4956a}));pHead.position.y=1.8;pGroup.add(pHead);
  const pHalo=new THREE.Mesh(new THREE.TorusGeometry(0.6,0.045,8,32),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:3.5}));pHalo.rotation.x=Math.PI/2;pHalo.position.y=2.3;pGroup.add(pHalo);
  const legMat=new THREE.MeshStandardMaterial({color:col,roughness:0.7});
  const legL=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.12,1,8),legMat);legL.position.set(-0.22,-0.25,0);pGroup.add(legL);
  const legR=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.12,1,8),legMat);legR.position.set(0.22,-0.25,0);pGroup.add(legR);
  const armL=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.9,8),legMat);armL.position.set(-0.58,0.8,0);armL.rotation.z=0.3;pGroup.add(armL);
  const armR=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.9,8),legMat);armR.position.set(0.58,0.8,0);armR.rotation.z=-0.3;pGroup.add(armR);
  const wingMat=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x1d4ed8,emissiveIntensity:0.7,transparent:true,opacity:0.85,side:THREE.DoubleSide});
  const wingL=new THREE.Mesh(new THREE.ConeGeometry(0,4.5,3),wingMat);wingL.rotation.z=-Math.PI/2.2;wingL.position.set(-2.8,0.6,0);wingL.visible=flyMode;pGroup.add(wingL);
  const wingR=new THREE.Mesh(new THREE.ConeGeometry(0,4.5,3),wingMat);wingR.rotation.z=Math.PI/2.2;wingR.position.set(2.8,0.6,0);wingR.visible=flyMode;pGroup.add(wingR);
  pGroup.position.set(walkPos.x,flyMode?35:0,walkPos.z);scene.add(pGroup);
  const pLight=new THREE.PointLight(col,2.5,10);scene.add(pLight);
  // NPC WALKERS
  const npcs=[0xff6b6b,0x4ecdc4,0xffe66d,0xa8e6cf,0xf8a5c2].map((c,i)=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,1.4,8),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.3}));const hd=new THREE.Mesh(new THREE.SphereGeometry(0.4,12,12),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.4}));hd.position.y=1.3;const hl=new THREE.Mesh(new THREE.TorusGeometry(0.52,0.04,8,30),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:3}));hl.rotation.x=Math.PI/2;hl.position.y=1.9;g.add(b,hd,hl);g.userData={angle:(i/5)*Math.PI*2,radius:flyMode?22+i*5:12+i*4,speed:0.16+i*0.04};g.position.y=flyMode?30:0.7;scene.add(g);return g;});
  // CONTROLS
  let camOrbit={theta:0,phi:0.5,r:flyMode?18:12},isDrag=false,prev={x:0,y:0};
  const onMD=e=>{isDrag=true;prev={x:e.clientX,y:e.clientY};};
  const onMU=()=>{isDrag=false;};
  const onMM=e=>{if(!isDrag)return;camOrbit.theta-=(e.clientX-prev.x)*0.005;camOrbit.phi=Math.max(0.05,Math.min(1.35,camOrbit.phi+(e.clientY-prev.y)*0.005));prev={x:e.clientX,y:e.clientY};};
  const onWH=e=>{camOrbit.r=Math.max(6,Math.min(flyMode?80:35,camOrbit.r+e.deltaY*0.04));};
  canvas.addEventListener("mousedown",onMD);canvas.addEventListener("mouseup",onMU);canvas.addEventListener("mousemove",onMM);canvas.addEventListener("wheel",onWH);
  const ray=new THREE.Raycaster(),m2=new THREE.Vector2();
  canvas.addEventListener("click",e=>{const rect=canvas.getBoundingClientRect();m2.x=((e.clientX-rect.left)/rect.width)*2-1;m2.y=-((e.clientY-rect.top)/rect.height)*2+1;ray.setFromCamera(m2,camera);for(const hit of ray.intersectObjects(scene.children,true)){let obj=hit.object;while(obj.parent&&!obj.userData.isPortal)obj=obj.parent;if(obj.userData.isPortal){onPortal(obj.userData.name);break;}}});
  const clock=new THREE.Clock();let animId;
  const templeRings=temple.children.filter(c=>c.userData.ri!==undefined);
  const state={pos:{...walkPos},angle:walkAngle,isMoving:false};
  function animate(){animId=requestAnimationFrame(animate);const t=clock.getElapsedTime();
    templeRings.forEach((r,i)=>{r.rotation.z=t*(0.4+i*0.3);});spire.rotation.y=t*0.5;tLight.intensity=3.5+Math.sin(t*1.5)*0.9;
    portals.forEach(({group,light},i)=>{group.rotation.y=t*(0.25+i*0.04);group.position.y=Math.sin(t*0.5+i*1.1)*0.6+(flyMode?3.5:3);light.intensity=2.2+Math.sin(t*1.8+i)*0.7;});
    festElems.forEach(e=>{if(e.isLant){e.lant.position.y=e.lant.userData.baseY+Math.sin(t*0.3+e.lant.userData.ph)*1.6;e.lant.position.x+=e.lant.userData.hs;if(Math.abs(e.lant.position.x)>55)e.lant.userData.hs*=-1;}else if(e.flame){e.flame.scale.setScalar(1+Math.sin(t*8+e.phase)*0.14);e.light.intensity=1.4+Math.sin(t*7+e.phase)*0.45;}});
    const ff=ffGeo.attributes.position.array;for(let i=0;i<FFN;i++){ff[i*3]+=Math.sin(t*0.3+i*0.7)*0.04;ff[i*3+1]=Math.sin(t*0.4+i*0.5)*(flyMode?10:5)+(flyMode?15:5);ff[i*3+2]+=Math.cos(t*0.3+i*0.6)*0.04;}ffGeo.attributes.position.needsUpdate=true;
    npcs.forEach(p=>{p.userData.angle+=p.userData.speed*0.01;p.position.x=Math.cos(p.userData.angle)*p.userData.radius;p.position.z=Math.sin(p.userData.angle)*p.userData.radius;p.rotation.y=-p.userData.angle+Math.PI/2;p.position.y=flyMode?30:0.7;});
    pGroup.position.x+=(state.pos.x-pGroup.position.x)*0.18;pGroup.position.z+=(state.pos.z-pGroup.position.z)*0.18;pGroup.position.y=flyMode?35+Math.sin(t*1.2)*1.5:0;pGroup.rotation.y=state.angle;
    if(state.isMoving){legL.position.y=-0.25+Math.sin(t*8)*0.3;legL.rotation.x=Math.sin(t*8)*0.5;legR.position.y=-0.25+Math.sin(t*8+Math.PI)*0.3;legR.rotation.x=Math.sin(t*8+Math.PI)*0.5;armL.rotation.x=Math.sin(t*8+Math.PI)*0.4;armR.rotation.x=Math.sin(t*8)*0.4;}else{legL.position.y=legR.position.y=-0.25;legL.rotation.x=legR.rotation.x=armL.rotation.x=armR.rotation.x=0;}
    if(flyMode){wingL.rotation.z=-(Math.PI/2.2+Math.sin(t*4)*0.35);wingR.rotation.z=Math.PI/2.2+Math.sin(t*4)*0.35;}
    pLight.position.copy(pGroup.position);pLight.position.y+=2;
    const camT=new THREE.Vector3(pGroup.position.x,pGroup.position.y+(flyMode?2:1),pGroup.position.z);
    const cx=camT.x+Math.sin(camOrbit.theta)*Math.sin(camOrbit.phi)*camOrbit.r;
    const cy=camT.y+Math.cos(camOrbit.phi)*camOrbit.r;
    const cz=camT.z+Math.cos(camOrbit.theta)*Math.sin(camOrbit.phi)*camOrbit.r;
    camera.position.lerp(new THREE.Vector3(cx,Math.max(flyMode?10:1.5,cy),cz),0.1);camera.lookAt(camT);renderer.render(scene,camera);}
  animate();
  const onResize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  window.addEventListener("resize",onResize);
  return{dispose:()=>{cancelAnimationFrame(animId);["mousedown","mouseup","mousemove","wheel"].forEach(ev=>canvas.removeEventListener(ev,ev==="mousedown"?onMD:ev==="mouseup"?onMU:ev==="mousemove"?onMM:onWH));window.removeEventListener("resize",onResize);renderer.dispose();},updateState:(pos,angle,isMoving)=>{state.pos=pos;state.angle=angle;state.isMoving=isMoving;}};
}

// ══════════════════════════════════════════════════════ LOGIN SCREEN
function LoginScreen({onStart}){
  const [anim,setAnim]=useState(false);
  useEffect(()=>{setTimeout(()=>setAnim(true),100);},[]);
  return(
    <div style={{height:"100vh",background:"#010812",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes loginFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes loginGlow{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes loginPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}
        @keyframes loginSlide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes loginSpin{to{transform:rotate(360deg)}}
        @keyframes loginBlink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes loginRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes loginStar{0%{opacity:0;transform:scale(0)}50%{opacity:1}100%{opacity:0;transform:scale(1.5) translateY(-20px)}}
      `}</style>
      {/* PARTICLE STARS */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {Array.from({length:80}).map((_,i)=>(
          <div key={i} style={{position:"absolute",width:i%5===0?3:i%3===0?2:1.5,height:i%5===0?3:i%3===0?2:1.5,borderRadius:"50%",background:i%7===0?"#f59e0b":i%5===0?"#38bdf8":"white",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.6+0.2,animation:`loginPulse ${Math.random()*4+2}s ${Math.random()*3}s infinite`}}/>
        ))}
        {/* Floating orbs */}
        {[0,1,2,3].map(i=>(
          <div key={`orb${i}`} style={{position:"absolute",width:80+i*40,height:80+i*40,borderRadius:"50%",background:`radial-gradient(circle,${["#f59e0b","#38bdf8","#a78bfa","#34d399"][i]}11,transparent 70%)`,top:`${[20,60,30,70][i]}%`,left:`${[15,70,45,25][i]}%`,animation:`loginFloat ${5+i*2}s ${i}s ease-in-out infinite`}}/>
        ))}
      </div>
      {/* BACKGROUND SILHOUETTE */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:220,overflow:"hidden",pointerEvents:"none"}}>
        <svg viewBox="0 0 800 220" style={{width:"100%",height:"100%"}} preserveAspectRatio="none">
          {/* Temple silhouette */}
          <polygon points="360,220 360,80 380,60 400,20 420,60 440,80 440,220" fill="#0a1628" opacity="0.9"/>
          <polygon points="375,220 375,110 385,100 390,85 395,100 405,100 410,85 415,100 425,110 425,220" fill="#0d1e35"/>
          {/* City skyline */}
          {[[50,180],[80,160],[120,140],[160,170],[480,165],[520,145],[560,170],[600,150],[650,175],[700,155],[750,180]].map(([x,y],i)=>(
            <rect key={i} x={x} y={y} width={25+i%3*10} height={220-y} fill="#060f1c"/>
          ))}
          {/* River reflection */}
          <rect x="0" y="195" width="800" height="25" fill="#06b6d408"/>
        </svg>
      </div>
      {/* MAIN CONTENT */}
      <div style={{position:"relative",zIndex:10,textAlign:"center",opacity:anim?1:0,transition:"opacity 1s ease"}}>
        {/* Logo rings */}
        <div style={{position:"relative",width:160,height:160,margin:"0 auto 24px"}}>
          {[160,130,100].map((s,i)=>(
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:s,height:s,marginLeft:-s/2,marginTop:-s/2,borderRadius:"50%",border:`1.5px solid ${["#f59e0b","#38bdf8","#a78bfa"][i]}`,opacity:0.4+i*0.15,animation:`loginRing ${3+i*0.8}s ${i*0.4}s ease-out infinite`}}/>
          ))}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#0d2040,#1a0a3d)",border:"2px solid #38bdf844",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,animation:"loginGlow 3s ease-in-out infinite",boxShadow:"0 0 40px #38bdf833"}}>
            🌏
          </div>
        </div>
        {/* Title */}
        <div style={{marginBottom:8,animation:"loginSlide 0.8s 0.3s ease both"}}>
          <div style={{fontSize:13,letterSpacing:6,color:"#38bdf8",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>META WORLD</div>
          <div style={{fontSize:28,fontWeight:900,background:"linear-gradient(135deg,#fbbf24,#f59e0b,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>UBON RATCHATHANI</div>
          <div style={{fontSize:13,color:"#f59e0b",fontWeight:700,marginTop:4,letterSpacing:1}}>อุบลราชธานี เมต้าเวิร์ด</div>
        </div>
        {/* Slogan */}
        <div style={{color:"#64748b",fontSize:12,marginBottom:32,lineHeight:1.8,animation:"loginSlide 0.8s 0.5s ease both"}}>
          เมืองดอกบัวงาม แม่น้ำสามสาย<br/>งามวิไล หลายวัฒนธรรม
        </div>
        {/* Badges */}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:32,flexWrap:"wrap",animation:"loginSlide 0.8s 0.6s ease both"}}>
          {[["🌏","โลกเสมือน 3D"],["🤖","AI Guide"],["🦅","ปีกบิน"],["📖","เรื่องราว"],["🗺️","แผนที่อุบล"]].map(([e,l],i)=>(
            <div key={i} style={{background:"#0d1f35",border:"1px solid #1e3a5a",borderRadius:20,padding:"5px 12px",display:"flex",gap:5,alignItems:"center"}}>
              <span style={{fontSize:12}}>{e}</span><span style={{color:"#64748b",fontSize:10}}>{l}</span>
            </div>
          ))}
        </div>
        {/* MAIN BUTTON */}
        <div style={{animation:"loginSlide 0.8s 0.8s ease both"}}>
          <button onClick={onStart} style={{background:"linear-gradient(135deg,#1d4ed8,#38bdf8)",border:"none",borderRadius:14,color:"white",padding:"16px 48px",fontSize:16,fontWeight:900,cursor:"pointer",letterSpacing:1,boxShadow:"0 0 30px #38bdf833",position:"relative",overflow:"hidden",marginBottom:12}}>
            <span style={{position:"relative",zIndex:1}}>⚔️ เข้าสู่โลกเสมือน</span>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,transparent,rgba(255,255,255,0.1),transparent)",animation:"loginSpin 3s linear infinite"}}/>
          </button>
          <div style={{color:"#334155",fontSize:10}}>v5.0 · Senior Project · CPAI Year 4</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ AVATAR CREATOR
function AvatarCreator({onComplete}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [outfit,setOutfit]=useState(0);
  const [skin,setSkin]=useState("#d4956a");
  const [hair,setHair]=useState(0);
  const [hairCol,setHairCol]=useState("#1a0a00");
  const [eye,setEye]=useState("#4a2c0a");
  const o=OUTFITS[outfit];
  const steps=["ชื่อ","ชุด","รูปร่าง","ตา"];
  return(
    <div style={{height:"100vh",background:"linear-gradient(135deg,#010812 0%,#0a1628 50%,#010812 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <style>{`@keyframes avFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes avPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden"}}>{Array.from({length:40}).map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",background:"white",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.4+0.1,animation:`avPulse ${Math.random()*3+2}s infinite`}}/>)}</div>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:460}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:4}}>🌏</div>
          <div style={{fontSize:18,fontWeight:900,background:"linear-gradient(135deg,#f59e0b,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>สร้างอวาตาร์ของคุณ</div>
          <div style={{color:"#475569",fontSize:11,marginTop:2}}>Meta World Ubon Ratchathani</div>
        </div>
        {/* Steps */}
        <div style={{display:"flex",gap:4,marginBottom:16,justifyContent:"center"}}>
          {steps.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:22,height:22,borderRadius:"50%",background:step>=i?"#38bdf8":"#1e293b",border:`2px solid ${step>=i?"#38bdf8":"#334155"}`,color:step>=i?"#fff":"#475569",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{step>i?"✓":i+1}</div><span style={{color:step>=i?"#38bdf8":"#475569",fontSize:9}}>{s}</span>{i<3&&<div style={{width:10,height:1,background:step>i?"#38bdf8":"#1e293b"}}/>}</div>)}
        </div>
        {/* Preview */}
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:skin,margin:"0 auto 5px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:`0 0 25px ${o.color}66`,border:`3px solid ${o.color}`,position:"relative"}}>
            {o.emoji}
            <div style={{position:"absolute",top:-5,right:-5,width:18,height:18,borderRadius:"50%",background:hairCol,border:"2px solid #0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>{HAIR_STYLES[hair].e}</div>
            <div style={{position:"absolute",bottom:-3,right:-3,width:12,height:12,borderRadius:"50%",background:eye,border:"2px solid #0f172a"}}/>
          </div>
          <div style={{color:o.color,fontWeight:700,fontSize:12}}>{name||"ชื่อของคุณ"}</div>
          <div style={{color:"#64748b",fontSize:10}}>{o.desc}</div>
        </div>
        {/* Step panels */}
        {step===0&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avFadeUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:12,marginBottom:10}}>ตั้งชื่อในโลกเสมือนจริง</p>
          <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(1)} placeholder="เช่น นักรบอุบล, สาวโขงเจียม, บักหำน้อย..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:13,outline:"none",marginBottom:10}}/>
          <button onClick={()=>name.trim()&&setStep(1)} style={{width:"100%",background:name.trim()?"linear-gradient(135deg,#1d4ed8,#38bdf8)":"#1e293b",border:"none",borderRadius:8,color:name.trim()?"white":"#475569",padding:"10px",fontSize:13,fontWeight:700,cursor:name.trim()?"pointer":"default"}}>ถัดไป →</button>
        </div>}
        {step===1&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avFadeUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:12,marginBottom:10}}>เลือกชุดอวาตาร์</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
            {OUTFITS.map((a,i)=><div key={a.id} onClick={()=>setOutfit(i)} style={{background:outfit===i?a.color+"20":"#1e293b",border:`2px solid ${outfit===i?a.color:"#334155"}`,borderRadius:9,padding:"10px 6px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:3}}>{a.emoji}</div>
              <div style={{color:outfit===i?a.color:"#94a3b8",fontWeight:700,fontSize:10}}>{a.label}</div>
            </div>)}
          </div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(0)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"9px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>setStep(2)} style={{flex:2,background:"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:8,color:"white",padding:"9px",fontSize:11,fontWeight:700,cursor:"pointer"}}>ถัดไป →</button></div>
        </div>}
        {step===2&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avFadeUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>สีผิว</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>{SKIN_COLORS.map(c=><div key={c} onClick={()=>setSkin(c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:`3px solid ${skin===c?"#38bdf8":"transparent"}`,cursor:"pointer"}}/>)}</div>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>ทรงผม</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{HAIR_STYLES.map((h,i)=><div key={h.id} onClick={()=>setHair(i)} style={{background:hair===i?"#1d4ed820":"#1e293b",border:`2px solid ${hair===i?"#38bdf8":"#334155"}`,borderRadius:7,padding:"5px 8px",cursor:"pointer",display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:12}}>{h.e}</span><span style={{color:hair===i?"#38bdf8":"#94a3b8",fontSize:9}}>{h.l}</span></div>)}</div>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:7}}>สีผม</p>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>{HAIR_COLORS.map(c=><div key={c} onClick={()=>setHairCol(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:`3px solid ${hairCol===c?"#a78bfa":"transparent"}`,cursor:"pointer",boxShadow:c==="#000"?"0 0 0 1px #334155":"none"}}/>)}</div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(1)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"8px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>setStep(3)} style={{flex:2,background:"linear-gradient(135deg,#34d399,#06b6d4)",border:"none",borderRadius:8,color:"white",padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>ถัดไป →</button></div>
        </div>}
        {step===3&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:18,animation:"avFadeUp 0.3s ease"}}>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:9}}>สีตา</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>{EYE_COLORS.map(c=><div key={c} onClick={()=>setEye(c)} style={{width:32,height:32,borderRadius:"50%",background:c,border:`3px solid ${eye===c?"#fbbf24":"transparent"}`,cursor:"pointer",boxShadow:eye===c?`0 0 10px ${c}88`:"none"}}/>)}</div>
          <div style={{background:"#1e293b",borderRadius:8,padding:11,marginBottom:12}}>
            <p style={{color:"#64748b",fontSize:9,marginBottom:6}}>📋 สรุปอวาตาร์</p>
            {[["ชื่อ",name],["ชุด",o.label],["ผม",HAIR_STYLES[hair].l]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#64748b",fontSize:9}}>{k}</span><span style={{color:"#e2e8f0",fontSize:9}}>{v}</span></div>)}
          </div>
          <div style={{display:"flex",gap:7}}><button onClick={()=>setStep(2)} style={{flex:1,background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"8px",fontSize:11,cursor:"pointer"}}>← กลับ</button><button onClick={()=>onComplete({name,outfit:o,skin,hair,hairCol,eye})} style={{flex:2,background:"linear-gradient(135deg,#f59e0b,#ef4444)",border:"none",borderRadius:8,color:"white",padding:"8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>🚀 เข้าสู่โลกเสมือน!</button></div>
        </div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ PROVINCE MAP
function ProvinceMap({onWarp,onStory,visited}){
  const [selDistrict,setSelDistrict]=useState(null);
  const d=selDistrict?UBON_DISTRICTS.find(d=>d.id===selDistrict):null;
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:"linear-gradient(135deg,#020c1b,#050a1a)"}}>
      <div style={{background:"#020812",borderBottom:"1px solid #0d2a44",padding:"12px 18px",flexShrink:0}}>
        <div style={{color:"#38bdf8",fontWeight:800,fontSize:16}}>🗺️ แผนที่จังหวัดอุบลราชธานี</div>
        <div style={{color:"#475569",fontSize:10,marginTop:2}}>คลิกเลือกอำเภอ · วาร์ปสถานที่ · เรียนรู้เรื่องราว</div>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* MAP SVG */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <svg viewBox="0 60 450 380" style={{width:"100%",height:"100%"}}>
            {/* Background */}
            <rect x="0" y="0" width="450" height="480" fill="#030c1a"/>
            {/* Province outline */}
            <polygon points="80,130 120,110 180,105 230,100 280,108 320,120 360,130 380,160 375,200 360,240 350,270 340,300 310,330 270,360 230,380 190,385 150,375 110,350 85,320 70,285 65,240 68,195 72,165" fill="#0a1828" stroke="#1e3a5a" strokeWidth="2"/>
            {/* Rivers */}
            {RIVERS_SVG.map((r,i)=><path key={i} d={r.path} fill="none" stroke={r.color} strokeWidth={r.width} strokeLinecap="round" opacity="0.7"/>)}
            {/* River labels */}
            <text x="85" y="258" fill="#06b6d4" fontSize="7" fontWeight="bold">แม่น้ำโขง</text>
            <text x="100" y="262" fill="#67e8f9" fontSize="6">แม่น้ำมูล</text>
            {/* Districts */}
            {UBON_DISTRICTS.map(d=>{
              const isV=visited.has(d.id),isSel=selDistrict===d.id;
              return(<g key={d.id} onClick={()=>setSelDistrict(isSel?null:d.id)} style={{cursor:"pointer"}}>
                <circle cx={d.x} cy={d.y} r={d.r} fill={isSel?d.color+"22":isV?d.color+"14":"#0d1e30"} stroke={isSel?d.color:isV?d.color+"88":"#1e3a5a"} strokeWidth={isSel?2:1.5}/>
                {isSel&&<circle cx={d.x} cy={d.y} r={d.r+6} fill="none" stroke={d.color} strokeWidth="1" opacity="0.4" strokeDasharray="4 3"/>}
                <text x={d.x} y={d.y-8} textAnchor="middle" fill={isSel?d.color:"#94a3b8"} fontSize="10" fontWeight={isSel?"700":"500"}>{d.emoji}</text>
                <text x={d.x} y={d.y+6} textAnchor="middle" fill={isSel?d.color:"#64748b"} fontSize="8" fontWeight={isSel?"700":"400"}>{d.name}</text>
                {isV&&<circle cx={d.x+d.r*0.7} cy={d.y-d.r*0.7} r="5" fill={d.color}/>}
                {isV&&<text x={d.x+d.r*0.7} y={d.y-d.r*0.7+3.5} textAnchor="middle" fill="white" fontSize="6" fontWeight="700">✓</text>}
              </g>);
            })}
            {/* Legend */}
            <text x="88" y="395" fill="#334155" fontSize="7">🗺️ อุบลราชธานี · แผนที่เสมือนจริง</text>
          </svg>
        </div>
        {/* DISTRICT DETAIL */}
        <div style={{width:220,borderLeft:"1px solid #0d2a44",overflowY:"auto",background:"#020c1b",flexShrink:0}}>
          {d?(
            <div style={{padding:16,animation:"avFadeUp 0.3s ease"}}>
              <div style={{fontSize:28,marginBottom:6}}>{d.emoji}</div>
              <div style={{color:d.color,fontWeight:800,fontSize:14,marginBottom:4}}>{d.name}</div>
              <div style={{color:"#64748b",fontSize:11,lineHeight:1.6,marginBottom:12}}>{d.story}</div>
              {/* Landmarks */}
              <div style={{color:"#94a3b8",fontSize:10,fontWeight:700,marginBottom:7}}>📍 สถานที่สำคัญ</div>
              {d.landmarks.map((lm,i)=>(
                <div key={i} style={{display:"flex",gap:7,alignItems:"center",padding:"5px 0",borderBottom:i<d.landmarks.length-1?"1px solid #0d1e30":"none"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:d.color,flexShrink:0}}/>
                  <span style={{color:"#64748b",fontSize:10}}>{lm}</span>
                </div>
              ))}
              {/* Buttons */}
              <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:7}}>
                {PLACES.filter(p=>p.district===d.id).map(p=>(
                  <button key={p.id} onClick={()=>onWarp(p.name)} style={{background:p.color+"18",border:`1px solid ${p.color}44`,color:p.color,borderRadius:8,padding:"7px 10px",fontSize:10,fontWeight:700,cursor:"pointer",textAlign:"left",display:"flex",gap:6,alignItems:"center"}}>
                    <span>{p.emoji}</span><span>{p.short}</span><span style={{marginLeft:"auto"}}>→</span>
                  </button>
                ))}
                {STORIES.filter(s=>s.location.includes(d.landmarks[0])||s.id==="naga"&&d.id==="khongjiam"||s.id==="phataem"&&d.id==="khongjiam"||s.id==="candle"&&d.id==="muang"||s.id==="mekong"&&d.id==="khongjiam"||s.id==="boatfire"&&d.id==="warin").slice(0,2).map(s=>(
                  <button key={s.id} onClick={()=>onStory(s.id)} style={{background:s.accent+"10",border:`1px solid ${s.accent}33`,color:s.accent,borderRadius:8,padding:"7px 10px",fontSize:10,fontWeight:700,cursor:"pointer",textAlign:"left",display:"flex",gap:6,alignItems:"center"}}>
                    <span>{s.char.emoji}</span><span style={{fontSize:9,lineHeight:1.3}}>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ):(
            <div style={{padding:20,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>🗺️</div>
              <div style={{color:"#64748b",fontSize:11,lineHeight:1.8}}>เลือกอำเภอบนแผนที่เพื่อดูข้อมูลสถานที่และเรื่องราว</div>
              <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
                {UBON_DISTRICTS.slice(0,4).map(d=><button key={d.id} onClick={()=>setSelDistrict(d.id)} style={{background:"#0d1e30",border:"1px solid #1e3a5a",borderRadius:8,padding:"8px",color:"#64748b",fontSize:10,cursor:"pointer",display:"flex",gap:6,alignItems:"center"}}><span>{d.emoji}</span><span>{d.name}</span></button>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ STORY MODE
function StoryMode({storyId,onClose,onComplete}){
  const {speak,stop}=useTTS();
  const story=STORIES.find(s=>s.id===storyId)||STORIES[0];
  const [ch,setCh]=useState(0);
  const [textIdx,setTextIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const chapter=story.chapters[ch];
  const fullText=chapter.text;
  useEffect(()=>{setTextIdx(0);stop();},[ch]);
  // Typing effect
  useEffect(()=>{if(textIdx<fullText.length){const t=setTimeout(()=>setTextIdx(p=>p+1),22);return()=>clearTimeout(t);}},[textIdx,fullText]);
  const handleSpeak=()=>{setPlaying(true);speak(chapter.title+"... "+fullText,{rate:0.85,pitch:story.char.emoji==="🐉"?0.7:story.char.emoji==="🧙"?0.8:1.1});setTimeout(()=>setPlaying(false),(fullText.length/10)*1200);};
  const handleStop=()=>{stop();setPlaying(false);};
  const handleNext=()=>{stop();setPlaying(false);if(ch<story.chapters.length-1){setCh(p=>p+1);}else{onComplete(story);}};
  const handlePrev=()=>{stop();setPlaying(false);if(ch>0)setCh(p=>p-1);};
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:story.bg,position:"relative",overflow:"hidden"}}>
      <style>{`@keyframes stScene{0%{opacity:0;transform:scale(0.9)}100%{opacity:1;transform:scale(1)}} @keyframes stText{from{opacity:0}to{opacity:1}} @keyframes stFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes stGlow{0%,100%{box-shadow:0 0 20px ${story.accent}44}50%{box-shadow:0 0 40px ${story.accent}88}}`}</style>
      {/* BG PARTICLES */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {Array.from({length:30}).map((_,i)=><div key={i} style={{position:"absolute",width:i%4===0?4:2,height:i%4===0?4:2,borderRadius:"50%",background:story.accent,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:Math.random()*0.3+0.1,animation:`stFloat ${3+i*0.3}s ${i*0.2}s ease-in-out infinite`}}/>)}
      </div>
      {/* HEADER */}
      <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",padding:"12px 18px",borderBottom:`1px solid ${story.accent}33`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:10}}>
        <div>
          <div style={{color:story.accent,fontWeight:800,fontSize:14}}>{story.title}</div>
          <div style={{color:"#64748b",fontSize:9}}>📍 {story.location}</div>
        </div>
        <button onClick={()=>{stop();onClose();}} style={{background:"transparent",border:`1px solid ${story.accent}44`,color:story.accent,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10}}>✕ ปิด</button>
      </div>
      {/* MAIN STORY */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:10}}>
        {/* SCENE EMOJI */}
        <div style={{fontSize:72,marginBottom:16,animation:"stScene 0.6s ease, stFloat 4s ease-in-out infinite"}}>{chapter.scene}</div>
        {/* CHARACTER */}
        <div style={{display:"flex",gap:14,alignItems:"center",background:"rgba(0,0,0,0.5)",borderRadius:16,padding:"14px 20px",marginBottom:20,border:`1px solid ${story.char.color}33`,backdropFilter:"blur(8px)",animation:"stGlow 3s ease-in-out infinite",maxWidth:500,width:"100%"}}>
          <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${story.char.color}22,${story.char.color}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`2px solid ${story.char.color}66`,flexShrink:0}}>{story.char.emoji}</div>
          <div>
            <div style={{color:story.char.color,fontWeight:700,fontSize:12,marginBottom:2}}>{story.char.name}</div>
            <div style={{color:"#94a3b8",fontSize:10}}>{story.char.desc}</div>
          </div>
        </div>
        {/* CHAPTER TITLE */}
        <div style={{color:story.accent,fontWeight:800,fontSize:16,marginBottom:10,textAlign:"center"}}>{chapter.title}</div>
        {/* STORY TEXT (typing) */}
        <div style={{color:"#e2e8f0",fontSize:13,lineHeight:1.9,textAlign:"center",maxWidth:480,background:"rgba(0,0,0,0.4)",borderRadius:12,padding:18,border:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(8px)",minHeight:100}}>
          {fullText.substring(0,textIdx)}
          {textIdx<fullText.length&&<span style={{animation:"stText 0.5s ease infinite",color:story.accent}}>|</span>}
        </div>
        {/* CHAPTER DOTS */}
        <div style={{display:"flex",gap:6,marginTop:16}}>
          {story.chapters.map((_,i)=><div key={i} onClick={()=>{stop();setPlaying(false);setCh(i);}} style={{width:i===ch?20:8,height:8,borderRadius:4,background:i===ch?story.accent:"#1e293b",cursor:"pointer",transition:"all 0.3s"}}/>)}
        </div>
      </div>
      {/* CONTROLS */}
      <div style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",padding:"14px 20px",borderTop:`1px solid ${story.accent}22`,display:"flex",gap:8,alignItems:"center",zIndex:10,flexShrink:0}}>
        <button onClick={handlePrev} disabled={ch===0} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"8px 14px",fontSize:12,cursor:ch===0?"default":"pointer",opacity:ch===0?0.4:1}}>← ก่อนหน้า</button>
        {playing
          ?<button onClick={handleStop} style={{background:"#ef444422",border:"1px solid #ef4444",color:"#ef4444",borderRadius:8,padding:"8px 14px",fontSize:11,cursor:"pointer",fontWeight:700}}>⏹ หยุดเสียง</button>
          :<button onClick={handleSpeak} style={{background:story.accent+"22",border:`1px solid ${story.accent}`,color:story.accent,borderRadius:8,padding:"8px 14px",fontSize:11,cursor:"pointer",fontWeight:700}}>🔊 ฟังเสียงไทย</button>}
        <button onClick={handleNext} style={{flex:1,background:`linear-gradient(135deg,${story.accent}44,${story.accent}22)`,border:`1px solid ${story.accent}`,color:story.accent,borderRadius:8,padding:"8px 14px",fontSize:12,cursor:"pointer",fontWeight:700}}>
          {ch<story.chapters.length-1?"บทถัดไป →":"✓ จบเรื่องราว (รับ "+story.reward.xp+" XP)"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ STORY LIST
function StoryList({onSelect,completed}){
  return(
    <div style={{padding:18,display:"flex",flexDirection:"column",gap:14,height:"100%",overflowY:"auto"}}>
      <div><div style={{color:"#f59e0b",fontWeight:800,fontSize:17}}>📖 เรื่องราวแห่งอุบลฯ</div><div style={{color:"#64748b",fontSize:11}}>ตำนาน ประวัติศาสตร์ และวัฒนธรรม · อ่านแล้ว {completed.size}/{STORIES.length} เรื่อง</div></div>
      {STORIES.map(s=>{const done=completed.has(s.id);return(
        <div key={s.id} onClick={()=>onSelect(s.id)} style={{background:done?s.accent+"10":"#0f172a",border:`2px solid ${done?s.accent:"#1e293b"}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}>
          {done&&<div style={{position:"absolute",top:10,right:10,background:s.accent,borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>✓</div>}
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${s.char.color}22,${s.char.color}44)`,border:`2px solid ${s.char.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.char.emoji}</div>
            <div style={{flex:1}}>
              <div style={{color:s.accent,fontWeight:800,fontSize:13,marginBottom:2}}>{s.title}</div>
              <div style={{color:"#64748b",fontSize:10,marginBottom:6}}>{s.subtitle}</div>
              <div style={{color:"#475569",fontSize:10,marginBottom:8}}>📍 {s.location} · {s.chapters.length} บท</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{background:s.accent+"20",color:s.accent,borderRadius:20,padding:"3px 9px",fontSize:10,fontWeight:700}}>🏆 {s.reward.xp} XP</span>
                {done&&<span style={{color:s.accent,fontSize:10}}>✓ {s.reward.item}</span>}
                <span style={{marginLeft:"auto",color:s.accent,fontSize:11,fontWeight:700}}>อ่านเรื่อง →</span>
              </div>
            </div>
          </div>
          {/* Chapter preview */}
          <div style={{marginTop:12,display:"flex",gap:5}}>
            {s.chapters.map((c,i)=><div key={i} style={{flex:1,background:s.accent+"15",borderRadius:4,padding:"4px 6px",textAlign:"center"}}>
              <div style={{fontSize:14}}>{c.scene}</div>
              <div style={{color:"#64748b",fontSize:8,marginTop:1}}>{c.title.substring(0,8)}...</div>
            </div>)}
          </div>
        </div>
      );})}
    </div>
  );
}

// ══════════════════════════════════════════════════════ 3D WORLD VIEW
function WorldView({avatar,festivalMode,flyMode,onPortal,onSteps}){
  const canvasRef=useRef(null),engineRef=useRef(null),keysRef=useRef({});
  const posRef=useRef({x:0,z:0}),angleRef=useRef(0),isMovRef=useRef(false);
  const stepsRef=useRef(0),stepAccRef=useRef(0);
  const onPortalRef=useRef(onPortal);
  useEffect(()=>{onPortalRef.current=onPortal;},[onPortal]);
  useEffect(()=>{
    const onKD=e=>{keysRef.current[e.code]=true;["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)&&e.preventDefault();};
    const onKU=e=>{keysRef.current[e.code]=false;};
    window.addEventListener("keydown",onKD);window.addEventListener("keyup",onKU);
    return()=>{window.removeEventListener("keydown",onKD);window.removeEventListener("keyup",onKU);};
  },[]);
  useEffect(()=>{
    let raf;
    const SPEED=flyMode?0.28:0.18,TURN=0.04;
    const loop=()=>{raf=requestAnimationFrame(loop);const k=keysRef.current;let moved=false;
      if(k["ArrowLeft"]||k["KeyA"]){angleRef.current+=TURN;moved=true;}
      if(k["ArrowRight"]||k["KeyD"]){angleRef.current-=TURN;moved=true;}
      if(k["ArrowUp"]||k["KeyW"]){posRef.current.x+=Math.sin(angleRef.current)*SPEED;posRef.current.z+=Math.cos(angleRef.current)*SPEED;moved=true;stepAccRef.current+=SPEED;if(stepAccRef.current>1){stepsRef.current++;stepAccRef.current=0;onSteps(stepsRef.current);}}
      if(k["ArrowDown"]||k["KeyS"]){posRef.current.x-=Math.sin(angleRef.current)*SPEED*0.6;posRef.current.z-=Math.cos(angleRef.current)*SPEED*0.6;moved=true;}
      isMovRef.current=moved;engineRef.current?.updateState({...posRef.current},angleRef.current,moved);};
    loop();return()=>cancelAnimationFrame(raf);
  },[flyMode,onSteps]);
  useEffect(()=>{
    if(!canvasRef.current)return;
    const eng=buildScene({canvas:canvasRef.current,onPortal:n=>onPortalRef.current(n),festivalMode,flyMode,walkPos:posRef.current,walkAngle:angleRef.current,avatarColor:avatar?.outfit?.color||"#38bdf8"});
    engineRef.current=eng;return()=>eng.dispose();
  },[festivalMode,flyMode]);
  return(
    <div style={{position:"relative",width:"100%",height:"100%"}}>
      <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",cursor:"grab"}} tabIndex={0}/>
      <div style={{position:"absolute",top:12,left:12,display:"flex",flexDirection:"column",gap:5,pointerEvents:"none"}}>
        {flyMode?<div style={{background:"#06b6d420",border:"1px solid #06b6d466",color:"#06b6d4",borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:700}}>🦅 โหมดปีกบิน — ชมแม่น้ำ 3 สาย</div>:<div style={{background:"#38bdf818",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:700}}>🌏 Meta World อุบลราชธานี</div>}
        <div style={{background:"#34d39918",border:"1px solid #34d39944",color:"#34d399",borderRadius:8,padding:"4px 11px",fontSize:10,fontWeight:700}}>👥 Online: 5 ผู้เล่น</div>
        {festivalMode&&<div style={{background:"#fbbf2418",border:"1px solid #fbbf2466",color:"#fbbf24",borderRadius:8,padding:"4px 11px",fontSize:10,fontWeight:700}}>🕯️ โหมดแห่เทียนพรรษา</div>}
      </div>
      {avatar&&<div style={{position:"absolute",top:12,right:12,background:avatar.outfit.color+"18",border:`1px solid ${avatar.outfit.color}44`,borderRadius:9,padding:"7px 12px",display:"flex",gap:8,alignItems:"center",pointerEvents:"none"}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:avatar.skin,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{avatar.outfit.emoji}</div>
        <div><div style={{color:avatar.outfit.color,fontWeight:700,fontSize:11}}>{avatar.name}</div><div style={{color:"#64748b",fontSize:9}}>{avatar.outfit.label}</div></div>
      </div>}
      <div style={{position:"absolute",bottom:50,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",maxWidth:"85%",pointerEvents:"auto"}}>
        {PLACES.slice(0,7).map(p=><button key={p.id} onClick={()=>onPortal(p.name)} style={{background:p.color+"22",border:`1px solid ${p.color}55`,color:p.color,borderRadius:7,padding:"4px 8px",fontSize:9,cursor:"pointer",fontWeight:600}}>{p.emoji} {p.short}</button>)}
      </div>
      <div style={{position:"absolute",bottom:12,right:12,background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:"8px 12px",pointerEvents:"none"}}>
        <div style={{color:"#475569",fontSize:8,fontWeight:700,marginBottom:4}}>🎮 WASD / ↑↓←→ = เดิน | 🖱️ ลาก = กล้อง</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 8px"}}>
          {[["W/↑","เดินหน้า"],["S/↓","ถอย"],["A/←","หันซ้าย"],["D/→","หันขวา"]].map(([k,v],i)=><div key={i} style={{display:"flex",gap:3,alignItems:"center"}}><span style={{background:"#1e293b",borderRadius:3,padding:"1px 4px",color:"#38bdf8",fontSize:7,fontFamily:"monospace"}}>{k}</span><span style={{color:"#475569",fontSize:7}}>{v}</span></div>)}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ NPC CHAT WITH VOICE
function NPCChat({place,onChat}){
  const {speak,stop}=useTTS();
  const [msgs,setMsgs]=useState([{role:"assistant",text:`สวัสดีค่ะ ยินดีต้อนรับสู่ Meta World อุบลราชธานีเด้อ! ตอนนี้คุณอยู่ที่${place}ค่ะ มีอะไรอยากรู้ไหมคะ? 🌸`}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const scrollRef=useRef(null);
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[msgs,loading]);
  const send=async()=>{const t=input.trim();if(!t||loading)return;setInput("");const um={role:"user",text:t};setMsgs(p=>[...p,um]);setLoading(true);try{const h=[...msgs,um].map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));const r=await askNPC(h,place);setMsgs(p=>[...p,{role:"assistant",text:r}]);onChat();speak(r,{rate:0.88,pitch:1.1});}catch{setMsgs(p=>[...p,{role:"assistant",text:"ขอโทษนะคะ 🙏"}]);}setLoading(false);};
  const qs=["สถานที่นี้มีอะไรน่าสนใจ?","ตำนานพญานาคคืออะไร?","อาหารเด็ดอุบลมีอะไรบ้าง?","แม่น้ำโขง ชี มูล ต่างกันยังไง?","บุญข้าวสากทำยังไง?"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#060e1c"}}>
      <div style={{background:"linear-gradient(135deg,#1a0a3d,#0d1128)",padding:"12px 16px",borderBottom:"1px solid #1e1b4b",display:"flex",gap:11,alignItems:"center",flexShrink:0}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 0 18px #7c3aed66"}}>🧕</div>
        <div style={{flex:1}}><div style={{color:"#a78bfa",fontWeight:800,fontSize:13}}>แม่หญิงอุบล</div><div style={{color:"#6d5ea8",fontSize:10}}>AI Guide · Claude AI · เสียงภาษาไทย</div><div style={{color:"#475569",fontSize:9,marginTop:1}}>📍 {place}</div></div>
        <button onClick={()=>stop()} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:7,padding:"4px 8px",fontSize:9,cursor:"pointer"}}>⏹ หยุดเสียง</button>
      </div>
      <div style={{padding:"6px 10px",borderBottom:"1px solid #0f172a",display:"flex",gap:5,flexWrap:"wrap",flexShrink:0}}>
        {qs.map((q,i)=><button key={i} onClick={()=>setInput(q)} style={{background:"#1e1b4b",border:"1px solid #312e81",color:"#818cf8",borderRadius:20,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>{q}</button>)}
      </div>
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"11px 10px",display:"flex",flexDirection:"column",gap:9}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:5}}>
          {m.role==="assistant"&&<div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>🧕</div>}
          <div style={{background:m.role==="user"?"linear-gradient(135deg,#1d4ed8,#2563eb)":"#1a1f35",color:"#e2e8f0",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"8px 11px",maxWidth:"78%",fontSize:11,lineHeight:1.6,border:m.role==="assistant"?"1px solid #2d2f52":"none"}}>{m.text}</div>
          {m.role==="assistant"&&<button onClick={()=>speak(m.text,{rate:0.88,pitch:1.1})} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:12,flexShrink:0}}>🔊</button>}
        </div>)}
        {loading&&<div style={{display:"flex",alignItems:"flex-end",gap:5}}><div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🧕</div><div style={{background:"#1a1f35",border:"1px solid #2d2f52",borderRadius:"14px 14px 14px 4px",padding:"9px 12px",display:"flex",gap:4}}>{[0,1,2].map(d=><div key={d} style={{width:5,height:5,borderRadius:"50%",background:"#a78bfa",animation:`stScene 0.8s ${d*0.15}s infinite`}}/>)}</div></div>}
      </div>
      <div style={{padding:"9px 10px",borderTop:"1px solid #1e1b4b",display:"flex",gap:6,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="ถามแม่หญิงอุบลได้เลยค่ะ..." style={{flex:1,background:"#1a1f35",border:"1px solid #312e81",borderRadius:9,padding:"8px 11px",color:"#e2e8f0",fontSize:11,outline:"none"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:loading?"#312e81":"linear-gradient(135deg,#7c3aed,#a78bfa)",border:"none",borderRadius:9,color:"white",padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700,opacity:loading||!input.trim()?0.5:1}}>▶</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ IOT DASH
function IoTDash(){
  const {sensors,hist}=useIoT();const [sel,setSel]=useState(0);const s=sensors[sel];
  return(
    <div style={{padding:18,display:"flex",flexDirection:"column",gap:14,height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div><div style={{color:"#f87171",fontWeight:800,fontSize:17}}>📡 IoT Live Dashboard</div><div style={{color:"#64748b",fontSize:11}}>ESP32 · {sensors.filter(s=>s.online).length}/{sensors.length} Online</div></div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#34d399"}}/><span style={{color:"#34d399",fontSize:10,fontWeight:600}}>Live · 2s</span></div>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{sensors.map((s,i)=><button key={s.id} onClick={()=>setSel(i)} style={{background:sel===i?"#f8717118":"transparent",border:`1px solid ${sel===i?"#f87171":"#1e293b"}`,color:sel===i?"#f87171":"#64748b",borderRadius:7,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:sel===i?700:400}}>{s.online?"🟢":"🔴"} {s.place}</button>)}</div>
      <div style={{background:"linear-gradient(135deg,#1e0f0f,#180a0a)",border:"1px solid #f8717130",borderRadius:12,padding:15}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,alignItems:"center",flexWrap:"wrap",gap:6}}><div><div style={{color:"#f87171",fontWeight:800,fontSize:13}}>{s.place}</div><div style={{color:"#475569",fontSize:10}}>{s.id}</div></div><div style={{background:s.online?"#34d39922":"#f8717122",color:s.online?"#34d399":"#f87171",borderRadius:20,padding:"2px 9px",fontSize:9,fontWeight:700}}>{s.online?"● ONLINE":"● OFFLINE"}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(88px,1fr))",gap:8}}>{[["🌡️",`${s.temp}°C`,"#f87171"],["💧",`${s.hum}%`,"#38bdf8"],["☀️",`${s.light}L`,"#fbbf24"],["👥",`${s.visitors}`,"#a78bfa"]].map(([ic,v,c],i)=><div key={i} style={{background:c+"10",border:`1px solid ${c}28`,borderRadius:8,padding:"9px 10px",textAlign:"center"}}><div style={{color:"#64748b",fontSize:12,marginBottom:2}}>{ic}</div><div style={{color:c,fontWeight:800,fontSize:17,fontFamily:"monospace"}}>{v}</div></div>)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>{[["🌡️ Temperature",hist.map(h=>h.temp),"#f87171"],["💧 Humidity",hist.map(h=>h.hum),"#38bdf8"]].map(([l,d,c],i)=><div key={i} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:12}}><div style={{color:c,fontSize:10,fontWeight:600,marginBottom:6}}>{l}</div><Spark data={d} color={c}/></div>)}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════ SIMPLE PANELS
function FoodPanel({onTry,tried}){return(<div style={{padding:18,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#fb923c",fontWeight:800,fontSize:17}}>🍜 อาหารของดีอุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>ลองแล้ว {tried.size}/{FOODS.length} อย่าง</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>{FOODS.map(f=>{const t=tried.has(f.id);return<div key={f.id} style={{background:t?f.color+"12":"#0f172a",border:`2px solid ${t?f.color:"#1e293b"}`,borderRadius:12,padding:14,position:"relative",transition:"all 0.2s"}}>{t&&<div style={{position:"absolute",top:8,right:8,background:f.color,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✓</div>}<div style={{fontSize:28,marginBottom:7,textAlign:"center"}}>{f.emoji}</div><div style={{color:f.color,fontWeight:700,fontSize:12,marginBottom:3}}>{f.name}</div><div style={{color:"#64748b",fontSize:9,lineHeight:1.5,marginBottom:10}}>{f.desc}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#34d399",fontSize:10,fontWeight:700}}>{f.price}</span><button onClick={()=>onTry(f)} style={{background:t?f.color+"20":f.color,border:"none",borderRadius:5,color:t?"#888":"white",padding:"4px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>{t?"ลองแล้ว":"ลอง!"}</button></div></div>;})}</div></div>);}

function TradPanel({onJoin,joined}){const [sel,setSel]=useState(null);return(<div style={{padding:18,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#fbbf24",fontWeight:800,fontSize:17}}>🎊 ประเพณีอุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>เข้าร่วมแล้ว {joined.size}/{TRADITIONS.length} ประเพณี</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:11}}>{TRADITIONS.map((t,i)=>{const j=joined.has(t.id);return<div key={t.id} onClick={()=>setSel(sel===i?null:i)} style={{background:sel===i?t.color+"15":"#0f172a",border:`2px solid ${j?t.color:sel===i?t.color+"88":"#1e293b"}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all 0.2s",position:"relative"}}>{j&&<div style={{position:"absolute",top:9,right:9,background:t.color,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✓</div>}<div style={{fontSize:26,marginBottom:7}}>{t.emoji}</div><div style={{color:t.color,fontWeight:700,fontSize:12,marginBottom:3}}>{t.name}</div><div style={{color:"#475569",fontSize:9,marginBottom:7}}>📅 {t.month}</div><div style={{color:"#64748b",fontSize:10,lineHeight:1.5,marginBottom:sel===i?10:0}}>{t.desc}</div>{sel===i&&<button onClick={e=>{e.stopPropagation();onJoin(t);}} style={{width:"100%",background:`linear-gradient(135deg,${t.color},${t.color}99)`,border:"none",borderRadius:7,color:"white",padding:"7px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{j?"✓ เข้าร่วมแล้ว":"🎉 เข้าร่วมประเพณี"}</button>}</div>;})}</div></div>);}

function PlacesPanel({onGo,visited}){const [cat,setCat]=useState("all");const cats=["all",...new Set(PLACES.map(p=>p.cat))];const f=cat==="all"?PLACES:PLACES.filter(p=>p.cat===cat);return(<div style={{padding:18,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#e2e8f0",fontWeight:800,fontSize:17}}>🗺️ สถานที่อุบลราชธานี</div><div style={{color:"#64748b",fontSize:11}}>เยี่ยมชมแล้ว {visited.size}/{PLACES.length} แห่ง</div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{background:cat===c?"#38bdf8":"#1e293b",border:"none",borderRadius:20,color:cat===c?"#000":"#64748b",padding:"4px 11px",fontSize:10,cursor:"pointer",fontWeight:cat===c?700:400}}>{c==="all"?"ทั้งหมด":c}</button>)}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:10}}>{f.map(p=>{const v=visited.has(p.name);return<div key={p.id} onClick={()=>onGo(p.name)} style={{background:v?p.color+"12":"#0f172a",border:`2px solid ${v?p.color:"#1e293b"}`,borderRadius:12,padding:16,cursor:"pointer",position:"relative",transition:"all 0.2s"}}>{v&&<div style={{position:"absolute",top:9,right:9,background:p.color,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✓</div>}<div style={{fontSize:28,marginBottom:8}}>{p.emoji}</div><div style={{color:p.color,fontWeight:700,fontSize:12,marginBottom:4}}>{p.name}</div><div style={{color:"#64748b",fontSize:10,lineHeight:1.5,marginBottom:10}}>{p.desc}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{background:p.color+"20",color:p.color,borderRadius:5,padding:"2px 7px",fontSize:9,fontWeight:700}}>{p.cat}</span><span style={{color:p.color,fontSize:10}}>วาร์ป →</span></div></div>;})}</div></div>);}

function QuestPanel({mainP,dailyP,xp}){const [tab,setTab]=useState("daily");return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div style={{padding:"14px 18px 0",flexShrink:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}><div><div style={{color:"#fbbf24",fontWeight:800,fontSize:17}}>⚔️ ภารกิจ</div><div style={{color:"#64748b",fontSize:11}}>สะสม XP อัพเลเวล</div></div><div style={{background:"linear-gradient(135deg,#92400e,#fbbf24)",borderRadius:20,padding:"5px 14px",display:"flex",gap:5,alignItems:"center"}}><span>⭐</span><span style={{color:"#fff",fontWeight:800,fontSize:14}}>{xp} XP</span></div></div><div style={{background:"#1e293b",borderRadius:9,padding:11,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#94a3b8",fontSize:10}}>Lv.{Math.floor(xp/100)+1}</span><span style={{color:"#fbbf24",fontSize:10}}>{xp%100}/100</span></div><div style={{height:5,background:"#0f172a",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${xp%100}%`,background:"linear-gradient(90deg,#f59e0b,#fbbf24)",borderRadius:3,transition:"width 0.5s"}}/></div></div><div style={{display:"flex",gap:7,marginBottom:12}}>{[["daily","📅 รายวัน"],["main","🏆 หลัก"]].map(([t,l])=><button key={t} onClick={()=>setTab(t)} style={{flex:1,background:tab===t?"#fbbf2420":"#1e293b",border:`1px solid ${tab===t?"#fbbf24":"#334155"}`,color:tab===t?"#fbbf24":"#64748b",borderRadius:7,padding:"7px",fontSize:11,cursor:"pointer",fontWeight:tab===t?700:400}}>{l}</button>)}</div></div><div style={{flex:1,overflowY:"auto",padding:"0 18px 18px"}}>{(tab==="daily"?DAILY_Q:MAIN_Q).map(q=>{const p=(tab==="daily"?dailyP:mainP)[q.id]||0,done=p>=q.max,pct=Math.min(100,(p/q.max)*100),c=q.color||"#fbbf24";return<div key={q.id} style={{background:done?c+"10":"#0f172a",border:`1px solid ${done?c:"#1e293b"}`,borderRadius:12,padding:14,marginBottom:9,transition:"all 0.3s"}}><div style={{display:"flex",gap:11,alignItems:"flex-start"}}><div style={{fontSize:22,flexShrink:0}}>{q.icon}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:done?c:"#e2e8f0",fontWeight:700,fontSize:12}}>{q.title}</span><span style={{background:done?c+"30":"#1e293b",color:done?c:"#64748b",borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700}}>{done?"✓":`${p}/${q.max}`}</span></div><p style={{color:"#64748b",fontSize:10,marginBottom:7,lineHeight:1.4}}>{q.desc}</p><div style={{height:4,background:"#1e293b",borderRadius:2,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:`${pct}%`,background:done?`linear-gradient(90deg,${c},${c}88)`:"linear-gradient(90deg,#334155,#475569)",borderRadius:2,transition:"width 0.5s"}}/></div><div style={{textAlign:"right"}}><span style={{color:"#fbbf24",fontSize:9}}>🏆 {q.xp} XP</span></div></div></div></div>;})}  </div></div>);}

function FlyPanel({onClose,onVisit,visited}){
  const {speak,stop}=useTTS();
  const rivers=[{name:"แม่น้ำโขง",color:"#06b6d4",emoji:"🏞️",width:"~1 กม.",length:"4,350 กม.",fact:"แม่น้ำนานาชาติ ไหลผ่าน 6 ประเทศ มีปลาบึก ปลาน้ำจืดใหญ่ที่สุดในโลก"},{name:"แม่น้ำชี",color:"#22d3ee",emoji:"💧",width:"~200 ม.",length:"765 กม.",fact:"แม่น้ำยาวที่สุดในไทย ต้นกำเนิดจากเพชรบูรณ์ ไหลลงมูลที่วารินชำราบ"},{name:"แม่น้ำมูล",color:"#67e8f9",emoji:"🛶",width:"~300 ม.",length:"640 กม.",fact:"ยาว 640 กม. ไหลลงโขงที่โขงเจียม ประเพณีไหลเรือไฟ สวยที่สุดในอีสาน"}];
  const [idx,setIdx]=useState(0);const r=rivers[idx];
  return(<div style={{height:"100%",display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#020c1b,#050a1a)"}}><div style={{background:"#020c1b",borderBottom:"1px solid #0d2a44",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}><div><div style={{color:"#38bdf8",fontWeight:800,fontSize:14}}>🦅 ปีกบินชมแม่น้ำ 3 สาย</div><div style={{color:"#475569",fontSize:10}}>แม่น้ำโขง · แม่น้ำชี · แม่น้ำมูล</div></div><button onClick={onClose} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:7,color:"#94a3b8",padding:"5px 10px",cursor:"pointer",fontSize:10}}>⬇️ ลงจอด</button></div><div style={{display:"flex",borderBottom:"1px solid #0d2a44",flexShrink:0}}>{rivers.map((rv,i)=><button key={i} onClick={()=>{setIdx(i);onVisit(rv.name);}} style={{flex:1,background:"transparent",border:"none",borderBottom:`3px solid ${idx===i?rv.color:"transparent"}`,color:idx===i?rv.color:"#475569",padding:"10px 4px",fontSize:11,cursor:"pointer",fontWeight:idx===i?700:400}}>{rv.emoji} {rv.name}</button>)}</div><div style={{flex:1,overflowY:"auto",padding:18}}><div style={{background:`linear-gradient(135deg,${r.color}12,${r.color}04)`,border:`1px solid ${r.color}40`,borderRadius:14,padding:18,marginBottom:14,textAlign:"center"}}><div style={{fontSize:48,marginBottom:8}}>🌊</div><div style={{color:r.color,fontWeight:800,fontSize:17,marginBottom:6}}>{r.name}</div>{visited.has(r.name)&&<span style={{background:r.color+"22",color:r.color,borderRadius:20,padding:"3px 12px",fontSize:10,fontWeight:700,display:"inline-block",marginBottom:8}}>✓ บินชมแล้ว</span>}<p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7}}>{r.fact}</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>{[["📏 ความกว้าง",r.width],["🗺️ ความยาว",r.length]].map(([l,v],i)=><div key={i} style={{background:"#0f172a",border:`1px solid ${r.color}30`,borderRadius:10,padding:13,textAlign:"center"}}><div style={{color:"#64748b",fontSize:10,marginBottom:3}}>{l}</div><div style={{color:r.color,fontWeight:800,fontSize:15}}>{v}</div></div>)}</div><button onClick={()=>speak(`${r.name} ${r.fact}`,{rate:0.85})} style={{width:"100%",background:r.color+"20",border:`1px solid ${r.color}44`,color:r.color,borderRadius:10,padding:"10px",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:8}}>🔊 ฟังข้อมูล{r.name}</button></div></div>);}

// ══════════════════════════════════════════════════════ ACTIVITIES
function ActivPanel({onDo}){
  const [active,setActive]=useState(null);const [lanterns,setLanterns]=useState(0);
  return(<div style={{padding:18,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}><div><div style={{color:"#34d399",fontWeight:800,fontSize:17}}>🎭 กิจกรรมใน Meta World</div><div style={{color:"#64748b",fontSize:11}}>ร่วมกิจกรรมสนุกสนาน วัฒนธรรมอีสาน</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10}}>{[{id:"campfire",name:"รอบกองไฟ",emoji:"🔥",color:"#f87171",desc:"เล่านิทานพื้นบ้าน ดนตรีอีสาน"},{id:"lantern",name:"ปล่อยโคมลอย",emoji:"🏮",color:"#fbbf24",desc:"ปล่อยโคมขอพร ท้องฟ้าเปล่งแสง"},{id:"singing",name:"ร้องเพลง",emoji:"🎤",color:"#a78bfa",desc:"หมอลำ ลูกทุ่ง เพลงอีสาน"},{id:"dance",name:"ฟ้อนอีสาน",emoji:"💃",color:"#34d399",desc:"ฟ้อนกลองตุ้ม ฟ้อนภูไท"},{id:"loykra",name:"ลอยกระทง",emoji:"🪷",color:"#ec4899",desc:"ทำกระทง ลอยในแม่น้ำมูล"},{id:"naga",name:"เฝ้าดูพญานาค",emoji:"🐉",color:"#06b6d4",desc:"รอชมบั้งไฟพญานาคริมโขง"},].map(a=><div key={a.id} onClick={()=>{setActive(active===a.id?null:a.id);onDo(a.name);}} style={{background:active===a.id?a.color+"20":"#0f172a",border:`2px solid ${active===a.id?a.color:"#1e293b"}`,borderRadius:12,padding:14,cursor:"pointer",transition:"all 0.2s"}}><div style={{fontSize:26,marginBottom:6}}>{a.emoji}</div><div style={{color:a.color,fontWeight:700,fontSize:12,marginBottom:4}}>{a.name}</div><div style={{color:"#64748b",fontSize:10,lineHeight:1.5}}>{a.desc}</div>{active===a.id&&<div style={{marginTop:7,color:a.color,fontSize:9,fontWeight:700}}>✓ กำลังดำเนินการ</div>}</div>)}</div>{active==="lantern"&&<div style={{background:"#1a1400",border:"1px solid #fbbf2440",borderRadius:12,padding:16,textAlign:"center"}}><div style={{fontSize:42,marginBottom:8}}>🏮</div><div style={{color:"#fbbf24",fontWeight:700,fontSize:14,marginBottom:8}}>ปล่อยโคมลอยสู่ท้องฟ้า</div><div style={{minHeight:36,display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap",marginBottom:8}}>{Array.from({length:lanterns}).map((_,i)=><span key={i} style={{fontSize:16}}>🏮</span>)}</div><button onClick={()=>setLanterns(p=>p+1)} style={{background:"linear-gradient(135deg,#92400e,#fbbf24)",border:"none",borderRadius:10,color:"white",padding:"9px 22px",fontSize:12,fontWeight:700,cursor:"pointer",display:"block",width:"100%",marginBottom:5}}>🏮 ปล่อยโคม</button><div style={{color:"#64748b",fontSize:10}}>ปล่อยแล้ว {lanterns} ดวง ✨</div></div>}{active==="naga"&&<div style={{background:"linear-gradient(135deg,#020c1b,#06243a)",border:"1px solid #06b6d440",borderRadius:12,padding:18,textAlign:"center"}}><div style={{fontSize:52,marginBottom:10,animation:"stFloat 3s ease-in-out infinite"}}>🐉</div><div style={{color:"#06b6d4",fontWeight:800,fontSize:15,marginBottom:8}}>พญานาคเสด็จขึ้นจากโขง</div><p style={{color:"#94a3b8",fontSize:11,lineHeight:1.7}}>ทุกปีในคืนวันออกพรรษา ลูกไฟสีชมพูพุ่งขึ้นจากแม่น้ำโขง นั่นคือพลังของพญานาคที่ยังคงดำรงอยู่ชั่วนิจนิรันดร์...</p></div>}</div>);}

// ══════════════════════════════════════════════════════ MAIN APP
const TABS = [
  {id:"world",  label:"🌏 โลก",      color:"#38bdf8"},
  {id:"map",    label:"🗺️ แผนที่",  color:"#4ade80"},
  {id:"stories",label:"📖 เรื่องราว",color:"#f59e0b"},
  {id:"fly",    label:"🦅 บิน",      color:"#06b6d4"},
  {id:"npc",    label:"🤖 AI",       color:"#a78bfa"},
  {id:"activities",label:"🎭 กิจกรรม",color:"#34d399"},
  {id:"traditions",label:"🎊 ประเพณี",color:"#fbbf24"},
  {id:"food",   label:"🍜 อาหาร",   color:"#fb923c"},
  {id:"places", label:"📍 สถานที่", color:"#f87171"},
  {id:"iot",    label:"📡 IoT",      color:"#f87171"},
  {id:"quest",  label:"⚔️ ภารกิจ", color:"#f59e0b"},
];

export default function App(){
  const [screen,setScreen]=useState("login"); // login → avatar → world
  const [avatar,setAvatar]=useState(null);
  const [page,setPage]=useState("world");
  const [activeStory,setActiveStory]=useState(null);
  const [popup,setPopup]=useState(null);
  const [fest,setFest]=useState(false);
  const [fly,setFly]=useState(false);
  const [place,setPlace]=useState("Meta World อุบลราชธานี");
  const [visited,setVisited]=useState(new Set());
  const [districtVisited,setDistrictVisited]=useState(new Set());
  const [rivers,setRivers]=useState(new Set());
  const [tried,setTried]=useState(new Set());
  const [joined,setJoined]=useState(new Set());
  const [completedStories,setCompletedStories]=useState(new Set());
  const [xp,setXp]=useState(0);
  const [steps,setSteps]=useState(0);
  const [mainP,setMainP]=useState({mq1:0,mq2:0,mq3:0,mq4:0,mq5:0,mq6:0,mq7:0});
  const [dailyP,setDailyP]=useState({dq1:0,dq2:0,dq3:0,dq4:0,dq5:0});

  const addXP=useCallback(n=>setXp(p=>p+n),[]);
  const upQ=useCallback((qs,set,id,amt=1)=>{set(prev=>{const q=qs.find(q=>q.id===id);if(!q)return prev;const cur=prev[id]||0;if(cur>=q.max)return prev;const next=Math.min(q.max,cur+amt);if(next===q.max&&cur<q.max)addXP(q.xp);return{...prev,[id]:next};});},[addXP]);
  const upM=useCallback((id,amt=1)=>upQ(MAIN_Q,setMainP,id,amt),[upQ]);
  const upD=useCallback((id,amt=1)=>upQ(DAILY_Q,setDailyP,id,amt),[upQ]);

  const showPop=useCallback((txt,icon="🌀")=>{setPopup({txt,icon});setTimeout(()=>setPopup(null),2800);},[]);

  const handlePortal=useCallback(name=>{
    setPlace(name);setVisited(p=>{const n=new Set(p);n.add(name);return n;});
    upM("mq1");upD("dq1");
    const pl=PLACES.find(p=>p.name===name);
    if(pl?.cat==="river")upM("mq6");
    if(pl?.cat==="festival"){setFest(true);upM("mq4");}
    if(pl?.district)setDistrictVisited(p=>{const n=new Set(p);n.add(pl.district);return n;});
    showPop(name,"🌀");
  },[upM,upD,showPop]);

  const handleWarp=useCallback(name=>{setPage("world");handlePortal(name);},[handlePortal]);
  const handleStoryOpen=useCallback(id=>{setActiveStory(id);setPage("stories");},[]);
  const handleStoryComplete=useCallback(story=>{
    setCompletedStories(p=>{const n=new Set(p);n.add(story.id);return n;});
    addXP(story.reward.xp);upM("mq6");upD("dq5");
    showPop(`🏆 +${story.reward.xp} XP · ${story.reward.item}`,story.char.emoji);
    setActiveStory(null);
  },[addXP,upM,upD,showPop]);

  const handleFood=useCallback(f=>{setTried(p=>{const n=new Set(p);n.add(f.id);return n;});upM("mq5");upD("dq2");addXP(5);showPop(`อร่อย! ${f.name} ${f.emoji}`,"🍜");},[upM,upD,addXP,showPop]);
  const handleTrad=useCallback(t=>{setJoined(p=>{const n=new Set(p);n.add(t.id);return n;});upM("mq4");addXP(20);showPop(t.name,t.emoji);},[upM,addXP,showPop]);
  const handleChat=useCallback(()=>{upM("mq2");upD("dq3");},[upM,upD]);
  const handleRiver=useCallback(name=>{setRivers(p=>{const n=new Set(p);n.add(name);return n;});upM("mq3");upD("dq4");addXP(15);},[upM,upD,addXP]);
  const handleActivity=useCallback(()=>addXP(10),[addXP]);
  const handleSteps=useCallback(total=>{setSteps(total);upM("mq7",1);},[upM]);
  const toggleFly=useCallback(()=>{setFly(p=>!p);setPage("world");if(!fly){upD("dq4");addXP(15);showPop("บินขึ้นสู่ท้องฟ้า!","🦅");}},[fly,upD,addXP,showPop]);

  // STATE MACHINE
  if(screen==="login") return <LoginScreen onStart={()=>setScreen("avatar")}/>;
  if(screen==="avatar") return <AvatarCreator onComplete={av=>{setAvatar(av);addXP(20);setScreen("world");}}/>;

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#060d1a",color:"#e2e8f0",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes stFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes stScene{0%{opacity:0;transform:scale(0.9)}100%{opacity:1;transform:scale(1)}}
        @keyframes avFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes warpAnim{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.1)}}
        @keyframes loginFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes loginRing{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes loginGlow{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes loginSlide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes loginPulse{0%,100%{opacity:0.3}50%{opacity:0.8}}
      `}</style>

      {/* TOP NAV */}
      <div style={{background:"#020812",borderBottom:"1px solid #0d1f35",display:"flex",alignItems:"stretch",flexShrink:0,overflowX:"auto",padding:"0 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginRight:8,flexShrink:0,padding:"5px 0"}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>🌏</div>
          <div><div style={{color:"#e2e8f0",fontWeight:800,fontSize:9,lineHeight:1.1}}>Meta World</div><div style={{color:"#38bdf8",fontSize:6,letterSpacing:1}}>UBON</div></div>
        </div>
        {TABS.map(t=><button key={t.id} onClick={()=>{setActiveStory(null);setPage(t.id);}} style={{background:"transparent",border:"none",borderBottom:`2px solid ${page===t.id?t.color:"transparent"}`,color:page===t.id?t.color:"#475569",padding:"0 7px",fontSize:9,cursor:"pointer",fontWeight:page===t.id?700:400,whiteSpace:"nowrap",flexShrink:0,transition:"color 0.2s"}}>{t.label}</button>)}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,flexShrink:0,padding:"4px 0"}}>
          <button onClick={toggleFly} style={{background:fly?"#06b6d420":"#1e293b",border:`1px solid ${fly?"#06b6d4":"#334155"}`,color:fly?"#06b6d4":"#64748b",borderRadius:5,padding:"2px 7px",fontSize:8,cursor:"pointer",fontWeight:700}}>🦅 {fly?"ON":"บิน"}</button>
          <button onClick={()=>setFest(p=>!p)} style={{background:fest?"#fbbf2420":"#1e293b",border:`1px solid ${fest?"#fbbf24":"#334155"}`,color:fest?"#fbbf24":"#64748b",borderRadius:5,padding:"2px 7px",fontSize:8,cursor:"pointer",fontWeight:700}}>🕯️</button>
          <div style={{background:"#92400e22",border:"1px solid #f59e0b44",borderRadius:5,padding:"2px 7px",display:"flex",gap:3,alignItems:"center"}}><span style={{fontSize:9}}>⭐</span><span style={{color:"#fbbf24",fontWeight:700,fontSize:10}}>{xp}</span></div>
          {steps>0&&<div style={{background:"#34d39922",border:"1px solid #34d39944",borderRadius:5,padding:"2px 6px",display:"flex",gap:2,alignItems:"center"}}><span style={{fontSize:8}}>👣</span><span style={{color:"#34d399",fontSize:9,fontWeight:700}}>{steps}</span></div>}
          {avatar&&<div style={{background:"#1e293b",borderRadius:5,padding:"2px 7px",display:"flex",gap:4,alignItems:"center"}}><div style={{width:14,height:14,borderRadius:"50%",background:avatar.skin,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8}}>{avatar.outfit.emoji}</div><span style={{color:avatar.outfit.color,fontSize:8,fontWeight:600,maxWidth:50,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{avatar.name}</span></div>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}} key={page+(activeStory||"")}>
        {page==="world"       && <WorldView avatar={avatar} festivalMode={fest} flyMode={fly} onPortal={handlePortal} onSteps={handleSteps}/>}
        {page==="map"         && <ProvinceMap onWarp={handleWarp} onStory={handleStoryOpen} visited={districtVisited}/>}
        {page==="stories"     && (activeStory
          ? <StoryMode storyId={activeStory} onClose={()=>setActiveStory(null)} onComplete={handleStoryComplete}/>
          : <StoryList onSelect={handleStoryOpen} completed={completedStories}/>)}
        {page==="fly"         && <FlyPanel onClose={()=>setPage("world")} onVisit={handleRiver} visited={rivers}/>}
        {page==="npc"         && <NPCChat place={place} onChat={handleChat}/>}
        {page==="activities"  && <ActivPanel onDo={handleActivity}/>}
        {page==="traditions"  && <TradPanel onJoin={handleTrad} joined={joined}/>}
        {page==="food"        && <FoodPanel onTry={handleFood} tried={tried}/>}
        {page==="places"      && <PlacesPanel onGo={handleWarp} visited={visited}/>}
        {page==="iot"         && <IoTDash/>}
        {page==="quest"       && <QuestPanel mainP={mainP} dailyP={dailyP} xp={xp}/>}

        {/* WARP POPUP */}
        {popup&&<div style={{position:"absolute",top:"50%",left:"50%",zIndex:100,textAlign:"center",animation:"warpAnim 2.8s ease forwards",pointerEvents:"none"}}><div style={{background:"rgba(0,0,0,0.92)",border:"2px solid #38bdf8",borderRadius:18,padding:"20px 32px",backdropFilter:"blur(16px)",minWidth:190}}><div style={{fontSize:36,marginBottom:6}}>{popup.icon}</div><div style={{color:"#38bdf8",fontWeight:800,fontSize:14,marginBottom:3}}>{popup.icon==="🌀"?"กำลังวาร์ป...":popup.icon==="🦅"?"กำลังบิน!":popup.icon==="🍜"?"อร่อยมาก!":"สำเร็จ!"}</div><div style={{color:"#e2e8f0",fontSize:12,lineHeight:1.5}}>{popup.txt}</div></div></div>}
      </div>
    </div>
  );
}
