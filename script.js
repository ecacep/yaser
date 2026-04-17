const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const scrollTopBtn = document.getElementById("scrollTop");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  mobileNav.classList.toggle("show");
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    mobileNav.classList.remove("show");
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 250) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        if (entry.target.classList.contains("hero-card")) {
          startCounters();
        }
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

let counterStarted = false;
function startCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 50));

    function updateCounter() {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        return;
      }
      counter.textContent = current;
      requestAnimationFrame(updateCounter);
    }

    updateCounter();
  });
}

/* animated particles background */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 100
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener("touchend", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }

    this.draw();
  }
}

function initParticles() {
  particles = [];
  const total = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));

  for (let i = 0; i < total; i++) {
    const size = Math.random() * 1.8 + 0.5;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const speedX = (Math.random() - 0.5) * 0.35;
    const speedY = (Math.random() - 0.5) * 0.35;
    particles.push(new Particle(x, y, size, speedX, speedY));
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 90) {
        const opacity = 1 - distance / 90;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124, 92, 255, ${opacity * 0.18})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => particle.update());
  connectParticles();

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();