const clock=document.getElementById("clock");
function updateClock(){clock.textContent=new Date().toLocaleString("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true}).replace("a. m.","a. m.").replace("p. m.","p. m.");}
updateClock();setInterval(updateClock,30000);

const alertBox=document.getElementById("alert"), events=document.getElementById("events"), toast=document.getElementById("toast");
function notify(msg){toast.textContent=msg;toast.style.display="block";setTimeout(()=>toast.style.display="none",3000)}
document.getElementById("robbery").onclick=()=>{
  alertBox.style.display="grid";
  events.insertAdjacentHTML("afterbegin",`<p>🔴 <b>AHORA</b> Robo simulado — paquete retirado del exterior</p>`);
  notify("🚨 Robo detectado: paquete retirado");
  document.querySelectorAll(".tag").forEach(x=>x.style.animation="pulse .7s infinite");
};
document.getElementById("stop").onclick=()=>{alertBox.style.display="none";notify("Alarma desactivada");};
document.getElementById("arm").onclick=()=>notify("Sistema armado y sensores activos");
document.getElementById("disarm").onclick=()=>notify("Sistema desarmado");

document.querySelectorAll(".tab").forEach((tab,i)=>{
  tab.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    tab.classList.add("active"); notify(`Cámara seleccionada: CAM 0${i+1}`);
  };
});
document.querySelectorAll(".nav").forEach(x=>x.onclick=()=>{
  document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));x.classList.add("active");
});
