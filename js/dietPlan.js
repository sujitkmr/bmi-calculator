// dietPlan.js - Dynamic Personalized Diet Plan Report
function generateDietPlan() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ====== USER DATA ======
  const name = window.lastName || "User";
  const age = parseFloat(window.lastAge) || 25;
  const gender = window.lastGender || "N/A";
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const bmi = window.lastBMI || parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
  let category = window.lastCategory || "N/A";
  const testDate = new Date().toLocaleString();

  if (!height || !weight || gender === "N/A") {
    alert("Please enter valid height, weight, and gender before generating the diet plan.");
    return;
  }

  // ====== CATEGORY DETECTION (safe fallback) ======
  if (category === "N/A") {
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";
  }

  // ====== CALCULATIONS ======
  const heightM = height / 100;

  // BMR
  const bmr =
    gender === "Male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // TDEE
  const tdee = bmr * 1.4; // Lightly active default

  // Goal adjustment
  let goalCalories = tdee;
  if (category === "Underweight") goalCalories += 300;
  else if (category === "Overweight") goalCalories -= 300;
  else if (category === "Obese") goalCalories -= 500;
  goalCalories = Math.round(goalCalories);

  // Macro calculations
  const carbs = Math.round((goalCalories * 0.50) / 4); // 4 kcal per gram
  const protein = Math.round((goalCalories * 0.25) / 4);
  const fat = Math.round((goalCalories * 0.25) / 9); // 9 kcal per gram

  // Target weight for BMI 22
  const targetWeight = (22 * (heightM * heightM)).toFixed(1);

  // Weekly progress estimate
  const calorieDeficit = tdee - goalCalories;
  const weeklyWeightChange = (calorieDeficit * 7) / 7700; // 7700 kcal = 1kg fat

  // ====== PAGE LAYOUT SETTINGS ======
  let y = 70;
  const lineGap = 14;

  const newPage = () => {
    doc.addPage();
    y = 50;
  };

  // ====== HEADER ======
  doc.setFillColor("#1d3557");
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("GYM‖BMI - Personalized Diet Plan", pageWidth / 2, 30, { align: "center" });
  doc.setTextColor("#000");

  // ====== USER SUMMARY BOX ======
  doc.setFontSize(10);
  doc.setDrawColor(180);
  doc.rect(40, y, pageWidth - 80, 60);
  doc.text(`Name: ${name}`, 50, y + 15);
  doc.text(`Age: ${age}`, 250, y + 15);
  doc.text(`Gender: ${gender}`, 400, y + 15);

  doc.text(`BMI: ${bmi} (${category})`, 50, y + 35);
  doc.text(`Current Weight: ${weight} kg`, 250, y + 35);
  doc.text(`Target Weight: ${targetWeight} kg`, 400, y + 35);

  doc.text(`BMR: ${Math.round(bmr)} kcal/day`, 50, y + 55);
  doc.text(`TDEE: ${Math.round(tdee)} kcal/day`, 250, y + 55);
  doc.text(`Calorie Goal: ${goalCalories} kcal/day`, 400, y + 55);
  y += 80;

  // ====== MACRO BREAKDOWN ======
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Daily Macro Goals", 40, y);
  y += lineGap;
  doc.setFont("helvetica", "normal");
  doc.setDrawColor(200);
  doc.rect(40, y, pageWidth - 80, 50);
  y += 15;
  doc.text(`Carbohydrates: ${carbs} g (50%)`, 50, y);
  doc.text(`Protein: ${protein} g (25%)`, 250, y);
  doc.text(`Fats: ${fat} g (25%)`, 420, y);
  y += 40;

  // ====== MEAL PLAN ======
  if (y > pageHeight - 200) newPage();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Personalized Meal Plan", 40, y);
  y += lineGap;

  const mealPlans = {
    "Underweight": [
      ["Breakfast", "Oats + Milk + Almonds + Banana", "400"],
      ["Mid-Morning", "Peanut Butter Shake / Smoothie", "250"],
      ["Lunch", "Rice + Chicken/Fish + Veggies", "600"],
      ["Snack", "Dry Fruits / High-calorie shake", "250"],
      ["Dinner", "Chapati + Paneer / Veg Curry", "500"],
      ["Bedtime", "Warm Milk + Honey", "150"],
    ],
    "Normal": [
      ["Breakfast", "Eggs + Wholegrain Toast + Fruits", "350"],
      ["Mid-Morning", "Seasonal Fruit", "150"],
      ["Lunch", "Brown Rice + Dal + Salad + Veggies", "500"],
      ["Snack", "Handful of Nuts", "150"],
      ["Dinner", "Chapati + Dal + Veggies", "400"],
      ["Bedtime", "Herbal Tea", "50"],
    ],
    "Overweight": [
      ["Breakfast", "Oatmeal + Apple", "300"],
      ["Mid-Morning", "Buttermilk / Fruit", "100"],
      ["Lunch", "Salad + Soup + Chapati", "400"],
      ["Snack", "Roasted Chana + Green Tea", "150"],
      ["Dinner", "Soup + Grilled Veggies", "300"],
      ["Bedtime", "Green Tea", "50"],
    ],
    "Obese": [
      ["Breakfast", "Veg Omelet / Smoothie", "250"],
      ["Mid-Morning", "Apple / Pear", "100"],
      ["Lunch", "Steamed Veggies + Dal/Soup", "300"],
      ["Snack", "Nuts (small portion)", "100"],
      ["Dinner", "Soup + Chapati + Salad", "250"],
      ["Bedtime", "Herbal Tea (no sugar)", "50"],
    ],
  };

  // Table Header
  doc.setFillColor("#f0f0f0");
  doc.rect(40, y, pageWidth - 80, 20, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Meal", 50, y + 14);
  doc.text("Foods", 180, y + 14);
  doc.text("Calories", 460, y + 14);
  y += 25;

  doc.setFont("helvetica", "normal");
  if (mealPlans[category]) {
    mealPlans[category].forEach((meal) => {
      doc.rect(40, y - 10, pageWidth - 80, 20);
      doc.text(meal[0], 50, y + 4);
      doc.text(meal[1], 180, y + 4);
      doc.text(meal[2], 460, y + 4, { align: "right" });
      y += 20;
    });
    y += 15;
  } else {
    doc.text("⚠ No meal plan available for this BMI category.", 50, y);
    y += 25;
  }

  // ====== EXPECTED PROGRESS ======
  if (y > pageHeight - 150) newPage();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Expected Progress", 40, y);
  y += lineGap;
  doc.setFont("helvetica", "normal");

  const safeChange = weeklyWeightChange !== 0 ? weeklyWeightChange : 0.45;
  const weeksRequired = Math.abs(weight - targetWeight) / Math.abs(safeChange);

  doc.text(`Expected Weekly Change: ${weeklyWeightChange.toFixed(2)} kg`, 50, y);
  y += lineGap;
  doc.text(`Estimated Duration to Reach Goal: ${Math.round(weeksRequired)} weeks`, 50, y);
  y += 25;

  // ====== LIFESTYLE RECOMMENDATIONS ======
  if (y > pageHeight - 150) newPage();
  doc.setFont("helvetica", "bold");
  doc.text("Lifestyle Recommendations", 40, y);
  y += lineGap;
  doc.setFont("helvetica", "normal");

  const tips = {
    "Underweight": [
      "Eat calorie-dense foods like nuts, avocados, whole grains.",
      "Include strength training 3x per week to build lean muscle.",
      "Drink smoothies and shakes between meals.",
    ],
    "Normal": [
      "Maintain a balanced diet with portion control.",
      "Include at least 30 min of physical activity daily.",
      "Track weight weekly to prevent sudden changes.",
    ],
    "Overweight": [
      "Avoid sugary drinks and deep-fried foods.",
      "Walk or cycle for 45 min daily.",
      "Eat high-fiber foods to stay full longer.",
    ],
    "Obese": [
      "Avoid processed sugar and junk food.",
      "Walk 60 minutes daily or do light cardio.",
      "Consult a nutritionist for a detailed plan.",
    ],
  };

  if (tips[category]) {
    tips[category].forEach((tip, index) => {
      doc.text(`• ${tip}`, 50, y + index * lineGap);
    });
    y += tips[category].length * lineGap + 20;
  }

  // ====== ACTIVITY CALORIE GUIDE ======
  if (y > pageHeight - 150) newPage();
  doc.setFont("helvetica", "bold");
  doc.text("Activity Calorie Guide (per hour)", 40, y);
  y += lineGap;

  const activityData = [
    ["Walking", Math.round(weight * 0.03 * 60) + " kcal"],
    ["Running", Math.round(weight * 0.07 * 60) + " kcal"],
    ["Cycling", Math.round(weight * 0.06 * 60) + " kcal"],
    ["Swimming", Math.round(weight * 0.065 * 60) + " kcal"],
    ["Yoga", Math.round(weight * 0.025 * 60) + " kcal"],
  ];

  activityData.forEach((activity) => {
    doc.text(activity[0], 50, y);
    doc.text(activity[1], 300, y);
    y += lineGap;
  });

  // ======  FOOTER ======
  doc.setDrawColor(180);
  doc.line(40, pageHeight - 40, pageWidth - 40, pageHeight - 40);
  doc.setFontSize(7);
  doc.setTextColor("#666");
  doc.text("Confidential | Generated by gymbmi.com", 40, pageHeight - 25);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 40, pageHeight - 25, { align: "right" });

  // ====== SAVE FILE ======
  doc.save(`Diet_Plan_${name}.pdf`);
}

window.generateDietPlan = generateDietPlan;
