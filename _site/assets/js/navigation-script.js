// assets/js/navigation.js
document.addEventListener('DOMContentLoaded', () => {
  // Header visibility
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
  });

  // Progress bar
  const progressBar = document.querySelector('.progress-bar');
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.transform = `scaleX(${scrolled / 100})`;
  });

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav ul');
  
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      primaryNav.classList.toggle('active');
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }
});
