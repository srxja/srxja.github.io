const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

const PARTICLE_COUNT = 70;
const FOLLOW_SPEED = 0.08;
const PULSE_SPEED = 0.0015;
const PARTICLE_BASE_RADIUS = 2;
const GLOW_BLUR = 10;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = 0;
        this.vy = 0;
        this.radius = PARTICLE_BASE_RADIUS;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.vx += dx * FOLLOW_SPEED;
        this.vy += dy * FOLLOW_SPEED;
        this.vx *= 0.9;
        this.vy *= 0.9;
        this.x += this.vx;
        this.y += this.vy;
        
        const pulse = Math.sin(Date.now() * PULSE_SPEED + this.pulseOffset);
        this.radius = PARTICLE_BASE_RADIUS + pulse * 1.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.shadowColor = 'white';
        ctx.shadowBlur = GLOW_BLUR;
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const particles = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.fillStyle = 'rgba(14, 14, 14, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => { p.update(); p.draw(); });
    
    requestAnimationFrame(animate);
}

animate();
