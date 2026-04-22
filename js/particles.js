// Lightweight particle background animation
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let w, h;

  const config = {
    particleCount: 45,
    maxSpeed: 0.4,
    connectionDistance: 150,
    particleSize: 2.5
  };

  function getColors() {
    const style = getComputedStyle(document.documentElement);
    const c1 = style.getPropertyValue('--particle-color-1').trim() || '108, 92, 231';
    const c2 = style.getPropertyValue('--particle-color-2').trim() || '162, 155, 254';
    const c3 = style.getPropertyValue('--particle-color-3').trim() || '253, 203, 110';
    return [c1, c2, c3];
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const colors = getColors();
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * config.maxSpeed * 2,
        vy: (Math.random() - 0.5) * config.maxSpeed * 2,
        size: Math.random() * config.particleSize + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ', ' + p.alpha + ')';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          const alpha = (1 - dist / config.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + p.color + ', ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawParticles);
  }

  function init() {
    resize();
    createParticles();
    drawParticles();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  // Re-create particles when theme changes
  const themeObserver = new MutationObserver(() => {
    createParticles();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  init();
})();
