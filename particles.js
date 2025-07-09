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
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: 0,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      const dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
      p.opacity = active ? Math.max(0.2, 1 - dist / 150) : 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 5;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
  }

  createParticles(80);
  drawParticles();

  canvas.addEventListener("mouseenter", () => (active = true));
  canvas.addEventListener("mouseleave", () => (active = false));
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
