
// bmi.js - BMI Calculator and Tips Toggle
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
    } else {
      resultText.textContent = 'Please enter valid height and weight!';
      resultText.style.color = '#ef4444';
      resultContainer.style.display = "none";
      suggestionBox.style.display = 'none';
    }
  });

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
});
