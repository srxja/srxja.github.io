// Wait until the entire HTML document is loaded and ready.
document.addEventListener("DOMContentLoaded", function() {

  // Find the canvas element in the HTML.
  const canvas = document.getElementById("custom-particles");
  
  // If the script runs but can't find the canvas, this will stop it and show an error.
  if (!canvas) {
    console.error("Fatal Error: Canvas element with ID 'custom-particles' was not found. Check your HTML file.");
    return;
  }
  
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  const particleCount = 150; // Increased count slightly for a fuller sky

  // Mouse position object
  const mouse = {
    x: null,
    y: null,
    radius: 150 // Area of effect around the cursor
  };

  // Add event listeners
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // This function sets the canvas size and creates the particles.
  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    
    // Safety check: Don't create particles if the canvas has no size.
    if (width > 0 && height > 0) {
      createParticles();
    }
  }
  window.addEventListener("resize", resizeCanvas);

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseSize = Math.random() * 2 + 1;
      this.size = this.baseSize;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.baseOpacity = Math.random() * 0.5 + 0.2; // Made them a bit brighter
      this.opacity = this.baseOpacity;
      this.time = Math.random() * 100;
    }

    update() {
      // Movement and edge wrapping
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
      
      // Pulsating effect
      this.time += 0.02;
      const pulseEffect = Math.sin(this.time) * 0.5;
      this.size = this.baseSize + pulseEffect;
      this.opacity = this.baseOpacity + (pulseEffect * 0.2);

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const effect = 1 - (distance / mouse.radius);
          this.size += effect * 5; // Stronger grow effect
          this.opacity = Math.min(1, this.opacity + effect * 0.6);
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create the initial set of particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // The animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    requestAnimationFrame(animate);
  }

  // --- Start Everything ---
  resizeCanvas(); // Set the initial size and create particles
  animate();      // Start the animation loop
});
