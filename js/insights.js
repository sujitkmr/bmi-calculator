// insights.js - Dynamic BMI Insights and Charts

// ===== Global chart variables =====
let bmiCategoryChart, bmiTrendChart, weightTrendChart, bodyFatTrendChart, correlationChart;

// ===== Fetch BMI data dynamically from localStorage =====
let bmiData = JSON.parse(localStorage.getItem("bmiInsightsData")) || [];

// ===== Function to calculate metrics =====
function calculateMetrics(data) {
    const totalEntries = data.length;
    const averageBMI = totalEntries ? (data.reduce((sum, d) => sum + d.bmi, 0) / totalEntries).toFixed(1) : 0;
    const lowestBMI = totalEntries ? Math.min(...data.map(d => d.bmi)).toFixed(1) : 0;
    const highestBMI = totalEntries ? Math.max(...data.map(d => d.bmi)).toFixed(1) : 0;

    const categoriesCount = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 };
    data.forEach(d => {
        if (d.category === "Underweight") categoriesCount.Underweight++;
        else if (d.category === "Normal weight" || d.category === "Normal") categoriesCount.Normal++;
        else if (d.category === "Overweight") categoriesCount.Overweight++;
        else if (d.category === "Obesity" || d.category === "Obese") categoriesCount.Obese++;
    });

    const normalPercent = totalEntries ? ((categoriesCount.Normal / totalEntries) * 100).toFixed(0) : 0;
    const overweightPercent = totalEntries ? ((categoriesCount.Overweight / totalEntries) * 100).toFixed(0) : 0;

    return { totalEntries, averageBMI, lowestBMI, highestBMI, categoriesCount, normalPercent, overweightPercent };
}

// ===== Function to populate metric cards =====
function populateMetrics(metrics) {
    document.getElementById('totalEntries').textContent = metrics.totalEntries;
    document.getElementById('averageBMI').textContent = metrics.averageBMI;
    document.getElementById('lowestBMI').textContent = metrics.lowestBMI;
    document.getElementById('highestBMI').textContent = metrics.highestBMI;
    document.getElementById('normalPercent').textContent = metrics.normalPercent + '%';
    document.getElementById('overweightPercent').textContent = metrics.overweightPercent + '%';
}

// ===== Initialize Charts =====
function initCharts(data) {
    const metrics = calculateMetrics(data);
    populateMetrics(metrics);

    // ===== Pie Chart - BMI Category Distribution =====
    bmiCategoryChart = new Chart(document.getElementById('bmiCategoryChart'), {
        type: 'pie',
        data: {
            labels: ['Underweight','Normal','Overweight','Obese'],
            datasets: [{
                data: [
                    metrics.categoriesCount.Underweight,
                    metrics.categoriesCount.Normal,
                    metrics.categoriesCount.Overweight,
                    metrics.categoriesCount.Obese
                ],
                backgroundColor: ['#1d3557','#2a9d8f','#f7a420','#e63946']
            }]
        },
        options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
    });

    // ===== Line Chart - BMI Trend =====
    bmiTrendChart = new Chart(document.getElementById('bmiTrendChart'), {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: 'BMI Over Time',
                data: data.map(d => d.bmi),
                fill: false,
                borderColor: '#1d3557',
                tension: 0.3
            }]
        },
        options: { responsive:true, scales:{ y:{ beginAtZero:false } } }
    });

    // ===== Line Chart - Weight Trend =====
    weightTrendChart = new Chart(document.getElementById('weightTrendChart'), {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: 'Weight Over Time (kg)',
                data: data.map(d => d.weight || Math.round(d.bmi*2)),
                fill: false,
                borderColor: '#2a9d8f',
                tension: 0.3
            }]
        },
        options: { responsive:true, scales:{ y:{ beginAtZero:false } } }
    });

    // ===== Line Chart - Body Fat % Trend =====
    bodyFatTrendChart = new Chart(document.getElementById('bodyFatTrendChart'), {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: 'Body Fat % Over Time',
                data: data.map(d => d.bodyFat || 0),
                fill: false,
                borderColor: '#f7a420',
                tension: 0.3
            }]
        },
        options: { responsive:true, scales:{ y:{ beginAtZero:true } } }
    });

    // ===== Scatter Chart - BMI vs Weight =====
    correlationChart = new Chart(document.getElementById('bmiWeightCorrelationChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'BMI vs Weight',
                data: data.map(d => ({x:d.weight || Math.round(d.bmi*2), y:d.bmi})),
                backgroundColor: '#1d3557'
            }]
        },
        options: {
            responsive:true,
            plugins:{
                legend:{ display:false },
                tooltip:{
                    callbacks:{
                        label:function(ctx){ return `Weight: ${ctx.raw.x} kg, BMI: ${ctx.raw.y}`; }
                    }
                }
            },
            scales:{
                x:{ title:{ display:true, text:'Weight (kg)' } },
                y:{ title:{ display:true, text:'BMI' } }
            }
        }
    });
}

// ===== Update Charts dynamically =====
function updateInsightsCharts() {
    bmiData = JSON.parse(localStorage.getItem("bmiInsightsData")) || [];
    const metrics = calculateMetrics(bmiData);
    populateMetrics(metrics);

    if (!bmiCategoryChart) return; // charts not initialized yet

    // Update pie chart
    bmiCategoryChart.data.datasets[0].data = [
        metrics.categoriesCount.Underweight,
        metrics.categoriesCount.Normal,
        metrics.categoriesCount.Overweight,
        metrics.categoriesCount.Obese
    ];
    bmiCategoryChart.update();

    // Update BMI trend
    bmiTrendChart.data.labels = bmiData.map(d => d.date);
    bmiTrendChart.data.datasets[0].data = bmiData.map(d => d.bmi);
    bmiTrendChart.update();

    // Update weight trend
    weightTrendChart.data.labels = bmiData.map(d => d.date);
    weightTrendChart.data.datasets[0].data = bmiData.map(d => d.weight || Math.round(d.bmi*2));
    weightTrendChart.update();

    // Update body fat trend
    bodyFatTrendChart.data.labels = bmiData.map(d => d.date);
    bodyFatTrendChart.data.datasets[0].data = bmiData.map(d => d.bodyFat || 0);
    bodyFatTrendChart.update();

    // Update correlation chart
    correlationChart.data.datasets[0].data = bmiData.map(d => ({x:d.weight || Math.round(d.bmi*2), y:d.bmi}));
    correlationChart.update();
}

// ===== Initialize everything on DOM load =====
document.addEventListener("DOMContentLoaded", () => {
    initCharts(bmiData);
});
