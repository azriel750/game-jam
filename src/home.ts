const clickSound2 = document.getElementById('clickSound') as HTMLAudioElement;
const sliderLabels = document.querySelectorAll('.slider-nav label');

sliderLabels.forEach(label => {
  label.addEventListener('click', () => {
    console.log("clic détecté");
    console.log("clickSound:", clickSound);
    if (clickSound2) {
      clickSound2.currentTime = 0;
      clickSound2.play().catch(e => console.error("Erreur audio:", e));
    }
  });
});