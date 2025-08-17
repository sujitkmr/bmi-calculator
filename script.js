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

        // Show result
        resultContainer.style.display = "block";
        resultBadge.textContent = category;
        resultBadge.style.background = tips[category].color;
        resultBadge.style.color = "white";
        resultText.textContent = `Your BMI is ${bmi}`;

        // Progress bar
        let progress = Math.min((bmi / 40) * 100, 100);
        progressBar.style.width = progress + "%";
        progressBar.style.background = tips[category].color;

        // Tips
        suggestionBox.style.display = 'block';
        suggestionList.style.display = 'none';
        toggleIcon.textContent = '▼';

        const bgColor = tips[category].color;
        suggestionBox.style.background = bgColor;
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
  }

  // ✅ Footer current time
  const timeEl = document.getElementById("current-time");
  function updateTime(){
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = now.toLocaleString();
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ✅ Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ✅ Contact form AJAX
  const contactForm = document.getElementById("contact-form");
  const successMsg = document.getElementById("success-msg");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch("https://formsubmit.co/ajax/contactgymbmi@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (successMsg) successMsg.style.display = "block";
        this.reset();
        setTimeout(() => {
          if (successMsg) successMsg.style.display = "none";
        }, 5000);
      })
      .catch(() => alert("❌ Error sending message, please try again."));
    });
  }

  // ✅ Newsletter form AJAX
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch("https://formsubmit.co/ajax/contactgymbmi@gmail.com", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (newsletterSuccess) newsletterSuccess.style.display = "block";
        this.reset();
        setTimeout(() => {
          if (newsletterSuccess) newsletterSuccess.style.display = "none";
        }, 5000);
      })
      .catch(() => alert("❌ Error subscribing, please try again."));
    });
  }
});
