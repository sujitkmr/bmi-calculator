// bmiReport.js - Advanced Dynamic BMI Report Generator (Compact Layout)
function generateBMIReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ====== USER DATA ======
    const name = window.lastName || "User";
    const dob = window.lastDOB || "N/A";
    const age = parseFloat(window.lastAge) || 25;
    const gender = window.lastGender || "N/A";
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (!height || !weight || !age || gender === "N/A") {
        alert("Please provide height, weight, age, and gender before generating report.");
        return;
    }

    // ====== DYNAMIC CALCULATIONS ======
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    // BMI Category
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    const targetWeight = (22 * heightM * heightM).toFixed(1);

    const bodyFatPercent =
        gender === "Male"
            ? (1.2 * bmi + 0.23 * age - 16.2).toFixed(1)
            : (1.2 * bmi + 0.23 * age - 5.4).toFixed(1);

    const fatMass = ((bodyFatPercent / 100) * weight).toFixed(1);
    const muscleMass = (weight * 0.55).toFixed(1);
    const totalBodyWater = (weight * 0.6).toFixed(1);
    const protein = (weight * 0.16).toFixed(1);
    const minerals = (weight * 0.04).toFixed(1);

    const waistHipRatio = (0.8 + (bmi / 100)).toFixed(2);
    const visceralFatLevel = (bmi / 2.5).toFixed(1);

    const bmr =
        gender === "Male"
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = Math.round(bmr * 1.4);

    const obesityDegree = ((bmi / 22) * 100).toFixed(1);
    const score = Math.max(0, Math.min(100, Math.round(100 - Math.abs(bmi - 22) * 3)));

    const weightControl = (weight - targetWeight).toFixed(1);
    const fatControl = (fatMass - targetWeight * 0.18).toFixed(1);

    // ====== PAGE TRACKING ======
    let y = 70;
    const lineGap = 14; // Compact line spacing
    const newPage = () => { doc.addPage(); y = 50; };

    // ====== HEADER ======
    doc.setFillColor("#1d3557");
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("GYM||BMI - Body Mass Report", pageWidth / 2, 30, { align: "center" });
    doc.setTextColor("#000");

    // ====== PERSONAL DETAILS ======
    doc.setFontSize(9);
    y += 10;
    doc.text(`Name: ${name}`, 40, y);
    doc.text(`Age: ${age}`, 200, y);
    doc.text(`Gender: ${gender}`, 300, y);
    const testDate = new Date();
    doc.text(`Date: ${testDate.toLocaleString()}`, 430, y);
    y += lineGap;

    doc.text(`Height: ${height} cm`, 40, y);
    doc.text(`Weight: ${weight} kg`, 200, y);
    doc.text(`BMI: ${bmi}`, 300, y);
    doc.text(`Category: ${category}`, 430, y);
    y += lineGap + 5;

    // ====== SCORE ======
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Body Composition Score:", 40, y);
    doc.setTextColor("#2ecc71");
    doc.text(`${score} / 100`, 180, y);
    doc.setTextColor("#000");
    y += lineGap + 5;

    // ====== BODY COMPOSITION ANALYSIS ======
    doc.setFont("helvetica", "bold");
    doc.text("Body Composition Analysis", 40, y);
    y += lineGap - 2;
    doc.setDrawColor(200);
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    doc.setFont("helvetica", "normal");

    const compositionData = [
        ["Total Body Water", `${totalBodyWater} kg`],
        ["Protein", `${protein} kg`],
        ["Minerals", `${minerals} kg`],
        ["Body Fat Mass", `${fatMass} kg`],
        ["Total Weight", `${weight} kg`],
    ];
    compositionData.forEach(row => { doc.text(row[0], 50, y); doc.text(row[1], 250, y); y += lineGap; });
    y += 5;

    // ====== MUSCLE-FAT ANALYSIS ======
    if (y > pageHeight - 120) newPage();
    doc.setFont("helvetica", "bold");
    doc.text("Muscle-Fat Analysis", 40, y);
    y += lineGap - 2;
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    doc.setFont("helvetica", "normal");
    doc.text(`Weight: ${weight} kg`, 50, y); y += lineGap;
    doc.text(`Skeletal Muscle Mass: ${muscleMass} kg`, 50, y); y += lineGap;
    doc.text(`Body Fat Mass: ${fatMass} kg`, 50, y); y += lineGap + 5;

    // ====== OBESITY ANALYSIS ======
    if (y > pageHeight - 120) newPage();
    doc.setFont("helvetica", "bold");
    doc.text("Obesity Analysis", 40, y);
    y += lineGap - 2;
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    const obesityData = [
        ["BMI", `${bmi} (18.5 - 24.9)`],
        ["PBF", `${bodyFatPercent}% (Normal: 10% - 20%)`],
        ["Waist-Hip Ratio", `${waistHipRatio} (Normal: 0.80 - 0.90)`],
        ["Visceral Fat Level", visceralFatLevel],
    ];
    obesityData.forEach(row => { doc.text(row[0], 50, y); doc.text(row[1], 250, y); y += lineGap; });
    y += 5;

    // ====== WEIGHT CONTROL ======
    if (y > pageHeight - 120) newPage();
    doc.setFont("helvetica", "bold");
    doc.text("Weight Control Goals", 40, y);
    y += lineGap - 2;
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    doc.setFont("helvetica", "normal");
    doc.text(`Target Weight: ${targetWeight} kg`, 50, y); y += lineGap;
    doc.text(`Weight to Reduce: ${weightControl} kg`, 50, y); y += lineGap;
    doc.text(`Fat to Reduce: ${fatControl} kg`, 50, y); y += lineGap + 5;

    // ====== RESEARCH PARAMETERS ======
    if (y > pageHeight - 120) newPage();
    doc.setFont("helvetica", "bold");
    doc.text("Research Parameters", 40, y);
    y += lineGap - 2;
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    const researchParams = [
        ["BMR (Basal Metabolic Rate)", `${Math.round(bmr)} kcal/day`],
        ["Obesity Degree", `${obesityDegree} %`],
        ["TDEE (Total Daily Energy Expenditure)", `${tdee} kcal/day`],
    ];
    researchParams.forEach(row => { doc.text(row[0], 50, y); doc.text(row[1], 300, y); y += lineGap; });
    y += 5;

    // ====== CALORIE EXPENDITURE ======
    if (y > pageHeight - 150) newPage();
    doc.setFont("helvetica", "bold");
    doc.text("Calorie Expenditure of Exercise (per hour)", 40, y);
    y += lineGap - 2;
    doc.line(40, y, pageWidth - 40, y);
    y += lineGap;
    const calorieData = [
        ["Walking", "149 kcal"], ["Running", "349 kcal"], ["Cycling", "294 kcal"],
        ["Swimming", "323 kcal"], ["Yoga", "129 kcal"], ["Basketball", "216 kcal"],
        ["Jump Rope", "413 kcal"]
    ];
    calorieData.forEach(row => { doc.text(row[0], 50, y); doc.text(row[1], 250, y); y += lineGap; });
    y += 10;

    // ====== FOOTER ======
    doc.setDrawColor(180);
    doc.line(40, pageHeight - 40, pageWidth - 40, pageHeight - 40);
    doc.setFontSize(7);
    doc.setTextColor("#666");
    doc.text("Confidential | Generated by gymbmi.com", 40, pageHeight - 25);
    doc.text(`Generated on ${testDate.toLocaleDateString()}`, pageWidth - 40, pageHeight - 25, { align: "right" });

    // ====== PUSH DATA FOR INSIGHTS ======
    const todayDate = new Date();
    const formattedDate = todayDate.getFullYear() + "-" +
                          String(todayDate.getMonth() + 1).padStart(2, "0") + "-" +
                          String(todayDate.getDate()).padStart(2, "0");

    const reportEntry = {
        date: formattedDate,
        bmi: parseFloat(bmi),
        weight: parseFloat(weight),
        bodyFat: parseFloat(bodyFatPercent),
        category: category
    };

    let insightsData = JSON.parse(localStorage.getItem("bmiInsightsData")) || [];
    insightsData.push(reportEntry);
    localStorage.setItem("bmiInsightsData", JSON.stringify(insightsData));

    // Update charts dynamically
    if (typeof updateInsightsCharts === "function") updateInsightsCharts();

    // ====== SAVE FILE ======
    doc.save(`BMI_Advanced_Report_${name}.pdf`);
}
