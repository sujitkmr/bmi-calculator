// healthTracker.js
// Handles BMI Health Tracker Excel download

function generateHealthTracker() {
  if (typeof lastBMI === 'undefined' || !lastBMI) {
    alert("Please calculate BMI first!");
    return;
  }
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const targetWeight = +(22 * (height / 100) ** 2).toFixed(1);
  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity";

  const ws_data = [
    ["Date", "Weight (kg)", "Height (cm)", "BMI", "BMI Category", "Target Weight (kg)"],
  ];
  const today = new Date();
  ws_data.push([today.toISOString().split("T")[0], weight, height, bmi, category, targetWeight]);

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BMI Tracker");
  XLSX.writeFile(wb, "BMI_Health_Tracker_by_GYMBMI.xlsx");
}

window.generateHealthTracker = generateHealthTracker;

