import { useState, useEffect, useRef } from "react";

// ============================================================
// CONSTANTS & DATA
// ============================================================
const SUPER_ADMIN = { username: "admin", password: "admin123", name: "المدير العام" };

const CLOTHING_CATEGORIES = ["كل الأصناف", "رجالي", "نسائي", "أطفال", "رياضي", "إكسسوار"];

const CLOTHING_PRODUCTS = [
  { id: 1, name: "بنطلون جينز رجالي", price: 85, stock: 24, category: "رجالي", sizes: ["S","M","L","XL"], emoji: "👖", color: "#4A90D9" },
  { id: 2, name: "قميص كتان أبيض", price: 55, stock: 18, category: "رجالي", sizes: ["M","L","XL","XXL"], emoji: "👔", color: "#F5F5F5" },
  { id: 3, name: "فستان سهرة", price: 195, stock: 8, category: "نسائي", sizes: ["S","M","L"], emoji: "👗", color: "#E91E8C" },
  { id: 4, name: "حجاب شيفون", price: 25, stock: 45, category: "نسائي", sizes: ["Free"], emoji: "🧕", color: "#9C27B0" },
  { id: 5, name: "بدلة رياضية أطفال", price: 65, stock: 12, category: "أطفال", sizes: ["2Y","4Y","6Y","8Y"], emoji: "🧒", color: "#FF9800" },
  { id: 6, name: "حذاء رياضي", price: 120, stock: 15, category: "رياضي", sizes: ["38","39","40","41","42","43"], emoji: "👟", color: "#4CAF50" },
  { id: 7, name: "جاكيت شتوي", price: 240, stock: 6, category: "رجالي", sizes: ["M","L","XL"], emoji: "🧥", color: "#795548" },
  { id: 8, name: "حقيبة يد نسائية", price: 145, stock: 11, category: "إكسسوار", sizes: ["Free"], emoji: "👜", color: "#E91E63" },
  { id: 9, name: "تيشيرت رياضي", price: 45, stock: 30, category: "رياضي", sizes: ["S","M","L","XL"], emoji: "👕", color: "#2196F3" },
  { id: 10, name: "بيجامة نسائية", price: 70, stock: 20, category: "نسائي", sizes: ["S","M","L"], emoji: "🌙", color: "#673AB7" },
  { id: 11, name: "قفازات جلد", price: 38, stock: 22, category: "إكسسوار", sizes: ["S","M","L"], emoji: "🧤", color: "#8B4513" },
  { id: 12, name: "بلوزة كاجوال", price: 60, stock: 16, category: "نسائي", sizes: ["S","M","L","XL"], emoji: "👚", color: "#FF5722" },
];

const INITIAL_STORES = [
  { id: 1, name: "بوتيك الأناقة - طرابلس", owner: "سامي الورفلي", phone: "0913111001", plan: "pro", status: "active", paid: true, expiry: "2026-08-01" },
  { id: 2, name: "محل الموضة - بنغازي", owner: "ليلى المقريف", phone: "0913111002", plan: "basic", status: "suspended", paid: false, expiry: "2026-04-01" },
  { id: 3, name: "ستايل هاوس - مصراتة", owner: "خالد الزروق", phone: "0913111003", plan: "enterprise", status: "active", paid: true, expiry: "2026-12-01" },
];

const INITIAL_EMPLOYEES = [
  { id: 1, storeId: 1, name: "أحمد سالم", role: "كاشير", pin: "1234", status: null, checkIn: null, sales: 0 },
  { id: 2, storeId: 1, name: "فاطمة العربي", role: "مشرفة", pin: "5678", status: null, checkIn: null, sales: 0 },
  { id: 3, storeId: 1, name: "يوسف الطاهر", role: "كاشير", pin: "9999", status: null, checkIn: null, sales: 0 },
  { id: 4, storeId: 3, name: "مريم البرغوثي", role: "كاشير", pin: "4321", status: null, checkIn: null, sales: 0 },
];

const PLANS = [
  { key: "basic", label: "أساسية", price: 150, stores: 1, users: 3 },
  { key: "pro", label: "احترافية", price: 350, stores: 5, users: 15 },
  { key: "enterprise", label: "مؤسسية", price: 900, stores: "∞", users: "∞" },
];

// Simulate live sales feed
const generateSale = (products) => {
  const p = products[Math.floor(Math.random() * products.length)];
  const emps = ["أحمد سالم", "فاطمة العربي", "يوسف الطاهر"];
  const emp = emps[Math.floor(Math.random() * emps.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  return { id: Date.now(), product: p.name, emoji: p.emoji, price: p.price * qty, qty, employee: emp, time: new Date().toLocaleTimeString("ar-LY"), size: p.sizes[0] };
};

// ============================================================
// COLORS
// ============================================================
const C = {
  bg: "#09090F", surface: "#0F1018", card: "#15161F",
  card2: "#1A1B26", border: "#1E2035", border2: "#252740",
  accent: "#7C6EFF", accentGlow: "#7C6EFF33",
  gold: "#FFB547", goldGlow: "#FFB54733",
  green: "#00D68F", greenGlow: "#00D68F22",
  red: "#FF4757", redGlow: "#FF475722",
  blue: "#4DAAFF", blueGlow: "#4DAAFF22",
  pink: "#FF6B9D", pinkGlow: "#FF6B9D22",
  text: "#ECEEFF", muted: "#555878", muted2: "#3A3D5C",
};

// ============================================================
// UTILITIES
// ============================================================
const nowTime = () => new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" });
const todayDate = () => new Date().toLocaleDateString("ar-LY");

const Badge = ({ color, bg, children, style = {} }) => (
  <span style={{ background: bg, color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, ...style }}>{children}</span>
);

const StatCard = ({ icon, label, value, color, glow, sub }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: glow, filter: "blur(20px)" }} />
    <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: color + "99", marginTop: 3 }}>{sub}</div>}
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState(null);
  const [activeStore, setActiveStore] = useState(null);
  const [stores, setStores] = useState(INITIAL_STORES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [adminTab, setAdminTab] = useState("stores");
  const [storeTab, setStoreTab] = useState("pos");
  const [ownerView, setOwnerView] = useState(false); // mobile owner monitoring
  const [cart, setCart] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});
  const [catFilter, setCatFilter] = useState("كل الأصناف");
  const [pinInput, setPinInput] = useState("");
  const [pinMsg, setPinMsg] = useState({ text: "", ok: false });
  const [loginData, setLoginData] = useState({ u: "", p: "" });
  const [loginError, setLoginError] = useState("");
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", owner: "", phone: "", plan: "basic" });
  const [toast, setToast] = useState(null);
  const [payDone, setPayDone] = useState(false);
  const [liveSales, setLiveSales] = useState([]);
  const [totalToday, setTotalToday] = useState(2840);
  const [billsToday, setBillsToday] = useState(22);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", role: "كاشير", pin: "" });
  const [searchProd, setSearchProd] = useState("");
  const [showSizeModal, setShowSizeModal] = useState(null);
  const liveInterval = useRef(null);

  // ---- TOAST ----
  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ---- LIVE FEED (simulate sales coming in) ----
  useEffect(() => {
    if ((screen === "store" && storeTab === "owner") || ownerView) {
      liveInterval.current = setInterval(() => {
        const sale = generateSale(CLOTHING_PRODUCTS);
        setLiveSales(prev => [sale, ...prev].slice(0, 30));
        setTotalToday(prev => prev + sale.price);
        setBillsToday(prev => prev + 1);
      }, 6000);
    }
    return () => clearInterval(liveInterval.current);
  }, [screen, storeTab, ownerView]);

  // ---- LOGIN ----
  const handleLogin = () => {
    if (loginData.u === SUPER_ADMIN.username && loginData.p === SUPER_ADMIN.password) {
      setRole("superadmin"); setScreen("superadmin"); setLoginError(""); return;
    }
    const store = stores.find(s => s.id.toString() === loginData.u && s.phone === loginData.p);
    if (store) {
      if (!store.paid || store.status === "suspended") {
        setLoginError("⛔ حسابك موقوف. يرجى سداد الاشتراك والتواصل مع الإدارة.");
        return;
      }
      setRole("store"); setActiveStore(store); setScreen("store"); setLoginError("");
    } else {
      setLoginError("بيانات غير صحيحة. تحقق من رقم المحل وكلمة المرور.");
    }
  };

  // ---- CART ----
  const addToCart = (p, size) => {
    const key = `${p.id}-${size}`;
    setCart(prev => {
      const ex = prev.find(i => i.key === key);
      return ex ? prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
                : [...prev, { ...p, key, size, qty: 1 }];
    });
    setShowSizeModal(null);
    toast_(`✓ ${p.name} - ${size}`);
  };

  const updateQty = (key, qty) => qty < 1 ? setCart(p => p.filter(i => i.key !== key)) : setCart(p => p.map(i => i.key === key ? { ...i, qty } : i));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handlePay = () => {
    if (!cart.length) return;
    setPayDone(true);
    const sale = { id: Date.now(), product: `${cart.length} منتج`, emoji: "🛍️", price: subtotal, qty: cart.length, employee: "الكاشير الحالي", time: nowTime(), size: "-" };
    setLiveSales(prev => [sale, ...prev].slice(0, 30));
    setTotalToday(p => p + subtotal);
    setBillsToday(p => p + 1);
    setTimeout(() => { setPayDone(false); setCart([]); toast_("✓ تم إتمام البيع بنجاح! 🎉"); }, 2000);
  };

  // ---- ATTENDANCE PIN ----
  const handlePin = (d) => {
    if (pinInput.length >= 4) return;
    const next = pinInput + d;
    setPinInput(next);
    if (next.length === 4) {
      const storeEmps = employees.filter(e => e.storeId === activeStore?.id);
      const emp = storeEmps.find(e => e.pin === next);
      if (emp) {
        const t = nowTime();
        setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "حاضر", checkIn: t } : e));
        setPinMsg({ text: `✓ أهلاً ${emp.name}! تم التسجيل ${t}`, ok: true });
      } else {
        setPinMsg({ text: "❌ كلمة السر خاطئة", ok: false });
      }
      setTimeout(() => { setPinInput(""); setPinMsg({ text: "", ok: false }); }, 2500);
    }
  };

  // ---- STORE MANAGEMENT ----
  const toggleStore = (id) => {
    setStores(p => p.map(s => {
      if (s.id !== id) return s;
      const ns = s.status === "active" ? "suspended" : "active";
      toast_(ns === "active" ? "✓ تم تفعيل المحل" : "⛔ تم تعليق المحل", ns === "active" ? "success" : "error");
      return { ...s, status: ns };
    }));
  };
  const markPaid = (id) => {
    setStores(p => p.map(s => s.id !== id ? s : { ...s, paid: true, status: "active" }));
    toast_("✓ تم تسجيل الدفع وتفعيل الحساب");
  };
  const addStore = () => {
    setStores(p => [...p, { id: p.length + 1, ...newStore, status: "suspended", paid: false, expiry: "2026-09-01" }]);
    setNewStore({ name: "", owner: "", phone: "", plan: "basic" });
    setShowAddStore(false);
    toast_("✓ تم إضافة المحل — في انتظار الدفع للتفعيل");
  };
  const addEmployee = () => {
    if (!newEmp.name || !newEmp.pin) return;
    setEmployees(p => [...p, { id: Date.now(), storeId: activeStore.id, ...newEmp, status: null, checkIn: null, sales: 0 }]);
    setNewEmp({ name: "", role: "كاشير", pin: "" });
    setShowAddEmp(false);
    toast_("✓ تم إضافة الموظف");
  };

  const storeEmps = employees.filter(e => e.storeId === activeStore?.id);
  const filteredProds = CLOTHING_PRODUCTS.filter(p =>
    (catFilter === "كل الأصناف" || p.category === catFilter) &&
    p.name.includes(searchProd)
  );

  // ============================================================
  const S = { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Cairo', sans-serif", direction: "rtl" };

  return (
    <div style={S}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; outline: none; font-family: inherit; }
        input, select { font-family: inherit; outline: none; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 4px; }
        .nav-btn { width:100%; display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:12px; background:transparent; color:${C.muted}; font-weight:500; font-size:13px; margin-bottom:3px; text-align:right; border-right:3px solid transparent; transition:all .2s; }
        .nav-btn:hover { background:${C.card2}; color:${C.text}; }
        .nav-btn.active { background:${C.accentGlow}; color:${C.accent}; border-right-color:${C.accent}; font-weight:700; }
        .prod-card { background:${C.card}; border:1px solid ${C.border}; border-radius:14px; padding:14px; cursor:pointer; transition:all .2s; }
        .prod-card:hover { border-color:${C.accent}55; transform:translateY(-2px); box-shadow:0 8px 24px ${C.accentGlow}; }
        .pin-key { background:${C.card2}; border:1px solid ${C.border}; border-radius:12px; padding:16px 0; font-size:20px; font-weight:800; color:${C.text}; transition:all .15s; }
        .pin-key:hover { background:${C.border2}; }
        .pin-key:active { transform:scale(.92); }
        .store-row:hover { background:${C.card2} !important; }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes liveDot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
        .anim { animation: slideUp .3s ease; }
        .live-dot { width:8px; height:8px; border-radius:50%; background:${C.green}; animation: liveDot 1.5s infinite; display:inline-block; }
        .sale-row { animation: fadeIn .4s ease; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:9999, background: toast.type==="error" ? C.red : C.green, color:"#000", padding:"11px 24px", borderRadius:14, fontWeight:800, fontSize:14, boxShadow:"0 8px 32px #0009", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* ── SIZE MODAL ── */}
      {showSizeModal && (
        <div style={{ position:"fixed", inset:0, background:"#000A", display:"flex", alignItems:"center", justifyContent:"center", zIndex:888 }} onClick={() => setShowSizeModal(null)}>
          <div className="anim" onClick={e => e.stopPropagation()} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:28, minWidth:280, textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>{showSizeModal.emoji}</div>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{showSizeModal.name}</div>
            <div style={{ color:C.accent, fontWeight:900, fontSize:18, marginBottom:20 }}>{showSizeModal.price} د.ل</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:14 }}>اختر المقاس</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
              {showSizeModal.sizes.map(sz => (
                <button key={sz} onClick={() => addToCart(showSizeModal, sz)}
                  style={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"10px 18px", fontWeight:700, color:C.text, fontSize:14, transition:"all .15s" }}
                  onMouseEnter={e => { e.target.style.background=C.accent; e.target.style.color="#000"; }}
                  onMouseLeave={e => { e.target.style.background=C.card2; e.target.style.color=C.text; }}>
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ LOGIN ══════════════ */}
      {screen === "login" && (
        <div style={{ display:"flex", minHeight:"100vh" }}>
          {/* Left brand panel */}
          <div style={{ flex:1, background:`linear-gradient(135deg, #0D0B1E 0%, #1A1040 50%, #0D0B1E 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:C.accentGlow, filter:"blur(80px)", top:"20%", right:"10%" }} />
            <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:C.pinkGlow, filter:"blur(60px)", bottom:"15%", left:"5%" }} />
            <div style={{ position:"relative", textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>👗</div>
              <div style={{ fontSize:42, fontWeight:900, color:"#fff", letterSpacing:-1 }}>نَقدي</div>
              <div style={{ fontSize:15, color:"#8080B0", marginTop:6 }}>نظام إدارة محلات الملابس</div>
              <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:14 }}>
                {["✦ إدارة المبيعات والمخزون", "✦ مراقبة المحل من هاتفك", "✦ حضور الموظفين بكلمة السر", "✦ تحكم كامل للمدير العام"].map(f => (
                  <div key={f} style={{ color:"#6060A0", fontSize:13 }}>{f}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right login */}
          <div style={{ width:420, display:"flex", alignItems:"center", justifyContent:"center", padding:40, background:C.surface }}>
            <div className="anim" style={{ width:"100%" }}>
              <div style={{ fontSize:24, fontWeight:900, marginBottom:6 }}>تسجيل الدخول</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:28 }}>أدخل بيانات حسابك للمتابعة</div>
              {[{k:"u",ph:"رقم المحل / اسم المستخدم",type:"text"},{k:"p",ph:"كلمة المرور / رقم الهاتف",type:"password"}].map(f => (
                <input key={f.k} type={f.type} placeholder={f.ph} value={loginData[f.k]}
                  onChange={e => setLoginData(p => ({...p,[f.k]:e.target.value}))}
                  onKeyDown={e => e.key==="Enter" && handleLogin()}
                  style={{ width:"100%", background:C.card, border:`1px solid ${C.border2}`, borderRadius:12, padding:"13px 16px", color:C.text, fontSize:14, marginBottom:12 }} />
              ))}
              {loginError && <div style={{ color:C.red, fontSize:13, marginBottom:12, lineHeight:1.6, textAlign:"center" }}>{loginError}</div>}
              <button onClick={handleLogin} style={{ width:"100%", background:C.accent, color:"#fff", borderRadius:12, padding:14, fontWeight:900, fontSize:15, marginTop:4 }}>
                دخول ←
              </button>
              <div style={{ marginTop:20, background:C.card, borderRadius:14, padding:16, fontSize:12, color:C.muted, lineHeight:2 }}>
                <div style={{ fontWeight:800, color:C.text, marginBottom:4 }}>بيانات تجريبية:</div>
                <div>👑 مدير: <b style={{color:C.accent}}>admin / admin123</b></div>
                <div>🏪 محل نشط: <b style={{color:C.green}}>1 / 0913111001</b></div>
                <div>⛔ محل موقوف: <b style={{color:C.red}}>2 / 0913111002</b></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SUPER ADMIN ══════════════ */}
      {screen === "superadmin" && (
        <div style={{ display:"flex", minHeight:"100vh" }}>
          <aside style={{ width:220, background:C.surface, borderLeft:`1px solid ${C.border}`, padding:"20px 0", display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"0 18px 18px", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:20, fontWeight:900, color:C.accent }}>نَقدي <span style={{ fontSize:10, background:C.goldGlow, color:C.gold, padding:"2px 8px", borderRadius:6 }}>ADMIN</span></div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>لوحة التحكم الرئيسية</div>
            </div>
            <div style={{ flex:1, padding:"14px 10px" }}>
              {[{k:"stores",icon:"🏪",l:"المحلات"},{k:"payments",icon:"💰",l:"المدفوعات"},{k:"plans",icon:"⭐",l:"الخطط"},{k:"stats",icon:"📊",l:"الإحصائيات"}].map(item => (
                <button key={item.k} className={`nav-btn ${adminTab===item.k?"active":""}`} onClick={() => setAdminTab(item.k)}>
                  <span>{item.icon}</span>{item.l}
                </button>
              ))}
            </div>
            <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
              <button onClick={() => setScreen("login")} style={{ width:"100%", background:C.card, color:C.muted, borderRadius:10, padding:10, fontSize:13, fontWeight:700 }}>⏻ خروج</button>
            </div>
          </aside>

          <main style={{ flex:1, overflowY:"auto", padding:28 }} className="anim">

            {/* ── STORES TAB ── */}
            {adminTab==="stores" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                  <div>
                    <h2 style={{ fontSize:22, fontWeight:900 }}>إدارة المحلات</h2>
                    <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>تحكم كامل — تفعيل / تعليق / دفع</div>
                  </div>
                  <button onClick={() => setShowAddStore(true)} style={{ background:C.accent, color:"#fff", borderRadius:12, padding:"10px 20px", fontWeight:800, fontSize:14 }}>+ محل جديد</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                  {[
                    {l:"إجمالي",v:stores.length,color:C.accent,glow:C.accentGlow,icon:"🏪"},
                    {l:"نشطة",v:stores.filter(s=>s.status==="active").length,color:C.green,glow:C.greenGlow,icon:"✅"},
                    {l:"موقوفة",v:stores.filter(s=>s.status==="suspended").length,color:C.red,glow:C.redGlow,icon:"⛔"},
                    {l:"غير مدفوعة",v:stores.filter(s=>!s.paid).length,color:C.gold,glow:C.goldGlow,icon:"⚠️"},
                  ].map((s,i) => <StatCard key={i} {...s} label={s.l} value={s.v} />)}
                </div>

                <div style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1.3fr 0.9fr 0.9fr 0.9fr 1.6fr", padding:"12px 20px", background:C.card, gap:8 }}>
                    {["المحل / المالك","الهاتف","الخطة","الدفع","الحالة","التحكم"].map(h => (
                      <div key={h} style={{ fontSize:11, color:C.muted, fontWeight:700 }}>{h}</div>
                    ))}
                  </div>
                  {stores.map(store => (
                    <div key={store.id} className="store-row" style={{ display:"grid", gridTemplateColumns:"2fr 1.3fr 0.9fr 0.9fr 0.9fr 1.6fr", padding:"14px 20px", borderTop:`1px solid ${C.border}`, alignItems:"center", gap:8 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13 }}>{store.name}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{store.owner}</div>
                      </div>
                      <div style={{ fontSize:12, color:C.muted }}>{store.phone}</div>
                      <div><Badge color={C.accent} bg={C.accentGlow}>{PLANS.find(p=>p.key===store.plan)?.label}</Badge></div>
                      <div><Badge color={store.paid?C.green:C.red} bg={store.paid?C.greenGlow:C.redGlow}>{store.paid?"مدفوع ✓":"غير مدفوع"}</Badge></div>
                      <div><Badge color={store.status==="active"?C.green:C.red} bg={store.status==="active"?C.greenGlow:C.redGlow}>{store.status==="active"?"نشط":"موقوف"}</Badge></div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => toggleStore(store.id)} style={{ background: store.status==="active"?C.redGlow:C.greenGlow, color:store.status==="active"?C.red:C.green, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800 }}>
                          {store.status==="active"?"⛔ تعليق":"✅ تفعيل"}
                        </button>
                        {!store.paid && <button onClick={() => markPaid(store.id)} style={{ background:C.goldGlow, color:C.gold, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800 }}>💰 دفع</button>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add store modal */}
                {showAddStore && (
                  <div style={{ position:"fixed", inset:0, background:"#000B", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
                    <div className="anim" style={{ background:C.surface, border:`1px solid ${C.border2}`, borderRadius:20, padding:32, width:420 }}>
                      <h3 style={{ fontSize:18, fontWeight:900, marginBottom:20 }}>إضافة محل جديد</h3>
                      {[{k:"name",l:"اسم المحل",ph:"بوتيك الأناقة — طرابلس"},{k:"owner",l:"اسم المالك",ph:"محمد العربي"},{k:"phone",l:"رقم الهاتف (كلمة مرور الدخول)",ph:"09XXXXXXXXX"}].map(f => (
                        <div key={f.k} style={{ marginBottom:14 }}>
                          <div style={{ fontSize:12, color:C.muted, marginBottom:5 }}>{f.l}</div>
                          <input value={newStore[f.k]} onChange={e => setNewStore(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}
                            style={{ width:"100%", background:C.card, border:`1px solid ${C.border2}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14 }} />
                        </div>
                      ))}
                      <div style={{ marginBottom:18 }}>
                        <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>الخطة</div>
                        <div style={{ display:"flex", gap:8 }}>
                          {PLANS.map(p => (
                            <button key={p.key} onClick={() => setNewStore(prev=>({...prev,plan:p.key}))}
                              style={{ flex:1, padding:"9px 0", borderRadius:10, fontWeight:800, fontSize:13, background:newStore.plan===p.key?C.accent:C.card, color:newStore.plan===p.key?"#000":C.muted, border:`1px solid ${newStore.plan===p.key?C.accent:C.border}` }}>
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={addStore} style={{ flex:1, background:C.accent, color:"#fff", borderRadius:12, padding:13, fontWeight:900 }}>إضافة</button>
                        <button onClick={() => setShowAddStore(false)} style={{ flex:1, background:C.card, color:C.muted, borderRadius:12, padding:13, fontWeight:700 }}>إلغاء</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PAYMENTS TAB ── */}
            {adminTab==="payments" && (
              <div>
                <h2 style={{ fontSize:22, fontWeight:900, marginBottom:24 }}>متابعة المدفوعات</h2>
                <div style={{ display:"grid", gap:12, marginBottom:24 }}>
                  {stores.map(store => (
                    <div key={store.id} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:store.paid?C.greenGlow:C.redGlow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                        {store.paid?"✅":"⛔"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700 }}>{store.name}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>انتهاء: {store.expiry} | {PLANS.find(p=>p.key===store.plan)?.label}</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:22, fontWeight:900, color:store.paid?C.green:C.red }}>{PLANS.find(p=>p.key===store.plan)?.price} <span style={{fontSize:12}}>د.ل</span></div>
                        <div style={{ fontSize:11, color:C.muted }}>/شهر</div>
                      </div>
                      {!store.paid && <button onClick={()=>markPaid(store.id)} style={{ background:C.gold, color:"#000", borderRadius:10, padding:"9px 18px", fontWeight:900, fontSize:13 }}>تأكيد الدفع</button>}
                    </div>
                  ))}
                </div>
                <div style={{ background:C.card, borderRadius:14, padding:22, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontWeight:700 }}>💰 إجمالي الإيرادات الشهرية</div>
                  <div style={{ fontSize:32, fontWeight:900, color:C.gold }}>
                    {stores.filter(s=>s.paid).reduce((sum,s)=>sum+(PLANS.find(p=>p.key===s.plan)?.price||0),0)} <span style={{fontSize:14,color:C.muted}}>د.ل</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── PLANS TAB ── */}
            {adminTab==="plans" && (
              <div>
                <h2 style={{ fontSize:22, fontWeight:900, marginBottom:24 }}>خطط الاشتراك</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
                  {PLANS.map(plan => (
                    <div key={plan.key} style={{ background:C.card, borderRadius:18, padding:28, border:`2px solid ${plan.key==="pro"?C.accent:C.border}`, position:"relative" }}>
                      {plan.key==="pro" && <div style={{ position:"absolute", top:-13, right:"50%", transform:"translateX(50%)", background:C.accent, color:"#fff", padding:"3px 16px", borderRadius:20, fontSize:11, fontWeight:800 }}>★ الأكثر طلباً</div>}
                      <div style={{ fontSize:15, fontWeight:800, marginBottom:6 }}>{plan.label}</div>
                      <div style={{ fontSize:36, fontWeight:900, color:C.accent, marginBottom:18 }}>{plan.price} <span style={{fontSize:14,color:C.muted}}>د.ل/شهر</span></div>
                      {[`${plan.stores} محل`,`${plan.users} مستخدم`,"دعم فني","تقارير متكاملة","مراقبة عن بُعد"].map(f => (
                        <div key={f} style={{ display:"flex", gap:8, marginBottom:10, fontSize:13 }}>
                          <span style={{color:C.green}}>✓</span><span style={{color:C.muted}}>{f}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:16, padding:"10px 0", borderTop:`1px solid ${C.border}`, fontSize:13, color:C.muted }}>
                        مشتركون: <b style={{color:C.text}}>{stores.filter(s=>s.plan===plan.key).length}</b>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STATS TAB ── */}
            {adminTab==="stats" && (
              <div>
                <h2 style={{ fontSize:22, fontWeight:900, marginBottom:24 }}>إحصائيات النظام</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
                  <StatCard icon="🏪" label="إجمالي المحلات" value={stores.length} color={C.accent} glow={C.accentGlow} />
                  <StatCard icon="✅" label="محلات نشطة" value={stores.filter(s=>s.status==="active").length} color={C.green} glow={C.greenGlow} />
                  <StatCard icon="💰" label="الإيراد الشهري" value={`${stores.filter(s=>s.paid).reduce((s,st)=>s+(PLANS.find(p=>p.key===st.plan)?.price||0),0)} د.ل`} color={C.gold} glow={C.goldGlow} />
                  <StatCard icon="⏳" label="في انتظار الدفع" value={stores.filter(s=>!s.paid).length} color={C.red} glow={C.redGlow} />
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ══════════════ STORE APP ══════════════ */}
      {screen === "store" && activeStore && (
        <div style={{ display:"flex", minHeight:"100vh" }}>

          {/* ── MOBILE OWNER VIEW OVERLAY ── */}
          {ownerView && (
            <div style={{ position:"fixed", inset:0, background:C.bg, zIndex:500, overflowY:"auto", padding:20 }}>
              <div className="anim">
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:900 }}>📱 مراقبة المحل</div>
                    <div style={{ fontSize:12, color:C.muted }}>{activeStore.name}</div>
                  </div>
                  <button onClick={() => setOwnerView(false)} style={{ background:C.card, color:C.muted, borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:13 }}>✕ إغلاق</button>
                </div>

                {/* Live indicator */}
                <div style={{ display:"flex", alignItems:"center", gap:8, background:C.greenGlow, border:`1px solid ${C.green}33`, borderRadius:12, padding:"10px 16px", marginBottom:20 }}>
                  <span className="live-dot" />
                  <span style={{ fontSize:13, color:C.green, fontWeight:700 }}>مباشر — المبيعات تُحدَّث تلقائياً كل 6 ثوان</span>
                </div>

                {/* KPIs */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  <StatCard icon="💰" label="مبيعات اليوم" value={`${totalToday.toLocaleString()} د.ل`} color={C.accent} glow={C.accentGlow} />
                  <StatCard icon="🧾" label="عدد الفواتير" value={billsToday} color={C.green} glow={C.greenGlow} />
                  <StatCard icon="👥" label="موظفون حاضرون" value={`${storeEmps.filter(e=>e.status==="حاضر").length}/${storeEmps.length}`} color={C.blue} glow={C.blueGlow} />
                  <StatCard icon="📦" label="منتجات نقص مخزون" value={CLOTHING_PRODUCTS.filter(p=>p.stock<10).length} color={C.red} glow={C.redGlow} />
                </div>

                {/* Employee status */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:20 }}>
                  <div style={{ fontWeight:800, marginBottom:14 }}>حالة الموظفين الآن</div>
                  {storeEmps.map(emp => (
                    <div key={emp.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, background:C.card, borderRadius:12, padding:12 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:emp.status?C.greenGlow:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:emp.status?C.green:C.muted, fontSize:16 }}>{emp.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{emp.name}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{emp.role} {emp.checkIn?`— دخل ${emp.checkIn}`:""}</div>
                      </div>
                      <Badge color={emp.status?C.green:C.muted} bg={emp.status?C.greenGlow:C.border}>{emp.status||"لم يسجل"}</Badge>
                    </div>
                  ))}
                </div>

                {/* Live sales feed */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <span className="live-dot" />
                    <span style={{ fontWeight:800 }}>آخر المبيعات — مباشر</span>
                  </div>
                  {liveSales.length === 0 ? (
                    <div style={{ textAlign:"center", color:C.muted, padding:"30px 0", fontSize:13 }}>في انتظار أول عملية بيع...</div>
                  ) : liveSales.map(sale => (
                    <div key={sale.id} className="sale-row" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, background:C.card, borderRadius:12, padding:12, borderRight:`3px solid ${C.accent}` }}>
                      <div style={{ fontSize:24 }}>{sale.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{sale.product}</div>
                        <div style={{ fontSize:11, color:C.muted }}>بواسطة {sale.employee}</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontWeight:900, color:C.accent, fontSize:15 }}>{sale.price} د.ل</div>
                        <div style={{ fontSize:10, color:C.muted }}>{sale.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <aside style={{ width:215, background:C.surface, borderLeft:`1px solid ${C.border}`, padding:"20px 0", display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"0 16px 16px", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:18, fontWeight:900, color:C.accent }}>نَقدي</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2, lineHeight:1.5 }}>{activeStore.name}</div>
              <Badge color={C.accent} bg={C.accentGlow} style={{ marginTop:6, display:"inline-block" }}>
                {PLANS.find(p=>p.key===activeStore.plan)?.label}
              </Badge>
            </div>

            {/* Owner monitoring button */}
            <div style={{ padding:"12px 10px" }}>
              <button onClick={() => setOwnerView(true)}
                style={{ width:"100%", background:`linear-gradient(135deg, ${C.accentGlow}, ${C.blueGlow})`, border:`1px solid ${C.accent}44`, borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:8, color:C.accent, fontWeight:800, fontSize:13, marginBottom:12 }}>
                <span className="live-dot" />
                📱 مراقبة عن بُعد
              </button>
            </div>

            <div style={{ flex:1, padding:"0 10px" }}>
              {[{k:"pos",icon:"🛒",l:"نقطة البيع"},{k:"inventory",icon:"📦",l:"المخزون"},{k:"reports",icon:"📊",l:"التقارير"},{k:"attendance",icon:"⏰",l:"الحضور"},{k:"employees",icon:"👥",l:"الموظفون"},{k:"customers",icon:"🌟",l:"العملاء"}].map(item => (
                <button key={item.k} className={`nav-btn ${storeTab===item.k?"active":""}`} onClick={() => setStoreTab(item.k)}>
                  <span>{item.icon}</span>{item.l}
                </button>
              ))}
            </div>
            <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
              <button onClick={() => { setScreen("login"); setActiveStore(null); setCart([]); setLiveSales([]); }}
                style={{ width:"100%", background:C.card, color:C.muted, borderRadius:10, padding:10, fontSize:13, fontWeight:700 }}>⏻ خروج</button>
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex:1, overflowY:"auto", padding:24 }} className="anim">

            {/* ── POS ── */}
            {storeTab==="pos" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:20, height:"calc(100vh - 48px)" }}>
                <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <h2 style={{ fontSize:20, fontWeight:900 }}>نقطة البيع 🛒</h2>
                  </div>
                  {/* Search + Cat filter */}
                  <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                    <input value={searchProd} onChange={e=>setSearchProd(e.target.value)} placeholder="🔍 ابحث عن منتج..."
                      style={{ flex:1, minWidth:120, background:C.card, border:`1px solid ${C.border2}`, borderRadius:10, padding:"9px 14px", color:C.text, fontSize:13 }} />
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                    {CLOTHING_CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setCatFilter(cat)}
                        style={{ padding:"7px 14px", borderRadius:20, fontSize:12, fontWeight:700, background:catFilter===cat?C.accent:C.card, color:catFilter===cat?"#fff":C.muted, border:`1px solid ${catFilter===cat?C.accent:C.border}`, transition:"all .2s" }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  {/* Products grid */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, overflowY:"auto", flex:1 }}>
                    {filteredProds.map(p => (
                      <div key={p.id} className="prod-card" onClick={() => setShowSizeModal(p)}>
                        <div style={{ fontSize:34, marginBottom:8, textAlign:"center" }}>{p.emoji}</div>
                        <div style={{ fontWeight:700, fontSize:13, marginBottom:4, textAlign:"center" }}>{p.name}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ color:C.accent, fontWeight:900, fontSize:16 }}>{p.price} <span style={{fontSize:11}}>د.ل</span></span>
                          <Badge color={p.stock<10?C.red:C.muted} bg={p.stock<10?C.redGlow:"transparent"}>{p.stock}</Badge>
                        </div>
                        <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                          {p.sizes.slice(0,3).map(sz => <span key={sz} style={{ fontSize:10, background:C.border, color:C.muted, padding:"2px 6px", borderRadius:6 }}>{sz}</span>)}
                          {p.sizes.length>3 && <span style={{ fontSize:10, color:C.muted }}>+{p.sizes.length-3}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:18, display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:15, fontWeight:900, marginBottom:14 }}>🧾 الفاتورة</div>
                  <div style={{ flex:1, overflowY:"auto" }}>
                    {cart.length===0 ? (
                      <div style={{ textAlign:"center", color:C.muted, marginTop:50, fontSize:13 }}>
                        <div style={{ fontSize:36, marginBottom:10 }}>🛍️</div>انقر على منتج للإضافة
                      </div>
                    ) : cart.map(item => (
                      <div key={item.key} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, background:C.card, borderRadius:10, padding:10 }}>
                        <span style={{ fontSize:20 }}>{item.emoji}</span>
                        <div style={{ flex:1, fontSize:12 }}>
                          <div style={{ fontWeight:700 }}>{item.name}</div>
                          <div style={{ color:C.muted, fontSize:11 }}>مقاس: {item.size}</div>
                          <div style={{ color:C.accent, fontWeight:800 }}>{(item.price*item.qty).toFixed(1)} د.ل</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <button onClick={()=>updateQty(item.key,item.qty-1)} style={{ background:C.border, color:C.text, width:22, height:22, borderRadius:6, fontWeight:900 }}>-</button>
                          <span style={{ fontWeight:900, minWidth:16, textAlign:"center", fontSize:13 }}>{item.qty}</span>
                          <button onClick={()=>updateQty(item.key,item.qty+1)} style={{ background:C.accent, color:"#fff", width:22, height:22, borderRadius:6, fontWeight:900 }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:17, color:C.accent, marginBottom:14 }}>
                      <span>الإجمالي</span><span>{subtotal.toFixed(1)} د.ل</span>
                    </div>
                    <button onClick={handlePay} disabled={!cart.length}
                      style={{ width:"100%", background:cart.length?C.accent:C.border, color:cart.length?"#fff":C.muted, borderRadius:12, padding:14, fontWeight:900, fontSize:15, transition:"all .2s" }}>
                      {payDone ? "✓ تم البيع!" : "إتمام البيع →"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── INVENTORY ── */}
            {storeTab==="inventory" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:900, marginBottom:20 }}>المخزون 📦</h2>
                <div style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr style={{ background:C.card }}>
                      {["المنتج","الفئة","المقاسات","السعر","الكمية","الحالة"].map(h => (
                        <th key={h} style={{ padding:"13px 16px", textAlign:"right", fontSize:11, color:C.muted, fontWeight:700 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{CLOTHING_PRODUCTS.map((p,i) => (
                      <tr key={p.id} style={{ borderTop:`1px solid ${C.border}`, background:i%2?C.surface+"55":"transparent" }}>
                        <td style={{ padding:"12px 16px", fontWeight:700 }}>{p.emoji} {p.name}</td>
                        <td style={{ padding:"12px 16px" }}><Badge color={C.accent} bg={C.accentGlow}>{p.category}</Badge></td>
                        <td style={{ padding:"12px 16px", fontSize:11, color:C.muted }}>{p.sizes.join(", ")}</td>
                        <td style={{ padding:"12px 16px", color:C.accent, fontWeight:800 }}>{p.price} د.ل</td>
                        <td style={{ padding:"12px 16px", fontWeight:700 }}>{p.stock}</td>
                        <td style={{ padding:"12px 16px" }}>
                          <Badge color={p.stock<10?C.red:p.stock<20?C.gold:C.green} bg={p.stock<10?C.redGlow:p.stock<20?C.goldGlow:C.greenGlow}>
                            {p.stock<10?"⚠ نقص":p.stock<20?"⚡ قليل":"✓ كافٍ"}
                          </Badge>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── REPORTS ── */}
            {storeTab==="reports" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:900, marginBottom:20 }}>التقارير 📊</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
                  <StatCard icon="💰" label="مبيعات اليوم" value={`${totalToday.toLocaleString()} د.ل`} color={C.accent} glow={C.accentGlow} />
                  <StatCard icon="🧾" label="عدد الفواتير" value={billsToday} color={C.green} glow={C.greenGlow} />
                  <StatCard icon="📈" label="متوسط الفاتورة" value={`${Math.round(totalToday/Math.max(billsToday,1))} د.ل`} color={C.gold} glow={C.goldGlow} />
                </div>
                <div style={{ background:C.card, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:800, marginBottom:18 }}>أكثر المنتجات مبيعاً</div>
                  {CLOTHING_PRODUCTS.slice(0,6).map((p,i) => {
                    const pct = [80,68,55,42,33,22][i];
                    return (
                      <div key={p.id} style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
                          <span>{p.emoji} {p.name}</span>
                          <span style={{ color:C.muted, fontSize:12 }}>{pct}%</span>
                        </div>
                        <div style={{ background:C.border, borderRadius:6, height:8 }}>
                          <div style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${C.accent}, ${C.pink})`, height:"100%", borderRadius:6 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ATTENDANCE ── */}
            {storeTab==="attendance" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 270px", gap:24 }}>
                <div>
                  <h2 style={{ fontSize:20, fontWeight:900, marginBottom:20 }}>سجل الحضور ⏰</h2>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                    <StatCard icon="✅" label="حاضر" value={storeEmps.filter(e=>e.status==="حاضر").length} color={C.green} glow={C.greenGlow} />
                    <StatCard icon="⏳" label="لم يسجل" value={storeEmps.filter(e=>!e.status).length} color={C.muted} glow={C.border} />
                    <StatCard icon="👥" label="إجمالي" value={storeEmps.length} color={C.accent} glow={C.accentGlow} />
                  </div>
                  {storeEmps.map(emp => (
                    <div key={emp.id} style={{ background:C.card, borderRadius:14, padding:16, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:"50%", background:emp.status?C.greenGlow:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:emp.status?C.green:C.muted, fontSize:18 }}>
                        {emp.name[0]}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700 }}>{emp.name}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{emp.role}</div>
                      </div>
                      {emp.checkIn && <div style={{ fontSize:12, color:C.muted }}>⏰ {emp.checkIn}</div>}
                      <Badge color={emp.status?C.green:C.muted} bg={emp.status?C.greenGlow:C.border}>{emp.status||"لم يسجل"}</Badge>
                    </div>
                  ))}
                </div>

                {/* PIN PAD */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:24, textAlign:"center", height:"fit-content", position:"sticky", top:0 }}>
                  <div style={{ fontSize:14, fontWeight:900, marginBottom:3 }}>⏰ تسجيل الحضور</div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>أدخل كلمة السر الخاصة بك</div>
                  {/* Dots */}
                  <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:20 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:i<pinInput.length?C.accent:C.border, transition:"all .2s", boxShadow:i<pinInput.length?`0 0 10px ${C.accent}`:"none" }} />
                    ))}
                  </div>
                  {pinMsg.text && (
                    <div style={{ background:pinMsg.ok?C.greenGlow:C.redGlow, color:pinMsg.ok?C.green:C.red, borderRadius:12, padding:"10px 14px", fontSize:13, marginBottom:16, fontWeight:700, lineHeight:1.5 }}>
                      {pinMsg.text}
                    </div>
                  )}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {[1,2,3,4,5,6,7,8,9].map(d => (
                      <button key={d} className="pin-key" onClick={() => handlePin(d.toString())}>{d}</button>
                    ))}
                    <button className="pin-key" onClick={() => setPinInput("")} style={{ color:C.red, fontSize:13 }}>مسح</button>
                    <button className="pin-key" onClick={() => handlePin("0")}>0</button>
                    <button className="pin-key" onClick={() => setPinInput(p=>p.slice(0,-1))} style={{ fontSize:18, color:C.muted }}>⌫</button>
                  </div>
                  <div style={{ marginTop:14, fontSize:11, color:C.muted }}>كلمات السر يحددها مدير المحل</div>
                </div>
              </div>
            )}

            {/* ── EMPLOYEES ── */}
            {storeTab==="employees" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h2 style={{ fontSize:20, fontWeight:900 }}>الموظفون 👥</h2>
                  <button onClick={() => setShowAddEmp(true)} style={{ background:C.accent, color:"#fff", borderRadius:12, padding:"10px 18px", fontWeight:800, fontSize:13 }}>+ إضافة موظف</button>
                </div>
                <div style={{ display:"grid", gap:12 }}>
                  {storeEmps.map(emp => (
                    <div key={emp.id} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ width:48, height:48, borderRadius:"50%", background:C.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:C.accent, fontSize:20 }}>{emp.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800 }}>{emp.name}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{emp.role}</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>كلمة السر</div>
                        <div style={{ background:C.border, borderRadius:8, padding:"6px 16px", fontWeight:900, fontSize:16, letterSpacing:4 }}>••••</div>
                      </div>
                      <Badge color={emp.status?C.green:C.muted} bg={emp.status?C.greenGlow:C.border}>{emp.status||"غائب"}</Badge>
                    </div>
                  ))}
                </div>
                {storeEmps.length===0 && <div style={{ textAlign:"center", color:C.muted, marginTop:60, fontSize:14 }}>لا يوجد موظفون. أضف موظفاً الآن.</div>}

                {showAddEmp && (
                  <div style={{ position:"fixed", inset:0, background:"#000B", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
                    <div className="anim" style={{ background:C.surface, border:`1px solid ${C.border2}`, borderRadius:20, padding:32, width:380 }}>
                      <h3 style={{ fontSize:17, fontWeight:900, marginBottom:20 }}>إضافة موظف جديد</h3>
                      {[{k:"name",l:"الاسم",ph:"محمد علي"},{k:"pin",l:"كلمة السر (4 أرقام)",ph:"****",type:"password"}].map(f => (
                        <div key={f.k} style={{ marginBottom:14 }}>
                          <div style={{ fontSize:12, color:C.muted, marginBottom:5 }}>{f.l}</div>
                          <input type={f.type||"text"} value={newEmp[f.k]} onChange={e=>setNewEmp(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} maxLength={f.k==="pin"?4:50}
                            style={{ width:"100%", background:C.card, border:`1px solid ${C.border2}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14 }} />
                        </div>
                      ))}
                      <div style={{ marginBottom:18 }}>
                        <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>الدور الوظيفي</div>
                        <div style={{ display:"flex", gap:8 }}>
                          {["كاشير","مشرف","مخزن"].map(r => (
                            <button key={r} onClick={() => setNewEmp(p=>({...p,role:r}))}
                              style={{ flex:1, padding:"9px 0", borderRadius:10, fontWeight:800, fontSize:13, background:newEmp.role===r?C.accent:C.card, color:newEmp.role===r?"#fff":C.muted, border:`1px solid ${newEmp.role===r?C.accent:C.border}` }}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={addEmployee} style={{ flex:1, background:C.accent, color:"#fff", borderRadius:12, padding:13, fontWeight:900 }}>إضافة</button>
                        <button onClick={() => setShowAddEmp(false)} style={{ flex:1, background:C.card, color:C.muted, borderRadius:12, padding:13, fontWeight:700 }}>إلغاء</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CUSTOMERS ── */}
            {storeTab==="customers" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:900, marginBottom:20 }}>العملاء 🌟</h2>
                <div style={{ display:"grid", gap:12 }}>
                  {[{n:"سامي البرغوثي",v:31,total:4200},{n:"ريم المصراتي",v:18,total:2850},{n:"خالد الورفلي",v:24,total:3100},{n:"نورة الزروق",v:9,total:1100}].map((c,i) => (
                    <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ width:48, height:48, borderRadius:"50%", background:C.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:C.accent, fontSize:20 }}>{c.n[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800 }}>{c.n}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{c.v} زيارة</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontWeight:900, color:C.accent, fontSize:18 }}>{c.total.toLocaleString()} <span style={{fontSize:12}}>د.ل</span></div>
                        <div style={{ fontSize:11, color:C.muted }}>إجمالي المشتريات</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
