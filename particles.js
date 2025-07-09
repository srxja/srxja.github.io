// This script creates the PARTICLE BURST effect.
console.log("PARTICLE BURST SCRIPT LOADED!");

const heroElement = document.querySelector('.hero');

// 1. Create the canvas element
const canvas = document.createElement('canvas');
canvas.id = 'particle-burst-canvas';

// 2. Insert the canvas into the hero section, behind the text content
heroElement.insertBefore(canvas, heroElement.firstChild);

// 3. Now get the context, which is guaranteed to work
const ctx = canvas.getContext('2d');

let particles = [];
let canvasRect = heroElement.getBoundingClientRect();

function resizeCanvas() {
    canvasRect = heroElement.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1; // Random speed for a natural look
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.life = 100; // Particle lives for 100 frames
        this.opacity = 1;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply some friction to slow down
        this.vx *= 0.97;
        this.vy *= 0.97;
        
        // Fade out
        this.life--;
        this.opacity = Math.max(0, this.life / 100);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function createBurst() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const burstAmount = 250; // Number of particles in the burst

    for (let i = 0; i < burstAmount; i++) {
        particles.push(new Particle(centerX, centerY));
    }
}

function animate() {
    // A subtle trail effect by not clearing completely
    ctx.fillStyle = 'rgba(78, 0, 150, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        if (p.life <= 0) {
            particles.splice(index, 1);
        }
    });

    // Only continue animation if there are particles
    if (particles.length > 0) {
        requestAnimationFrame(animate);
    } else {
        // Optional: create a new burst after the old one fades
        // createBurst();
        // animate();
    }
}

// Create the initial burst and start the animation
createBurst();
animate();
