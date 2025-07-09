// Get the canvas and its 2D rendering context
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const PARTICLE_COUNT = 70; // Number of dots
const FOLLOW_SPEED = 0.08; // How fast particles follow the cursor (0 to 1)
const PULSE_SPEED = 0.0015; // Speed of the pulsing effect
const PARTICLE_BASE_RADIUS = 2; // Base size of the dots
const GLOW_BLUR = 10; // How much the dots glow

// Set canvas dimensions to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Store mouse position
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    isMoving: false
};

// Track mouse movement
let moveTimeout;
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
        mouse.isMoving = false;
    }, 100); // Consider mouse static after 100ms of no movement
});

// Particle class to define our dots
class Particle {
    constructor() {
        // Start at a random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Velocity for smooth movement
        this.vx = 0;
        this.vy = 0;
        
        // Radius and a random offset for the pulse animation
        this.radius = PARTICLE_BASE_RADIUS;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    // Update particle's position and appearance
    update() {
        // Calculate the vector from the particle to the mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        
        // Accelerate towards the mouse
        this.vx += dx * FOLLOW_SPEED;
        this.vy += dy * FOLLOW_SPEED;
        
        // Apply friction to slow down the particle (damping)
        this.vx *= 0.9;
        this.vy *= 0.9;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // The pulsing effect using a sine wave
        const pulse = Math.sin(Date.now() * PULSE_SPEED + this.pulseOffset);
        this.radius = PARTICLE_BASE_RADIUS + pulse * 1.5; // Pulse size variation
    }

    // Draw the particle on the canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Set the glow effect
        ctx.shadowColor = 'white';
        ctx.shadowBlur = GLOW_BLUR;
        
        // Set the color and fill the circle
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Reset shadow for other drawings if any
        ctx.shadowBlur = 0; 
    }
}

// Create an array to hold all particles
const particles = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

// The main animation loop
function animate() {
    // Clear the canvas with a semi-transparent black for a trailing effect
    // Matched to your site's #0e0e0e background (rgb(14, 14, 14))
    ctx.fillStyle = 'rgba(14, 14, 14, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each particle
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Request the next frame
    requestAnimationFrame(animate);
}

// Start the animation
animate();
