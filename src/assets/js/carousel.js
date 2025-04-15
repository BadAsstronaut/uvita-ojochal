document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  
  const container = carousel.querySelector('.carousel-container');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');
  
  let currentIndex = 0;
  const slideCount = slides.length;
  let interval;
  
  // Set initial position
  updateCarousel();
  
  // Reset and restart timer
  function resetTimer() {
    clearInterval(interval);
    startTimer();
  }
  
  // Start timer function
  function startTimer() {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    }, 2200);
  }
  
  // Initialize timer
  startTimer();
  
  // Previous slide function
  function goToPrevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
    resetTimer();
  }
  
  // Next slide function
  function goToNextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
    resetTimer();
  }
  
  // Add event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPrevSlide);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNextSlide);
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
      resetTimer();
    });
  });
  
  // Keyboard navigation - using a namespaced event handler
  function carouselKeyboardHandler(e) {
    // Only respond to arrow keys when carousel is in viewport
    const rect = carousel.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    // Skip if user is in a form input element
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }
    
    if (isVisible) {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
        e.preventDefault(); // Prevent default only when we handle the event
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
        e.preventDefault(); // Prevent default only when we handle the event
      }
    }
  }
  
  // Add keyboard event listener
  document.addEventListener('keydown', carouselKeyboardHandler);
  
  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(interval);
  });
  
  carousel.addEventListener('mouseleave', () => {
    startTimer();
  });
  
  // Update carousel position and active dot
  function updateCarousel() {
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
}); 
