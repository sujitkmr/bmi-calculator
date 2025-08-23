// bmi.js - BMI Calculator, Tips Toggle, and Downloads
document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  if (!bmiForm) return;

  const resultContainer = document.getElementById("result-container");
  const resultBadge = document.getElementById("result-badge");
  const resultText = document.getElementById("result-text");
  const progressBar = document.getElementById("progress-bar");
  const suggestionBox = document.getElementById("suggestion-box");
  const suggestionTitle = document.getElementById("suggestion-title");
  const suggestionList = document.getElementById("suggestion-list");
  const toggleBtn = document.getElementById("toggle-suggestions");
  const toggleIcon = document.getElementById("toggle-icon");

  // ✅ New: download buttons
  const downloadButtons = document.getElementById("download-buttons");
  const downloadReport = document.getElementById("download-report");
  const downloadTracker = document.getElementById("download-tracker");
  const downloadDiet = document.getElementById("download-diet");

  const tips = {
    "Underweight": {
      color: "#fbbf24",
      list: [
        "Add calorie-dense, nutritious foods.",
        "Eat small meals more frequently.",
        "Incorporate strength training."
      ]
    },
    "Normal weight": {
      color: "#22c55e",
      list: [
        "Maintain a balanced diet with whole foods.",
        "Stay active 150+ minutes/week.",
        "Keep tracking your progress."
      ]
    },
    "Overweight": {
      color: "#f97316",
      list: [
        "Focus on portion control and whole foods.",
        "Add regular cardio and resistance training.",
        "Limit sugary drinks and ultra-processed foods."
      ]
    },
    "Obesity": {
      color: "#ef4444",
      list: [
        "Adopt a sustainable calorie deficit.",
        "Increase daily movement and structured exercise.",
        "Consult a healthcare professional."
      ]
    }
  };

  let lastBMI = null;
  let lastCategory = null;

  // ✅ BMI calculation
  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (height > 0 && weight > 0) {
      const h = height / 100;
      const bmi = +(weight / (h * h)).toFixed(2);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obesity';

      lastBMI = bmi;
      lastCategory = category;

      resultContainer.style.display = "block";
      resultBadge.textContent = category;
      resultBadge.style.background = tips[category].color;
      resultBadge.style.color = "white";
      resultText.textContent = `Your BMI is ${bmi}`;

      progressBar.style.width = Math.min((bmi / 40) * 100, 100) + "%";
      progressBar.style.background = tips[category].color;

      suggestionBox.style.display = 'block';
      suggestionList.style.display = 'none';
      toggleIcon.textContent = '▼';
      suggestionBox.style.background = tips[category].color;
      suggestionBox.style.color = category === "Underweight" ? "#222" : "white";
      suggestionTitle.style.color = category === "Underweight" ? "#222" : "white";
      suggestionList.innerHTML = tips[category].list.map(t => `<li>${t}</li>`).join('');

      // ✅ Show download buttons after result
      if (downloadButtons) downloadButtons.style.display = "block";
    } else {
      resultText.textContent = 'Please enter valid height and weight!';
      resultText.style.color = '#ef4444';
      resultContainer.style.display = "none";
      suggestionBox.style.display = 'none';
      if (downloadButtons) downloadButtons.style.display = "none";
    }
  });

  // ✅ Toggle suggestions
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (suggestionList.style.display === "none") {
        suggestionList.style.display = "block";
        toggleIcon.textContent = '▲';
      } else {
        suggestionList.style.display = "none";
        toggleIcon.textContent = '▼';
      }
    });
  }

  // ======================
  // ✅ DOWNLOAD HANDLERS
  // ======================

  // 1. BMI Report PDF
  if (downloadReport) {
    downloadReport.addEventListener("click", () => {
      if (!lastBMI || !lastCategory) return alert("Please calculate BMI first!");

      const jsPDF = window.jspdf.jsPDF;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("BMI Report", 20, 20);
      doc.setFontSize(12);
      doc.text(`Your BMI: ${lastBMI}`, 20, 40);
      doc.text(`Category: ${lastCategory}`, 20, 50);
      doc.text("Tips:", 20, 70);
      tips[lastCategory].list.forEach((t, i) => {
        doc.text(`- ${t}`, 25, 80 + i * 10);
      });

      doc.save("BMI_Report.pdf");
    });
  }

  // 2. Health Tracker Excel
  if (downloadTracker) {
    downloadTracker.addEventListener("click", () => {
      const header = ["Day", "Weight", "Steps", "Calories Intake", "Water Intake", "Notes"];
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = [header, ...days.map(d => [d, "", "", "", "", ""])];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tracker");

      XLSX.writeFile(wb, "Health_Tracker.xlsx");
    });
  }

  // 3. Diet Plan PDF
  if (downloadDiet) {
    downloadDiet.addEventListener("click", () => {
      if (!lastCategory) return alert("Please calculate BMI first!");

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Diet Plan", 20, 20);
      doc.setFontSize(12);
      doc.text(`Category: ${lastCategory}`, 20, 40);

      let diet = [];
      if (lastCategory === "Underweight") {
        diet = [
          "Eat calorie-dense foods (nuts, dairy, rice).",
          "Add protein shakes or smoothies.",
          "Have frequent meals (5–6 times/day)."
        ];
      } else if (lastCategory === "Normal weight") {
        diet = [
          "Maintain a balanced plate (carbs, proteins, fats).",
          "Stay hydrated.",
          "Continue regular exercise."
        ];
      } else if (lastCategory === "Overweight") {
        diet = [
          "Focus on calorie deficit.",
          "Eat more vegetables and lean protein.",
          "Avoid sugar-sweetened drinks."
        ];
      } else {
        diet = [
          "Avoid fried and processed foods.",
          "Eat high-fiber, low-calorie meals.",
          "Consult a dietitian for a structured plan."
        ];
      }

      doc.text("Diet Recommendations:", 20, 60);
      diet.forEach((d, i) => {
        doc.text(`- ${d}`, 25, 70 + i * 10);
      });

      doc.save("Diet_Plan.pdf");
    });
  }
});
