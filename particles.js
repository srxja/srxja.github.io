document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("custom-particles");
  // If the script runs but can't find the canvas, this will tell us in the console.
  if (!canvas) {
    console.error("Fatal Error: Canvas element with ID 'custom-particles' was not found in the HTML.");
    return;
  }
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  const particleCount = 120;

  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseSize = Math.random() * 2 + 1;
      this.size = this.baseSize;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.baseOpacity = Math.random() * 0.4 + 0.3;
      this.opacity = this.baseOpacity;
      this.time = Math.random() * 100;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
      
      this.time += 0.02;
      const pulseEffect = Math.sin(this.time) * 0.5;
      this.size = this.baseSize + pulseEffect;
      
      this.opacity = this.baseOpacity + (pulseEffect * 0.2);

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
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
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = this.size * 2;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
});
