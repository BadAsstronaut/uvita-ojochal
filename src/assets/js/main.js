// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.primary-nav ul');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded',
                menuToggle.classList.contains('active').toString());
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .section').forEach(element => {
        element.classList.add('fade-in');
        fadeInObserver.observe(element);
    });

    // Add active class to current navigation item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }

    // Handle image loading animations
    function handleImageLoad(img) {
        if (img.complete) {
            img.style.opacity = '0';
            img.style.animation = 'fadeInImage 0.8s ease-out forwards';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '0';
                img.style.animation = 'fadeInImage 0.8s ease-out forwards';
            });
        }
    }

    // Initialize all images
    document.querySelectorAll('img').forEach(handleImageLoad);

    // Handle dynamically added images
    const imageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IMG') {
                    handleImageLoad(node);
                }
            });
        });
    });

    imageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Update the parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroAfter = hero.style;
            heroAfter.setProperty('--scroll-offset', `${scrolled * 0.5}px`);
        });
    }
});
