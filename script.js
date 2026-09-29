const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const clock=$("#clock"), toast=$("#toast"), alertBox=$("#alert"), events=$("#events");
let armed=true, alarmOn=false, scenarioRunning=false, audioCtx=null, sirenTimer=null, scenarioTimer=null;

function now(){return new Date().toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});}
function updateClock(){clock.textContent=new Date().toLocaleString("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true});}
updateClock();setInterval(updateClock,30000);

function notify(msg){toast.textContent=msg;toast.style.display="block";clearTimeout(notify.t);notify.t=setTimeout(()=>toast.style.display="none",3000);}
function eventLog(msg,kind="red"){events.insertAdjacentHTML("afterbegin",`<p class="${kind==="blue"?"blue":""}">🔴 <b>${now()}</b> ${msg}</p>`);}
function setStatus(msg){$("#scenarioStatus").textContent=msg;}

function beep(){
  if(!$("#sound").checked) return;
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type="square";o.frequency.value=760;g.gain.value=.06;o.connect(g);g.connect(audioCtx.destination);
  o.start();o.stop(audioCtx.currentTime+.16);
}
function startSiren(){
  if(alarmOn)return;
  alarmOn=true;document.body.classList.add("alarm-active");alertBox.classList.remove("hidden");
  beep();sirenTimer=setInterval(beep,650);
}
function stopSiren(){
  alarmOn=false;document.body.classList.remove("alarm-active");clearInterval(sirenTimer);sirenTimer=null;alertBox.classList.add("hidden");
}

function setArmed(value){
  armed=value;
  const badge=$("#armedBadge"), prot=$(".protected");
  badge.textContent=value?"♧ SISTEMA ARMADO":"♧ SISTEMA DESARMADO";
  badge.classList.toggle("off",!value);
  prot.classList.toggle("off",!value);
  $("#systemText").textContent=value?"Caja protegida":"Caja sin protección";
  $("#sensorText").textContent=value?"Sensores activos y vigilando":"Sensores desactivados";
  $("#robbery").disabled=!value;
  if(!value) stopSiren();
  notify(value?"Sistema armado: sensores activos":"Sistema desarmado: no se generarán alarmas");
  eventLog(value?"Sistema armado":"Sistema desarmado","blue");
}
$("#arm").onclick=()=>setArmed(true);
$("#disarm").onclick=()=>setArmed(false);
$("#stop").onclick=()=>{stopSiren();notify("🔊 Alarma desactivada");eventLog("Alarma desactivada manualmente","blue");};

function selectCamera(i){
  $$(".tab").forEach((x,n)=>x.classList.toggle("active",n===i));
  $$(".camera").forEach((x,n)=>{x.classList.toggle("selected",n===i);x.classList.toggle("dim",n!==i)});
  const cam=$(`.camera[data-camera="${i}"]`);
  cam.scrollIntoView({behavior:"smooth",block:"center"});
  notify(`Cámara activa: CAM 0${i+1}`);
}
$$(".tab").forEach((t,i)=>t.onclick=()=>selectCamera(i));

function resetScene(){
  clearTimeout(scenarioTimer);scenarioRunning=false;stopSiren();
  $(".delivery").classList.remove("visible","move");
  $$(".package").forEach(x=>x.classList.remove("visible"));
  $$(".person").forEach(x=>x.classList.remove("visible","carry"));
  $$(".walking").forEach(x=>x.classList.remove("visible"));
  $$(".tag").forEach(x=>{x.classList.remove("danger");x.textContent="SIN MOVIMIENTO"});
  $("[data-tag='0']").textContent="PAQUETE ESPERANDO";
  $("[data-time='0']").textContent="Esperando paquete...";
  $("[data-time='1']").textContent="Sin movimiento";
  $("[data-time='2']").textContent="Sin movimiento";
  $("[data-time='3']").textContent="Sin movimiento";
  $("#mapIntruder").style.left="68%";$("#mapIntruder").style.top="32%";
  $("#stepText").textContent="Paso 0/4 — Sistema vigilando";
  setStatus("Monitoreo exterior activo");
  notify("Escena reiniciada");
}
$("#resetScenario").onclick=resetScene;

function runStep(step){
  if(!scenarioRunning)return;
  const p=$(".package"), delivery=$(".delivery"), thief=$(".thief"), walkers=$$(".walking");
  if(step===1){
    selectCamera(0);setStatus("Repartidor llegando a la entrada");$("#stepText").textContent="Paso 1/4 — Llega el paquete";
    delivery.classList.add("visible","move");eventLog("Repartidor llega a la entrada exterior — Cámara 01");
    setTimeout(()=>{p.classList.add("visible");$("[data-tag='0']").textContent="PAQUETE DETECTADO";$("[data-tag='0']").classList.add("danger");eventLog("Paquete dejado frente a la casa — Cámara 01");},1900);
    scenarioTimer=setTimeout(()=>runStep(2),3200);
  } else if(step===2){
    selectCamera(1);setStatus("Intruso acercándose al paquete");$("#stepText").textContent="Paso 2/4 — Intruso detectado";
    thief.classList.add("visible");$("[data-tag='1']").textContent="MOVIMIENTO DETECTADO";$("[data-tag='1']").classList.add("danger");
    eventLog("Movimiento detectado frente al paquete — Cámara 02");$("#mapIntruder").style.left="53%";$("#mapIntruder").style.top="45%";
    scenarioTimer=setTimeout(()=>runStep(3),2800);
  } else if(step===3){
    selectCamera(2);setStatus("Intruso tomando el paquete");$("#stepText").textContent="Paso 3/4 — Paquete retirado";
    thief.classList.add("carry");p.classList.remove("visible");walkers[0].classList.add("visible");
    $("[data-tag='2']").textContent="OBJETO EN MANOS";$("[data-tag='2']").classList.add("danger");
    eventLog("Intruso toma el paquete y avanza hacia la calle — Cámara 03");$("#mapIntruder").style.left="79%";$("#mapIntruder").style.top="55%";
    scenarioTimer=setTimeout(()=>runStep(4),2800);
  } else if(step===4){
    selectCamera(3);setStatus("Robo confirmado — salida exterior");$("#stepText").textContent="Paso 4/4 — Robo confirmado";
    walkers[1].classList.add("visible");$("[data-tag='3']").textContent="SALIDA DETECTADA";$("[data-tag='3']").classList.add("danger");
    eventLog("Intruso sale de la zona con el paquete — Cámara 04");
    $("#alertText").textContent="Paquete robado. Intruso en salida exterior.";
    startSiren();notify("🚨 ¡ROBO DETECTADO! Alarma activada");
    $("#notifications").insertAdjacentHTML("afterbegin",`<p>🚨 Alerta de robo enviada al celular <time>${now()}</time></p>`);
    scenarioRunning=false;
  }
}
function startScenario(){
  if(!armed){notify("⚠ Primero debes ARMAR el sistema");return}
  resetScene();scenarioRunning=true;notify("▶ Secuencia iniciada");scenarioTimer=setTimeout(()=>runStep(1),300);
}
$("#startScenario").onclick=startScenario;
$("#robbery").onclick=()=>{if(armed){if(!scenarioRunning)startScenario();else notify("La secuencia ya está en ejecución")}};

$$(".nav").forEach(x=>x.onclick=()=>{$$(".nav").forEach(n=>n.classList.remove("active"));x.classList.add("active")});
resetScene();
