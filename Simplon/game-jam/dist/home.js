const clickSound = document.getElementById('clickSound');


const sliderLabels = document.querySelectorAll('.slider-nav label');

sliderLabels.forEach(label => {
  label.addEventListener('click', () => {
   
    clickSound.currentTime = 0;
    clickSound.play();
  });
});