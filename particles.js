// This is your original script. It will log "particles running" to the console.
console.log("particles running");

// Create a canvas element and give it the ID your CSS is looking for
const canvas = document.createElement("canvas");
canvas.id = "custom-particles";

// Add the canvas inside the .hero section
document.querySelector(".hero").appendChild(canvas);

const ctx = canvas.getContext("2d");
let width, height;
let particles = [];
let mouse = { x: null, y: null };
let active = false; // This tracks if the mouse is inside the hero box

// Set canvas size to match the hero box
function resizeCanvas() {
  width = canvas.width = document.querySelector(".hero").clientWidth;
  height = canvas.height = document.querySelector(".hero").clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Set initial size

// Create the scattered particles
function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5, // Slow horizontal drift
      dy: (Math.random() - 0.5) * 0.5, // Slow vertical drift
      opacity: 0,
    });
  }
}

// Draw the particles and update their position
function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    // Calculate distance from mouse to particle
    const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    
    // If the mouse is inside the box (active), set opacity based on distance. Otherwise, opacity is 0.
    p.opacity = active ? Math.max(0, 1 - dist / 150) : 0;

    // Draw the particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 5;
    ctx.fill();

    // Move the particle slightly for a twinkling effect
    p.x += p.dx;
    p.y += p.dy;

    // Wrap particles around the edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  });

  requestAnimationFrame(drawParticles);
}

// --- Initialize and add Event Listeners ---

createParticles(120); // Create 120 stars
drawParticles(); // Start the animation loop

const heroElement = document.querySelector('.hero');

// When the mouse enters the hero box, set active to true
heroElement.addEventListener("mouseenter", () => (active = true));

// When it leaves, set active to false (stars will fade out)
heroElement.addEventListener("mouseleave", () => (active = false));

// Track the mouse position relative to the hero box
heroElement.addEventListener("mousemove", (e) => {
  const rect = heroElement.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
