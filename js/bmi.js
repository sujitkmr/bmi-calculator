// bmi.js - BMI Calculator + PDF Report + Tracker + Diet
document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  if (!bmiForm) return;

  const resultContainer = document.getElementById("result-container");
  const resultBadge = document.getElementById("result-badge");
  const resultText = document.getElementById("result-text");
  const progressBar = document.getElementById("progress-bar");

  const downloadButtons = document.getElementById("download-buttons");
  const downloadReport = document.getElementById("download-report");
  const downloadTracker = document.getElementById("download-tracker");
  const downloadDiet = document.getElementById("download-diet");

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

  // Show download buttons
  function showDownloads() {
    if (downloadButtons) downloadButtons.style.display = "flex";
  }

  // Update UI after BMI calculation
  function updateUI(bmi, category) {
    resultContainer.style.display = "block";
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

    showDownloads();
  }

  // BMI form submit
  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    lastName = document.getElementById("name")?.value.trim() || "User";
    localStorage.setItem("userName", lastName);

    const genderInput = document.querySelector('input[name="Gender"]:checked');
    lastGender = genderInput ? genderInput.value : "Not specified";

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
            resultContainer.style.display = "none";
            progressBar.style.width = "0%";
            if (downloadButtons) downloadButtons.style.display = "none";
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
        "Lunch: Brown rice/quinoa, lean protein, lots of vegetables",
        "Snack: Nuts or sprouts salad",
        "Dinner: Grilled fish/chicken with steamed vegetables",
        "Before Bed: Herbal tea or warm water"
      ],
      "Obesity": [
        "Breakfast: Vegetable omelette or Greek yogurt with fruits",
        "Mid-Morning: Fresh vegetables or green tea",
        "Lunch: Salad with lean protein and minimal carbs",
        "Snack: Nuts, seeds, or vegetable sticks",
        "Dinner: Light soup with grilled veggies or fish",
        "Before Bed: Warm water or herbal tea"
      ]
    };

    let y = 60;
    genericDietPlans[lastCategory].forEach((item, i) => {
      if (y + i * 10 > 270) {
        doc.addPage();
        addHeaderFooter(doc, "Personalized Diet Plan");
        y = 30;
      }
      doc.text(`- ${item}`, 25, y + i * 10);
    });

    doc.save("Diet_Plan_by_GYMBMI.pdf");
  }

  // Event Listeners
  if (downloadReport) downloadReport.addEventListener("click", generateBMIReport);
  if (downloadTracker) downloadTracker.addEventListener("click", generateHealthTracker);
  if (downloadDiet) downloadDiet.addEventListener("click", generateDietPlan);
});
