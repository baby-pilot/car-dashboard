function updateGauge(value) {
    const percentageElement = document.getElementById('percentage');
    percentageElement.textContent = value + '%';
    
    const fullMask = document.querySelector('.mask.full');
    const halfMask = document.querySelector('.mask.half');
    const fill = document.querySelector('.fill');
    
    if (value <= 50) {
      fullMask.style.transform = `rotate(${90 + value * 3.6}deg)`;
      halfMask.style.transform = 'rotate(90deg)';
      fill.classList.remove('fix');
    } else {
      fullMask.style.transform = 'rotate(90deg)';
      halfMask.style.transform = `rotate(${135 + (value - 50) * 3.6}deg)`;
      fill.classList.add('fix');
    }
  }
  