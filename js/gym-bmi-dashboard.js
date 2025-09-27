// gym-bmi-dashboard.js - Fully Dynamic BMI Report Generator

function generateBMIReport() {
  const savedData = JSON.parse(localStorage.getItem("latestBMIData"));
  if (!savedData) {
    alert("No BMI data available. Please calculate your BMI first.");
    return;
  }

  const { name, age, gender, weight, height } = savedData;

  if (!height || !weight || !age || !gender) {
    alert("Incomplete BMI data. Please ensure height, weight, age, and gender are provided.");
    return;
  }

  const testDate = new Date().toLocaleString();

  // ====== DYNAMIC CALCULATIONS ======
  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity";

  // All other calculations remain the same...
  const targetWeight = (22 * heightM * heightM).toFixed(1);
  const bodyFatPercent = gender === "Male"
    ? (1.2 * bmi + 0.23 * age - 16.2).toFixed(1)
    : (1.2 * bmi + 0.23 * age - 5.4).toFixed(1);

  const fatMass = ((bodyFatPercent / 100) * weight).toFixed(1);
  const muscleMass = (weight * 0.55).toFixed(1);
  const totalBodyWater = (weight * 0.6).toFixed(1);
  const protein = (weight * 0.16).toFixed(1);
  const minerals = (weight * 0.04).toFixed(1);
  const waistHipRatio = (0.8 + bmi / 100).toFixed(2);
  const visceralFatLevel = (bmi / 2.5).toFixed(1);

  const bmr = gender === "Male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * 1.4);
  const obesityDegree = ((bmi / 22) * 100).toFixed(1);
  const score = Math.max(0, Math.min(100, Math.round(100 - Math.abs(bmi - 22) * 3)));
  const weightControl = (weight - targetWeight).toFixed(1);
  const fatControl = (fatMass - targetWeight * 0.18).toFixed(1);

  // ====== BUILD HTML ======
  const container = document.getElementById("bmi-dashboard");
  if (!container) return;

  container.style.display = "block";
  container.innerHTML = `
    <h2>GYM||BMI - Body Mass Report</h2>
    <p><strong>Name:</strong> ${name} | <strong>Age:</strong> ${age} | <strong>Gender:</strong> ${gender} | <strong>Date:</strong> ${testDate}</p>
    <p><strong>Height:</strong> ${height} cm | <strong>Weight:</strong> ${weight} kg | <strong>BMI:</strong> ${bmi} | <strong>Category:</strong> ${category}</p>
    <p><strong>Body Composition Score:</strong> ${score} / 100</p>

    <h3>Body Composition Analysis</h3>
    <ul>
      <li>Total Body Water: ${totalBodyWater} kg</li>
      <li>Protein: ${protein} kg</li>
      <li>Minerals: ${minerals} kg</li>
      <li>Body Fat Mass: ${fatMass} kg</li>
      <li>Total Weight: ${weight} kg</li>
    </ul>

    <h3>Muscle-Fat Analysis</h3>
    <ul>
      <li>Weight: ${weight} kg</li>
      <li>Skeletal Muscle Mass: ${muscleMass} kg</li>
      <li>Body Fat Mass: ${fatMass} kg</li>
    </ul>

    <h3>Obesity Analysis</h3>
    <ul>
      <li>BMI: ${bmi}</li>
      <li>PBF: ${bodyFatPercent}%</li>
      <li>Waist-Hip Ratio: ${waistHipRatio}</li>
      <li>Visceral Fat Level: ${visceralFatLevel}</li>
    </ul>

    <h3>Weight Control Goals</h3>
    <ul>
      <li>Target Weight: ${targetWeight} kg</li>
      <li>Weight to Reduce: ${weightControl} kg</li>
      <li>Fat to Reduce: ${fatControl} kg</li>
    </ul>

    <h3>Research Parameters</h3>
    <ul>
      <li>BMR: ${Math.round(bmr)} kcal/day</li>
      <li>Obesity Degree: ${obesityDegree} %</li>
      <li>TDEE: ${tdee} kcal/day</li>
    </ul>
  `;

  container.scrollIntoView({ behavior: "smooth" });
}

// Auto-generate report on page load if data exists
document.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem("latestBMIData"));
  if (savedData) generateBMIReport();
});


// Auto-generate report on page load if data exists
document.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem("latestBMIData"));
  if (savedData) generateBMIReport();
});
