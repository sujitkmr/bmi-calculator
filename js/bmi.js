// bmi.js - BMI Calculator + PDF Report + Tracker + Diet (with Popup Modal, No Lock Timer)
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
    <div id="popup-content" style="background:#fff; border-radius:12px; padding:20px; max-width:600px; width:90%; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
      <button id="popup-close" style="position:absolute;top:10px;right:15px;font-size:22px;font-weight:bold;color:#e74c3c;border:none;background:none;cursor:pointer;">✖</button>
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

    // User details
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

    // Body composition estimates
    const bodyFat = (1.2 * lastBMI + 0.23 * age - 16.2).toFixed(1);
    const muscleMass = (weight * 0.4).toFixed(1);
    const waterPercentage = (weight * 0.6).toFixed(1);

    doc.setFont("helvetica", "bold");
    doc.text("Estimated Body Composition:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Body Fat %: ${bodyFat}%`, 20, 80);
    doc.text(`Muscle Mass: ${muscleMass} kg`, 20, 87);
    doc.text(`Water Weight: ${waterPercentage} kg`, 20, 94);

    // Analysis
    doc.setFont("helvetica", "bold");
    doc.text("Health Analysis:", 20, 110);
    doc.setFont("helvetica", "normal");
    const analysis = {
      "Underweight": "You are below the healthy range. Focus on nutrient-rich and calorie-dense foods.",
      "Normal weight": "You are in the healthy range. Maintain balanced diet and regular exercise.",
      "Overweight": "You are above the healthy range. Start mild exercise and control calorie intake.",
      "Obesity": "You are in the high-risk category. Consult a healthcare provider for a structured plan."
    };
    doc.text(analysis[lastCategory], 20, 120, { maxWidth: 170 });

    // Tips
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Tips:", 20, 150);
    doc.setFont("helvetica", "normal");
    tips[lastCategory].list.forEach((tip, i) => {
      doc.text(`- ${tip}`, 20, 160 + i * 7);
    });

    doc.save("BMI_Report_by_GYMBMI.pdf");
  }

  // Generate Health Tracker Excel
  function generateHealthTracker() {
    if (!lastBMI) return alert("Please calculate BMI first!");
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const targetWeight = +(22 * (height / 100) ** 2).toFixed(1);
    const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obesity";

    const ws_data = [
      ["Date", "Weight (kg)", "Height (cm)", "BMI", "BMI Category", "Target Weight (kg)"],
    ];
    const today = new Date();
    ws_data.push([today.toISOString().split("T")[0], weight, height, bmi, category, targetWeight]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BMI Tracker");
    XLSX.writeFile(wb, "BMI_Health_Tracker_by_GYMBMI.xlsx");
  }

  // Generate Diet Plan PDF
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

    const plans = {
      "Underweight": [
        "Breakfast: Oats with milk, nuts, banana",
        "Mid-Morning: Peanut butter sandwich / smoothie",
        "Lunch: Rice, chicken/fish, veggies",
        "Snack: Dry fruits / protein shake",
        "Dinner: Pasta/chapati with paneer/veg curry",
        "Before Bed: Warm milk with honey"
      ],
      "Normal weight": [
        "Breakfast: Eggs, toast, fruits",
        "Mid-Morning: Seasonal fruit",
        "Lunch: Quinoa/brown rice + dal + salad",
        "Snack: Handful of nuts",
        "Dinner: Chapati + dal + veggies",
        "Before Bed: Herbal tea"
      ],
      "Overweight": [
        "Breakfast: Oatmeal + apple",
        "Mid-Morning: Buttermilk / fruit",
        "Lunch: Salad bowl with lean protein",
        "Snack: Roasted chana, sprouts",
        "Dinner: Soup + grilled veggies + chapati",
        "Before Bed: Green tea"
      ],
      "Obesity": [
        "Breakfast: Veg omelet / smoothie",
        "Mid-Morning: Apple / pear",
        "Lunch: Steamed veggies + dal/soup",
        "Snack: Nuts in small portions",
        "Dinner: Veg soup + chapati",
        "Before Bed: Herbal tea (no sugar)"
      ]
    };

    let y = 65;
    plans[lastCategory].forEach((meal, i) => {
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
