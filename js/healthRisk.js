// ====== Health Risk Script (healthRisk.js) ======
// Handles both the small risk tile and the detailed popup modal

function getRiskDetails(bmi) {
  if (bmi < 18.5)
    return {
      level: 'Low',
      score: 20,
      desc: 'Underweight',
      diabetes: 5,
      heart: 7,
      bp: 6,
      advice: 'Increase protein intake and strength training.'
    };
  if (bmi < 25)
    return {
      level: 'Healthy',
      score: 15,
      desc: 'Ideal range',
      diabetes: 10,
      heart: 8,
      bp: 9,
      advice: 'Maintain with balanced diet and activity.'
    };
  if (bmi < 30)
    return {
      level: 'Moderate',
      score: 45,
      desc: 'Slightly high',
      diabetes: 25,
      heart: 20,
      bp: 30,
      advice: 'Focus on regular exercise and portion control.'
    };
  if (bmi < 35)
    return {
      level: 'High',
      score: 70,
      desc: 'Obesity risk',
      diabetes: 45,
      heart: 35,
      bp: 50,
      advice: 'Include daily cardio & reduce processed foods.'
    };
  return {
    level: 'Very High',
    score: 85,
    desc: 'Severe risk',
    diabetes: 65,
    heart: 55,
    bp: 70,
    advice: 'Consult a physician and nutritionist for guidance.'
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const bmiElement = document.getElementById('bmi-value');
  if (!bmiElement) return;

  const bmi = parseFloat(bmiElement.textContent) || 27.5;
  const risk = getRiskDetails(bmi);

  // ===== Small Risk Tile =====
  const ctxMini = document.getElementById('riskGaugeMini')?.getContext('2d');
  if (ctxMini) {
    new Chart(ctxMini, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [risk.score, 100 - risk.score],
          backgroundColor: [
            risk.score > 70 ? '#ff3e3e' :
            risk.score > 40 ? '#ffcc00' : '#32cd32',
            '#f0f0f0'
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '70%'
        }]
      },
      options: { plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
  }

  document.getElementById('risk-level-mini').textContent = risk.level;

  // ===== Popup Modal =====
  const modal = document.getElementById('riskModal');
  const tile = document.getElementById('riskTile');
  const closeBtn = document.getElementById('closeRiskModal');

  if (tile && modal && closeBtn) {
    tile.addEventListener('click', () => {
      modal.style.display = 'flex';
      modal.classList.add('fade-in');

      document.getElementById('risk-level-full').textContent = risk.level;
      document.getElementById('risk-desc-full').textContent = risk.desc;
      document.getElementById('risk-diabetes-full').textContent = `${risk.diabetes}%`;
      document.getElementById('risk-bp-full').textContent = `${risk.bp}%`;
      document.getElementById('risk-heart-full').textContent = `${risk.heart}%`;
      document.getElementById('risk-advice').innerHTML = `<p>${risk.advice}</p>`;

      const ctxFull = document.getElementById('riskGaugeFull').getContext('2d');
      new Chart(ctxFull, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [risk.score, 100 - risk.score],
            backgroundColor: [
              risk.score > 70 ? '#ff3e3e' :
              risk.score > 40 ? '#ffcc00' : '#32cd32',
              '#eaeaea'
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '70%'
          }]
        },
        options: { plugins: { legend: { display: false }, tooltip: { enabled: false } } }
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('fade-in');
      modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('fade-in');
        modal.style.display = 'none';
      }
    });
  }
});
