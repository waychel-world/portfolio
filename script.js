

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


// Email obfuscation script

(function() {
  // Email components (never stored as complete string)
  const emailParts = {
    user: 'hello',
    domain: 'rachelooi.space'
  };

  const contactBtn = document.getElementById('contact-btn');
  const copyText = document.getElementById('copy-text');
  
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
})();


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