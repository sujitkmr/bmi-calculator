// tracker.js - BMI Progress Tracker with Excel Export Only

document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("export-btn"); // Export to Excel
  const clearBtn = document.getElementById("clear-btn");   // optional clear all button
  const ctx = document.getElementById("bmiChart").getContext("2d");

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

// When refreshing chart
const refreshChart = () => {
  bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];
  const sortedData = sortDataByDate(bmiData);

  chart.data.labels = sortedData.map(entry => entry.date);
  chart.data.datasets[0].data = sortedData.map(entry => entry.bmi);
  chart.update();
};

  // ✅ Make it accessible to bmi.js
  window.refreshBMIChart = refreshChart;

  // Export to Excel
  exportBtn.addEventListener("click", () => {
    if (bmiData.length === 0) {
      alert("No data to export!");
      return;
    }

    // Export to Excel
exportBtn.addEventListener("click", () => {
  // ... export logic
});

// Clear/Delete All Data
const clearBtn = document.getElementById("clear-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all BMI data? This cannot be undone.")) {
      localStorage.removeItem("bmiData");
      bmiData = [];
      if (window.refreshBMIChart) window.refreshBMIChart();
      alert("All BMI data cleared successfully.");
    }
  });
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
      }
    });
  }
});
