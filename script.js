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
    
    // Set initial slide widths based on their natural aspect ratio
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        const clone = slide.cloneNode(true);
        track.appendChild(clone);

        // Use naturalWidth and naturalHeight to calculate aspect ratio
        img.onload = function() {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            // Since height is fixed at 500px, set width accordingly
            img.style.width = (500 * aspectRatio) + 'px';
        };
    });
    
    // Create dots for navigation
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);
    
    // Function to update carousel position
    const updateCarousel = (targetIndex) => {
        // Calculate the total width of all previous slides
        let newPosition = 0;
        for (let i = 0; i < targetIndex; i++) {
            newPosition += slides[i].querySelector('img').width;
        }
        
        track.style.transform = `translateX(-${newPosition}px)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[targetIndex].classList.add('active');
        
        currentIndex = targetIndex;
    };
    
    let currentIndex = 0;
    
    // Next button event listener
    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            updateCarousel(currentIndex + 1);
        } else {
            updateCarousel(0); // Loop back to start
        }
    });
    
    // Previous button event listener
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            updateCarousel(currentIndex - 1);
        } else {
            updateCarousel(slides.length - 1); // Loop to end
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
    
    // Auto-play functionality
    let autoplayInterval = setInterval(() => {
        nextButton.click();
    }, 4000);
    
    // Pause autoplay when hovering over carousel
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            nextButton.click();
        }, 4000);
    });

    // Initialize carousel
    updateCarousel(0);
});