// Portfolio Script - Feras Khirfan

// Wait for document to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Update year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Scroll animation - FIXED: now removing hidden class
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
      }
    });
  }, {
    threshold: 0.1
  });

  // Initialize sections - show first section (about) immediately
  document.querySelectorAll('.fade-in-section').forEach((section, index) => {
    observer.observe(section);
    // Make first section visible immediately
    if (index === 0) {
      section.classList.add('show');
      section.classList.remove('hidden');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Offset for header
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // Typing effect for hero section
  const typeTarget = document.getElementById('typing-text');
  if (typeTarget) {
    const phrases = ['Backend Developer', 'Machine Learning Engineer', 'AI Developer', 'Software Developer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before starting new phrase
      }
      
      setTimeout(typeEffect, typingSpeed);
    }
    
    setTimeout(typeEffect, 1000);
  }

  // Improved Project filtering with faster transitions
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterButtons.length && projectCards.length) {
    // Pre-setup - style all cards for immediate transitions
    projectCards.forEach(card => {
      card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button styles
        filterButtons.forEach(btn => {
          btn.classList.remove('bg-purple-600', 'text-white');
          btn.classList.add('bg-white', 'text-gray-700');
        });
        button.classList.remove('bg-white', 'text-gray-700');
        button.classList.add('bg-purple-600', 'text-white');
        
        // Filter projects - improved with faster transitions
        projectCards.forEach(card => {
          if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = 'block';
            // Make visible immediately
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            // Faster fade out
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            // Hide quickly after fade
            setTimeout(() => {
              card.style.display = 'none';
            }, 150); // Reduced from 300ms
          }
        });
      });
    });
  }

  // Form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const formInputs = contactForm.querySelectorAll('input, textarea');
      
      formInputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });
      
      if (isValid) {
        // Show success message (in a real app, handle form submission here)
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
          formMessage.textContent = 'Message sent successfully!';
          formMessage.classList.remove('hidden', 'text-red-500');
          formMessage.classList.add('text-green-500');
          
          // Reset form
          contactForm.reset();
          
          // Hide message after 3 seconds
          setTimeout(() => {
            formMessage.classList.add('hidden');
          }, 3000);
        }
      } else {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
          formMessage.textContent = 'Please fill in all required fields';
          formMessage.classList.remove('hidden', 'text-green-500');
          formMessage.classList.add('text-red-500');
        }
      }
    });
  }

  // Email link handler
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const email = this.href.split('?')[0].replace('mailto:', '');
      const subject = this.href.includes('subject=') ? 
        decodeURIComponent(this.href.split('subject=')[1].split('&')[0]) : '';
      
      // Try to open the default mail client
      try {
        // If clicking directly doesn't work, show a message with the email address
        setTimeout(() => {
          const wasHandled = document.hasFocus();
          if (wasHandled) {
            showEmailCopyMessage(email, subject);
          }
        }, 500);
      } catch (err) {
        // Fallback if there's an error
        showEmailCopyMessage(email, subject);
        e.preventDefault();
      }
    });
  });
  
  function showEmailCopyMessage(email, subject) {
    // Check if message already exists
    if (document.getElementById('email-copy-message')) return;
    
    // Create a message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'email-copy-message';
    messageDiv.innerHTML = `
      <div class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg z-50 max-w-md text-center">
        <p class="mb-2">If your email client didn't open, copy this address:</p>
        <div class="flex items-center justify-center mb-2">
          <input type="text" value="${email}" class="border px-2 py-1 mr-2 w-full" id="email-to-copy" readonly />
          <button class="bg-[#670b0a] text-white px-3 py-1 rounded" id="copy-email-btn">Copy</button>
        </div>
        <p class="text-sm text-gray-600">Suggested subject: ${subject}</p>
        <button class="mt-3 text-gray-500 text-sm" id="close-email-message">Close</button>
      </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Add event listeners
    document.getElementById('copy-email-btn').addEventListener('click', function() {
      const emailInput = document.getElementById('email-to-copy');
      emailInput.select();
      document.execCommand('copy');
      this.textContent = 'Copied!';
    });
    
    document.getElementById('close-email-message').addEventListener('click', function() {
      document.getElementById('email-copy-message').remove();
    });
  }
}); 