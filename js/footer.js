
// footer.js - Live Time in Footer
document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("current-time");
  if (!timeEl) return;
  function updateTime(){
    const now = new Date();
    timeEl.textContent = now.toLocaleString();
  }
  updateTime();
  setInterval(updateTime, 1000);
});

//scrty
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  const ctrlOrCmd = e.ctrlKey || e.metaKey;
  if (ctrlOrCmd && ["u", "s", "c", "x", "a", "p"].includes(key)) {
    e.preventDefault();
    return;
  }
  if (e.key === "F12" || (ctrlOrCmd && e.shiftKey && ["i", "c", "j"].includes(key))) {
    e.preventDefault();
    return;
  }
});
//scrty