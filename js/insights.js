// js/insights.js
// Sample data for demo — replace with live data later
const bmiData = [
  { date: '2025-09-01', bmi: 21.5, weight: 65, bodyFat: 18, category: 'Normal' },
  { date: '2025-09-05', bmi: 27.3, weight: 75, bodyFat: 25, category: 'Overweight' },
  { date: '2025-09-10', bmi: 23.1, weight: 68, bodyFat: 20, category: 'Normal' },
  { date: '2025-09-15', bmi: 19.2, weight: 60, bodyFat: 15, category: 'Underweight' },
  { date: '2025-09-20', bmi: 30.4, weight: 80, bodyFat: 30, category: 'Obese' }
];

// Calculate metrics
const totalEntries = bmiData.length;
const averageBMI = (bmiData.reduce((sum, d) => sum + d.bmi, 0) / totalEntries).toFixed(1);
const lowestBMI = Math.min(...bmiData.map(d => d.bmi)).toFixed(1);
const highestBMI = Math.max(...bmiData.map(d => d.bmi)).toFixed(1);

// Count categories
const categoriesCount = { Underweight:0, Normal:0, Overweight:0, Obese:0 };
bmiData.forEach(d => { categoriesCount[d.category]++; });

// Percentages
const normalPercent = ((categoriesCount.Normal / totalEntries) * 100).toFixed(0);
const overweightPercent = ((categoriesCount.Overweight / totalEntries) * 100).toFixed(0);

// Populate cards
document.getElementById('totalEntries').textContent = totalEntries;
document.getElementById('averageBMI').textContent = averageBMI;
document.getElementById('normalPercent').textContent = normalPercent + '%';
document.getElementById('overweightPercent').textContent = overweightPercent + '%';
document.getElementById('lowestBMI').textContent = lowestBMI;
document.getElementById('highestBMI').textContent = highestBMI;

// ===== Charts =====

// 1. Pie Chart for BMI Categories
new Chart(document.getElementById('bmiCategoryChart'), {
  type: 'pie',
  data: {
    labels: ['Underweight','Normal','Overweight','Obese'],
    datasets: [{
      data: [
        categoriesCount.Underweight,
        categoriesCount.Normal,
        categoriesCount.Overweight,
        categoriesCount.Obese
      ],
      backgroundColor: ['#1d3557','#2a9d8f','#f7a420','#e63946']
    }]
  },
  options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// 2. Line Chart for BMI Trend
new Chart(document.getElementById('bmiTrendChart'), {
  type: 'line',
  data: {
    labels: bmiData.map(d => d.date),
    datasets: [{
      label: 'BMI Over Time',
      data: bmiData.map(d => d.bmi),
      fill: false,
      borderColor: '#1d3557',
      tension: 0.3
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: false } } }
});

// 3. Line Chart for Weight Trend
new Chart(document.getElementById('weightTrendChart'), {
  type: 'line',
  data: {
    labels: bmiData.map(d => d.date),
    datasets: [{
      label: 'Weight Over Time (kg)',
      data: bmiData.map(d => d.weight),
      fill: false,
      borderColor: '#2a9d8f',
      tension: 0.3
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: false } } }
});

// 4. Line Chart for Body Fat % Trend
new Chart(document.getElementById('bodyFatTrendChart'), {
  type: 'line',
  data: {
    labels: bmiData.map(d => d.date),
    datasets: [{
      label: 'Body Fat % Over Time',
      data: bmiData.map(d => d.bodyFat),
      fill: false,
      borderColor: '#f7a420',
      tension: 0.3
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});
