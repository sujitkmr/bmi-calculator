
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
