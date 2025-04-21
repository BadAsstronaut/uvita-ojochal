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

    // Define path mappings for translating between languages
    const pathMap = {
        en_to_es: {
            '/': '/es/',
            '/recommendations/': '/es/recomendaciones/',
            '/recommendations/uvita-mercado/': '/es/recomendaciones/uvita-mercado/',
            '/recommendations/landscaping/': '/es/recomendaciones/paisajismo/',
            '/about/': '/es/nosotros/',
            '/contact/': '/es/contacto/',
            '/contact/success/': '/es/contacto/exito/'
        },
        es_to_en: {
            '/es/': '/',
            '/es/recomendaciones/': '/recommendations/',
            '/es/recomendaciones/uvita-mercado/': '/recommendations/uvita-mercado/',
            '/es/recomendaciones/paisajismo/': '/recommendations/landscaping/',
            '/es/nosotros/': '/about/',
            '/es/contacto/': '/contact/',
            '/es/contacto/exito/': '/contact/success/'
        }
    };

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

        // Auto-detect browser language on first visit (if no preference stored)
        const storedLang = localStorage.getItem('preferredLanguage');
        const currentLang = document.documentElement.lang;

        if (!storedLang) {
            // Get browser language (only consider 'en' or 'es')
            const browserLang = navigator.language.split('-')[0];
            const supportedLang = ['en', 'es'].includes(browserLang) ? browserLang : 'en';
            
            // Only redirect if the detected language is different from current
            if (supportedLang !== currentLang) {
                const currentPath = window.location.pathname;
                const newUrl = getLocalizedUrl(currentPath, supportedLang);
                localStorage.setItem('preferredLanguage', supportedLang);
                window.location.href = newUrl;
            }
        } else if (storedLang !== currentLang) {
            // Apply stored language if different from current
            const currentPath = window.location.pathname;
            const newUrl = getLocalizedUrl(currentPath, storedLang);
            window.location.href = newUrl;
        }
    }

    // Helper function to get localized URL
    function getLocalizedUrl(path, locale) {
        const currentLocale = document.documentElement.lang;
        
        // If already on the target locale, no change needed
        if (currentLocale === locale) {
            return path;
        }
        
        // Clean up the path - remove trailing slash for lookup if present
        let lookupPath = path;
        const hasTrailingSlash = path.endsWith('/') && path !== '/';
        if (!hasTrailingSlash) {
            lookupPath = path + '/';
        }
        
        // Choose the right mapping based on the direction of translation
        const mapToUse = locale === 'en' ? pathMap.es_to_en : pathMap.en_to_es;
        
        // Check for exact match in our path mappings
        if (mapToUse[lookupPath]) {
            // Return the matched path, preserving trailing slash status
            const result = mapToUse[lookupPath];
            return hasTrailingSlash ? result : result.replace(/\/$/, '');
        }
        
        // No exact match found, check for path without trailing slash
        if (hasTrailingSlash && mapToUse[lookupPath.slice(0, -1)]) {
            return mapToUse[lookupPath.slice(0, -1)];
        }
        
        // If no direct mapping exists, handle by prefixing/removing /es/
        if (locale === 'en') {
            // To English: remove /es/ prefix and translate known paths
            let newPath = path.replace(/^\/es\//, '/');
            // Handle special conversions
            newPath = newPath.replace('/recomendaciones/', '/recommendations/');
            newPath = newPath.replace('/paisajismo/', '/landscaping/');
            newPath = newPath.replace('/nosotros/', '/about/');
            newPath = newPath.replace('/contacto/', '/contact/');
            newPath = newPath.replace('/exito/', '/success/');
            return newPath;
        } else {
            // To Spanish: add /es/ prefix if not present and translate known paths
            let newPath = path.startsWith('/es/') ? path : `/es${path}`;
            // Handle special conversions
            newPath = newPath.replace('/recommendations/', '/recomendaciones/');
            newPath = newPath.replace('/landscaping/', '/paisajismo/');
            newPath = newPath.replace('/about/', '/nosotros/');
            newPath = newPath.replace('/contact/', '/contacto/');
            newPath = newPath.replace('/success/', '/exito/');
            return newPath;
        }
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
