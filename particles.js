document.addEventListener("DOMContentLoaded", function() {
  // Find the canvas element in the HTML
  const canvas = document.getElementById("custom-particles");
  if (!canvas) {
    console.error("Canvas element with ID 'custom-particles' not found.");
    return;
  }
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  const particleCount = 120; // Number of stars

  // Mouse position object
  const mouse = {
    x: null,
    y: null,
    radius: 150 // Area of effect around the cursor
  };

  // Get mouse position relative to the canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Reset mouse position when it leaves the canvas
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Set canvas dimensions and regenerate particles on window resize
  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }
  window.addEventListener("resize", resizeCanvas);

  // Particle constructor
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseSize = Math.random() * 1.5 + 1; // Base size of the star
      this.size = this.baseSize;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1; // Base opacity
      this.time = Math.random() * 100; // For individual pulsation
    }

    update() {
      // Gentle movement
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap particles around the edges
      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
      
      // Pulsating effect
      this.time += 0.02;
      this.size = this.baseSize + Math.sin(this.time) * 0.5;

      // Interaction with mouse
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          // Increase size and opacity when mouse is near
          const effect = 1 - (distance / mouse.radius);
          this.size += effect * 4;
          this.opacity = Math.min(1, this.opacity + effect * 0.5);
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.shadowColor = 'white';
      ctx.shadowBlur = this.size * 2; // Glow effect
      ctx.fill();
    }
  }

  // Create the particles array
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    requestAnimationFrame(animate);
  }

  // Initial setup and start animation
  resizeCanvas();
  animate();
});
