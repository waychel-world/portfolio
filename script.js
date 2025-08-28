// Wait for header and footer to load before initializing dependent functionality
Promise.all([
    // Load header
    fetch('includes/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        }),
    
    // Load footer
    fetch('includes/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
]).then(() => {
    // Initialize components that depend on header/footer
    initHamburgerMenu();
    initEmailObfuscation();
    initBackToTop();
}).catch(error => {
    console.error('Error loading header/footer:', error);
});

// Animated text initialization (doesn't depend on header/footer)
document.addEventListener('DOMContentLoaded', function() {
    const animatedTexts = document.querySelectorAll('.animated-text');
    
    // Trigger animation on scroll
    window.addEventListener('scroll', triggerAnimation);
    window.addEventListener('mousemove', triggerAnimation);

    function triggerAnimation() {
        animateText();
        // Remove event listeners after first trigger
        window.removeEventListener('scroll', triggerAnimation);
        window.removeEventListener('mousemove', triggerAnimation);
    }

    function animateText() {
        animatedTexts.forEach((text, index) => {
            // Stagger animations
            setTimeout(() => {
                text.style.animation = 'handwriting 4s steps(500, end) forwards';
            }, index * 600);
        });
    }
});

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Safety check
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        // Toggle active class on hamburger
        hamburger.classList.toggle('active');
        // Toggle active class on nav links
        navLinks.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') 
            ? 'hidden' 
            : 'auto';
    });

    // Event delegation for nav links
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-links a')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

//Dropdown menu functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const caret = dropdown.querySelector('.caret');

        toggle.addEventListener('click', (e) => {
            // Only intercept click on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();

                // Close all other dropdowns first
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        d.querySelector('.caret').textContent = '▼';
                    }
                });

                // Toggle this one
                dropdown.classList.toggle('active');
                caret.textContent = dropdown.classList.contains('active') ? '▲' : '▼';
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        // ignore clicks on toggles
        if (e.target.closest('.dropdown-toggle')) return;

        if (!e.target.closest('.dropdown') && !e.target.closest('.hamburger')) {
            dropdowns.forEach(d => {
                d.classList.remove('active');
                d.querySelector('.caret').textContent = '▼';
            });
        }
    });

    // Close dropdown + reset caret on link click
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            dropdowns.forEach(d => {
                d.classList.remove('active');
                d.querySelector('.caret').textContent = '▼';
            });
        }
    });

    // Reset caret when hamburger closes
    hamburger.addEventListener('click', () => {
        if (!navLinks.classList.contains('active')) {
            dropdowns.forEach(d => {
                d.classList.remove('active');
                d.querySelector('.caret').textContent = '▼';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initDropdowns();
});


// Email obfuscation script
function initEmailObfuscation() {
    // Email components (never stored as complete string)
    const emailParts = {
        user: 'hello',
        domain: 'rachelooi.space'
    };

    const contactBtn = document.getElementById('contact-btn');
    const copyText = document.getElementById('copy-text');
    
    // Safety check
    if (!contactBtn || !copyText) return;
    
    const email = `${emailParts.user}@${emailParts.domain}`;
    contactBtn.textContent = email.replace('@', ' [at] ');

    // Contact button functionality
    contactBtn.addEventListener('click', () => {
        window.location.href = `mailto:${emailParts.user}@${emailParts.domain}`;
    });

    // Copy functionality with visual feedback
    copyText.addEventListener('click', async () => {
        try {
            // Assemble email only at moment of copying
            const email = `${emailParts.user}@${emailParts.domain}`;
            
            // Modern clipboard API
            await navigator.clipboard.writeText(email);
            
            // Visual feedback
            const originalText = copyText.textContent;
            copyText.textContent = '✓ email copied!';
            
            // Revert after 1 second
            setTimeout(() => {
                copyText.textContent = originalText;
            }, 1000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = `${emailParts.user}@${emailParts.domain}`;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                copyText.textContent = '✓ email copied!';
            } catch (copyErr) {
                copyText.textContent = 'Press Ctrl+C';
            }
            
            document.body.removeChild(textArea);
            
            setTimeout(() => {
                copyText.textContent = '(click here to copy)';
            }, 1000);
        }
    });
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Safety check
    if (!backToTopButton) return;

    // Show or hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Scroll to top when the button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Project Page Image Carousel 

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Store slide widths and positions
    let slideWidths = [];
    let slidePositions = [0];
    
    // Function to calculate slide widths and positions
    function calculateSlideMetrics() {
        slideWidths = [];
        slidePositions = [0];
        
        // Calculate width of each slide and cumulative positions
        let totalWidth = 0;
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            const slideWidth = img.getBoundingClientRect().width;
            slideWidths[index] = slideWidth;
            
            if (index > 0) {
                totalWidth += slideWidths[index - 1];
                slidePositions[index] = totalWidth;
            }

        });
        
        // Set track width to accommodate all slides
        const totalTrackWidth = slideWidths.reduce((sum, width) => sum + width, 0);
        track.style.width = totalTrackWidth + 'px';
    }
    
    // Pad the track with cloned slides so no empty space at the end
    function padEndWithClones() {
        // 1) Nuke any previous clones (so we can re-run on resize)
        track.querySelectorAll('.clone').forEach(n => n.remove());

        // 2) Compute how much visible width exists from the last real slide onward
        const totalOriginalWidth = slideWidths.reduce((s, w) => s + w, 0);
        const lastStart = slidePositions[slides.length - 1] || 0;
        const tailWidth = totalOriginalWidth - lastStart;

        // 3) If that tail is narrower than the viewport, pad with clones
        const containerWidth = track.parentElement.getBoundingClientRect().width;
        let needed = Math.ceil(containerWidth - tailWidth);
        if (needed <= 0) return;

        // 4) Append inert clones until we've filled the gap
        let i = 0; // safety cap prevents infinite loop
        const maxClones = slides.length * 3;
        while (needed > 0 && i < maxClones) {
            const src = slides[i % slides.length];
            const clone = src.cloneNode(true);
            clone.classList.add('clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.tabIndex = -1;
            clone.style.pointerEvents = 'none';

            track.appendChild(clone);

            // Measure the clone after insert (layout is synchronous)
            const w = clone.getBoundingClientRect().width
                || src.getBoundingClientRect().width
                || slideWidths[i % slideWidths.length]
                || 0;

            needed -= w;
            i++;
        }
    }

    // Calculate initial metrics after images load
    const images = Array.from(document.querySelectorAll('img'));
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
        }

    });
    
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === images.length) {
            calculateSlideMetrics();
            padEndWithClones();
            initCarousel();
        }
    }
    
    // Initialize carousel after metrics are calculated
    function initCarousel() {
        // Create dots for navigation
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });
        
        const dots = Array.from(dotsContainer.children);
        
        let currentIndex = 0;
        
        // Function to update carousel position
        function updateCarousel(targetIndex, animate = true) {
            if (animate) {
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(-${slidePositions[targetIndex]}px)`;
            
            // Update active dot
            dots.forEach(dot => dot.classList.remove('active'));
            dots[targetIndex].classList.add('active');
            
            currentIndex = targetIndex;
        }
        
        // Next button event listener
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                updateCarousel(currentIndex + 1);
            } else {
                // Jump to first slide without animation for seamless loop
                updateCarousel(0, false);
                // Force reflow to ensure the transition reset works
                track.offsetHeight;
                updateCarousel(1);
            }
        });
        
        // Previous button event listener
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateCarousel(currentIndex - 1);
            } else {
                // Jump to last slide without animation for seamless loop
                updateCarousel(slides.length - 1, false);
                // Force reflow to ensure the transition reset works
                track.offsetHeight;
                updateCarousel(slides.length - 2);
            }
        });
        
        // Dot navigation event listeners
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.dataset.index);
                updateCarousel(targetIndex);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') {
                nextButton.click();
            } else if (e.key === 'ArrowLeft') {
                prevButton.click();
            }
        });
        
        // Initialize carousel
        updateCarousel(0);
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            calculateSlideMetrics();
            padEndWithClones();
            updateCarousel(currentIndex, false);
        });
    }
});