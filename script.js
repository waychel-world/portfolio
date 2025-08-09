

//Hero text animation

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


//Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    // Toggle active class on hamburger
    hamburger.classList.toggle('active');
    // Toggle active class on nav links
    navLinks.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Back to top button

document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('back-to-top');

  // Show or hide the button based on scroll position
  window.addEventListener('scroll', () => {
      if (window.scrollY > 300) { // Show button after scrolling down 300px
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
});


