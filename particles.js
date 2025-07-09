// This is your original script. It will log "particles running" to the console.
console.log("particles running");

const canvas = document.createElement("canvas");
canvas.id = "custom-particles";
document.querySelector(".hero").appendChild(canvas);

const ctx = canvas.getContext("2d");
let width, height;
let particles = [];
let mouse = { x: null, y: null };
let active = false;

function resizeCanvas() {
  width = canvas.width = document.querySelector(".hero").clientWidth;
  height = canvas.height = document.querySelector(".hero").clientHeight;
  createParticles(120); // Re-create particles on resize to fill new space
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5, // Made them slightly smaller and more varied
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: 0,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    // This logic makes the particle glow based on distance to the mouse.
    // It DOES NOT make the particle follow.
    const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
    p.opacity = active ? Math.max(0, 1 - dist / 150) : 0;

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

drawParticles();

const heroElement = document.querySelector('.hero');

heroElement.addEventListener("mouseenter", () => (active = true));
heroElement.addEventListener("mouseleave", () => (active = false));
heroElement.addEventListener("mousemove", (e) => {
  const rect = heroElement.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
