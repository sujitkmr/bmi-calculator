document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  const resultContainer = document.getElementById("result-container");
  const resultBadge = document.getElementById("result-badge");
  const resultText = document.getElementById("result-text");
  const progressBar = document.getElementById("progress-bar");
  const suggestionBox = document.getElementById("suggestion-box");
  const suggestionTitle = document.getElementById("suggestion-title");
  const suggestionList = document.getElementById("suggestion-list");
  const toggleBtn = document.getElementById("toggle-suggestions");
  const toggleIcon = document.getElementById("toggle-icon");

  if (bmiForm) {
    const tips = {
      "Underweight": {
        color: "#fbbf24", // yellow/amber
        list: [
          "Add calorie-dense, nutritious foods.",
          "Eat small meals more frequently.",
          "Incorporate strength training."
        ]
      },
      "Normal weight": {
        color: "#22c55e", // green
        list: [
          "Maintain a balanced diet with whole foods.",
          "Stay active 150+ minutes/week.",
          "Keep tracking your progress."
        ]
      },
      "Overweight": {
        color: "#f97316", // orange
        list: [
          "Focus on portion control and whole foods.",
          "Add regular cardio and resistance training.",
          "Limit sugary drinks and ultra-processed foods."
        ]
      },
      "Obesity": {
        color: "#ef4444", // red
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

        // Show result
        resultContainer.style.display = "block";
        resultBadge.textContent = category;
        resultBadge.style.background = tips[category].color;
        resultBadge.style.color = "white";
        resultText.textContent = `Your BMI is ${bmi}`;

        // Progress bar (scale BMI 0–40 → 0–100%)
        let progress = Math.min((bmi / 40) * 100, 100);
        progressBar.style.width = progress + "%";
        progressBar.style.background = tips[category].color;

        // Tips box
        suggestionBox.style.display = 'block';
        suggestionList.style.display = 'none';
        toggleIcon.textContent = '▼';

        // Apply background & text color dynamically
        const bgColor = tips[category].color;
        suggestionBox.style.background = bgColor;

        if (category === "Underweight") {
          // Yellow → dark text
          suggestionBox.style.color = "#222";
          suggestionTitle.style.color = "#222";
        } else {
          // Green, orange, red → white text
          suggestionBox.style.color = "white";
          suggestionTitle.style.color = "white";
        }

        // Fill tips
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
  }

  // Footer current time
  const timeEl = document.getElementById("current-time");
  function updateTime(){
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = now.toLocaleString();
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active"); // keep consistent with CSS
    });
  }
});
