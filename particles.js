particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 120, // Number of stars
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff" // Star color
    },
    "shape": {
      "type": "circle",
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": { // Pulsating effect
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2.5,
      "random": true,
      "anim": { // Pulsating size
        "enable": true,
        "speed": 2,
        "size_min": 0.5,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false // No lines between stars
    },
    "move": {
      "enable": true,
      "speed": 0.4, // Slow movement speed
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble" // Glow/grow on hover
      },
      "onclick": {
        "enable": false,
      },
      "resize": true
    },
    "modes": {
      "bubble": { // Configuration for the hover effect
        "distance": 150,
        "size": 6,
        "duration": 2,
        "opacity": 1,
        "speed": 3
      }
    }
  },
  "retina_detect": true
});
