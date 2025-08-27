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
// ----------------- Hamburger + Nav -----------------
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');

    // prevent body scroll while mobile nav is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';

    // if we're closing the mobile menu, also collapse any open dropdowns
    if (!navLinks.classList.contains('active')) {
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
        const c = d.querySelector('.caret'); if (c) c.textContent = '▼';
        const m = d.querySelector('.dropdown-menu'); if (m) m.style.maxHeight = null;
        const t = d.querySelector('.dropdown-toggle'); if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // When clicking nav links: close mobile menu, except when clicking the portfolio toggle itself
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a');
    if (!link) return;

    // if it's the dropdown-toggle, let the dropdown handler manage it (we use stopPropagation there)
    if (link.classList.contains('dropdown-toggle')) return;

    // otherwise close the mobile menu (and reset dropdowns)
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = 'auto';

    document.querySelectorAll('.dropdown').forEach(d => {
      d.classList.remove('active');
      const c = d.querySelector('.caret'); if (c) c.textContent = '▼';
      const m = d.querySelector('.dropdown-menu'); if (m) m.style.maxHeight = null;
      const t = d.querySelector('.dropdown-toggle'); if (t) t.setAttribute('aria-expanded', 'false');
    });
  });
}

// ----------------- Dropdowns (mobile toggle + auto-height) -----------------
function initDropdowns() {
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.dropdown-menu');

    // accessibility initial states
    if (toggle) toggle.setAttribute('aria-haspopup', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (menu) menu.setAttribute('aria-hidden', 'true');

    // mobile toggle click
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation(); // prevent document click from closing nav immediately

        // close any other open dropdowns first
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('active');
            const c2 = d.querySelector('.caret'); if (c2) c2.textContent = '▼';
            const m2 = d.querySelector('.dropdown-menu'); if (m2) { m2.style.maxHeight = null; m2.setAttribute('aria-hidden', 'true'); }
            const t2 = d.querySelector('.dropdown-toggle'); if (t2) t2.setAttribute('aria-expanded', 'false');
          }
        });

        const opening = !dropdown.classList.contains('active');
        if (opening) {
          dropdown.classList.add('active');
          if (caret) caret.textContent = '▲';
          toggle.setAttribute('aria-expanded', 'true');

          // AUTO height: set maxHeight to the real content height
          menu.style.maxHeight = menu.scrollHeight + 'px';
          menu.setAttribute('aria-hidden', 'false');

          // If content height might change later, keep the inline maxHeight.
        } else {
          // closing
          dropdown.classList.remove('active');
          if (caret) caret.textContent = '▼';
          toggle.setAttribute('aria-expanded', 'false');

          menu.style.maxHeight = '0px';
          menu.setAttribute('aria-hidden', 'true');

          // optional: after transition, cleanup inline style
          menu.addEventListener('transitionend', function tidy() {
            if (menu.style.maxHeight === '0px') menu.style.maxHeight = null;
            menu.removeEventListener('transitionend', tidy);
          });
        }
      }
    });

    // clicking a submenu link should close dropdown + mobile nav
    menu.addEventListener('click', (e) => {
      const clickedLink = e.target.closest('a');
      if (!clickedLink) return;

      // collapse dropdown
      dropdown.classList.remove('active');
      if (caret) caret.textContent = '▼';
      toggle.setAttribute('aria-expanded', 'false');
      menu.style.maxHeight = null;
      menu.setAttribute('aria-hidden', 'true');

      // also close mobile nav if open
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // close dropdown(s) when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(d => {
        d.classList.remove('active');
        const c = d.querySelector('.caret'); if (c) c.textContent = '▼';
        const m = d.querySelector('.dropdown-menu'); if (m) { m.style.maxHeight = null; m.setAttribute('aria-hidden', 'true'); }
        const t = d.querySelector('.dropdown-toggle'); if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // on resize, collapse mobile-specific inline styles when switching to desktop
  window.addEventListener('resize', () => {
    dropdowns.forEach(d => {
      const t = d.querySelector('.dropdown-toggle');
      const m = d.querySelector('.dropdown-menu');
      if (window.innerWidth > 768) {
        d.classList.remove('active');
        if (t) t.setAttribute('aria-expanded', 'false');
        if (m) m.style.maxHeight = null;
        const c = d.querySelector('.caret'); if (c) c.textContent = '▼';
      } else {
        // ensure closed on small screens by default
        if (m) m.style.maxHeight = null;
      }
    });
  }, { passive: true });
}

// ----------------- Initialize -----------------
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