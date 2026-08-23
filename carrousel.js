document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carouselExampleIndicators');
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = carousel.querySelector('.carousel-control-prev');
  const nextBtn = carousel.querySelector('.carousel-control-next');
  const indicatorsContainer = carousel.querySelector('.carousel-indicators');
  const bxButtons = document.querySelectorAll('#Controles .Bx');

  let currentIndex = 0;
  let autoPlayTimer = null;
  let isPlaying = true;

  // Reconstruir indicadores para sincronizar con las imágenes
  indicatorsContainer.innerHTML = '';
  items.forEach((_, idx) => {
    const li = document.createElement('li');
    if (idx === 0) li.classList.add('active');
    li.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoPlay();
    });
    indicatorsContainer.appendChild(li);
  });

  const indicators = indicatorsContainer.querySelectorAll('li');

  // Función para cambiar de imagen
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = items.length - 1;
    } else if (index >= items.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentIndex);
    });
  }

  // Eventos de flechas
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  // Temporizador de reproducción automática
  function startAutoPlay() {
    if (!autoPlayTimer) {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 3500);
      isPlaying = true;
    }
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      isPlaying = false;
    }
  }

  function resetAutoPlay() {
    if (isPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  }

  startAutoPlay();

  // Funcionalidad de tus botones <div class="Bx"></div> inferiores
  if (bxButtons.length >= 3) {
    bxButtons[0].textContent = 'Inicio';
    bxButtons[1].textContent = 'Pausa';
    bxButtons[2].textContent = 'Siguiente';

    // B1: Ir a la primera imagen
    bxButtons[0].addEventListener('click', () => {
      goToSlide(0);
      resetAutoPlay();
    });

    // B2: Pausar o reanudar
    bxButtons[1].addEventListener('click', () => {
      if (isPlaying) {
        stopAutoPlay();
        bxButtons[1].textContent = 'Play';
        bxButtons[1].style.backgroundColor = '#471414ad';
        bxButtons[1].style.color = '#000000';
      } else {
        startAutoPlay();
        bxButtons[1].textContent = 'Pausa';
        bxButtons[1].style.backgroundColor = '#471414ad';
        bxButtons[1].style.color = '#000000';
      }
    });

    // B3: Pasar a la siguiente imagen
    bxButtons[2].addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }
});