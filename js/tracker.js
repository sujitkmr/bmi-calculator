// tracker.js - Final Modern BMI Progress Tracker with Attractive Graphs

document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("export-btn");
  const clearBtn = document.getElementById("clear-btn");
  const trackerMenuBtn = document.getElementById("trackerMenuBtn");
  const trackerMenu = document.getElementById("trackerMenu");
  const ctx = document.getElementById("bmiChart").getContext("2d");

  let bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];

  const normalBMI = 22;
  const normalMin = 18.5;
  const normalMax = 24.9;

  const sortDataByDate = (data) => data.sort((a, b) => new Date(a.date) - new Date(b.date));
  let sortedData = sortDataByDate(bmiData);

  // ==============================
  // Gradient for User BMI line
  // ==============================
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(42, 157, 143, 0.4)');
  gradient.addColorStop(1, 'rgba(42, 157, 143, 0.05)');

  // ==============================
  // Initialize Chart.js
  // ==============================
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedData.map(entry => entry.date),
      datasets: [
        // User BMI
        {
          label: "Your BMI",
          data: sortedData.map(entry => entry.bmi),
          borderColor: sortedData.map(entry => (entry.bmi >= normalMin && entry.bmi <= normalMax ? "#2a9d8f" : "#e63946")),
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: sortedData.map(entry => (entry.bmi >= normalMin && entry.bmi <= normalMax ? "#2a9d8f" : "#e63946")),
          pointHoverRadius: 8
        },
        // Normal BMI solid green line
        {
          label: "Normal BMI",
          data: sortedData.map(() => normalBMI),
          borderColor: "#2a9d8f", // solid green
          fill: false,
          pointRadius: 0
        },
        // Normal range upper
        {
          label: "Normal Range Max",
          data: sortedData.map(() => normalMax),
          borderColor: "rgba(0,0,0,0)",
          backgroundColor: "rgba(76, 175, 80, 0.15)",
          fill: "+1",
          pointRadius: 0
        },
        // Normal range lower
        {
          label: "Normal Range Min",
          data: sortedData.map(() => normalMin),
          borderColor: "rgba(0,0,0,0)",
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              if(context.dataset.label === "Your BMI"){
                const gap = (context.raw - normalBMI).toFixed(1);
                return `Your BMI: ${context.raw} (${gap >=0 ? "+" : ""}${gap} vs normal)`;
              }
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        },
        legend: {
          labels: {
            filter: function(item){ 
              return item.text !== "Normal Range Max" && item.text !== "Normal Range Min"; 
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 40,
          title: { display:true, text:'BMI' }
        },
        x: {
          title: { display:true, text:'Date' }
        }
      }
    }
  });

  // ==============================
  // Refresh chart
  // ==============================
  const refreshChart = () => {
    bmiData = JSON.parse(localStorage.getItem("bmiData")) || [];
    sortedData = sortDataByDate(bmiData);

    chart.data.labels = sortedData.map(entry => entry.date);
    chart.data.datasets[0].data = sortedData.map(entry => entry.bmi);
    chart.data.datasets[0].borderColor = sortedData.map(entry => (entry.bmi >= normalMin && entry.bmi <= normalMax ? "#2a9d8f" : "#e63946"));
    chart.data.datasets[0].pointBackgroundColor = sortedData.map(entry => (entry.bmi >= normalMin && entry.bmi <= normalMax ? "#2a9d8f" : "#e63946"));
    chart.data.datasets[1].data = sortedData.map(() => normalBMI);
    chart.data.datasets[2].data = sortedData.map(() => normalMax);
    chart.data.datasets[3].data = sortedData.map(() => normalMin);
    chart.update();
  };
  window.refreshBMIChart = refreshChart;

  // ==============================
  // Export to Excel
  // ==============================
  if(exportBtn){
    exportBtn.addEventListener("click", () => {
      if(bmiData.length === 0){ alert("No data to export!"); return; }
      const wsData = [["Date","BMI"], ...sortedData.map(entry=>[entry.date,entry.bmi])];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "BMI Progress");
      XLSX.writeFile(wb, "bmi-data.xlsx");
    });
  }

  // ==============================
  // Clear all data
  // ==============================
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      if(confirm("Are you sure you want to clear all BMI data? This cannot be undone.")){
        localStorage.removeItem("bmiData");
        bmiData = [];
        chart.data.labels = [];
        chart.data.datasets.forEach(ds => ds.data = []);
        chart.update();
        alert("All BMI data cleared successfully.");
      }
    });
  }

  // ==============================
  // Three-dot menu toggle
  // ==============================
  trackerMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    trackerMenu.style.display = trackerMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!trackerMenu.contains(e.target) && e.target !== trackerMenuBtn) {
      trackerMenu.style.display = "none";
    }
  });
});
