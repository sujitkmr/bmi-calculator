// bmiReport.js - Generate Styled BMI Report PDF
function generateBMIReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ====== USER DATA FROM GLOBALS ======
  const name = window.lastName || "User";
  const dob = window.lastDOB || "N/A";
  const age = window.lastAge || "N/A";
  const gender = window.lastGender || "N/A";
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const bmi = window.lastBMI || 0;
  const category = window.lastCategory || "N/A";

  // ====== DERIVED METRICS ======
  const heightM = height / 100;
  const targetWeight = (22 * (heightM * heightM)).toFixed(1); // Normal BMI mid point
  const bmr = gender === "Male"
    ? (10 * weight + 6.25 * height - 5 * age + 5)
    : (10 * weight + 6.25 * height - 5 * age - 161);
  const tdee = bmr * 1.4;

  const waistHeightRatio = (height ? (0.45).toFixed(2) : "N/A");
  const visceralFat = (bmi / 2.5).toFixed(1);
  const bodyFat = gender === "Male"
    ? (1.2 * bmi + 0.23 * age - 16.2).toFixed(1) + "%"
    : (1.2 * bmi + 0.23 * age - 5.4).toFixed(1) + "%";
  const muscleMass = (weight * 0.55).toFixed(1) + " kg";
  const waterWeight = (weight * 0.6).toFixed(1) + " kg";

  const tips = window.tips?.[category]?.list || ["Maintain healthy lifestyle"];

  // ====== COLORS ======
  const categoryColors = {
    "Underweight": "#f39c12",
    "Normal weight": "#2ecc71",
    "Overweight": "#f97316",
    "Obesity": "#e74c3c",
  };
  const catColor = categoryColors[category] || "#999";

  // ====== HEADER BAR ======
  doc.setFillColor("#1d3557");
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("GYM‖BMI - Personal BMI Health Report", pageWidth / 2, 32, { align: "center" });

  let y = 80;
  doc.setFontSize(12);
  doc.setTextColor("#000000");

  // ====== PERSONAL INFO ======
  doc.setFont("helvetica", "bold");
  doc.text("Personal Information", 40, y); y += 16;
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.rect(40, y, pageWidth - 80, 60);
  doc.text(`Name: ${name}`, 50, y + 20);
  doc.text(`Gender: ${gender}`, 280, y + 20);
  doc.text(`DOB: ${dob}`, 50, y + 40);
  doc.text(`Age: ${age}`, 280, y + 40);
  doc.text(`Height: ${height} cm`, 50, y + 60);
  doc.text(`Weight: ${weight} kg`, 280, y + 60);
  y += 90;

  // ====== BMI SUMMARY ======
  doc.setFont("helvetica", "bold");
  doc.text("BMI Summary", 40, y); y += 16;
  doc.setDrawColor(200);
  doc.rect(40, y, pageWidth - 80, 40);
  doc.text(`BMI: ${bmi}`, 50, y + 25);
  doc.setFillColor(catColor);
  doc.setTextColor("#ffffff");
  doc.rect(200, y, 200, 40, "F");
  doc.text(`Category: ${category}`, 210, y + 25);
  doc.setTextColor("#000000");
  y += 70;

  // ====== BODY COMPOSITION ======
  doc.setFont("helvetica", "bold");
  doc.text("Body Composition", 40, y); y += 16;
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(200);
  doc.rect(40, y, pageWidth - 80, 50);
  doc.text(`Body Fat: ${bodyFat}`, 50, y + 20);
  doc.text(`Muscle Mass: ${muscleMass}`, 280, y + 20);
  doc.text(`Water Weight: ${waterWeight}`, 50, y + 40);
  doc.text(`Target Weight: ${targetWeight} kg`, 280, y + 40);
  y += 80;

  // ====== ENERGY & METABOLISM ======
  doc.setFont("helvetica", "bold");
  doc.text("Energy & Metabolism", 40, y); y += 16;
  doc.setDrawColor(200);
  doc.rect(40, y, pageWidth - 80, 50);
  doc.text(`BMR: ${Math.round(bmr)} kcal/day`, 50, y + 20);
  doc.text(`TDEE: ${Math.round(tdee)} kcal/day`, 280, y + 20);
  doc.text(`Waist/Height: ${waistHeightRatio}`, 50, y + 40);
  doc.text(`Visceral Fat: ${visceralFat}`, 280, y + 40);
  y += 80;

  // ====== HEALTH ANALYSIS ======
  doc.setFont("helvetica", "bold");
  doc.text("Health Analysis", 40, y); y += 16;
  const analysis = {
    "Underweight": "You are under the healthy BMI range. Increase calorie intake and consult a nutritionist.",
    "Normal weight": "Your BMI is within the healthy range. Maintain your current lifestyle and habits.",
    "Overweight": "You are above the healthy BMI range. Add regular exercise and reduce calorie-dense foods.",
    "Obesity": "You are in the obesity range. Please consult a doctor and follow a strict fitness plan."
  };
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(analysis[category] || "", pageWidth - 80), 40, y);
  y += 50;

  // ====== TIPS ======
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Tips", 40, y); y += 20;
  doc.setFont("helvetica", "normal");
  tips.forEach((tip, i) => {
    doc.text(`• ${tip}`, 50, y + i * 18);
  });

  // ====== FOOTER ======
  doc.setDrawColor(180);
  doc.line(40, pageHeight - 40, pageWidth - 40, pageHeight - 40);
  doc.setFontSize(8);
  doc.setTextColor("#666666");
  doc.text("Confidential | Generated by gymbmi.com", 40, pageHeight - 25);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 40, pageHeight - 25, { align: "right" });

  doc.save(`BMI_Report_by_GYMBMI.pdf`);
}
