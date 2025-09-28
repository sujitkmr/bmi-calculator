// bmi.js - BMI Calculator with Popup Modal and Dynamic Left-Pane Report
document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  if (!bmiForm) return;

  // Left-pane basic report element
  const basicReport = document.querySelector(".bmi-basic-report");

  // Create popup modal dynamically
  const popup = document.createElement("div");
  popup.id = "bmi-popup";
  popup.style.display = "none";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.background = "rgba(0,0,0,0.6)";
  popup.style.zIndex = "9999";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.innerHTML = `
    <div id="popup-content" style="background:#fff; border-radius:12px; padding:20px; max-width:600px; width:90%; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
      <button id="popup-close" style="position:absolute;top:10px;right:15px;font-size:22px;font-weight:bold;color:#e74c3c;border:none;background:none;cursor:pointer;">✖</button>
      <h2 style="margin-bottom:10px; text-align:center;">Your BMI Results</h2>
      <div id="result-badge" style="padding:8px 15px; color:#fff; font-weight:bold; text-align:center; border-radius:8px; margin-bottom:10px;"></div>
      <p id="result-text" style="font-size:16px; margin-bottom:10px;"></p>
      <p id="add-to-tracker" style="display:none; color:#1d3557; text-decoration:underline; cursor:pointer; text-align:center; font-weight:600; margin-bottom:12px;">
        BMI Tracker : See Your Progress » 
      </p>
      <div style="background:#eee; border-radius:8px; overflow:hidden; height:20px; margin-bottom:15px;">
        <div id="progress-bar" style="height:100%; width:0%; background:#2ecc71; transition:width 0.5s;"></div>
      </div>
      <h3 style="margin-bottom:8px;">Recommended Tips:</h3>
      <ul id="tips-list" style="margin-bottom:15px; padding-left:20px;"></ul>
      <div id="download-buttons" style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
        <button id="download-report" style="padding:8px 12px; border:none; border-radius:6px; background:#3498db; color:#fff; cursor:pointer;">📄 Download Report</button>
        <button id="download-tracker" style="padding:8px 12px; border:none; border-radius:6px; background:#27ae60; color:#fff; cursor:pointer;">📊 Download Tracker</button>
        <button id="download-diet" style="padding:8px 12px; border:none; border-radius:6px; background:#e67e22; color:#fff; cursor:pointer;">🥗 Download Diet</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // DOM refs for popup
  const resultBadge = popup.querySelector("#result-badge");
  const resultText = popup.querySelector("#result-text");
  const progressBar = popup.querySelector("#progress-bar");
  const tipsList = popup.querySelector("#tips-list");
  const downloadButtons = popup.querySelector("#download-buttons");
  const closeBtn = popup.querySelector("#popup-close");
  const addToTrackerText = popup.querySelector("#add-to-tracker");

  // Tips/colors
  const tips = {
    "Underweight": { color: "#f39c12", list: ["Eat calorie-dense foods", "Add healthy snacks", "Increase protein intake"] },
    "Normal weight": { color: "#2ecc71", list: ["Maintain balanced diet", "Stay active daily", "Keep hydrated"] },
    "Overweight": { color: "#f97316", list: ["Increase fruits & veggies", "Add daily walks", "Cut down sugary drinks"] },
    "Obesity": { color: "#e74c3c", list: ["Consult a nutritionist", "Do regular physical activity", "Monitor blood pressure"] }
  };

  // Globals
  window.lastBMI = null;
  window.lastCategory = null;
  window.lastGender = null;
  window.lastAge = null;
  window.lastDOB = null;
  window.lastName = null;
  window.tips = tips;
  window.lastWeight = null;


  // Age from DOB
  function calculateAge(dobValue) {
    const dob = new Date(dobValue);
    if (isNaN(dob)) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  // Popup show/hide
  function showPopup() { popup.style.display = "flex"; }
  function hidePopup() {
    popup.style.display = "none";
    bmiForm.reset();
    progressBar.style.width = "0";
    tipsList.innerHTML = "";
    resultBadge.textContent = "";
    resultText.textContent = "";
    downloadButtons.style.display = "none";
    if (addToTrackerText) addToTrackerText.style.display = "none";
  }
  closeBtn.addEventListener("click", hidePopup);

  // Update popup UI
  function updateUI(bmi, category) {
    resultBadge.textContent = category;
    resultBadge.style.background = tips[category].color;

    resultText.innerHTML = `
      Hey <strong>${lastName}</strong>! Based on your height, weight, age (<strong>${lastAge ?? "N/A"}</strong>),
      and gender (<strong>${lastGender}</strong>),
      your Body Mass Index (BMI) is <strong>${bmi}</strong>,
      which falls under the "<strong>${category}</strong>" category.
    `;
    resultText.style.color = tips[category].color;

    progressBar.style.width = Math.min((bmi / 40) * 100, 100) + "%";
    progressBar.style.background = tips[category].color;

    tipsList.innerHTML = "";
    tips[category].list.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });

    downloadButtons.style.display = "flex";

    if (addToTrackerText) {
      addToTrackerText.style.display = "block";
      addToTrackerText.textContent = "Add this BMI to your Progress Tracker »";
      addToTrackerText.style.pointerEvents = "auto";
    }

    showPopup();
  }

  // Update left-pane basic report
function updateBasicReport() {
  if (!basicReport || lastBMI === null) return;

  basicReport.querySelector(".bmi-value").textContent = lastBMI;

  const statusEl = basicReport.querySelector(".bmi-status");
  statusEl.textContent = lastCategory;
  statusEl.className = `bmi-status ${lastCategory.replace(" ", "-").toLowerCase()}`;

  let rangeText = "";
  switch(lastCategory) {
    case "Underweight": rangeText = "Below 18.5"; break;
    case "Normal weight": rangeText = "18.5 – 24.9"; break;
    case "Overweight": rangeText = "25 – 29.9"; break;
    case "Obesity": rangeText = "30+"; break;
  }
  basicReport.querySelector(".bmi-range").textContent = rangeText;

  let score = 0, scoreLabel = "";
  switch(lastCategory) {
    case "Underweight": score = 60; scoreLabel = "Needs Improvement"; break;
    case "Normal weight": score = 98; scoreLabel = "Excellent"; break;
    case "Overweight": score = 75; scoreLabel = "Good"; break;
    case "Obesity": score = 50; scoreLabel = "Needs Attention"; break;
  }
  basicReport.querySelector(".score-circle span").textContent = score;
  basicReport.querySelector(".score-label").textContent = scoreLabel;

  // ✅ Use lastWeight instead of reading input
  basicReport.querySelector(".weight-value").innerHTML = `${lastWeight} <span>kg</span>`;
  basicReport.querySelector(".weight-bar .progress").style.width = Math.min((lastWeight / 100) * 100, 100) + "%";

  const weightChange = (Math.random() * 5 - 2.5).toFixed(1);
  basicReport.querySelector(".weight-change").textContent = (weightChange > 0 ? "+" : "") + weightChange + " kg";
}


  // BMI form submit
 bmiForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name")?.value.trim() || "User";
  const dob = document.getElementById("dob")?.value || "N/A";
  const age = calculateAge(dob);

  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  const genderInput = document.querySelector('input[name="gender"]:checked');
  const gender = genderInput ? genderInput.value : "N/A";

  if (height > 0 && weight > 0) {
    const h = height / 100;
    const bmi = +(weight / (h * h)).toFixed(1);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obesity";

    // Save globals
    window.lastBMI = bmi;
    window.lastCategory = category;
    window.lastName = name;
    window.lastAge = age;
    window.lastDOB = dob;
    window.lastGender = gender;
    window.lastWeight = weight;

      // === Health Metrics Calculations ===
  // Estimate % body fat
// ===== Dynamic Metrics =====
const defaultWaist = gender === "male" ? 90 : 80;   // default waist cm
const defaultHip = gender === "male" ? 100 : 95;    // default hip cm

const waist = parseFloat(document.getElementById("waist")?.value) || defaultWaist;
const hip = parseFloat(document.getElementById("hip")?.value) || defaultHip;
const waistHipRatio = +(waist / hip).toFixed(2);

// Percent Body Fat
let pbf;
if (gender === "male") pbf = +(1.20 * bmi + 0.23 * age - 16.2).toFixed(1);
else pbf = +(1.20 * bmi + 0.23 * age - 5.4).toFixed(1);

// Visceral Fat Level (approx)
const visceralFatLevel = +(pbf / 2).toFixed(1);

// Fat to Reduce (20% of fat mass)
const fatMass = +(weight * (pbf / 100)).toFixed(1);
const fatToReduce = +(fatMass * 0.2).toFixed(1);

// BMR (Mifflin-St Jeor)
const bmr = +(gender === "male"
  ? 10 * weight + 6.25 * height - 5 * age + 5
  : 10 * weight + 6.25 * height - 5 * age - 161).toFixed(0);

// TDEE assuming sedentary activity
const tdee = +(bmr * 1.2).toFixed(0);

// Obesity Degree (BMI vs ideal BMI=22)
const obesityDegree = +((bmi / 22) * 100).toFixed(1);
//++++++++++++++++++++++++++++

    // ✅ Store all relevant info in localStorage
    const currentDate = new Date();
    const formattedDate = currentDate.getFullYear() + "-" +
                          String(currentDate.getMonth() + 1).padStart(2, "0") + "-" +
                          String(currentDate.getDate()).padStart(2, "0");

    const bmiDataToStore = {
      name,
      age,
      currentDate: formattedDate,
      dob,
      height,
      weight,
      gender,
      bmi,
      category,
  pbf,
  waistHipRatio,
  visceralFatLevel,
  fatToReduce,
  bmr,
  tdee,
  obesityDegree
    };

    localStorage.setItem("latestBMIData", JSON.stringify(bmiDataToStore));

    // Update UI
    updateUI(bmi, category);
    updateBasicReport();
  }
});


  // Add to Tracker functionality
  if (addToTrackerText) {
    addToTrackerText.addEventListener("click", () => {
      if (!window.lastBMI && window.lastBMI !== 0) return alert("No BMI result found to add.");

      const todayDate = new Date();
      const today = todayDate.getFullYear() + "-" +
                    String(todayDate.getMonth() + 1).padStart(2, "0") + "-" +
                    String(todayDate.getDate()).padStart(2, "0");

      let bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];

      const existingIndex = bmiData.findIndex(entry => entry.date === today);
      if (existingIndex !== -1) bmiData[existingIndex].bmi = window.lastBMI;
      else bmiData.push({ bmi: window.lastBMI, date: today });

      localStorage.setItem("bmiData", JSON.stringify(bmiData));

      addToTrackerText.textContent = "✔ Added to Tracker";
      addToTrackerText.style.pointerEvents = "none";

      if (window.refreshBMIChart) window.refreshBMIChart();
      document.querySelector("#progress-tracker")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Load latest BMI on page load
const savedData = JSON.parse(localStorage.getItem("latestBMIData"));
if (savedData) {
  lastBMI = savedData.bmi;
  lastCategory = savedData.category;
  lastName = savedData.name;
  lastAge = savedData.age;
  lastGender = savedData.gender;
  lastWeight = savedData.weight; // ✅ add this
  updateBasicReport();
}


  // Attach download events to both main and popup buttons
  ["report", "tracker", "diet"].forEach(type => {
    document.querySelectorAll(`#download-${type}, #popup-download-${type}`).forEach(btn => {
      if (type === "report") btn.addEventListener("click", generateBMIReport);
      if (type === "tracker") btn.addEventListener("click", generateHealthTracker);
      if (type === "diet") btn.addEventListener("click", generateDietPlan);
    });
  });

});
