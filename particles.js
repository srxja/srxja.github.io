// --- Get the Canvas and its Parent (the .hero box) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const heroElement = document.querySelector('.hero');

// --- Configuration for the "Swarm" effect ---
const PARTICLE_COUNT = 150;      // More dots for a dense swarm
const FOLLOW_SPEED = 0.03;       // Slower for a smoother, trailing flow
const DAMPING = 0.96;            // Higher value = more "floaty" and less friction
const PARTICLE_BASE_RADIUS = 1;  // Tinier dots
const GLOW_BLUR = 5;             // Softer glow for tiny dots
const TRAIL_ALPHA = 0.08;        // Lower alpha = longer, more visible trails

let particles = [];
let animationFrameId;
let mouse = { x: null, y: null };
let canvasRect = heroElement.getBoundingClientRect();

// --- Main Functions ---

function resizeCanvas() {
    canvasRect = heroElement.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
}

// Particle class for our dots
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2; // Initial small random velocity
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = PARTICLE_BASE_RADIUS + Math.random() * 1.5;
        this.opacity = 0;
    }

    update() {
        // Fade in
        if (this.opacity < 1) this.opacity = Math.min(1, this.opacity + 0.02);

        // Move towards the mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.vx += dx * FOLLOW_SPEED;
        this.vy += dy * FOLLOW_SPEED;
        
        // Apply damping (friction)
        this.vx *= DAMPING;
        this.vy *= DAMPING;
        
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.shadowBlur = GLOW_BLUR;
        ctx.fill();
    }
}

// The animation loop
function animate() {
    // This creates the beautiful trail effect
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(14, 14, 14, ${TRAIL_ALPHA})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; // Makes glows add up

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
}

// --- Event Listeners & Initialization ---

// Start everything when the mouse enters the hero box
heroElement.addEventListener('mouseenter', (e) => {
    // Get initial mouse position relative to the canvas
    mouse.x = e.clientX - canvasRect.left;
    mouse.y = e.clientY - canvasRect.top;

    // Create the swarm at the entry point
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
    
    // Start the animation if it's not already running
    if (!animationFrameId) {
        animate();
    }
});

// Update mouse position as it moves inside the box
heroElement.addEventListener('mousemove', (e) => {
    // Check if the animation has started
    if (particles.length > 0) {
        mouse.x = e.clientX - canvasRect.left;
        mouse.y = e.clientY - canvasRect.top;
    }
});

// Fade out and stop animation when the mouse leaves
heroElement.addEventListener('mouseleave', () => {
    // This is an optional but elegant fade-out effect.
    // For now, we'll just stop the animation and clear for simplicity.
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
});

// Resize the canvas when the window size changes
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
