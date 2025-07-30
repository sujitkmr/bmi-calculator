document.getElementById('bmi-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const resultDiv = document.getElementById('result');

  if (height > 0 && weight > 0) {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    let category = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#3498db'; // blue
    } else if (bmi < 24.9) {
      category = 'Normal weight';
      color = '#2ecc71'; // green
    } else if (bmi < 29.9) {
      category = 'Overweight';
      color = '#f39c12'; // orange
    } else {
      category = 'Obesity';
      color = '#e74c3c'; // red
    }

    resultDiv.textContent = `Your BMI is ${bmi} (${category})`;
    resultDiv.style.color = color;
  } else {
    resultDiv.textContent = 'Please enter valid height and weight!';
    resultDiv.style.color = '#e74c3c'; // red for invalid input
  }
});

function updateDateTime() {
  const now = new Date();
  const timeString = now.toLocaleString();
  document.getElementById('current-time').textContent = timeString;
}

setInterval(updateDateTime, 1000);
updateDateTime();
