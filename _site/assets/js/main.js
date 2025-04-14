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
        
        // Handle root path special case
        if (path === '/' || path === '') {
            return locale === 'en' ? '/' : `/${locale}/`;
        }
        
        // Step 1: Clean the path - remove locale prefix
        let cleanPath = path;
        if (currentLocale === 'es' && path.startsWith('/es')) {
            cleanPath = path.replace(/^\/es/, '');
        }
        
        // Step 2: Check for direct matches in our path mappings first
        const result = tryDirectMapping(cleanPath, currentLocale, locale);
        if (result) {
            return locale === 'en' ? result : `/${locale}${result}`;
        }
        
        // Step 3: Use pattern replacement for more complex paths
        let transformedPath = applyPatternReplacements(cleanPath, currentLocale, locale);
        
        // Add locale prefix for non-English
        return locale === 'en' ? transformedPath : `/${locale}${transformedPath}`;
    }
    
    // Try to find a direct match in our mappings
    function tryDirectMapping(path, fromLocale, toLocale) {
        const pathMappings = {
            'en': {
                '/recommendations': '/recomendaciones',
                '/recommendations/': '/recomendaciones/',
                '/recommendations/landscaping': '/recomendaciones/paisajismo',
                '/recommendations/landscaping/': '/recomendaciones/paisajismo/',
                '/about': '/nosotros',
                '/about/': '/nosotros/',
                '/contact': '/contacto',
                '/contact/': '/contacto/',
                '/contact/success': '/contacto/exito',
                '/contact/success/': '/contacto/exito/'
            },
            'es': {
                '/recomendaciones': '/recommendations',
                '/recomendaciones/': '/recommendations/',
                '/recomendaciones/paisajismo': '/recommendations/landscaping',
                '/recomendaciones/paisajismo/': '/recommendations/landscaping/',
                '/nosotros': '/about',
                '/nosotros/': '/about/',
                '/contacto': '/contact',
                '/contacto/': '/contact/',
                '/contacto/exito': '/contact/success',
                '/contacto/exito/': '/contact/success/'
            }
        };
        
        return pathMappings[fromLocale][path];
    }
    
    // Apply pattern-based replacements
    function applyPatternReplacements(path, fromLocale, toLocale) {
        let result = path;
        
        const patterns = {
            'en': [
                { from: /\/recommendations\b/g, to: '/recomendaciones' },
                { from: /\/landscaping\b/g, to: '/paisajismo' },
                { from: /\/about\b/g, to: '/nosotros' },
                { from: /\/contact\b/g, to: '/contacto' },
                { from: /\/success\b/g, to: '/exito' }
            ],
            'es': [
                { from: /\/recomendaciones\b/g, to: '/recommendations' },
                { from: /\/paisajismo\b/g, to: '/landscaping' },
                { from: /\/nosotros\b/g, to: '/about' },
                { from: /\/contacto\b/g, to: '/contact' },
                { from: /\/exito\b/g, to: '/success' }
            ]
        };
        
        patterns[fromLocale].forEach(pattern => {
            result = result.replace(pattern.from, pattern.to);
        });
        
        return result;
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
