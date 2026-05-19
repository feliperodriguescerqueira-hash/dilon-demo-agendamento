import { useState, useEffect, useRef } from "react";

// ─── BUSINESS PROFILES ───────────────────────────────────────────────────────
const BUSINESSES = {
  barbearia: {
    type: "barbearia",
    name: "Barbearia Kings",
    tagline: "Cortes que definem estilo",
    address: "Rua das Pedras, 142 — Duque de Caxias, RJ",
    phone: "21 99001-2233",
    whatsapp: "5521990012233",
    rating: 4.9,
    reviews: 312,
    hours: "Seg–Sáb · 08h às 20h",
    accentColor: "#C8A96E",
    accentDark: "#8B6914",
    bgColor: "#0D0D0D",
    cardColor: "#141414",
    surfaceColor: "#1A1A1A",
    textColor: "#F5F0E8",
    mutedColor: "#6B6560",
    emoji: "✂️",
    coverGradient: "linear-gradient(135deg, #1A1208 0%, #0D0D0D 50%, #121008 100%)",
    professionals: [
      { id:1, name:"Rafael Costa", role:"Barbeiro Master", specialty:"Degradê & Barba", avatar:"RC", rating:5.0, slots:18 },
      { id:2, name:"Diego Mendes", role:"Barbeiro Senior", specialty:"Corte Clássico", avatar:"DM", rating:4.9, slots:14 },
      { id:3, name:"Lucas Silva", role:"Barbeiro", specialty:"Navalhado", avatar:"LS", rating:4.8, slots:20 },
    ],
    services: [
      { id:1, name:"Corte Degradê", duration:45, price:45, icon:"✦", popular:true },
      { id:2, name:"Corte + Barba", duration:60, price:65, icon:"◈", popular:true },
      { id:3, name:"Barba Completa", duration:30, price:35, icon:"◇", popular:false },
      { id:4, name:"Nevado / Navalhado", duration:45, price:50, icon:"◆", popular:false },
      { id:5, name:"Corte Infantil", duration:30, price:30, icon:"○", popular:false },
      { id:6, name:"Sobrancelha", duration:15, price:15, icon:"—", popular:false },
    ],
  },
  salao: {
    type: "salao",
    name: "Salão Elegance",
    tagline: "Beleza que transforma",
    address: "Av. Presidente Kennedy, 890 — Duque de Caxias, RJ",
    phone: "21 98800-4455",
    whatsapp: "5521988004455",
    rating: 4.8,
    reviews: 487,
    hours: "Ter–Dom · 09h às 19h",
    accentColor: "#E8A0A0",
    accentDark: "#C0505A",
    bgColor: "#0F0A0A",
    cardColor: "#160F0F",
    surfaceColor: "#1C1212",
    textColor: "#F8F0F0",
    mutedColor: "#6E5858",
    emoji: "💅",
    coverGradient: "linear-gradient(135deg, #180A0A 0%, #0F0A0A 50%, #140808 100%)",
    professionals: [
      { id:1, name:"Ana Paula", role:"Cabeleireira Master", specialty:"Coloração & Luzes", avatar:"AP", rating:5.0, slots:12 },
      { id:2, name:"Fernanda Lima", role:"Cabeleireira Senior", specialty:"Tratamentos", avatar:"FL", rating:4.9, slots:16 },
      { id:3, name:"Camila Rocha", role:"Manicure & Pedicure", specialty:"Nail Art", avatar:"CR", rating:4.8, slots:22 },
    ],
    services: [
      { id:1, name:"Corte Feminino", duration:60, price:80, icon:"✦", popular:true },
      { id:2, name:"Coloração Completa", duration:150, price:180, icon:"◈", popular:true },
      { id:3, name:"Luzes / Balayage", duration:180, price:250, icon:"◇", popular:true },
      { id:4, name:"Escova Progressiva", duration:120, price:150, icon:"◆", popular:false },
      { id:5, name:"Manicure + Pedicure", duration:90, price:70, icon:"○", popular:false },
      { id:6, name:"Hidratação", duration:60, price:90, icon:"◉", popular:false },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(n);
const today = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate()+n); return r; };
const fmtDate = d => d.toLocaleDateString("pt-BR", { weekday:"short", day:"2-digit", month:"short" });
const fmtFull = d => d.toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
const DAYS = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));

const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
];

const BLOCKED = {
  1: ["09:00","10:30","14:00","16:00"],
  2: ["08:30","11:00","13:30","15:00","17:00"],
  3: ["09:30","14:30","16:30"],
};

function getSlots(profId, date, serviceDuration) {
  const blocked = BLOCKED[profId] || [];
  const dayOfWeek = date.getDay();
  const extraBlocked = dayOfWeek === 6 ? ["08:00","18:00","18:30"] : [];
  return TIME_SLOTS.filter(t => !blocked.includes(t) && !extraBlocked.includes(t));
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function WhatsAppNotification({ biz, booking, onClose }) {
  const [visible, setVisible] = useState(false);
  const [msgStep, setMsgStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const t1 = setTimeout(() => setMsgStep(1), 800);
    const t2 = setTimeout(() => setMsgStep(2), 2000);
    const t3 = setTimeout(() => setMsgStep(3), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const msgs = [
    {
      from: "sistema",
      text: `🔔 *NOVO AGENDAMENTO — ${biz.name.toUpperCase()}*\n\n👤 *Cliente:* ${booking.name}\n📱 *WhatsApp:* ${booking.phone}\n✦ *Serviço:* ${booking.service.name}\n💰 *Valor:* ${fmt(booking.service.price)}\n⏱ *Duração:* ${booking.service.duration} min\n👨‍💼 *Profissional:* ${booking.professional.name}\n📅 *Data:* ${fmtFull(booking.date)}\n⏰ *Horário:* ${booking.time}`,
    },
    { from: "sistema", text: `💬 Responda "OK" para confirmar ou "REAGENDAR" para alterar.` },
    { from: "dono", text: "OK ✅" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000CC", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, animation:"fadeIn .3s ease" }}>
      <div style={{ width:380, maxHeight:"90vh", display:"flex", flexDirection:"column", borderRadius:20, overflow:"hidden", boxShadow:"0 40px 80px #00000080" }}>
        {/* WA Header */}
        <div style={{ background:"#075E54", padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🔔</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Dilon Tech · Notificações</div>
            <div style={{ fontSize:11, color:"#B2DFDB" }}>Sistema de Agendamento</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#B2DFDB", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        {/* WA Chat */}
        <div style={{ flex:1, background:"#0D1117", backgroundImage:"radial-gradient(circle at 20% 80%, #075E5420 0%, transparent 50%), radial-gradient(circle at 80% 20%, #25D36618 0%, transparent 50%)", padding:"16px", overflowY:"auto", minHeight:300 }}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <span style={{ background:"#1A2A1A", color:"#6B9B6B", borderRadius:8, padding:"4px 12px", fontSize:11 }}>Hoje · {new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
          </div>

          {msgs.slice(0, msgStep + 1).map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent: m.from === "dono" ? "flex-end" : "flex-start", marginBottom:10, animation:"slideUp .4s ease" }}>
              <div style={{
                maxWidth:"85%",
                background: m.from === "dono" ? "#005C4B" : "#1E2A1E",
                borderRadius: m.from === "dono" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding:"10px 14px",
                boxShadow:"0 2px 6px #00000040",
              }}>
                <div style={{ fontSize:12.5, color:"#E8F5E9", lineHeight:1.65, whiteSpace:"pre-wrap" }}>
                  {m.text.split(/(\*[^*]+\*)/g).map((part, j) =>
                    part.startsWith("*") && part.endsWith("*")
                      ? <strong key={j} style={{ color:"#81C784" }}>{part.slice(1,-1)}</strong>
                      : <span key={j}>{part}</span>
                  )}
                </div>
                <div style={{ fontSize:10, color:"#4CAF50", textAlign:"right", marginTop:4 }}>
                  {new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} {m.from==="dono"?"✓✓":""}
                </div>
              </div>
            </div>
          ))}

          {msgStep >= 2 && (
            <div style={{ textAlign:"center", marginTop:8, animation:"slideUp .4s ease" }}>
              <span style={{ background:"#1A2A1A", color:"#81C784", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700 }}>
                ✅ Agendamento confirmado pelo salão!
              </span>
            </div>
          )}
        </div>

        {/* WA Input mock */}
        <div style={{ background:"#1A1A1A", padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, background:"#2A2A2A", borderRadius:20, padding:"10px 16px", fontSize:12, color:"#666" }}>
            Escreva uma mensagem...
          </div>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🎙</div>
        </div>

        <div style={{ background:"#111", padding:"14px 18px", display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:"#25D366", border:"none", borderRadius:10, padding:"12px", color:"#000", fontWeight:800, fontSize:13, cursor:"pointer" }}>
            Incrível! Fechar ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ biz, booking, onNew }) {
  const [showWA, setShowWA] = useState(false);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 24px", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:`${biz.accentColor}20`, border:`2px solid ${biz.accentColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:24, animation:"pop .5s cubic-bezier(.17,.67,.56,1.27)" }}>
        ✓
      </div>
      <h2 style={{ fontSize:26, fontWeight:900, color:biz.textColor, marginBottom:8, letterSpacing:-0.5 }}>
        Agendamento Confirmado!
      </h2>
      <p style={{ fontSize:14, color:biz.mutedColor, marginBottom:32, lineHeight:1.6 }}>
        {booking.name}, seu horário está reservado.<br/>Você receberá uma confirmação em breve.
      </p>

      {/* Resumo */}
      <div style={{ width:"100%", background:biz.surfaceColor, borderRadius:16, padding:"20px", marginBottom:24, textAlign:"left", border:`1px solid ${biz.accentColor}30` }}>
        {[
          ["✦", "Serviço", booking.service.name],
          ["◈", "Profissional", booking.professional.name],
          ["📅", "Data", fmtFull(booking.date)],
          ["⏰", "Horário", booking.time],
          ["💰", "Valor", fmt(booking.service.price)],
          ["⏱", "Duração", `${booking.service.duration} minutos`],
        ].map(([icon, label, value]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:`1px solid ${biz.mutedColor}20` }}>
            <span style={{ fontSize:14, color:biz.accentColor, width:20, textAlign:"center" }}>{icon}</span>
            <span style={{ fontSize:12, color:biz.mutedColor, width:80 }}>{label}</span>
            <span style={{ fontSize:13, fontWeight:600, color:biz.textColor, flex:1 }}>{value}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setShowWA(true)} style={{ width:"100%", background:"#25D366", border:"none", borderRadius:12, padding:"14px", color:"#000", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        <span>💬</span> Ver notificação no WhatsApp
      </button>

      <button onClick={onNew} style={{ width:"100%", background:"transparent", border:`1px solid ${biz.accentColor}44`, borderRadius:12, padding:"13px", color:biz.accentColor, fontWeight:700, fontSize:13, cursor:"pointer" }}>
        Fazer outro agendamento
      </button>

      {showWA && <WhatsAppNotification biz={biz} booking={booking} onClose={() => setShowWA(false)} />}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // Selector state
  const [bizType, setBizType] = useState(null);
  const [step, setStep] = useState(0); // 0=service 1=professional 2=datetime 3=form 4=confirm 5=success

  // Booking state
  const [service, setService] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name:"", phone:"", notes:"" });
  const [booking, setBooking] = useState(null);

  const biz = bizType ? BUSINESSES[bizType] : null;
  const slots = (professional && date) ? getSlots(professional.id, date, service?.duration) : [];

  const canNext = [
    !!service,
    !!professional,
    !!(date && time),
    !!(form.name && form.phone),
  ];

  const reset = () => {
    setStep(0); setService(null); setProfessional(null);
    setDate(null); setTime(null); setForm({ name:"", phone:"", notes:"" }); setBooking(null);
  };

  const confirm = () => {
    const b = { service, professional, date, time, ...form };
    setBooking(b);
    setStep(5);
  };

  // ── Business Selector ───────────────────────────────────────────────────
  if (!bizType) {
    return (
      <div style={{ minHeight:"100vh", background:"#080808", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
        <style>{`
          @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
          @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
          @keyframes pop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
          @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
          * { box-sizing:border-box; }
        `}</style>

        {/* Dilon Tech badge */}
        <div style={{ marginBottom:40, textAlign:"center", animation:"fadeIn .6s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#141414", border:"1px solid #2A2A2A", borderRadius:100, padding:"8px 16px", marginBottom:20 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#00E5A0", boxShadow:"0 0 8px #00E5A0" }}/>
            <span style={{ fontSize:11, color:"#888", letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>Powered by Dilon Tech</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:900, color:"#fff", margin:"0 0 8px", letterSpacing:-1 }}>
            Sistema de<br/>
            <span style={{ background:"linear-gradient(90deg, #C8A96E, #E8C990, #C8A96E)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 3s linear infinite" }}>Agendamento Online</span>
          </h1>
          <p style={{ fontSize:14, color:"#555", margin:0 }}>Escolha o tipo de estabelecimento para demonstração</p>
        </div>

        <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", animation:"fadeIn .6s ease .2s both" }}>
          {[
            { key:"barbearia", label:"Barbearia", sub:"Corte, barba e muito estilo", emoji:"✂️", color:"#C8A96E", bg:"#1A1208" },
            { key:"salao", label:"Salão de Beleza", sub:"Cabelo, unhas e tratamentos", emoji:"💅", color:"#E8A0A0", bg:"#180A0A" },
          ].map(opt => (
            <button key={opt.key} onClick={() => setBizType(opt.key)} style={{ width:240, background:`linear-gradient(135deg, ${opt.bg}, #0D0D0D)`, border:`1px solid ${opt.color}33`, borderRadius:20, padding:"32px 24px", cursor:"pointer", textAlign:"center", transition:"all .25s", position:"relative", overflow:"hidden" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=opt.color+"88"; e.currentTarget.style.boxShadow=`0 20px 40px ${opt.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderColor=opt.color+"33"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ fontSize:52, marginBottom:16 }}>{opt.emoji}</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:6 }}>{opt.label}</div>
              <div style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>{opt.sub}</div>
              <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", fontSize:11, color:opt.color, fontWeight:700, letterSpacing:1 }}>
                VER DEMO →
              </div>
            </button>
          ))}
        </div>

        <p style={{ marginTop:40, fontSize:11, color:"#333", textAlign:"center", animation:"fadeIn .6s ease .4s both" }}>
          dilon.tech · Duque de Caxias, RJ
        </p>
      </div>
    );
  }

  // ── Booking Flow ────────────────────────────────────────────────────────
  const STEPS = ["Serviço", "Profissional", "Horário", "Seus dados", "Confirmação"];

  return (
    <div style={{ minHeight:"100vh", background:biz.bgColor, fontFamily:"'Segoe UI', system-ui, sans-serif", color:biz.textColor }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes pop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
        *{box-sizing:border-box;}
        input,textarea{font-family:inherit;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:4px;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:biz.coverGradient, borderBottom:`1px solid ${biz.accentColor}20`, padding:"0 0 0 0" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px" }}>
          <button onClick={() => setBizType(null)} style={{ background:"none", border:"none", color:biz.mutedColor, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
            ← Voltar
          </button>
          <div style={{ fontSize:10, color:biz.mutedColor, letterSpacing:2, textTransform:"uppercase" }}>
            Dilon Tech
          </div>
          <div style={{ width:60 }} />
        </div>

        {/* Business info */}
        <div style={{ padding:"0 20px 24px", display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:64, height:64, borderRadius:16, background:`${biz.accentColor}20`, border:`2px solid ${biz.accentColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>
            {biz.emoji}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ margin:"0 0 4px", fontSize:22, fontWeight:900, color:biz.textColor, letterSpacing:-0.5 }}>{biz.name}</h1>
            <p style={{ margin:"0 0 6px", fontSize:12, color:biz.mutedColor }}>{biz.tagline}</p>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:12, color:biz.accentColor }}>⭐ {biz.rating} ({biz.reviews} avaliações)</span>
              <span style={{ fontSize:11, color:biz.mutedColor }}>· {biz.hours}</span>
            </div>
          </div>
        </div>

        {/* Step progress */}
        {step < 5 && (
          <div style={{ padding:"0 20px 16px" }}>
            <div style={{ display:"flex", gap:4 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ flex:1 }}>
                  <div style={{ height:3, borderRadius:2, background: i < step ? biz.accentColor : i === step ? biz.accentColor : biz.mutedColor+"30", transition:"background .3s" }} />
                  <div style={{ fontSize:9, color: i <= step ? biz.accentColor : biz.mutedColor, marginTop:4, textAlign:"center", fontWeight: i===step?700:400, letterSpacing:.5 }}>
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:520, margin:"0 auto", padding:"0 16px 100px" }}>

        {/* STEP 0 — Serviço */}
        {step === 0 && (
          <div style={{ animation:"fadeIn .4s ease" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"24px 0 4px", color:biz.textColor }}>Qual serviço você quer?</h2>
            <p style={{ fontSize:12, color:biz.mutedColor, margin:"0 0 20px" }}>Selecione um serviço para continuar</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {biz.services.map(svc => (
                <button key={svc.id} onClick={() => { setService(svc); }} style={{ background: service?.id === svc.id ? `${biz.accentColor}18` : biz.cardColor, border:`1px solid ${service?.id === svc.id ? biz.accentColor : biz.mutedColor+"30"}`, borderRadius:14, padding:"16px 18px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, transition:"all .2s" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${biz.accentColor}15`, border:`1px solid ${biz.accentColor}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:biz.accentColor, flexShrink:0 }}>
                    {svc.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:biz.textColor }}>{svc.name}</span>
                      {svc.popular && <span style={{ background:`${biz.accentColor}22`, color:biz.accentColor, borderRadius:4, padding:"1px 7px", fontSize:9, fontWeight:700 }}>POPULAR</span>}
                    </div>
                    <div style={{ fontSize:11, color:biz.mutedColor }}>⏱ {svc.duration} min</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:biz.accentColor }}>{fmt(svc.price)}</div>
                  </div>
                  {service?.id === svc.id && (
                    <div style={{ width:22, height:22, borderRadius:"50%", background:biz.accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, color:biz.bgColor, fontWeight:900 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Profissional */}
        {step === 1 && (
          <div style={{ animation:"fadeIn .4s ease" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"24px 0 4px", color:biz.textColor }}>Escolha o profissional</h2>
            <p style={{ fontSize:12, color:biz.mutedColor, margin:"0 0 20px" }}>Serviço: <strong style={{ color:biz.accentColor }}>{service.name}</strong> · {fmt(service.price)}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {biz.professionals.map(prof => (
                <button key={prof.id} onClick={() => setProfessional(prof)} style={{ background: professional?.id === prof.id ? `${biz.accentColor}18` : biz.cardColor, border:`1px solid ${professional?.id === prof.id ? biz.accentColor : biz.mutedColor+"30"}`, borderRadius:16, padding:"18px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, transition:"all .2s" }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg, ${biz.accentColor}40, ${biz.accentColor}20)`, border:`2px solid ${biz.accentColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:biz.accentColor, flexShrink:0 }}>
                    {prof.avatar}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:biz.textColor, marginBottom:3 }}>{prof.name}</div>
                    <div style={{ fontSize:11, color:biz.accentColor, marginBottom:4, fontWeight:600 }}>{prof.role}</div>
                    <div style={{ fontSize:11, color:biz.mutedColor }}>{prof.specialty}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:biz.accentColor, marginBottom:4 }}>⭐ {prof.rating}</div>
                    <div style={{ fontSize:10, color:biz.mutedColor }}>{prof.slots} horários</div>
                  </div>
                  {professional?.id === prof.id && (
                    <div style={{ width:22, height:22, borderRadius:"50%", background:biz.accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, color:biz.bgColor, fontWeight:900 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Data e Horário */}
        {step === 2 && (
          <div style={{ animation:"fadeIn .4s ease" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"24px 0 4px", color:biz.textColor }}>Data e horário</h2>
            <p style={{ fontSize:12, color:biz.mutedColor, margin:"0 0 20px" }}>Profissional: <strong style={{ color:biz.accentColor }}>{professional.name}</strong></p>

            {/* Date selector */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:12, color:biz.mutedColor, marginBottom:10, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>Escolha a data</div>
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8 }}>
                {DAYS.map((d, i) => {
                  const isSelected = date?.toDateString() === d.toDateString();
                  const isWeekend = d.getDay() === 0;
                  return (
                    <button key={i} disabled={isWeekend} onClick={() => { setDate(d); setTime(null); }}
                      style={{ flexShrink:0, width:64, background: isSelected ? biz.accentColor : isWeekend ? biz.cardColor : biz.cardColor, border:`1px solid ${isSelected ? biz.accentColor : biz.mutedColor+"30"}`, borderRadius:12, padding:"10px 6px", cursor:isWeekend?"not-allowed":"pointer", textAlign:"center", opacity:isWeekend?.4:1, transition:"all .2s" }}>
                      <div style={{ fontSize:10, color:isSelected ? biz.bgColor : biz.mutedColor, marginBottom:4, textTransform:"uppercase", fontWeight:600 }}>
                        {d.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".","")}
                      </div>
                      <div style={{ fontSize:18, fontWeight:900, color:isSelected ? biz.bgColor : biz.textColor }}>
                        {d.getDate()}
                      </div>
                      <div style={{ fontSize:9, color:isSelected ? biz.bgColor+"CC" : biz.mutedColor }}>
                        {d.toLocaleDateString("pt-BR",{month:"short"}).replace(".","")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {date && (
              <div style={{ animation:"fadeIn .3s ease" }}>
                <div style={{ fontSize:12, color:biz.mutedColor, marginBottom:10, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>
                  Horários disponíveis — {fmtDate(date)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                  {slots.map(slot => {
                    const isSel = time === slot;
                    return (
                      <button key={slot} onClick={() => setTime(slot)} style={{ background: isSel ? biz.accentColor : biz.cardColor, border:`1px solid ${isSel ? biz.accentColor : biz.mutedColor+"30"}`, borderRadius:10, padding:"10px 4px", cursor:"pointer", fontSize:13, fontWeight: isSel ? 800 : 500, color: isSel ? biz.bgColor : biz.textColor, transition:"all .2s" }}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {slots.length === 0 && (
                  <div style={{ textAlign:"center", padding:"32px", color:biz.mutedColor, fontSize:13 }}>
                    Sem horários disponíveis neste dia
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Dados pessoais */}
        {step === 3 && (
          <div style={{ animation:"fadeIn .4s ease" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"24px 0 4px", color:biz.textColor }}>Seus dados</h2>
            <p style={{ fontSize:12, color:biz.mutedColor, margin:"0 0 24px" }}>Precisamos de algumas informações para confirmar</p>

            {/* Resumo rápido */}
            <div style={{ background:biz.cardColor, borderRadius:14, padding:"14px 16px", marginBottom:24, border:`1px solid ${biz.accentColor}20` }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, background:`${biz.accentColor}15`, color:biz.accentColor, borderRadius:6, padding:"3px 8px" }}>{service.name}</span>
                <span style={{ fontSize:11, background:biz.surfaceColor, color:biz.mutedColor, borderRadius:6, padding:"3px 8px" }}>{professional.name}</span>
                <span style={{ fontSize:11, background:biz.surfaceColor, color:biz.mutedColor, borderRadius:6, padding:"3px 8px" }}>{fmtDate(date)} às {time}</span>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { key:"name", label:"Seu nome completo", placeholder:"Ex: João da Silva", type:"text", required:true },
                { key:"phone", label:"WhatsApp (com DDD)", placeholder:"Ex: 21 99999-0000", type:"tel", required:true },
                { key:"notes", label:"Observações (opcional)", placeholder:"Ex: Prefiro hidratante sem fragrância", type:"text", required:false },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize:12, color:biz.mutedColor, marginBottom:6, display:"block", fontWeight:600 }}>
                    {field.label} {field.required && <span style={{ color:biz.accentColor }}>*</span>}
                  </label>
                  {field.key === "notes" ? (
                    <textarea value={form[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]:e.target.value }))} placeholder={field.placeholder} rows={3}
                      style={{ width:"100%", background:biz.cardColor, border:`1px solid ${biz.mutedColor}30`, borderRadius:12, padding:"12px 14px", color:biz.textColor, fontSize:14, outline:"none", resize:"none", transition:"border .2s" }}
                      onFocus={e => e.target.style.borderColor=biz.accentColor}
                      onBlur={e => e.target.style.borderColor=biz.mutedColor+"30"}
                    />
                  ) : (
                    <input value={form[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]:e.target.value }))} type={field.type} placeholder={field.placeholder}
                      style={{ width:"100%", background:biz.cardColor, border:`1px solid ${biz.mutedColor}30`, borderRadius:12, padding:"13px 14px", color:biz.textColor, fontSize:14, outline:"none", transition:"border .2s" }}
                      onFocus={e => e.target.style.borderColor=biz.accentColor}
                      onBlur={e => e.target.style.borderColor=biz.mutedColor+"30"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Confirmação */}
        {step === 4 && (
          <div style={{ animation:"fadeIn .4s ease" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"24px 0 4px", color:biz.textColor }}>Confirmar agendamento</h2>
            <p style={{ fontSize:12, color:biz.mutedColor, margin:"0 0 24px" }}>Revise os detalhes antes de confirmar</p>

            <div style={{ background:biz.cardColor, borderRadius:18, overflow:"hidden", border:`1px solid ${biz.accentColor}30`, marginBottom:20 }}>
              {/* Header do card */}
              <div style={{ background:`linear-gradient(135deg, ${biz.accentColor}15, ${biz.accentColor}05)`, padding:"20px", borderBottom:`1px solid ${biz.accentColor}20` }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{biz.emoji}</div>
                <div style={{ fontSize:16, fontWeight:800, color:biz.textColor }}>{biz.name}</div>
                <div style={{ fontSize:11, color:biz.mutedColor }}>{biz.address}</div>
              </div>

              {/* Detalhes */}
              <div style={{ padding:"16px 20px" }}>
                {[
                  ["✦", "Serviço", service.name],
                  ["⏱", "Duração", `${service.duration} minutos`],
                  ["◈", "Profissional", professional.name],
                  ["📅", "Data", fmtFull(date)],
                  ["⏰", "Horário", time],
                  ["👤", "Cliente", form.name],
                  ["📱", "WhatsApp", form.phone],
                  ...(form.notes ? [["📝", "Obs", form.notes]] : []),
                ].map(([icon, label, value]) => (
                  <div key={label} style={{ display:"flex", gap:12, padding:"9px 0", borderBottom:`1px solid ${biz.mutedColor}15` }}>
                    <span style={{ color:biz.accentColor, fontSize:13, width:18, flexShrink:0 }}>{icon}</span>
                    <span style={{ fontSize:12, color:biz.mutedColor, width:80, flexShrink:0 }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:biz.textColor }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ padding:"16px 20px", background:`${biz.accentColor}10`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, color:biz.mutedColor }}>Total a pagar</span>
                <span style={{ fontSize:24, fontWeight:900, color:biz.accentColor }}>{fmt(service.price)}</span>
              </div>
            </div>

            <div style={{ background:biz.cardColor, borderRadius:12, padding:"12px 14px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start", border:`1px solid #25D36630` }}>
              <span style={{ fontSize:18, flexShrink:0 }}>💬</span>
              <div style={{ fontSize:12, color:biz.mutedColor, lineHeight:1.6 }}>
                O <strong style={{ color:biz.textColor }}>{biz.name}</strong> receberá uma notificação no WhatsApp com os detalhes do seu agendamento. Você também receberá uma confirmação.
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Sucesso */}
        {step === 5 && booking && (
          <SuccessScreen biz={biz} booking={booking} onNew={() => { reset(); }} />
        )}
      </div>

      {/* ── BOTTOM CTA ── */}
      {step < 5 && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:`${biz.bgColor}F0`, backdropFilter:"blur(12px)", borderTop:`1px solid ${biz.accentColor}20`, padding:"16px 20px", zIndex:50 }}>
          <div style={{ maxWidth:520, margin:"0 auto", display:"flex", gap:10 }}>
            {step > 0 && (
              <button onClick={() => { setStep(s => s-1); }} style={{ background:"transparent", border:`1px solid ${biz.mutedColor}40`, borderRadius:12, padding:"14px 20px", color:biz.mutedColor, fontWeight:600, fontSize:13, cursor:"pointer", flexShrink:0 }}>
                ← Voltar
              </button>
            )}
            <button
              onClick={() => {
                if (step === 4) { confirm(); }
                else setStep(s => s+1);
              }}
              disabled={!canNext[step]}
              style={{ flex:1, background: canNext[step] ? `linear-gradient(135deg, ${biz.accentColor}, ${biz.accentDark})` : biz.mutedColor+"30", border:"none", borderRadius:12, padding:"14px", color: canNext[step] ? biz.bgColor : biz.mutedColor, fontWeight:800, fontSize:14, cursor: canNext[step] ? "pointer" : "not-allowed", transition:"all .3s", boxShadow: canNext[step] ? `0 8px 24px ${biz.accentColor}40` : "none" }}>
              {step === 4 ? `✓ Confirmar Agendamento — ${fmt(service?.price||0)}` :
               step === 0 ? (service ? `Continuar com ${service.name} →` : "Selecione um serviço") :
               step === 1 ? (professional ? `Continuar com ${professional.name} →` : "Selecione um profissional") :
               step === 2 ? (date && time ? `Confirmar ${fmtDate(date)} às ${time} →` : "Selecione data e horário") :
               "Revisar agendamento →"}
            </button>
          </div>

          {/* Powered by */}
          <div style={{ textAlign:"center", marginTop:8 }}>
            <span style={{ fontSize:9, color:biz.mutedColor+"60", letterSpacing:1 }}>
              AGENDAMENTO ONLINE · DILON TECH · DUQUE DE CAXIAS, RJ
            </span>
          </div>
        </div>
      )}
    </div>
  );
}