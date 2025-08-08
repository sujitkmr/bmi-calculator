// BMI tips by category
const tips = {
  "Underweight": {
    color: '#3498db',
    list: [
      "🍽️ Eat more frequently with calorie-dense foods",
      "🥜 Include more healthy fats like nuts, seeds, and avocado",
      "🏋️‍♂️ Do strength training to build muscle mass",
      "🛌 Get plenty of rest for recovery",
      "👨‍⚕️ Consult a nutritionist for a weight gain plan"
    ]
  },
  "Normal weight": {
    color: '#2ecc71',
    list: [
      "🥗 Maintain a balanced diet with lean proteins and vegetables",
      "🚶 Stay physically active with at least 30 min of movement daily",
      "💧 Drink enough water and manage stress levels",
      "🧘 Keep a consistent sleep routine and healthy habits"
    ]
  },
  "Overweight": {
    color: '#f39c12',
    list: [
      "🥦 Replace processed food with natural, whole foods",
      "⛹️ Exercise regularly with a mix of cardio and weights",
      "📏 Monitor portion sizes and reduce sugary drinks",
      "👨‍⚕️ Talk to a health coach or join a fitness plan"
    ]
  },
  "Obesity": {
    color: '#e74c3c',
    list: [
      "🥗 Eat more fruits, vegetables, and lean proteins",
      "🚶 Walk or exercise at least 30 minutes daily",
      "💧 Drink 2–3 liters of water per day",
      "🛌 Get 7–8 hours of quality sleep",
      "📋 Track your calories and progress weekly",
      "👩‍⚕️ Consult a doctor or dietitian if needed"
    ]
  }
};

// BMI calculator logic
document.getElementById('bmi-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const resultDiv = document.getElementById('result');
  const suggestionBox = document.getElementById('suggestions');
  const suggestionList = document.getElementById('suggestion-list');
  const suggestionTitle = document.getElementById('suggestion-title');

  if (height > 0 && weight > 0) {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    const color = tips[category].color;
    const suggestions = tips[category].list;

    resultDiv.textContent = `Your BMI is ${bmi} (${category})`;
    resultDiv.style.color = color;

    suggestionTitle.style.color = color;
    suggestionBox.style.borderLeft = `5px solid ${color}`;
    suggestionList.innerHTML = suggestions.map(tip => `<li>${tip}</li>`).join('');
    suggestionBox.style.display = 'block';
    suggestionList.style.display = 'none';
    document.getElementById('toggle-icon').textContent = '▼';

    if (window.popupTimer) clearTimeout(window.popupTimer);
    window.popupTimer = setTimeout(() => {
      showThankYouPopup();
    }, 30000);
  } else {
    resultDiv.textContent = 'Please enter valid height and weight!';
    resultDiv.style.color = '#e74c3c';
    suggestionBox.style.display = 'none';
  }
});

// Toggle suggestions
function toggleSuggestions() {
  const list = document.getElementById('suggestion-list');
  const icon = document.getElementById('toggle-icon');
  const isOpen = list.style.display === 'block';
  list.style.display = isOpen ? 'none' : 'block';
  icon.textContent = isOpen ? '▼' : '▲';
}

// Clock
function updateDateTime() {
  const now = new Date();
  document.getElementById('current-time').textContent = now.toLocaleString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Thank You Popup
function showThankYouPopup() {
  const popup = document.createElement('div');
  popup.className = 'thankyou-popup';
  popup.style.display = 'flex';
  popup.innerHTML = `
    <div class="thankyou-content">
      <span class="popup-close" onclick="closeThankYouPopup()">×</span>
      <div class="popup-left">
        <h2>🙏 Thank you!</h2>
        <p>How helpful was the BMI tips section?</p>
        <div class="feedback-options">
          <button type="button">😊 Good</button>
          <button type="button">😐 Okay</button>
          <button type="button">🙁 Bad</button>
        </div>
        <div class="star-rating" id="starRating">
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
          <span class="star">★</span>
        </div>
      </div>
      <div class="popup-right">
        <h3>💬 Suggest Improvements</h3>
        <form action="mailto:support@gymbmi.com" method="POST" enctype="text/plain">
          <input type="text" name="Name" placeholder="Your Name" required>
          <input type="tel" name="Mobile" placeholder="Mobile Number" required>
          <input type="email" name="Email" placeholder="Your Email" required>
          <textarea name="Suggestion" placeholder="Your Suggestion" required></textarea>
          <div class="popup-footer">
            <button type="submit">Send</button>
            <button type="button" onclick="closeThankYouPopup()">Close</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  popup.querySelectorAll('.star').forEach((star, index, stars) => {
    star.style.color = '#ccc';
    star.addEventListener('click', () => {
      stars.forEach((s, i) => {
        s.style.color = i <= index ? 'gold' : '#ccc';
      });
    });
  });

  window.autoClosePopup = setTimeout(closeThankYouPopup, 30000);
}

function closeThankYouPopup() {
  const popup = document.querySelector('.thankyou-popup');
  if (popup) popup.remove();
  clearTimeout(window.autoClosePopup);
}

// Modal content map
const modalContent = {
  about: {
    title: "About Us",
    body: "At gymbmi.com, we aim to help individuals stay informed about their health using a simple, effective BMI tool. Our goal is to provide clear, useful data and wellness tips to promote a healthy lifestyle."
  },
  contact: {
    title: "Contact Us",
    body: "Email: contact@gymbmi.com<br>Location: Online, Global"
  },
  privacy: {
    title: "Privacy Policy",
    body: "We respect your privacy. We do not collect personal data. This site may use cookies or third-party services like Google AdSense which may collect information as per their own privacy policies."
  },
  terms: {
    title: "Terms and Conditions",
    body: "By using gymbmi.com, you agree to use the site responsibly and understand that the information provided is for general wellness and not medical advice."
  },
  disclaimer: {
    title: "Disclaimer",
    body: "The BMI calculations provided are for educational purposes only. Always consult a healthcare professional for medical advice."
  }
};

// Open modal with event parameter to prevent link default
function openModal(section, event) {
  if (event) event.preventDefault();

  const modal = document.getElementById("modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");

  if (modalContent[section]) {
    title.textContent = modalContent[section].title;
    body.innerHTML = modalContent[section].body;
    modal.style.display = "flex";
  }
}

// Close modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}
