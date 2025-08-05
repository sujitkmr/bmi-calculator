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

    // Reset timer if already running
    if (window.popupTimer) clearTimeout(window.popupTimer);

    // Start 30-second timer only if suggestions shown
    if (suggestionBox.style.display === 'block') {
      window.popupTimer = setTimeout(() => {
        showThankYouPopup();
      }, 30000);//30 sec
    }

  } else {
    resultDiv.textContent = 'Please enter valid height and weight!';
    resultDiv.style.color = '#e74c3c';
    suggestionBox.style.display = 'none';
  }
});

function toggleSuggestions() {
  const list = document.getElementById('suggestion-list');
  const icon = document.getElementById('toggle-icon');
  if (list.style.display === 'none') {
    list.style.display = 'block';
    icon.textContent = '▲';
  } else {
    list.style.display = 'none';
    icon.textContent = '▼';
  }
}

function updateDateTime() {
  const now = new Date();
  const timeString = now.toLocaleString();
  document.getElementById('current-time').textContent = timeString;
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Show Thank You Popup
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

  // Handle star click effect
  const stars = popup.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.style.color = '#ccc'; // white/gray by default
    star.addEventListener('click', () => {
      stars.forEach((s, i) => {
        s.style.color = i <= index ? 'gold' : '#ccc';
      });
    });
  });

  // Auto-close popup in 10 seconds
  window.autoClosePopup = setTimeout(() => {
    closeThankYouPopup();
  }, 30000);//10 sec
}

function closeThankYouPopup() {
  const popup = document.querySelector('.thankyou-popup');
  if (popup) popup.remove();
  clearTimeout(window.autoClosePopup);
}
