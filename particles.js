// A check to see if the correct script is running.
console.log("NEW cursor-following particle script loaded!");

// Get the canvas and its 2D rendering context
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const PARTICLE_COUNT = 50; 
const FOLLOW_SPEED = 0.08;
const PULSE_SPEED = 0.002;
const PARTICLE_BASE_RADIUS = 1.5;
const GLOW_BLUR = 8;
const SPAWN_RADIUS = 40; 

let particles = [];
let animationFrameId;

// Set canvas dimensions to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Store mouse position
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * SPAWN_RADIUS;
        this.y = y + (Math.random() - 0.5) * SPAWN_RADIUS;
        this.vx = 0;
        this.vy = 0;
        this.radius = PARTICLE_BASE_RADIUS;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.opacity = 0;
    }

    update() {
        if (this.opacity < 1) {
            this.opacity = Math.min(1, this.opacity + 0.03);
        }
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.vx += dx * FOLLOW_SPEED;
        this.vy += dy * FOLLOW_SPEED;
        this.vx *= 0.9;
        this.vy *= 0.9;
        this.x += this.vx;
        this.y += this.vy;
        const pulse = Math.sin(Date.now() * PULSE_SPEED + this.pulseOffset);
        this.radius = PARTICLE_BASE_RADIUS + pulse * 1.2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowBlur = GLOW_BLUR;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function animate() {
    ctx.fillStyle = 'rgba(14, 14, 14, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
}

function init(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
    
    animate();
    window.removeEventListener('mousemove', init);
}

window.addEventListener('mousemove', init);
