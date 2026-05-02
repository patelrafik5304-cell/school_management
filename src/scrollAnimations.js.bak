// Simple scroll animation system using Intersection Observer
// This adds reveal animations to elements as they scroll into view

document.addEventListener('DOMContentLoaded', () => {
  // Add reveal on scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            // Optional: remove revealed class if you want re-animation
            // entry.target.classList.remove('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // Add stagger animation to containers
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  });

  // Add hover effects to cards
  const cards = document.querySelectorAll('.stat-card, .card, .announcement-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });

  // Add magnetic effect to buttons
  const buttons = document.querySelectorAll('.btn-magnetic');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add ripple effect to buttons
  const rippleButtons = document.querySelectorAll('.btn, .btn-primary, .btn-secondary');
  rippleButtons.forEach((button) => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleExpand 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  console.log('Scroll animations initialized');
});

// Add CSS for ripple animation if not exists
if (!document.querySelector('#ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes rippleExpand {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
