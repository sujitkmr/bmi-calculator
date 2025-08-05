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

    // Apply color to suggestion title and border
    suggestionTitle.style.color = color;
    suggestionBox.style.borderLeft = `5px solid ${color}`;

    // Inject suggestions
    suggestionList.innerHTML = suggestions.map(tip => `<li>${tip}</li>`).join('');
    suggestionBox.style.display = 'block';
    suggestionList.style.display = 'none';
    document.getElementById('toggle-icon').textContent = '▼';
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
