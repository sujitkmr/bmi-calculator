// bmi.js - BMI Calculator + PDF Report + Tracker + Diet (with Popup Modal)
document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  if (!bmiForm) return;

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
    <div id="popup-content" style="background:#fff; border-radius:12px; padding:20px; max-width:600px; width:90%; position:relative;">
      <button id="popup-close" style="position:absolute;top:10px;right:15px;font-size:20px;border:none;background:none;cursor:pointer;">✖</button>
      <h2 style="margin-bottom:10px; text-align:center;">Your BMI Results</h2>
      <div id="result-badge" style="padding:8px 15px; color:#fff; font-weight:bold; text-align:center; border-radius:8px; margin-bottom:10px;"></div>
      <p id="result-text" style="font-size:16px; margin-bottom:15px;"></p>
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

  const resultBadge = popup.querySelector("#result-badge");
  const resultText = popup.querySelector("#result-text");
  const progressBar = popup.querySelector("#progress-bar");
  const tipsList = popup.querySelector("#tips-list");
  const downloadButtons = popup.querySelector("#download-buttons");
  const downloadReport = popup.querySelector("#download-report");
  const downloadTracker = popup.querySelector("#download-tracker");
  const downloadDiet = popup.querySelector("#download-diet");
  const closeBtn = popup.querySelector("#popup-close");

  const tips = {
    "Underweight": {
      color: "#f39c12",
      list: ["Eat calorie-dense foods", "Add healthy snacks", "Increase protein intake"]
    },
    "Normal weight": {
      color: "#2ecc71",
      list: ["Maintain balanced diet", "Stay active daily", "Keep hydrated"]
    },
    "Overweight": {
      color: "#f97316",
      list: ["Increase fruits & veggies", "Add daily walks", "Cut down sugary drinks"]
    },
    "Obesity": {
      color: "#e74c3c",
      list: ["Consult a nutritionist", "Do regular physical activity", "Monitor blood pressure"]
    }
  };

  let lastBMI = null;
  let lastCategory = null;
  let lastGender = null;
  let lastAge = null;
  let lastDOB = null;
  let lastName = null;

  // Calculate age from DOB
  function calculateAge(dobValue) {
    const dob = new Date(dobValue);
    if (isNaN(dob)) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  // Show popup
  function showPopup() {
    popup.style.display = "flex";
  }

  // Hide popup
  function hidePopup() {
    popup.style.display = "none";
  }
  closeBtn.addEventListener("click", hidePopup);
  popup.addEventListener("click", (e) => {
    if (e.target === popup) hidePopup();
  });

  // Update UI after BMI calculation
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

    // Show tips
    tipsList.innerHTML = "";
    tips[category].list.forEach((tip) => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });

    // Show buttons
    downloadButtons.style.display = "flex";

    showPopup();
  }

  // BMI form submit
  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    lastName = document.getElementById("name")?.value.trim() || "User";
    localStorage.setItem("userName", lastName);

    const genderInput = document.querySelector('input[name="gender"]:checked');
    lastGender = genderInput ? genderInput.value : "N/A";

    lastDOB = document.getElementById("dob")?.value || "N/A";
    lastAge = calculateAge(lastDOB);

    if (height > 0 && weight > 0) {
      const h = height / 100;
      const bmi = +(weight / (h * h)).toFixed(1);

      let category = "";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obesity";

      lastBMI = bmi;
      lastCategory = category;

      updateUI(bmi, category);

      // 🔒 Disable Compute BMI button and lock form for 30 seconds
      const computeBtn = bmiForm.querySelector("button[type='submit']");
      const allFields = bmiForm.querySelectorAll("input, select, textarea");
      if (computeBtn) {
        computeBtn.disabled = true;
        allFields.forEach(field => field.disabled = true);
        let seconds = 30;
        const originalText = "Compute BMI";
        computeBtn.textContent = `Report Download window is open for (${seconds}s)`;

        const countdown = setInterval(() => {
          seconds--;
          computeBtn.textContent = `Report Download window is open for (${seconds}s)`;
          if (seconds <= 0) {
            clearInterval(countdown);
            computeBtn.disabled = false;
            computeBtn.textContent = originalText;
            allFields.forEach(field => field.disabled = false);
            bmiForm.reset();
            progressBar.style.width = "0%";
            downloadButtons.style.display = "none";
            hidePopup();
            lastBMI = lastCategory = lastAge = lastName = lastGender = lastDOB = null;
          }
        }, 1000);
      }
    }
  });

  // Helper: PDF Header & Footer
  function addHeaderFooter(doc, title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("GYM‖BMI", 20, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(title, 105, 15, { align: "center" });
    const now = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated: ${now}`, 200, 15, { align: "right" });
    doc.setDrawColor(150);
    doc.line(20, 20, 190, 20);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Confidential | Generated by BMI Calculator – GYM‖BMI", 105, 285, { align: "center" });
    doc.setTextColor(0);
  }

  // Generate BMI Report PDF
  function generateBMIReport() {
    if (!lastBMI || !lastCategory) return alert("Please calculate BMI first!");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addHeaderFooter(doc, "BMI & Body Composition Report");

    const age = lastAge ?? "N/A";
    const gender = lastGender ?? "N/A";
    const dob = lastDOB ?? "N/A";
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;

    doc.setFontSize(12);
    doc.text(`Name: ${lastName}`, 20, 30);
    doc.text(`DOB: ${dob}`, 20, 37);
    doc.text(`Age: ${age}`, 20, 44);
    doc.text(`Gender: ${gender}`, 20, 51);
    doc.text(`Height: ${height} cm`, 120, 30);
    doc.text(`Weight: ${weight} kg`, 120, 37);
    doc.setTextColor(tips[lastCategory].color);
    doc.text(`BMI: ${lastBMI} (${lastCategory})`, 120, 44);
    doc.setTextColor(0);

    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("1. Body Composition", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Body Fat Mass: ${(weight * 0.25).toFixed(1)} kg`, 25, y);
    y += 8;
    doc.text(`Percent Body Fat: ${(lastBMI / 30 * 25).toFixed(1)} %`, 25, y);
    y += 8;
    doc.text(`Skeletal Muscle Mass: ${(weight * 0.35).toFixed(1)} kg`, 25, y);
    y += 8;
    doc.text(`Fat Free Mass: ${(weight * 0.75).toFixed(1)} kg`, 25, y);

    // Sections 2–6
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("2. Obesity Analysis", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`BMI: ${lastBMI} (${lastCategory})`, 25, y);
    y += 8;
    doc.text(`PBF: ${(lastBMI / 30 * 25).toFixed(1)} %`, 25, y);
    y += 8;
    doc.text(`Visceral Fat Level: ${Math.round(lastBMI / 2)}`, 25, y);

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("3. Muscle-Fat Analysis", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Weight: ${weight} kg`, 25, y);
    y += 8;
    doc.text(`Skeletal Muscle Mass: ${(weight * 0.35).toFixed(1)} kg`, 25, y);
    y += 8;
    doc.text(`Body Fat Mass: ${(weight * 0.25).toFixed(1)} kg`, 25, y);

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("4. Segmental Analysis", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    ["Right Arm", "Left Arm", "Right Leg", "Left Leg", "Trunk"].forEach((part) => {
      doc.text(`${part}: Lean ${(weight * 0.08).toFixed(1)} kg | Fat ${(weight * 0.05).toFixed(1)} kg`, 25, y);
      y += 8;
    });

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("5. Weight Control", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Target Weight: ${(22 * (height / 100) ** 2).toFixed(1)} kg`, 25, y);
    y += 8;
    doc.text(`Weight to Lose: ${(weight - 22 * (height / 100) ** 2).toFixed(1)} kg`, 25, y);

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("6. Comprehensive Evaluation", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    tips[lastCategory].list.forEach((t, i) => {
      doc.text(`- ${t}`, 25, y + i * 8);
    });

    doc.save("BMI_Report_by_GYMBMI.pdf");
  }

  // Generate Health Tracker Excel (30 days)
  function generateHealthTracker() {
    if (!lastBMI) return alert("Please calculate BMI first!");
    
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const targetWeight = +(22 * (height / 100) ** 2).toFixed(1);
    const weightToLoseGain = +(weight - targetWeight).toFixed(1);
    const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obesity";

    const ws_data = [
      ["Date", "Weight (kg)", "Height (cm)", "BMI", "BMI Category", "Target Weight (kg)", "Weight to Lose/Gain (kg)", "Calories Intake (kcal)", "Water Intake (L)", "Steps / Activity", "Sleep Hours", "Mood / Energy Level", "Notes"]
    ];

    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      if (i === 0) {
        ws_data.push([dateStr, weight, height, bmi, category, targetWeight, weightToLoseGain, "", "", "", "", "", ""]);
      } else {
        ws_data.push([dateStr, "", height, "", "", targetWeight, "", "", "", "", "", "", ""]);
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BMI Tracker");
    XLSX.writeFile(wb, "BMI_Health_Tracker_by_GYMBMI.xlsx");
  }

  // Generate Generic Diet Plan PDF
  function generateDietPlan() {
    if (!lastCategory) return alert("Please calculate BMI first!");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    addHeaderFooter(doc, "Personalized Diet Plan");

    doc.setFontSize(12);
    doc.text(`Category: ${lastCategory}`, 20, 30);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Daily Diet Plan:", 20, 50);
    doc.setFont("helvetica", "normal");

    const genericDietPlans = {
      "Underweight": [
        "Breakfast: Oatmeal with milk, nuts, and fruits + 1 boiled egg",
        "Mid-Morning: Smoothie with banana, peanut butter, and yogurt",
        "Lunch: Brown rice, grilled chicken/fish, vegetables",
        "Snack: Handful of nuts and dried fruits",
        "Dinner: Whole wheat pasta or chapati, paneer/tofu, veggies",
        "Before Bed: Glass of milk or protein shake"
      ],
      "Normal weight": [
        "Breakfast: Whole grain toast with avocado and boiled eggs",
        "Mid-Morning: Fresh fruits or yogurt",
        "Lunch: Quinoa/rice, lean protein (chicken/fish/tofu), vegetables",
        "Snack: Carrot/cucumber sticks with hummus or nuts",
        "Dinner: Chapati with dal, salad, and grilled vegetables",
        "Before Bed: Herbal tea or warm milk"
      ],
      "Overweight": [
        "Breakfast: Oatmeal with berries or egg whites and vegetables",
        "Mid-Morning: Green smoothie or fruits",
        "Lunch: Salad bowl with lean protein, no fried foods",
        "Snack: Roasted chana, sprouts, or green tea",
        "Dinner: Soup + grilled veggies + chapati (avoid rice at night)",
        "Before Bed: Herbal tea"
      ],
      "Obesity": [
        "Breakfast: Vegetable omelet or green smoothie",
        "Mid-Morning: Fresh fruits (low GI like apple, pear)",
        "Lunch: Steamed vegetables with dal/soup + salad",
        "Snack: Nuts in small portions + green tea",
        "Dinner: Vegetable soup + 1-2 chapatis (avoid rice)",
        "Before Bed: Herbal tea (no sugar)"
      ]
    };

    let y = 65;
    genericDietPlans[lastCategory].forEach((meal, i) => {
      doc.text(`${i + 1}. ${meal}`, 20, y);
      y += 10;
    });

    doc.save("Diet_Plan_by_GYMBMI.pdf");
  }

  // Attach download events
  downloadReport.addEventListener("click", generateBMIReport);
  downloadTracker.addEventListener("click", generateHealthTracker);
  downloadDiet.addEventListener("click", generateDietPlan);
});
