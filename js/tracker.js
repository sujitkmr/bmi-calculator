// tracker.js - BMI Progress Tracker with Excel Export Only

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const bmiInput = document.getElementById("bmi-input");
  const dateInput = document.getElementById("date-input");
  const saveBtn = document.getElementById("save-btn");
  const exportBtn = document.getElementById("export-btn"); // Export to Excel
  const clearBtn = document.getElementById("clear-btn");   // optional clear all button
  const ctx = document.getElementById("bmiChart").getContext("2d");

  // Helper: Get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Set default date to today
  if (dateInput) dateInput.value = getToday();

  // Load from localStorage
  let bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];

  // Sort function by date
  const sortDataByDate = (data) => {
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

// Sort data before chart initialization
const sortedData = sortDataByDate(bmiData);

let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: sortedData.map(entry => entry.date),
    datasets: [{
      label: "BMI Progress",
      data: sortedData.map(entry => entry.bmi),
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
      fill: true,
      tension: 0.3,
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});



// Function to refresh chart (reloads from localStorage)
const refreshChart = () => {
  bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];
  const sortedData = sortDataByDate(bmiData);
  chart.data.labels = sortedData.map(entry => entry.date);
  chart.data.datasets[0].data = sortedData.map(entry => entry.bmi);
  chart.update();
};


// ✅ Make it accessible to bmi.js
window.refreshBMIChart = refreshChart;


  // Save new entry
  saveBtn.addEventListener("click", () => {
    const bmi = parseFloat(bmiInput.value);
    const date = dateInput.value || getToday();

if (isNaN(bmi) || bmi <= 0) {
  alert("Please enter a valid BMI value greater than 0.");
  return;
}


    // Check for duplicate BMI for the same date
    const duplicate = bmiData.some(entry => entry.date === date);
    if (duplicate) {
      alert("A BMI entry for this date already exists. Please choose a different date.");
      return;
    }

    bmiData.push({ bmi, date });
    localStorage.setItem("bmiData", JSON.stringify(bmiData));

    refreshChart(); // Ensure chart is updated in date order

    bmiInput.value = "";
    dateInput.value = getToday();
  });

  // Export to Excel
  exportBtn.addEventListener("click", () => {
    if (bmiData.length === 0) {
      alert("No data to export!");
      return;
    }

    const wsData = [
      ["Date", "BMI"], // headers
      ...sortDataByDate(bmiData).map(entry => [entry.date, entry.bmi])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BMI Progress");
    XLSX.writeFile(wb, "bmi-data.xlsx");
  });

  // Clear All Data
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all BMI data? This cannot be undone.")) {
        localStorage.removeItem("bmiData");
        bmiData = [];
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
        bmiInput.value = "";
        dateInput.value = getToday();
      }
    });
  }

});
