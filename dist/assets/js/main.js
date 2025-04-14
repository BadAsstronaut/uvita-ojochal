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
    const languageSelector = document.querySelector('.language-selector');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded',
                menuToggle.classList.contains('active').toString());

            // On mobile, hide the language selector when menu is open
            if (window.innerWidth <= 768) { // Assuming $breakpoint-mobile is 768px
                if (languageSelector) {
                    languageSelector.classList.toggle('hidden', menuToggle.classList.contains('active'));
                }
            }
        });
    }

    // Language selector functionality - works for both mobile and desktop selectors
    const languageRadios = document.querySelectorAll('.language-selector input[type="radio"]');

    if (languageRadios.length) {
        languageRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const newLocale = e.target.value;
                const currentPath = window.location.pathname;

                // Store the selected language in localStorage
                localStorage.setItem('preferredLanguage', newLocale);

                // Redirect to the same page with the new locale
                const newUrl = getLocalizedUrl(currentPath, newLocale);
                window.location.href = newUrl;
            });
        });

        // Apply preferred language from localStorage on page load
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) {
            const currentLang = document.documentElement.lang;

            // Only redirect if the stored language is different from current
            if (storedLang !== currentLang) {
                const currentPath = window.location.pathname;
                const newUrl = getLocalizedUrl(currentPath, storedLang);
                window.location.href = newUrl;
            }
        }
    }

    // Helper function to get localized URL
    function getLocalizedUrl(path, locale) {
        // Remove any existing locale prefix
        let cleanPath = path.replace(/^\/(en|es)\//, '/');

        // Handle root path special case
        if (cleanPath === '/' || cleanPath === '') {
            return locale === 'en' ? '/' : `/${locale}/`;
        }

        // Add locale prefix for non-English
        return locale === 'en' ? cleanPath : `/${locale}${cleanPath}`;
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

    // Form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');

        formInputs.forEach(input => {
            // Add error message container
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.id = `${input.id}-error`;
            input.setAttribute('aria-describedby', errorDiv.id);
            input.parentNode.insertBefore(errorDiv, input.nextSibling);

            // Validate on blur
            input.addEventListener('blur', () => {
                validateInput(input);
            });

            // Validate on input
            input.addEventListener('input', () => {
                if (input.getAttribute('aria-invalid') === 'true') {
                    validateInput(input);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Focus first invalid input
                contactForm.querySelector('[aria-invalid="true"]')?.focus();
            }
        });
    }

    function validateInput(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous state
        input.setAttribute('aria-invalid', 'false');
        errorDiv.textContent = '';
        errorDiv.classList.remove('visible');

        // Required field validation
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update UI if invalid
        if (!isValid) {
            input.setAttribute('aria-invalid', 'true');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.add('visible');
        }

        return isValid;
    }
});
