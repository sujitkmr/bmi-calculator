// bodyUI.js - Handles "Your Body Visualization" panel

document.addEventListener("DOMContentLoaded", () => {
  const bodyUI = {
    bmi: document.getElementById("viz-bmi"),
    fat: document.getElementById("viz-fat"),
    muscle: document.getElementById("viz-muscle"),
    water: document.getElementById("viz-water"),
    bone: document.getElementById("viz-bone"),
  };

  // store previous values for comparison arrows
  let prevData = { fat: null, muscle: null, water: null, bone: null };

  // update function
  function updateBodyUI(data) {
    if (!data) return;

    // BMI
    if (bodyUI.bmi) bodyUI.bmi.textContent = `BMI: ${data.bmi.toFixed(1)} (${data.category})`;

    // Fat %
    if (bodyUI.fat) bodyUI.fat.innerHTML = compareChange("Fat", data.fat.toFixed(1), prevData.fat);

    // Muscle %
    if (bodyUI.muscle) bodyUI.muscle.innerHTML = compareChange("Muscle", data.muscle.toFixed(1), prevData.muscle);

    // Water %
    if (bodyUI.water) bodyUI.water.innerHTML = compareChange("Water", data.water.toFixed(1), prevData.water);

    // Bone Mass
    if (bodyUI.bone) bodyUI.bone.innerHTML = compareChange("Bone", data.bone.toFixed(1), prevData.bone);

    // Save as previous
    prevData = { fat: data.fat, muscle: data.muscle, water: data.water, bone: data.bone };
  }

  // helper to show arrows for change
  function compareChange(label, current, previous) {
    if (previous === null) return `${label}: ${current}`;
    if (current > previous) return `${label}: ${current} 🔼`;
    if (current < previous) return `${label}: ${current} 🔽`;
    return `${label}: ${current} ➖`;
  }

  // listen for custom event from bmiReport.js
  document.addEventListener("updateBodyUI", (e) => {
    updateBodyUI(e.detail);
  });

  // clear event
  document.addEventListener("clearBodyUI", () => {
    Object.values(bodyUI).forEach(el => {
      if (el) el.textContent = "--";
    });
    prevData = { fat: null, muscle: null, water: null, bone: null };
  });

  // auto-update if global BMI data already exists
  if (window.latestBMIData) {
    updateBodyUI(window.latestBMIData);
  }
});
