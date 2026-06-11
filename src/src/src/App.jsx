import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETA ───────────────────────────────────────────────────────────────
const C = {
  bosque:"#1A3D2B", verde:"#2D6A4F", cafe:"#6B3F1F", tostado:"#8B5A2B",
  crema:"#F5ECD7", oro:"#C9963A", oroL:"#E8B96A", blanco:"#FDFAF5",
  gris:"#E8E0D4", grisM:"#9C8F7E", texto:"#2C1810", rojo:"#C0392B",
  azul:"#1e40af", azulL:"#dbeafe", verde2:"#166534", verdeL:"#dcfce7",
  amarillo:"#92400e", amarilloL:"#fef3c7",
};

// ─── CSS GLOBAL ───────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:${C.crema};color:${C.texto};font-size:14px}

/* AUTH */
.auth-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
  background:linear-gradient(145deg,${C.bosque} 0%,${C.cafe} 55%,${C.tostado} 100%);position:relative;overflow:hidden}
.auth-deco{position:absolute;font-size:260px;opacity:.04;pointer-events:none}
.auth-deco.a{top:-80px;right:-80px;transform:rotate(25deg)}
.auth-deco.b{bottom:-100px;left:-60px;transform:rotate(-15deg)}
.auth-box{background:${C.blanco};border-radius:22px;width:100%;max-width:500px;
  box-shadow:0 24px 64px rgba(0,0,0,.38);overflow:hidden;position:relative;z-index:1}
.auth-top{background:linear-gradient(135deg,${C.bosque},${C.verde});padding:28px 32px;text-align:center}
.auth-top h1{font-family:'Playfair Display',serif;font-size:26px;color:#fff;line-height:1.2}
.auth-top p{font-size:12px;color:rgba(255,255,255,.55);margin-top:4px}
.auth-body{padding:28px 32px}
.tabs{display:flex;background:${C.gris};border-radius:10px;padding:3px;margin-bottom:22px}
.tab{flex:1;padding:9px;border:none;background:transparent;border-radius:8px;cursor:pointer;
  font-size:13px;font-weight:600;color:${C.grisM};transition:.2s;font-family:inherit}
.tab.on{background:${C.bosque};color:#fff}
.field{margin-bottom:14px}
.field label{display:block;font-size:11px;font-weight:700;color:${C.cafe};margin-bottom:4px;
  text-transform:uppercase;letter-spacing:.5px}
.field input,.field select,.field textarea{width:100%;padding:10px 13px;border:1.5px solid ${C.gris};
  border-radius:10px;font-size:13px;background:${C.blanco};color:${C.texto};outline:none;
  transition:.2s;font-family:inherit}
.field input:focus,.field select:focus,.field textarea:focus{border-color:${C.oro};
  box-shadow:0 0 0 3px rgba(201,150,58,.14)}
.field textarea{resize:vertical;min-height:72px}
.roles-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}
.role-opt{border:2px solid ${C.gris};border-radius:12px;padding:13px 8px;text-align:center;
  cursor:pointer;transition:.18s;background:${C.blanco}}
.role-opt:hover{border-color:${C.oro}}
.role-opt.sel{border-color:${C.bosque};background:#edf5f0}
.role-opt .ri{font-size:24px}
.role-opt .rn{font-size:12px;font-weight:700;color:${C.bosque};margin-top:4px}
.role-opt .rd{font-size:10px;color:${C.grisM};margin-top:1px}
.err{background:#fef2f2;border:1px solid #fca5a5;color:${C.rojo};padding:9px 13px;
  border-radius:8px;font-size:12px;margin-bottom:12px}

/* VERIFICACIÓN ID */
.verif-steps{display:flex;gap:6px;margin-bottom:20px}
.vstep{flex:1;height:4px;border-radius:2px;background:${C.gris}}
.vstep.done{background:${C.bosque}}
.vstep.active{background:${C.oro}}
.upload-zone{border:2px dashed ${C.gris};border-radius:14px;padding:28px;text-align:center;
  cursor:pointer;transition:.2s;position:relative;background:#fafaf8}
.upload-zone:hover{border-color:${C.oro};background:#fffbf2}
.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer}
.upload-zone .uz-icon{font-size:36px;margin-bottom:8px}
.upload-zone .uz-title{font-size:14px;font-weight:700;color:${C.bosque}}
.upload-zone .uz-sub{font-size:11px;color:${C.grisM};margin-top:3px}
.preview-img{width:100%;max-height:200px;object-fit:cover;border-radius:10px;margin-top:10px}
.verif-check{display:flex;align-items:center;gap:10px;padding:12px;background:${C.verdeL};
  border-radius:10px;color:${C.verde2};font-size:13px;font-weight:600;margin-top:10px}
.ai-scanning{display:flex;align-items:center;gap:10px;padding:12px;background:#f0f9ff;
  border-radius:10px;font-size:13px;color:${C.azul};margin-top:10px}
.spin{display:inline-block;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* LAYOUT */
.layout{display:flex;min-height:100vh}
.sidebar{width:248px;background:${C.bosque};min-height:100vh;display:flex;flex-direction:column;flex-shrink:0}
.sb-logo{padding:22px 18px 18px;border-bottom:1px solid rgba(255,255,255,.1)}
.sb-logo h2{font-family:'Playfair Display',serif;font-size:19px;color:#fff;line-height:1.25}
.sb-logo span{font-size:10px;color:rgba(255,255,255,.4)}
.sb-nav{flex:1;padding:14px 10px;overflow-y:auto}
.sb-sec{font-size:9px;color:rgba(255,255,255,.3);font-weight:700;text-transform:uppercase;
  letter-spacing:1.2px;padding:12px 10px 5px}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:10px;
  cursor:pointer;color:rgba(255,255,255,.65);font-size:13px;font-weight:500;
  transition:.15s;margin-bottom:1px;position:relative}
.sb-item:hover{background:rgba(255,255,255,.1);color:#fff}
.sb-item.on{background:${C.oro};color:#fff;font-weight:700}
.sb-item .si{font-size:15px;width:20px;text-align:center}
.sb-badge{position:absolute;right:10px;top:50%;transform:translateY(-50%);
  background:#ef4444;color:#fff;border-radius:20px;font-size:10px;
  font-weight:700;padding:1px 7px;min-width:18px;text-align:center}
.sb-user{padding:14px;border-top:1px solid rgba(255,255,255,.1)}
.sb-chip{display:flex;align-items:center;gap:10px;padding:9px;
  background:rgba(255,255,255,.07);border-radius:10px}
.sb-av{width:38px;height:38px;border-radius:50%;background:${C.oro};display:flex;
  align-items:center;justify-content:center;font-size:17px;flex-shrink:0;overflow:hidden}
.sb-av img{width:100%;height:100%;object-fit:cover}
.sb-uname{font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-urole{font-size:10px;color:rgba(255,255,255,.45)}
.sb-verif{font-size:9px;color:#4ade80;font-weight:600;margin-top:1px}
.sb-logout{width:100%;margin-top:7px;padding:7px;background:rgba(255,255,255,.07);
  border:none;border-radius:8px;color:rgba(255,255,255,.5);font-size:11px;cursor:pointer;
  font-family:inherit;transition:.15s}
.sb-logout:hover{background:rgba(255,255,255,.14);color:#fff}

/* CONTENT */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{background:${C.blanco};border-bottom:1px solid ${C.gris};padding:14px 26px;
  display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.topbar-left h1{font-family:'Playfair Display',serif;font-size:21px;color:${C.bosque}}
.topbar-left p{font-size:12px;color:${C.grisM};margin-top:1px}
.topbar-right{display:flex;align-items:center;gap:10px}
.notif-btn{position:relative;background:none;border:none;cursor:pointer;font-size:20px;
  padding:6px;border-radius:8px;transition:.15s}
.notif-btn:hover{background:${C.gris}}
.notif-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;
  background:#ef4444;border-radius:50%;border:2px solid ${C.blanco}}
.page{flex:1;overflow-y:auto;padding:24px}

/* CARDS & GRIDS */
.card{background:${C.blanco};border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.card-title{font-family:'Playfair Display',serif;font-size:16px;color:${C.bosque};
  margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid ${C.gris}}
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:22px}
.stat{background:${C.blanco};border-radius:14px;padding:18px;border-left:4px solid ${C.oro};
  box-shadow:0 2px 10px rgba(0,0,0,.06)}
.stat .sl{font-size:11px;color:${C.grisM};font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.stat .sv{font-family:'Playfair Display',serif;font-size:28px;color:${C.bosque};margin:3px 0 2px}
.stat .ss{font-size:11px;color:${C.verde}}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px}

/* MARKETPLACE */
.filter-row{background:${C.blanco};border-radius:14px;padding:16px;margin-bottom:18px;
  display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.filter-row .field{margin:0;flex:1;min-width:140px}
.btn{padding:10px 20px;border:none;border-radius:10px;font-size:13px;font-weight:700;
  cursor:pointer;font-family:inherit;transition:.15s}
.btn-primary{background:linear-gradient(135deg,${C.bosque},${C.verde});color:#fff}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(26,61,43,.3)}
.btn-oro{background:${C.oro};color:#fff}
.btn-oro:hover{background:${C.oroL}}
.btn-sm{padding:6px 13px;font-size:12px}
.btn-ghost{background:${C.gris};color:${C.texto}}
.btn-ghost:hover{background:#d8d0c4}
.btn-danger{background:#fef2f2;color:${C.rojo}}
.btn-danger:hover{background:#fee2e2}
.listings-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px}
.lcard{background:${C.blanco};border-radius:16px;overflow:hidden;
  box-shadow:0 2px 12px rgba(0,0,0,.07);transition:.2s;cursor:pointer}
.lcard:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.13)}
.lcard-head{padding:18px;display:flex;align-items:center;gap:12px}
.lcard-head.venta{background:linear-gradient(135deg,${C.bosque},${C.verde})}
.lcard-head.compra{background:linear-gradient(135deg,${C.cafe},${C.tostado})}
.lcard-head .lhi{font-size:30px}
.lcard-head .lht{font-size:10px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.8px}
.lcard-head .lhv{font-size:15px;font-weight:700;color:#fff;margin-top:2px}
.lcard-body{padding:16px}
.lrow{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px}
.lrow .lk{color:${C.grisM}} .lrow .lv{font-weight:600;color:${C.bosque}}
.lprice{font-family:'Playfair Display',serif;font-size:20px;color:${C.cafe};margin:10px 0 6px}
.lprice span{font-size:11px;font-family:'Inter',sans-serif;color:${C.grisM};font-weight:400}
.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700}
.b-venta{background:${C.verdeL};color:${C.verde2}}
.b-compra{background:${C.azulL};color:${C.azul}}
.b-pend{background:${C.amarilloL};color:${C.amarillo}}
.b-verif{background:${C.verdeL};color:${C.verde2}}
.b-noVerif{background:#fef2f2;color:${C.rojo}}

/* MENSAJERÍA */
.msg-layout{display:grid;grid-template-columns:300px 1fr;gap:0;height:calc(100vh - 110px);
  background:${C.blanco};border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07)}
.convos{border-right:1px solid ${C.gris};overflow-y:auto}
.convos-head{padding:16px;border-bottom:1px solid ${C.gris};font-weight:700;color:${C.bosque};
  font-size:15px;display:flex;align-items:center;justify-content:space-between}
.convo-item{padding:14px 16px;border-bottom:1px solid ${C.gris};cursor:pointer;transition:.15s}
.convo-item:hover{background:${C.crema}}
.convo-item.on{background:#edf5f0}
.ci-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px}
.ci-name{font-weight:700;font-size:13px;color:${C.bosque}}
.ci-time{font-size:10px;color:${C.grisM}}
.ci-last{font-size:12px;color:${C.grisM};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ci-unread{background:#ef4444;color:#fff;border-radius:20px;font-size:10px;
  font-weight:700;padding:1px 6px;margin-left:6px}
.chat-area{display:flex;flex-direction:column;overflow:hidden}
.chat-head{padding:14px 18px;border-bottom:1px solid ${C.gris};display:flex;align-items:center;gap:12px}
.chat-head .ch-av{width:36px;height:36px;border-radius:50%;background:${C.gris};
  display:flex;align-items:center;justify-content:center;font-size:18px;overflow:hidden}
.chat-head .ch-av img{width:100%;height:100%;object-fit:cover}
.chat-head .ch-name{font-weight:700;color:${C.bosque};font-size:14px}
.chat-head .ch-role{font-size:11px;color:${C.grisM}}
.messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9f6f1}
.msg{max-width:70%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5}
.msg.mine{align-self:flex-end;background:${C.bosque};color:#fff;border-bottom-right-radius:4px}
.msg.theirs{align-self:flex-start;background:${C.blanco};color:${C.texto};
  border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.msg-time{font-size:10px;opacity:.6;margin-top:4px}
.msg-offer{background:${C.amarilloL};border:1.5px solid ${C.oroL};border-radius:12px;
  padding:12px 14px;max-width:80%;align-self:flex-start}
.msg-offer.mine{align-self:flex-end;background:#edf5f0;border-color:${C.verde}}
.msg-offer .mo-label{font-size:10px;font-weight:700;color:${C.amarillo};text-transform:uppercase;margin-bottom:4px}
.msg-offer.mine .mo-label{color:${C.verde2}}
.msg-offer .mo-price{font-family:'Playfair Display',serif;font-size:20px;color:${C.cafe}}
.msg-offer .mo-btns{display:flex;gap:8px;margin-top:8px}
.chat-input{padding:12px 16px;border-top:1px solid ${C.gris};display:flex;gap:8px;align-items:flex-end;background:${C.blanco}}
.chat-input textarea{flex:1;padding:9px 13px;border:1.5px solid ${C.gris};border-radius:10px;
  font-size:13px;font-family:inherit;resize:none;outline:none;min-height:40px;max-height:100px;transition:.2s}
.chat-input textarea:focus{border-color:${C.oro};box-shadow:0 0 0 3px rgba(201,150,58,.12)}
.offer-bar{padding:10px 16px;background:${C.crema};border-top:1px solid ${C.gris};
  display:flex;gap:8px;align-items:center}
.offer-bar input{width:140px;padding:7px 11px;border:1.5px solid ${C.gris};border-radius:8px;
  font-size:13px;font-family:inherit;outline:none}
.offer-bar input:focus{border-color:${C.oro}}

/* NOTIFICACIONES */
.notif-panel{position:fixed;top:60px;right:20px;width:340px;background:${C.blanco};
  border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.2);z-index:200;overflow:hidden}
.np-head{padding:14px 18px;border-bottom:1px solid ${C.gris};display:flex;justify-content:space-between;align-items:center}
.np-head h3{font-weight:700;color:${C.bosque};font-size:14px}
.np-list{max-height:400px;overflow-y:auto}
.notif-item{padding:13px 16px;border-bottom:1px solid ${C.gris};display:flex;gap:10px;
  cursor:pointer;transition:.15s}
.notif-item:hover{background:${C.crema}}
.notif-item.unread{background:#fffbf2}
.ni-icon{font-size:20px;flex-shrink:0;margin-top:1px}
.ni-body{flex:1}
.ni-title{font-size:13px;font-weight:600;color:${C.bosque}}
.ni-sub{font-size:11px;color:${C.grisM};margin-top:2px}
.ni-time{font-size:10px;color:${C.grisM};margin-top:3px}

/* HISTORIAL */
.tx-list{display:flex;flex-direction:column;gap:12px}
.tx-item{background:${C.blanco};border-radius:14px;padding:16px 18px;
  display:flex;align-items:center;gap:14px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.tx-icon{width:44px;height:44px;border-radius:12px;background:${C.gris};
  display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.tx-info{flex:1}
.tx-title{font-weight:700;color:${C.bosque};font-size:14px}
.tx-sub{font-size:11px;color:${C.grisM};margin-top:2px}
.tx-price{text-align:right}
.tx-val{font-family:'Playfair Display',serif;font-size:18px;color:${C.cafe}}
.tx-date{font-size:10px;color:${C.grisM}}

/* PUBLICAR */
.pub-form{background:${C.blanco};border-radius:18px;padding:26px;max-width:650px;
  box-shadow:0 2px 14px rgba(0,0,0,.07)}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fgrid .full{grid-column:1/-1}

/* PERFIL */
.profile-card{background:${C.blanco};border-radius:18px;padding:28px;max-width:580px;
  box-shadow:0 2px 14px rgba(0,0,0,.07)}
.profile-av{width:80px;height:80px;border-radius:50%;background:${C.gris};
  display:flex;align-items:center;justify-content:center;font-size:36px;
  margin:0 auto 16px;overflow:hidden;border:3px solid ${C.oro}}
.profile-av img{width:100%;height:100%;object-fit:cover}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:${C.bosque};color:#fff;
  padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:999;
  box-shadow:0 8px 24px rgba(0,0,0,.22);animation:toastIn .3s ease;max-width:320px}
@keyframes toastIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:100;
  display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:${C.blanco};border-radius:20px;padding:28px;width:100%;max-width:500px;
  max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.modal-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
.modal-hd h2{font-family:'Playfair Display',serif;font-size:20px;color:${C.bosque}}
.close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:${C.grisM};padding:0 3px}
.irow{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid ${C.gris};font-size:13px}
.irow:last-child{border:none}
.irow .ik{color:${C.grisM}} .irow .iv{font-weight:600;color:${C.bosque}}
.contact-box{background:${C.crema};border-radius:12px;padding:14px;margin-top:14px}
.contact-box p{font-size:12px;font-weight:700;color:${C.cafe};margin-bottom:3px}

/* EMPTY */
.empty{text-align:center;padding:52px 20px;color:${C.grisM}}
.empty .ei{font-size:44px;margin-bottom:10px}
.empty p{font-size:14px} .empty small{font-size:12px;margin-top:4px;display:block}

/* RESPONSIVE */
@media(max-width:750px){
  .sidebar{display:none}.two-col{grid-template-columns:1fr}
  .msg-layout{grid-template-columns:1fr}.convos{display:none}
  .fgrid{grid-template-columns:1fr}.fgrid .full{grid-column:1}
}
`;

// ─── DATOS INICIALES ──────────────────────────────────────────────────────
const ROLES_LIST = [
  {id:"productor",icon:"🌿",name:"Productor",desc:"Finca o cooperativa"},
  {id:"intermediario",icon:"🔄",name:"Intermediario",desc:"Compra y revende"},
  {id:"exportador",icon:"🚢",name:"Exportador",desc:"Empresa exportadora"},
  {id:"tostador",icon:"🔥",name:"Tostador",desc:"Tuesta y procesa"},
];
const RI = {productor:"🌿",intermediario:"🔄",exportador:"🚢",tostador:"🔥"};
const VARIEDADES = ["Catuaí","Caturra","Bourbon","Pacas","Lempira","IHCAFE-90","Geisha","Parainema","Cualquiera"];
const PROCESOS = ["Lavado","Natural","Honey","Semi-lavado"];
const DEPTOS = ["Santa Bárbara","Ocotepeque","La Paz","Intibucá","Copán","Lempira","El Paraíso","Olancho","Comayagua","Francisco Morazán"];

const SEED_USERS = [
  {id:1,nombre:"Carlos Mejía",email:"productor@demo.com",password:"1234",rol:"productor",verificado:true,
   selfie:null,dpi:null,telefono:"+(504) 9988-1234"},
  {id:2,nombre:"Exportadora HonduCafé",email:"export@demo.com",password:"1234",rol:"exportador",verificado:true,
   selfie:null,dpi:null,telefono:"+(504) 9877-4567"},
];

const SEED_LISTINGS = [
  {id:1,tipo:"venta",usuarioId:1,vendedor:"Carlos Mejía",rol:"productor",variedad:"Catuaí",proceso:"Lavado",
   departamento:"Santa Bárbara",cantidad:200,unidad:"qq",precio:2800,puntuacion:85,
   descripcion:"Café pergamino seco, excelente calidad, cosecha reciente.",telefono:"+(504) 9988-1234"},
  {id:2,tipo:"compra",usuarioId:2,vendedor:"Exportadora HonduCafé",rol:"exportador",variedad:"Cualquiera",proceso:"Lavado",
   departamento:"Copán",cantidad:500,unidad:"qq",precio:2600,puntuacion:82,
   descripcion:"Buscamos productores para compra directa, mínimo 500 qq.",telefono:"+(504) 9877-4567"},
  {id:3,tipo:"venta",usuarioId:1,vendedor:"Carlos Mejía",rol:"productor",variedad:"Lempira",proceso:"Natural",
   departamento:"Ocotepeque",cantidad:80,unidad:"qq",precio:3100,puntuacion:88,
   descripcion:"Proceso natural especial, lotes pequeños.",telefono:"+(504) 9988-1234"},
];

const SEED_CONVOS = [
  {id:1,participantes:[1,2],listingId:2,
   mensajes:[
     {id:1,de:2,texto:"Hola Carlos, vi tu oferta de Catuaí. ¿Está disponible?",ts:"2025-06-08T10:00:00Z"},
     {id:2,de:1,texto:"Sí, tenemos 200 qq disponibles. ¿Cuándo necesitas?",ts:"2025-06-08T10:05:00Z"},
     {id:3,de:2,tipo:"oferta",precio:2650,ts:"2025-06-08T10:10:00Z",estado:"pendiente"},
   ]},
];

const SEED_NOTIFS = [
  {id:1,usuarioId:1,tipo:"mensaje",titulo:"Nuevo mensaje de HonduCafé",sub:"¿Está disponible el lote?",ts:"2025-06-08T10:00:00Z",leida:false},
  {id:2,usuarioId:1,tipo:"oferta",titulo:"Nueva contraoferta recibida",sub:"L. 2,650 por quintal por HonduCafé",ts:"2025-06-08T10:10:00Z",leida:false},
];

const SEED_HIST = [
  {id:1,usuarioId:1,tipo:"venta",contraparte:"Tostadora Nacional",variedad:"Bourbon",
   cantidad:50,unidad:"qq",precio:5100,fecha:"2025-05-20",estado:"completada"},
  {id:2,usuarioId:2,tipo:"compra",contraparte:"Finca Las Flores",variedad:"Catuaí",
   cantidad:120,unidad:"qq",precio:2750,fecha:"2025-06-01",estado:"completada"},
];

// ─── UTILS ────────────────────────────────────────────────────────────────
const fmtTime = (ts) => {
  const d = new Date(ts), now = new Date();
  const diff = (now - d) / 60000;
  if (diff < 1) return "ahora";
  if (diff < 60) return `${Math.floor(diff)}m`;
  if (diff < 1440) return `${Math.floor(diff/60)}h`;
  return d.toLocaleDateString("es-HN",{day:"2-digit",month:"short"});
};

const uid = () => Date.now() + Math.random();

// ─── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [usuarios, setUsuarios] = useState(SEED_USERS);
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState("dashboard");
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [convos, setConvos] = useState(SEED_CONVOS);
  const [notifs, setNotifs] = useState(SEED_NOTIFS);
  const [historial, setHistorial] = useState(SEED_HIST);
  const [toast, setToast] = useState("");
  const [modalListing, setModalListing] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg); setTimeout(()=>setToast(""), 3500);
  }, []);

  const addNotif = useCallback((uid2, tipo, titulo, sub) => {
    setNotifs(n => [{id:Date.now(),usuarioId:uid2,tipo,titulo,sub,ts:new Date().toISOString(),leida:false},...n]);
  }, []);

  const unreadNotifs = notifs.filter(n=>n.usuarioId===usuario?.id && !n.leida).length;
  const unreadMsgs = convos.filter(c=>c.participantes.includes(usuario?.id) &&
    c.mensajes.some(m=>m.de!==usuario?.id && !m.leido)).length;

  const markNotifsRead = () => setNotifs(n=>n.map(x=>x.usuarioId===usuario?.id?{...x,leida:true}:x));

  if (!usuario) return (
    <div><style>{CSS}</style>
      <AuthScreen usuarios={usuarios} setUsuarios={setUsuarios}
        onLogin={u=>{setUsuario(u);setVista("dashboard");}} />
    </div>
  );

  const abrirChat = (convoId) => { setVista("mensajes"); };

  return (
    <div>
      <style>{CSS}</style>
      <div className="layout">
        <Sidebar usuario={usuario} vista={vista} setVista={setVista}
          unreadNotifs={unreadNotifs} unreadMsgs={unreadMsgs}
          onLogout={()=>{setUsuario(null);setVista("dashboard");}} />
        <div className="main">
          <TopBar vista={vista} usuario={usuario}
            unreadNotifs={unreadNotifs} showNotifs={showNotifs}
            setShowNotifs={(v)=>{setShowNotifs(v);if(v)markNotifsRead();}} />
          <div className="page">
            {vista==="dashboard" && <Dashboard usuario={usuario} listings={listings}
              convos={convos} historial={historial} notifs={notifs} setVista={setVista} />}
            {vista==="marketplace" && <Marketplace listings={listings} usuario={usuario}
              usuarios={usuarios} onDetalle={setModalListing}
              onContactar={(listing)=>{
                const existe = convos.find(c=>c.participantes.includes(usuario.id)&&c.participantes.includes(listing.usuarioId));
                if(!existe){
                  const nueva = {id:uid(),participantes:[usuario.id,listing.usuarioId],listingId:listing.id,mensajes:[]};
                  setConvos(cs=>[...cs,nueva]);
                }
                setVista("mensajes");
                showToast("Chat iniciado con "+listing.vendedor);
              }} />}
            {vista==="publicar" && <PublicarForm usuario={usuario} setListings={setListings}
              showToast={showToast} />}
            {vista==="mis" && <MisPublicaciones usuario={usuario} listings={listings}
              setListings={setListings} onDetalle={setModalListing} showToast={showToast} />}
            {vista==="mensajes" && <Mensajeria usuario={usuario} convos={convos}
              setConvos={setConvos} usuarios={usuarios} listings={listings}
              addNotif={addNotif} showToast={showToast} historial={historial} setHistorial={setHistorial} />}
            {vista==="historial" && <Historial usuario={usuario} historial={historial} />}
            {vista==="perfil" && <Perfil usuario={usuario} setUsuario={setUsuario}
              setUsuarios={setUsuarios} showToast={showToast} />}
          </div>
        </div>
      </div>
      {showNotifs && (
        <NotifPanel notifs={notifs.filter(n=>n.usuarioId===usuario.id)}
          onClose={()=>setShowNotifs(false)} setVista={setVista} />
      )}
      {modalListing && <ModalListing listing={modalListing} onClose={()=>setModalListing(null)}
        usuario={usuario} usuarios={usuarios}
        onContactar={()=>{
          const l = modalListing;
          const existe = convos.find(c=>c.participantes.includes(usuario.id)&&c.participantes.includes(l.usuarioId));
          if(!existe) setConvos(cs=>[...cs,{id:uid(),participantes:[usuario.id,l.usuarioId],listingId:l.id,mensajes:[]}]);
          setModalListing(null); setVista("mensajes"); showToast("Chat iniciado con "+l.vendedor);
        }} />}
      {toast && <div className="toast">✅ {toast}</div>}
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────
function AuthScreen({usuarios, setUsuarios, onLogin}) {
  const [tab, setTab] = useState("login");
  const [step, setStep] = useState(1); // 1=datos, 2=dpi, 3=selfie
  const [form, setForm] = useState({nombre:"",email:"",password:"",rol:"",telefono:""});
  const [dpiImg, setDpiImg] = useState(null);
  const [selfieImg, setSelfieImg] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selfieScanning, setSelfieScanning] = useState(false);
  const [selfieOk, setSelfieOk] = useState(false);
  const [err, setErr] = useState("");
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const login = () => {
    const u = usuarios.find(u=>u.email===form.email&&u.password===form.password);
    if(!u) return setErr("Correo o contraseña incorrectos.");
    setErr(""); onLogin(u);
  };

  const handleDpi = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setDpiImg(ev.target.result);
      setScanning(true); setScanned(false);
      setTimeout(()=>{setScanning(false);setScanned(true);},2400);
    };
    reader.readAsDataURL(file);
  };

  const handleSelfie = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setSelfieImg(ev.target.result);
      setSelfieScanning(true); setSelfieOk(false);
      setTimeout(()=>{setSelfieScanning(false);setSelfieOk(true);},2800);
    };
    reader.readAsDataURL(file);
  };

  const finalizarRegistro = () => {
    if(!selfieOk) return setErr("Completa la verificación facial.");
    const nuevo = {id:uid(),...form,verificado:true,selfie:selfieImg,dpi:dpiImg};
    setUsuarios(us=>[...us,nuevo]); onLogin(nuevo);
  };

  return (
    <div className="auth-bg">
      <div className="auth-deco a">🫘</div>
      <div className="auth-deco b">☕</div>
      <div className="auth-box">
        <div className="auth-top">
          <div style={{fontSize:36,marginBottom:8}}>🫘</div>
          <h1>CaféHonduras Market</h1>
          <p>Plataforma oficial de comercio de café</p>
        </div>
        <div className="auth-body">
          <div className="tabs">
            <button className={`tab${tab==="login"?" on":""}`} onClick={()=>{setTab("login");setErr("");setStep(1);}}>Iniciar sesión</button>
            <button className={`tab${tab==="reg"?" on":""}`} onClick={()=>{setTab("reg");setErr("");setStep(1);}}>Crear cuenta</button>
          </div>
          {err && <div className="err">⚠️ {err}</div>}

          {tab==="login" ? (
            <>
              <div className="field"><label>Correo</label>
                <input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e=>upd("email",e.target.value)} /></div>
              <div className="field"><label>Contraseña</label>
                <input type="password" placeholder="••••••" value={form.password} onChange={e=>upd("password",e.target.value)} /></div>
              <button className="btn btn-primary" style={{width:"100%",marginTop:4}} onClick={login}>Entrar al mercado</button>
              <p style={{textAlign:"center",fontSize:11,color:C.grisM,marginTop:10}}>Demo: productor@demo.com / 1234</p>
            </>
          ) : (
            <>
              {/* Indicador de pasos */}
              <div style={{display:"flex",gap:8,marginBottom:18,alignItems:"center"}}>
                {["Datos","DPI","Selfie"].map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,flex:i<2?1:"auto"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:step>i+1?C.verde:step===i+1?C.oro:C.gris,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,
                      color:step>=i+1?"#fff":C.grisM,flexShrink:0}}>
                      {step>i+1?"✓":i+1}
                    </div>
                    <span style={{fontSize:11,color:step===i+1?C.bosque:C.grisM,fontWeight:step===i+1?700:400}}>{s}</span>
                    {i<2&&<div style={{flex:1,height:2,background:step>i+1?C.verde:C.gris,borderRadius:1,marginLeft:4}}/>}
                  </div>
                ))}
              </div>

              {step===1 && <>
                <div className="field"><label>Nombre completo o empresa</label>
                  <input placeholder="Ej. Finca El Cedro" value={form.nombre} onChange={e=>upd("nombre",e.target.value)} /></div>
                <div className="field"><label>Correo electrónico</label>
                  <input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e=>upd("email",e.target.value)} /></div>
                <div className="field"><label>Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e=>upd("password",e.target.value)} /></div>
                <div className="field"><label>Teléfono</label>
                  <input placeholder="+(504) 9xxx-xxxx" value={form.telefono} onChange={e=>upd("telefono",e.target.value)} /></div>
                <div className="field"><label>Tipo de actor</label></div>
                <div className="roles-grid">
                  {ROLES_LIST.map(r=>(
                    <div key={r.id} className={`role-opt${form.rol===r.id?" sel":""}`} onClick={()=>upd("rol",r.id)}>
                      <div className="ri">{r.icon}</div><div className="rn">{r.name}</div><div className="rd">{r.desc}</div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{width:"100%"}} onClick={()=>{
                  if(!form.nombre||!form.email||!form.password||!form.rol||!form.telefono) return setErr("Completa todos los campos.");
                  if(usuarios.find(u=>u.email===form.email)) return setErr("Este correo ya está registrado.");
                  setErr(""); setStep(2);
                }}>Siguiente →</button>
              </>}

              {step===2 && <>
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:13,color:C.bosque,fontWeight:700,marginBottom:4}}>📋 Foto de tu DPI (cédula)</p>
                  <p style={{fontSize:12,color:C.grisM}}>Sube una foto clara de tu Documento Personal de Identificación. Esto nos ayuda a verificar tu identidad.</p>
                </div>
                <div className="upload-zone">
                  <input type="file" accept="image/*" onChange={handleDpi} />
                  <div className="uz-icon">{dpiImg?"📄":"🪪"}</div>
                  <div className="uz-title">{dpiImg?"DPI cargado":"Subir foto del DPI"}</div>
                  <div className="uz-sub">Haz clic o arrastra tu imagen aquí</div>
                  {dpiImg && <img src={dpiImg} className="preview-img" alt="DPI" />}
                </div>
                {scanning && <div className="ai-scanning"><span className="spin">⚙️</span> Leyendo datos del DPI con IA…</div>}
                {scanned && <div className="verif-check">✅ DPI verificado correctamente — datos extraídos</div>}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setStep(1)}>← Atrás</button>
                  <button className="btn btn-primary" style={{flex:2}} onClick={()=>{
                    if(!scanned) return setErr("Sube tu DPI para continuar.");
                    setErr(""); setStep(3);
                  }}>Siguiente →</button>
                </div>
              </>}

              {step===3 && <>
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:13,color:C.bosque,fontWeight:700,marginBottom:4}}>🤳 Selfie para reconocimiento facial</p>
                  <p style={{fontSize:12,color:C.grisM}}>Tómate una selfie clara mirando de frente. Nuestra IA la comparará con tu DPI para confirmar tu identidad.</p>
                </div>
                <div className="upload-zone">
                  <input type="file" accept="image/*" onChange={handleSelfie} />
                  <div className="uz-icon">{selfieImg?"🤳":"📸"}</div>
                  <div className="uz-title">{selfieImg?"Selfie cargada":"Subir selfie"}</div>
                  <div className="uz-sub">Haz clic o arrastra tu foto aquí</div>
                  {selfieImg && <img src={selfieImg} className="preview-img" alt="selfie" />}
                </div>
                {selfieScanning && <div className="ai-scanning"><span className="spin">🧠</span> Comparando rostro con DPI mediante IA…</div>}
                {selfieOk && <div className="verif-check">✅ ¡Identidad verificada! Coincidencia facial confirmada</div>}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setStep(2)}>← Atrás</button>
                  <button className="btn btn-primary" style={{flex:2}} onClick={finalizarRegistro}
                    disabled={!selfieOk} style={{flex:2,opacity:selfieOk?1:.5,
                    background:`linear-gradient(135deg,${C.bosque},${C.verde})`,color:"#fff",
                    border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:selfieOk?"pointer":"not-allowed",fontFamily:"inherit"}}>
                    ✅ Crear cuenta verificada
                  </button>
                </div>
              </>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
function Sidebar({usuario, vista, setVista, unreadNotifs, unreadMsgs, onLogout}) {
  const NAV = [
    {id:"dashboard",icon:"📊",label:"Panel Principal"},
    {id:"marketplace",icon:"🏪",label:"Mercado de Café"},
    {id:"publicar",icon:"➕",label:"Publicar Oferta"},
    {id:"mis",icon:"📋",label:"Mis Publicaciones"},
    {id:"mensajes",icon:"💬",label:"Mensajes",badge:unreadMsgs},
    {id:"historial",icon:"📜",label:"Historial"},
    {id:"perfil",icon:"👤",label:"Mi Perfil"},
  ];
  return (
    <div className="sidebar">
      <div className="sb-logo">
        <h2>🫘 CaféHonduras<br/>Market</h2>
        <span>Plataforma de comercio</span>
      </div>
      <nav className="sb-nav">
        <div className="sb-sec">Navegación</div>
        {NAV.map(n=>(
          <div key={n.id} className={`sb-item${vista===n.id?" on":""}`} onClick={()=>setVista(n.id)}>
            <span className="si">{n.icon}</span>{n.label}
            {n.badge>0 && <span className="sb-badge">{n.badge}</span>}
          </div>
        ))}
      </nav>
      <div className="sb-user">
        <div className="sb-chip">
          <div className="sb-av">
            {usuario.selfie?<img src={usuario.selfie} alt="av"/>:RI[usuario.rol]}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div className="sb-uname">{usuario.nombre}</div>
            <div className="sb-urole">{ROLES_LIST.find(r=>r.id===usuario.rol)?.name}</div>
            {usuario.verificado && <div className="sb-verif">✅ Verificado</div>}
          </div>
        </div>
        <button className="sb-logout" onClick={onLogout}>⬅ Cerrar sesión</button>
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────
const VISTA_LABELS = {
  dashboard:"Panel Principal",marketplace:"Mercado de Café",publicar:"Publicar Oferta",
  mis:"Mis Publicaciones",mensajes:"Mensajes",historial:"Historial de Transacciones",perfil:"Mi Perfil"
};
function TopBar({vista, usuario, unreadNotifs, showNotifs, setShowNotifs}) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{VISTA_LABELS[vista]||vista}</h1>
        <p>CaféHonduras Market — {ROLES_LIST.find(r=>r.id===usuario.rol)?.name}</p>
      </div>
      <div className="topbar-right">
        <button className="notif-btn" onClick={()=>setShowNotifs(!showNotifs)}>
          🔔{unreadNotifs>0&&<span className="notif-dot"/>}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({usuario, listings, convos, historial, notifs, setVista}) {
  const mis = listings.filter(l=>l.usuarioId===usuario.id);
  const misH = historial.filter(h=>h.usuarioId===usuario.id);
  const unread = notifs.filter(n=>n.usuarioId===usuario.id&&!n.leida).length;
  const totalVol = misH.reduce((a,h)=>a+h.precio*h.cantidad,0);

  return (
    <>
      <div className="stats-row">
        <div className="stat"><div className="sl">Mis publicaciones</div>
          <div className="sv">{mis.length}</div><div className="ss">📦 activas</div></div>
        <div className="stat" style={{borderLeftColor:C.cafe}}>
          <div className="sl">En el mercado</div><div className="sv">{listings.length}</div>
          <div className="ss">🏪 total ofertas</div></div>
        <div className="stat" style={{borderLeftColor:C.verde}}>
          <div className="sl">Transacciones</div><div className="sv">{misH.length}</div>
          <div className="ss">✅ completadas</div></div>
        <div className="stat" style={{borderLeftColor:"#6366f1"}}>
          <div className="sl">Notificaciones</div><div className="sv">{unread}</div>
          <div className="ss">🔔 sin leer</div></div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Últimas publicaciones del mercado</div>
          {listings.slice(-5).reverse().map(l=>(
            <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"9px 0",borderBottom:`1px solid ${C.gris}`,fontSize:12}}>
              <div><span style={{marginRight:5}}>{RI[l.rol]}</span>
                <strong>{l.variedad}</strong><span style={{color:C.grisM,marginLeft:5}}>· {l.vendedor}</span></div>
              <div style={{textAlign:"right"}}>
                <span className={`badge b-${l.tipo}`}>{l.tipo}</span>
                <div style={{fontWeight:700,color:C.cafe}}>L.{l.precio.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Actividad reciente</div>
          {notifs.filter(n=>n.usuarioId===usuario.id).slice(0,5).map(n=>(
            <div key={n.id} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.gris}`}}>
              <span style={{fontSize:18}}>{n.tipo==="mensaje"?"💬":n.tipo==="oferta"?"💰":"📢"}</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.bosque}}>{n.titulo}</div>
                <div style={{fontSize:11,color:C.grisM}}>{n.sub}</div>
                <div style={{fontSize:10,color:C.grisM,marginTop:2}}>{fmtTime(n.ts)}</div>
              </div>
            </div>
          ))}
          {notifs.filter(n=>n.usuarioId===usuario.id).length===0&&(
            <div className="empty"><div className="ei">🔔</div><p>Sin actividad reciente</p></div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MARKETPLACE ─────────────────────────────────────────────────────────
function Marketplace({listings, usuario, usuarios, onDetalle, onContactar}) {
  const [f, setF] = useState({tipo:"",variedad:"",departamento:"",buscar:""});
  const upd = (k,v)=>setF(x=>({...x,[k]:v}));
  const res = listings.filter(l=>{
    if(f.tipo&&l.tipo!==f.tipo) return false;
    if(f.variedad&&l.variedad!==f.variedad) return false;
    if(f.departamento&&l.departamento!==f.departamento) return false;
    if(f.buscar&&!l.vendedor.toLowerCase().includes(f.buscar.toLowerCase())&&
       !l.variedad.toLowerCase().includes(f.buscar.toLowerCase())) return false;
    return true;
  });
  const getU = (uid2) => usuarios.find(u=>u.id===uid2);
  return (
    <>
      <div className="filter-row">
        <div className="field" style={{minWidth:130}}><label>Tipo</label>
          <select value={f.tipo} onChange={e=>upd("tipo",e.target.value)}>
            <option value="">Todos</option><option value="venta">Venta</option><option value="compra">Compra</option>
          </select></div>
        <div className="field" style={{minWidth:140}}><label>Variedad</label>
          <select value={f.variedad} onChange={e=>upd("variedad",e.target.value)}>
            <option value="">Todas</option>{VARIEDADES.map(v=><option key={v}>{v}</option>)}
          </select></div>
        <div className="field" style={{minWidth:160}}><label>Departamento</label>
          <select value={f.departamento} onChange={e=>upd("departamento",e.target.value)}>
            <option value="">Todos</option>{DEPTOS.map(d=><option key={d}>{d}</option>)}
          </select></div>
        <div className="field" style={{flex:2}}><label>Buscar</label>
          <input placeholder="Nombre, variedad…" value={f.buscar} onChange={e=>upd("buscar",e.target.value)} /></div>
      </div>
      {res.length===0&&<div className="empty"><div className="ei">🔍</div>
        <p>Sin resultados con esos filtros</p></div>}
      <div className="listings-grid">
        {res.map(l=>{
          const pub = getU(l.usuarioId);
          return (
            <div className="lcard" key={l.id}>
              <div className={`lcard-head ${l.tipo}`} onClick={()=>onDetalle(l)}>
                <span className="lhi">{RI[l.rol]}</span>
                <div>
                  <div className="lht">{ROLES_LIST.find(r=>r.id===l.rol)?.name} · <span className={`badge b-${l.tipo}`}>{l.tipo}</span></div>
                  <div className="lhv">{l.variedad}</div>
                </div>
              </div>
              <div className="lcard-body">
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:C.gris,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,overflow:"hidden",flexShrink:0}}>
                    {pub?.selfie?<img src={pub.selfie} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:RI[l.rol]}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.bosque}}>{l.vendedor}</div>
                    <span className={`badge ${pub?.verificado?"b-verif":"b-noVerif"}`}>
                      {pub?.verificado?"✅ Verificado":"⚠️ Sin verificar"}</span>
                  </div>
                </div>
                <div className="lrow"><span className="lk">Proceso</span><span className="lv">{l.proceso}</span></div>
                <div className="lrow"><span className="lk">Departamento</span><span className="lv">{l.departamento}</span></div>
                <div className="lrow"><span className="lk">Cantidad</span><span className="lv">{l.cantidad} {l.unidad}</span></div>
                {l.puntuacion&&<div className="lrow"><span className="lk">Q-grade</span><span className="lv">⭐ {l.puntuacion} pts</span></div>}
                <div className="lprice">L.{l.precio.toLocaleString()} <span>/ {l.unidad}</span></div>
                {l.usuarioId!==usuario.id&&(
                  <button className={`btn btn-sm btn-${l.tipo==="venta"?"primary":"oro"}`}
                    style={{width:"100%"}} onClick={()=>onContactar(l)}>
                    💬 {l.tipo==="venta"?"Contactar vendedor":"Contactar comprador"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── MENSAJERÍA ───────────────────────────────────────────────────────────
function Mensajeria({usuario, convos, setConvos, usuarios, listings, addNotif, showToast, historial, setHistorial}) {
  const [selConvo, setSelConvo] = useState(null);
  const [texto, setTexto] = useState("");
  const [ofertaVal, setOfertaVal] = useState("");
  const [showOferta, setShowOferta] = useState(false);
  const endRef = useRef(null);

  const misConvos = convos.filter(c=>c.participantes.includes(usuario.id));
  const convo = misConvos.find(c=>c.id===selConvo) || misConvos[0];

  useEffect(()=>{if(misConvos.length>0&&!selConvo)setSelConvo(misConvos[0].id);},[misConvos.length]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[convo?.mensajes?.length]);

  const otro = (c) => c ? usuarios.find(u=>c.participantes.find(p=>p!==usuario.id)===u.id) : null;

  const enviar = () => {
    if(!texto.trim()||!convo) return;
    const msg = {id:uid(),de:usuario.id,texto:texto.trim(),ts:new Date().toISOString()};
    setConvos(cs=>cs.map(c=>c.id===convo.id?{...c,mensajes:[...c.mensajes,msg]}:c));
    const dest = otro(convo);
    if(dest) addNotif(dest.id,"mensaje","Nuevo mensaje de "+usuario.nombre,texto.trim().slice(0,50));
    setTexto("");
  };

  const enviarOferta = () => {
    const val = parseInt(ofertaVal);
    if(!val||val<1) return;
    const msg = {id:uid(),de:usuario.id,tipo:"oferta",precio:val,ts:new Date().toISOString(),estado:"pendiente"};
    setConvos(cs=>cs.map(c=>c.id===convo.id?{...c,mensajes:[...c.mensajes,msg]}:c));
    const dest = otro(convo);
    if(dest) addNotif(dest.id,"oferta","Nueva oferta de "+usuario.nombre,"L. "+val.toLocaleString()+" por quintal");
    setOfertaVal(""); setShowOferta(false);
    showToast("Oferta enviada: L."+val.toLocaleString());
  };

  const responderOferta = (msgId, accion) => {
    setConvos(cs=>cs.map(c=>{
      if(c.id!==convo.id) return c;
      const msgs = c.mensajes.map(m=>m.id===msgId?{...m,estado:accion}:m);
      return {...c,mensajes:msgs};
    }));
    if(accion==="aceptada"){
      const ofertaMsg = convo.mensajes.find(m=>m.id===msgId);
      const listing = listings.find(l=>l.id===convo.listingId);
      if(ofertaMsg&&listing){
        const tx = {id:uid(),usuarioId:usuario.id,tipo:"compra",contraparte:listing.vendedor,
          variedad:listing.variedad,cantidad:listing.cantidad,unidad:listing.unidad,
          precio:ofertaMsg.precio,fecha:new Date().toISOString().split("T")[0],estado:"completada"};
        setHistorial(h=>[...h,tx]);
      }
      const dest = otro(convo);
      if(dest) addNotif(dest.id,"oferta","✅ Oferta aceptada","Tu oferta fue aceptada");
      showToast("✅ Oferta aceptada — transacción registrada");
    } else {
      showToast("Oferta rechazada");
    }
  };

  const listing = convo ? listings.find(l=>l.id===convo?.listingId) : null;

  return (
    <div className="msg-layout">
      {/* Lista de conversaciones */}
      <div className="convos">
        <div className="convos-head">
          💬 Conversaciones
          <span style={{fontSize:12,color:C.grisM,fontWeight:400}}>{misConvos.length}</span>
        </div>
        {misConvos.length===0&&<div className="empty"><div className="ei">💬</div>
          <p>Sin conversaciones</p><small>Contacta a un vendedor desde el mercado</small></div>}
        {misConvos.map(c=>{
          const o = otro(c);
          const last = c.mensajes[c.mensajes.length-1];
          const unread = c.mensajes.filter(m=>m.de!==usuario.id&&!m.leido).length;
          return (
            <div key={c.id} className={`convo-item${selConvo===c.id?" on":""}`} onClick={()=>setSelConvo(c.id)}>
              <div className="ci-top">
                <span className="ci-name">{o?.nombre||"Usuario"}</span>
                <span className="ci-time">{last?fmtTime(last.ts):""}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span className="ci-last">
                  {last?(last.tipo==="oferta"?`💰 Oferta: L.${last.precio?.toLocaleString()}`:last.texto):"Sin mensajes"}
                </span>
                {unread>0&&<span className="ci-unread">{unread}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Área de chat */}
      {convo ? (
        <div className="chat-area">
          <div className="chat-head">
            <div className="ch-av">
              {otro(convo)?.selfie?<img src={otro(convo).selfie} alt="av"/>:RI[otro(convo)?.rol]}
            </div>
            <div>
              <div className="ch-name">{otro(convo)?.nombre}</div>
              <div className="ch-role">{ROLES_LIST.find(r=>r.id===otro(convo)?.rol)?.name}
                {otro(convo)?.verificado&&" · ✅ Verificado"}
              </div>
            </div>
            {listing&&(
              <div style={{marginLeft:"auto",background:C.crema,borderRadius:8,padding:"5px 10px",fontSize:11}}>
                📦 {listing.variedad} · L.{listing.precio.toLocaleString()}/{listing.unidad}
              </div>
            )}
          </div>

          <div className="messages">
            {convo.mensajes.length===0&&<div style={{textAlign:"center",color:C.grisM,fontSize:13,margin:"auto"}}>
              Envía un mensaje para iniciar la negociación</div>}
            {convo.mensajes.map(m=>{
              const mine = m.de===usuario.id;
              if(m.tipo==="oferta") return (
                <div key={m.id} className={`msg-offer${mine?" mine":""}`}>
                  <div className="mo-label">{mine?"Tu oferta enviada":"Contraoferta recibida"}</div>
                  <div className="mo-price">L. {m.precio?.toLocaleString()} <span style={{fontSize:12,fontFamily:"Inter",color:C.grisM}}>/qq</span></div>
                  <div style={{fontSize:11,color:C.grisM,marginTop:2}}>{fmtTime(m.ts)}</div>
                  {!mine && m.estado==="pendiente"&&(
                    <div className="mo-btns">
                      <button className="btn btn-sm btn-primary" onClick={()=>responderOferta(m.id,"aceptada")}>✅ Aceptar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>responderOferta(m.id,"rechazada")}>❌ Rechazar</button>
                    </div>
                  )}
                  {m.estado&&m.estado!=="pendiente"&&(
                    <div style={{marginTop:6,fontSize:11,fontWeight:700,color:m.estado==="aceptada"?C.verde2:C.rojo}}>
                      {m.estado==="aceptada"?"✅ Aceptada":"❌ Rechazada"}
                    </div>
                  )}
                </div>
              );
              return (
                <div key={m.id} className={`msg ${mine?"mine":"theirs"}`}>
                  {m.texto}
                  <div className="msg-time">{fmtTime(m.ts)}</div>
                </div>
              );
            })}
            <div ref={endRef}/>
          </div>

          {showOferta&&(
            <div className="offer-bar">
              <span style={{fontSize:12,fontWeight:700,color:C.bosque}}>💰 Oferta L.</span>
              <input type="number" placeholder="ej. 2750" value={ofertaVal}
                onChange={e=>setOfertaVal(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&enviarOferta()} />
              <button className="btn btn-sm btn-oro" onClick={enviarOferta}>Enviar oferta</button>
              <button className="btn btn-sm btn-ghost" onClick={()=>setShowOferta(false)}>Cancelar</button>
            </div>
          )}

          <div className="chat-input">
            <button className="btn btn-sm btn-oro" onClick={()=>setShowOferta(v=>!v)} title="Negociar precio">💰</button>
            <textarea rows={1} placeholder="Escribe un mensaje…" value={texto}
              onChange={e=>setTexto(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();enviar();}}} />
            <button className="btn btn-sm btn-primary" onClick={enviar}>Enviar →</button>
          </div>
        </div>
      ) : (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1}}>
          <div className="empty"><div className="ei">💬</div>
            <p>Selecciona una conversación</p>
            <small>O contacta a alguien desde el mercado</small></div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICACIONES ───────────────────────────────────────────────────────
function NotifPanel({notifs, onClose, setVista}) {
  const ICONS = {mensaje:"💬",oferta:"💰",sistema:"📢"};
  return (
    <div className="notif-panel">
      <div className="np-head">
        <h3>🔔 Notificaciones</h3>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.grisM}} onClick={onClose}>✕</button>
      </div>
      <div className="np-list">
        {notifs.length===0&&<div className="empty" style={{padding:"28px 0"}}><div className="ei">🔔</div>
          <p>Sin notificaciones</p></div>}
        {notifs.map(n=>(
          <div key={n.id} className={`notif-item${!n.leida?" unread":""}`}
            onClick={()=>{if(n.tipo==="mensaje"||n.tipo==="oferta")setVista("mensajes");onClose();}}>
            <span className="ni-icon">{ICONS[n.tipo]||"📢"}</span>
            <div className="ni-body">
              <div className="ni-title">{n.titulo}</div>
              <div className="ni-sub">{n.sub}</div>
              <div className="ni-time">{fmtTime(n.ts)}</div>
            </div>
            {!n.leida&&<div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",flexShrink:0,marginTop:4}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PUBLICAR ─────────────────────────────────────────────────────────────
function PublicarForm({usuario, setListings, showToast}) {
  const [f, setF] = useState({tipo:"venta",variedad:"Catuaí",proceso:"Lavado",
    departamento:"Santa Bárbara",cantidad:"",unidad:"qq",precio:"",puntuacion:"",descripcion:""});
  const upd = (k,v)=>setF(x=>({...x,[k]:v}));

  const submit = () => {
    if(!f.cantidad||!f.precio) return alert("Cantidad y precio son obligatorios.");
    const nueva = {id:uid(),...f,cantidad:+f.cantidad,precio:+f.precio,
      puntuacion:f.puntuacion?+f.puntuacion:null,
      usuarioId:usuario.id,vendedor:usuario.nombre,rol:usuario.rol,
      telefono:usuario.telefono||""};
    setListings(ls=>[...ls,nueva]);
    showToast("¡Publicación creada y visible en el mercado!");
    setF(x=>({...x,cantidad:"",precio:"",puntuacion:"",descripcion:""}));
  };

  return (
    <div className="pub-form">
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.bosque,marginBottom:18}}>Nueva publicación</div>
      <div className="field"><label>Tipo *</label>
        <div style={{display:"flex",gap:10}}>
          {["venta","compra"].map(t=>(
            <div key={t} onClick={()=>upd("tipo",t)}
              style={{flex:1,padding:12,border:`2px solid ${f.tipo===t?C.bosque:C.gris}`,borderRadius:12,
              textAlign:"center",cursor:"pointer",background:f.tipo===t?"#edf5f0":C.blanco}}>
              <div style={{fontSize:22}}>{t==="venta"?"📦":"🛒"}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.bosque,marginTop:3}}>{t==="venta"?"Quiero vender":"Quiero comprar"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fgrid">
        <div className="field"><label>Variedad *</label>
          <select value={f.variedad} onChange={e=>upd("variedad",e.target.value)}>
            {VARIEDADES.map(v=><option key={v}>{v}</option>)}</select></div>
        <div className="field"><label>Proceso *</label>
          <select value={f.proceso} onChange={e=>upd("proceso",e.target.value)}>
            {PROCESOS.map(p=><option key={p}>{p}</option>)}</select></div>
        <div className="field"><label>Departamento *</label>
          <select value={f.departamento} onChange={e=>upd("departamento",e.target.value)}>
            {DEPTOS.map(d=><option key={d}>{d}</option>)}</select></div>
        <div className="field"><label>Unidad</label>
          <select value={f.unidad} onChange={e=>upd("unidad",e.target.value)}>
            <option value="qq">Quintales (qq)</option>
            <option value="kg">Kilogramos (kg)</option>
            <option value="sacos">Sacos</option></select></div>
        <div className="field"><label>Cantidad *</label>
          <input type="number" placeholder="200" value={f.cantidad} onChange={e=>upd("cantidad",e.target.value)} /></div>
        <div className="field"><label>Precio / unidad (L.) *</label>
          <input type="number" placeholder="2800" value={f.precio} onChange={e=>upd("precio",e.target.value)} /></div>
        <div className="field"><label>Q-grade (opcional)</label>
          <input type="number" placeholder="84" value={f.puntuacion} onChange={e=>upd("puntuacion",e.target.value)} /></div>
        <div className="field full"><label>Descripción</label>
          <textarea placeholder="Detalles del lote, condiciones, etc." value={f.descripcion}
            onChange={e=>upd("descripcion",e.target.value)} /></div>
      </div>
      <button className="btn btn-primary" style={{marginTop:4}} onClick={submit}>🚀 Publicar en el mercado</button>
    </div>
  );
}

// ─── MIS PUBLICACIONES ────────────────────────────────────────────────────
function MisPublicaciones({usuario, listings, setListings, onDetalle, showToast}) {
  const mias = listings.filter(l=>l.usuarioId===usuario.id);
  return (
    <>
      {mias.length===0&&<div className="empty"><div className="ei">📝</div>
        <p>No tienes publicaciones</p><small>Crea tu primera en "Publicar Oferta"</small></div>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {mias.map(l=>(
          <div key={l.id} style={{background:C.blanco,borderRadius:14,padding:"16px 18px",
            display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{width:46,height:46,borderRadius:12,background:C.gris,display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{RI[l.rol]}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:C.bosque,fontSize:14}}>{l.variedad} · {l.proceso}</div>
              <div style={{fontSize:11,color:C.grisM,marginTop:2}}>{l.departamento} · {l.cantidad} {l.unidad} · <span className={`badge b-${l.tipo}`}>{l.tipo}</span></div>
              {l.descripcion&&<div style={{fontSize:11,color:C.grisM,marginTop:3}}>{l.descripcion}</div>}
              <div style={{display:"flex",gap:7,marginTop:7}}>
                <button className="btn btn-sm btn-ghost" onClick={()=>onDetalle(l)}>👁 Ver</button>
                <button className="btn btn-sm btn-danger" onClick={()=>{
                  setListings(ls=>ls.filter(x=>x.id!==l.id)); showToast("Publicación eliminada");
                }}>🗑 Eliminar</button>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:C.cafe}}>L.{l.precio.toLocaleString()}</div>
              <div style={{fontSize:10,color:C.grisM}}>por {l.unidad}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── HISTORIAL ────────────────────────────────────────────────────────────
function Historial({usuario, historial}) {
  const mis = historial.filter(h=>h.usuarioId===usuario.id);
  return (
    <>
      {mis.length===0&&<div className="empty"><div className="ei">📜</div>
        <p>Sin transacciones registradas</p><small>Las negociaciones aceptadas aparecerán aquí</small></div>}
      <div className="tx-list">
        {mis.map(h=>(
          <div key={h.id} className="tx-item">
            <div className="tx-icon">{h.tipo==="venta"?"📦":"🛒"}</div>
            <div className="tx-info">
              <div className="tx-title">{h.variedad} · {h.tipo==="venta"?"Vendido a":"Comprado de"} {h.contraparte}</div>
              <div className="tx-sub">{h.cantidad} {h.unidad} · {h.fecha} · <span className="badge b-verif">{h.estado}</span></div>
            </div>
            <div className="tx-price">
              <div className="tx-val">L.{(h.precio*h.cantidad).toLocaleString()}</div>
              <div className="tx-date">L.{h.precio.toLocaleString()}/{h.unidad}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── PERFIL ───────────────────────────────────────────────────────────────
function Perfil({usuario, setUsuario, setUsuarios, showToast}) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [tel, setTel] = useState(usuario.telefono||"");
  const [selfie, setSelfie] = useState(usuario.selfie);

  const handleSelfie = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSelfie(ev.target.result);
    reader.readAsDataURL(file);
  };

  const guardar = () => {
    const upd = {...usuario,nombre,telefono:tel,selfie};
    setUsuario(upd);
    setUsuarios(us=>us.map(u=>u.id===usuario.id?upd:u));
    showToast("Perfil actualizado");
  };

  return (
    <div className="profile-card">
      <div style={{textAlign:"center",marginBottom:24}}>
        <div className="profile-av">
          {selfie?<img src={selfie} alt="av"/>:RI[usuario.rol]}
        </div>
        <label style={{cursor:"pointer",display:"inline-block",marginTop:8,
          padding:"6px 14px",background:C.gris,borderRadius:8,fontSize:12,fontWeight:600,color:C.bosque}}>
          📷 Cambiar foto
          <input type="file" accept="image/*" style={{display:"none"}} onChange={handleSelfie} />
        </label>
        <div style={{marginTop:10}}>
          <span className={`badge ${usuario.verificado?"b-verif":"b-noVerif"}`}>
            {usuario.verificado?"✅ Cuenta verificada":"⚠️ Cuenta sin verificar"}
          </span>
        </div>
      </div>

      <div className="field"><label>Nombre / Empresa</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} /></div>
      <div className="field"><label>Correo electrónico</label>
        <input value={usuario.email} disabled style={{opacity:.6,cursor:"not-allowed"}} /></div>
      <div className="field"><label>Teléfono</label>
        <input value={tel} onChange={e=>setTel(e.target.value)} placeholder="+(504) 9xxx-xxxx" /></div>
      <div className="field"><label>Rol</label>
        <input value={ROLES_LIST.find(r=>r.id===usuario.rol)?.name} disabled style={{opacity:.6,cursor:"not-allowed"}} /></div>

      <button className="btn btn-primary" onClick={guardar} style={{marginTop:4}}>💾 Guardar cambios</button>
    </div>
  );
}

// ─── MODAL DETALLE ─────────────────────────────────────────────────────────
function ModalListing({listing:l, onClose, usuario, usuarios, onContactar}) {
  const pub = usuarios.find(u=>u.id===l.usuarioId);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <span className={`badge b-${l.tipo}`}>{l.tipo==="venta"?"📦 Oferta de venta":"🛒 Demanda de compra"}</span>
            <h2 style={{marginTop:6}}>{l.variedad}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.gris}`,marginBottom:8}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:C.gris,display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:18,overflow:"hidden",flexShrink:0}}>
            {pub?.selfie?<img src={pub.selfie} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:RI[l.rol]}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:C.bosque}}>{l.vendedor}</div>
            <span className={`badge ${pub?.verificado?"b-verif":"b-noVerif"}`}>
              {pub?.verificado?"✅ Verificado":"⚠️ Sin verificar"}</span>
          </div>
        </div>
        <div className="irow"><span className="ik">Rol</span><span className="iv">{ROLES_LIST.find(r=>r.id===l.rol)?.name}</span></div>
        <div className="irow"><span className="ik">Proceso</span><span className="iv">{l.proceso}</span></div>
        <div className="irow"><span className="ik">Departamento</span><span className="iv">{l.departamento}</span></div>
        <div className="irow"><span className="ik">Cantidad</span><span className="iv">{l.cantidad} {l.unidad}</span></div>
        <div className="irow"><span className="ik">Precio</span>
          <span className="iv" style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.cafe}}>L.{l.precio.toLocaleString()}/{l.unidad}</span></div>
        {l.puntuacion&&<div className="irow"><span className="ik">Q-grade</span><span className="iv">⭐ {l.puntuacion} pts</span></div>}
        {l.descripcion&&<div className="irow"><span className="ik">Descripción</span>
          <span className="iv" style={{maxWidth:"60%",textAlign:"right"}}>{l.descripcion}</span></div>}
        {l.telefono&&(
          <div className="contact-box">
            <p>📞 Contacto directo</p>
            <span>{l.vendedor} — {l.telefono}</span>
          </div>
        )}
        {l.usuarioId!==usuario.id&&(
          <button className="btn btn-primary" style={{width:"100%",marginTop:14}} onClick={onContactar}>
            💬 Iniciar negociación
          </button>
        )}
      </div>
    </div>
  );
}
