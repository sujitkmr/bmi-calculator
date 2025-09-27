document.addEventListener("DOMContentLoaded", () => {
  // Load latest BMI data from localStorage
  const latestData = JSON.parse(localStorage.getItem("latestBMIData"));

  if (latestData) {
    document.getElementById("user-name").textContent = latestData.name;
    document.getElementById("user-age").textContent = latestData.age;
    document.getElementById("user-gender").textContent = latestData.gender;
    document.getElementById("generated-date").textContent = latestData.currentDate;

  } else {
    console.warn("No BMI data found in localStorage!");
  }
});
