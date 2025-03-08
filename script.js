document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements for better performance
  const header = document.querySelector("header");
  const sections = document.querySelectorAll("section");
  const h1 = document.querySelector("h1");
  const body = document.body;
  const timeline = document.querySelectorAll(".timeline li");

  // Configuration
  const config = {
    particleCount: 30,
    typingSpeed: 80,
    cursorBlinkRate: 530,
    particleColors: ["#39ff14", "#ff2975", "#14f1ff"],
    parallaxStrength: 0.7,
    rotationStrength: 5,
    scrollAnimationThreshold: 0.15,
  };

  // Initialize custom cursor
  initCustomCursor();

  // Enhanced animated text for h1
  createTextAnimation(h1);

  // Add 3D tilt effect to sections
  addTiltEffect(sections);

  // Create particle background
  createParticleEffect();

  // Implement smooth scrolling
  implementSmoothScrolling();

  // Add scroll-based animations
  addScrollAnimations();

  // Add hover effects for timeline
  enhanceTimelineInteractions();

  // Add interactive background grid
  addInteractiveGrid();

  // Add dynamic line effect on mouse movement
  addDynamicLineEffect();

  // Add subtle noise texture
  addNoiseTexture();

  // Add interactive typing effect to subtitle
  addTypingEffect();

  // Add scroll progress indicator
  addScrollProgressIndicator();

  // Add theme toggle functionality
  addThemeToggle();

  // Add section reveal animations
  addSectionRevealAnimations();

  // Advanced text animations
  function createTextAnimation(element) {
    const text = element.textContent;
    element.textContent = "";

    // Create a wrapper for better animation control
    const wrapper = document.createElement("span");
    wrapper.className = "text-animation-wrapper";
    element.appendChild(wrapper);

    // Split text into individual chars with random delays
    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.className = "animated-char";
      span.style.animationDelay = `${i * 0.05 + Math.random() * 0.1}s`;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.transform = "translateY(20px) rotateY(90deg)";
      span.style.animation = "fadeInChar 0.5s forwards";
      wrapper.appendChild(span);
    });
  }

  // Custom cursor implementation
  function initCustomCursor() {
    const cursorDot = document.querySelector(".cursor-dot");
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    // Create cursor trail effect
    const trail = [];
    const trailLength = 5;

    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement("div");
      dot.className = "cursor-trail";
      dot.style.cssText = `
        position: fixed;
        width: ${6 - i}px;
        height: ${6 - i}px;
        background: var(--highlight-color);
        border-radius: 50%;
        opacity: ${0.7 - i * 0.1};
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ${i * 0.02}s linear;
      `;
      document.body.appendChild(dot);
      trail.push(dot);
    }

    // Smooth cursor movement with requestAnimationFrame
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Change cursor based on hoverable elements
      const hoveredElement = document.elementFromPoint(mouseX, mouseY);
      if (
        hoveredElement &&
        (hoveredElement.tagName === "A" ||
          hoveredElement.tagName === "BUTTON" ||
          hoveredElement.closest(".timeline-content"))
      ) {
        cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorDot.style.background = "var(--highlight-color)";
      } else {
        cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
        cursorDot.style.background = "var(--accent-color)";
      }
    });

    function updateCursor() {
      // Add smooth easing to cursor movement
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      if (cursorDot) {
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
      }

      // Update trail positions with delay
      trail.forEach((dot, index) => {
        const prevDot = trail[index - 1] || cursorDot;
        if (prevDot) {
          const rect = prevDot.getBoundingClientRect();
          dot.style.left = `${rect.left + rect.width / 2}px`;
          dot.style.top = `${rect.top + rect.height / 2}px`;
        }
      });

      requestAnimationFrame(updateCursor);
    }

    updateCursor();
  }

  // Enhanced parallax effect with depth
  function addTiltEffect(elements) {
    let prevMouseX = 0,
      prevMouseY = 0;

    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      // Add inertia to mouse movement
      prevMouseX += (mouseX - prevMouseX) * 0.1;
      prevMouseY += (mouseY - prevMouseY) * 0.1;

      elements.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // Calculate distance from center of screen for depth effect
          const distanceFromCenter =
            Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) /
            window.innerHeight;
          const depthFactor = 1 - distanceFromCenter * 0.8;

          // Apply 3D transform with depth
          section.style.transform = `
            perspective(1000px)
            rotateY(${prevMouseX * config.rotationStrength * depthFactor}deg)
            rotateX(${-prevMouseY * config.rotationStrength * depthFactor}deg)
            translateZ(${10 * depthFactor}px)
          `;

          // Add subtle shadow based on tilt
          section.style.boxShadow = `
            ${prevMouseX * 20}px ${prevMouseY * 20}px 20px rgba(0,0,0,0.1),
            var(--box-shadow)
          `;
        }
      });

      // Apply subtle parallax to header background
      header.style.backgroundPositionX = `${prevMouseX * 30}px`;
      header.style.backgroundPositionY = `${prevMouseY * 30}px`;
    });

    // Reset on touch devices
    window.addEventListener("touchstart", () => {
      elements.forEach((section) => {
        section.style.transform = "none";
        section.style.boxShadow = "var(--box-shadow)";
      });
    });
  }

  // Particle effect background
  function createParticleEffect() {
    for (let i = 0; i < config.particleCount; i++) {
      setTimeout(() => {
        createParticle();
      }, i * 300);
    }

    function createParticle() {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random properties for each particle
      const size = Math.random() * 6 + 2;
      const color =
        config.particleColors[
          Math.floor(Math.random() * config.particleColors.length)
        ];
      const left = Math.random() * window.innerWidth;
      const duration = Math.random() * 15 + 10;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}px;
        bottom: -20px;
        opacity: ${Math.random() * 0.6 + 0.1};
        animation: floatUp ${duration}s linear forwards;
      `;

      document.body.appendChild(particle);

      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove();
        createParticle();
      }, duration * 1000);
    }
  }

  // Smooth scroll implementation
  function implementSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Create smooth scrolling with easing
          const startPosition = window.pageYOffset;
          const targetPosition =
            targetElement.getBoundingClientRect().top + startPosition;
          const distance = targetPosition - startPosition;
          const duration = 1000;
          let start = null;

          function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);

            // Easing function
            const easing = (t) =>
              t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

            window.scrollTo(0, startPosition + distance * easing(percentage));

            if (progress < duration) {
              window.requestAnimationFrame(step);
            }
          }

          window.requestAnimationFrame(step);
        }
      });
    });
  }

  // Enhanced scroll-based animations
  function addScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered animation for children
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = "1";
                child.style.transform = "translateY(0)";
              }, index * 100);
            });
          }
        });
      },
      {
        threshold: config.scrollAnimationThreshold,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      observer.observe(section);
    });

    // Parallax scrolling effect for sections
    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const screenCenter = window.innerHeight / 2;
        const distanceFromCenter = sectionCenter - screenCenter;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          section.style.transform = `translateY(${
            distanceFromCenter * 0.05
          }px)`;
        }
      });

      // Parallax for header
      header.style.backgroundPositionY = `${
        scrollPosition * config.parallaxStrength
      }px`;
    });
  }

  // Advanced timeline interactions
  function enhanceTimelineInteractions() {
    timeline.forEach((item, index) => {
      // Staggered appearance
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, index * 200);

      // Enhanced hover effects
      item.addEventListener("mouseenter", () => {
        const date = item.querySelector(".date");

        if (date) {
          date.style.transform = "skew(-10deg) scale(1.1)";
          date.style.background = "var(--accent-color)";
          date.style.color = "var(--primary-color)";
        }

        // Push other items slightly away
        timeline.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.style.transform = "scale(0.98)";
            otherItem.style.opacity = "0.7";
          }
        });
      });

      item.addEventListener("mouseleave", () => {
        const date = item.querySelector(".date");

        if (date) {
          date.style.transform = "skew(-10deg)";
          date.style.background = "var(--primary-color)";
          date.style.color = "var(--highlight-color)";
        }

        // Restore other items
        timeline.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.style.transform = "scale(1)";
            otherItem.style.opacity = "1";
          }
        });
      });
    });
  }

  // Interactive background grid
  function addInteractiveGrid() {
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      // Apply a more complex movement to the grid
      const offsetX = Math.sin(mouseX * Math.PI * 2) * 15;
      const offsetY = Math.cos(mouseY * Math.PI * 2) * 15;

      document.body.style.setProperty("--grid-offset-x", `${offsetX}px`);
      document.body.style.setProperty("--grid-offset-y", `${offsetY}px`);
    });

    // Pulse animation for grid on click
    document.addEventListener("click", (e) => {
      // Create pulse effect
      const pulse = document.createElement("div");
      pulse.className = "grid-pulse";
      pulse.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 10px;
        height: 10px;
        background: transparent;
        border: 2px solid var(--accent-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        animation: gridPulse 1s ease-out forwards;
      `;

      document.body.appendChild(pulse);

      setTimeout(() => {
        pulse.remove();
      }, 1000);
    });
  }

  // Enhanced dynamic line effect
  function addDynamicLineEffect() {
    // Create horizontal and vertical lines
    const hLine = document.createElement("div");
    const vLine = document.createElement("div");

    hLine.className = "dynamic-line horizontal";
    vLine.className = "dynamic-line vertical";

    document.body.appendChild(hLine);
    document.body.appendChild(vLine);

    document.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Horizontal line
      hLine.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--accent-color);
        opacity: 0.08;
        pointer-events: none;
        z-index: 9997;
      `;

      // Vertical line
      vLine.style.cssText = `
        position: fixed;
        top: 0;
        left: ${x}px;
        width: 1px;
        height: 100%;
        background: var(--accent-color);
        opacity: 0.08;
        pointer-events: none;
        z-index: 9997;
      `;

      // Highlight intersections when hovering interactive elements
      const hoveredElement = document.elementFromPoint(x, y);
      if (
        hoveredElement &&
        (hoveredElement.tagName === "A" ||
          hoveredElement.tagName === "BUTTON" ||
          hoveredElement.closest(".timeline-content"))
      ) {
        hLine.style.opacity = "0.3";
        vLine.style.opacity = "0.3";
      }
    });
  }

  // Subtle noise texture
  function addNoiseTexture() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    const imageData = ctx.createImageData(200, 200);
    const data = imageData.data;

    // Create more varied noise pattern
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      const noise = Math.random() < 0.5 ? value : 255 - value;

      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 10; // Very subtle opacity
    }

    ctx.putImageData(imageData, 0, 0);
    document.body.style.backgroundBlendMode = "overlay";
    document.body.style.backgroundImage = `url(${canvas.toDataURL(
      "image/png"
    )})`;
  }

  // Typing effect for subtitle
  function addTypingEffect() {
    const subtitle = document.querySelector(".subtitle");
    if (subtitle) {
      const originalText = subtitle.textContent;
      subtitle.textContent = "";

      // Add cursor element
      const cursorElement = document.createElement("span");
      cursorElement.className = "typing-cursor";
      cursorElement.textContent = "|";
      cursorElement.style.animation = `blink ${config.cursorBlinkRate}ms infinite`;

      subtitle.appendChild(cursorElement);

      // Type text
      let index = 0;

      function typeText() {
        if (index < originalText.length) {
          // Create character span
          const charSpan = document.createElement("span");
          charSpan.textContent = originalText.charAt(index);
          subtitle.insertBefore(charSpan, cursorElement);

          index++;
          setTimeout(typeText, config.typingSpeed + Math.random() * 50);
        } else {
          // Keep cursor blinking
          setTimeout(() => {
            cursorElement.style.opacity = "0";
          }, 2000);
        }
      }

      setTimeout(typeText, 1000);
    }
  }

  // Add scroll progress indicator
  function addScrollProgressIndicator() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, var(--accent-color), var(--highlight-color));
      z-index: 1000;
      transition: width 0.1s;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // Theme toggle functionality
  function addThemeToggle() {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.innerHTML = "🌙";
    themeToggle.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--accent-color);
      border: 2px solid var(--accent-color);
      cursor: pointer;
      z-index: 1000;
      opacity: 0.7;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(themeToggle);

    let isDark = true;

    themeToggle.addEventListener("mouseenter", () => {
      themeToggle.style.opacity = "1";
      themeToggle.style.transform = "scale(1.1) rotate(45deg)";
    });

    themeToggle.addEventListener("mouseleave", () => {
      themeToggle.style.opacity = "0.7";
      themeToggle.style.transform = "scale(1) rotate(0deg)";
    });

    themeToggle.addEventListener("click", () => {
      isDark = !isDark;

      if (isDark) {
        themeToggle.innerHTML = "🌙";
        document.documentElement.style.setProperty(
          "--primary-color",
          "#0a0a0a"
        );
        document.documentElement.style.setProperty(
          "--background-color",
          "#121212"
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          "#1a1a1a"
        );
        document.documentElement.style.setProperty("--text-color", "#ffffff");
      } else {
        themeToggle.innerHTML = "☀️";
        document.documentElement.style.setProperty(
          "--primary-color",
          "#f0f0f0"
        );
        document.documentElement.style.setProperty(
          "--background-color",
          "#e5e5e5"
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          "#d1d1d1"
        );
        document.documentElement.style.setProperty("--text-color", "#0a0a0a");
      }

      // Animate transition
      document.body.style.transition = "background-color 0.5s ease";
      document.querySelectorAll("section, header, footer").forEach((elem) => {
        elem.style.transition = "background-color 0.5s ease, color 0.5s ease";
      });
    });
  }

  // Add section reveal animations with advanced effects
  function addSectionRevealAnimations() {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;
            section.classList.add("revealed");

            // Create staggered animation for section elements
            const animElements = section.querySelectorAll(
              "h2, h3, p, .timeline li, .skill-bar"
            );
            animElements.forEach((el, index) => {
              el.style.opacity = "0";
              el.style.transform = "translateY(20px)";

              setTimeout(() => {
                el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }, 100 + index * 100);
            });

            // Special animation for headings
            const heading = section.querySelector("h2");
            if (heading) {
              heading.style.position = "relative";

              // Create glitch effect on reveal
              const glitchEffect = document.createElement("div");
              glitchEffect.className = "heading-glitch";
              glitchEffect.textContent = heading.textContent;
              glitchEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                color: var(--highlight-color);
                clip-path: inset(0 0 0 0);
                transform: translateX(5px);
                opacity: 0.3;
                pointer-events: none;
              `;

              heading.appendChild(glitchEffect);

              // Animate glitch effect
              setTimeout(() => {
                glitchEffect.style.transition =
                  "transform 0.2s ease, opacity 0.5s ease";
                glitchEffect.style.transform = "translateX(0)";
                glitchEffect.style.opacity = "0";
              }, 500);
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach((section) => {
      revealObserver.observe(section);
    });
  }

  // Add these keyframe animations to your CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInChar {
      0% {
        opacity: 0;
        transform: translateY(20px) rotateY(90deg);
      }
      50% {
        transform: translateY(0) rotateY(0);
      }
      100% {
        opacity: 1;
        transform: translateY(0) rotateY(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes gridPulse {
      0% {
        width: 10px;
        height: 10px;
        opacity: 0.8;
      }
      100% {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }

    @keyframes blink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    .particle {
      position: fixed;
      background: linear-gradient(45deg, var(--accent-color), var(--highlight-color));
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.6;
      animation: floatUp linear forwards;
      z-index: -1;
    }

    @keyframes floatUp {
      from {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0.6;
      }
      to {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    .typing-cursor {
      display: inline-block;
      font-weight: bold;
      color: var(--accent-color);
      animation: blink 0.7s infinite;
    }

    .section.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animated {
      animation: fadeIn 0.8s forwards;
    }
  `;
  document.head.appendChild(style);

  // Create animated background bubbles on scroll
  window.addEventListener("scroll", () => {
    if (Math.random() < 0.1) {
      const bubble = document.createElement("div");
      bubble.className = "background-bubble";

      const size = Math.random() * 50 + 20;
      const posX = Math.random() * window.innerWidth;
      const duration = Math.random() * 15 + 10;

      bubble.style.cssText = `
        position: fixed;
        bottom: -${size}px;
        left: ${posX}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid var(--accent-color);
        border-right-color: var(--highlight-color);
        opacity: 0.1;
        z-index: -2;
        pointer-events: none;
        animation: bubbleFloat ${Math.random() * 10 + 10}s linear forwards;
      `;

      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 20000);
    }
  });

  // Add this for smoother loading
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    // Initial scroll position check
    setTimeout(() => {
      const scrollY = window.scrollY;
      if (scrollY === 0) {
        // Subtle bounce animation for header
        header.style.animation = "bounce 2s ease";
      }
    }, 500);
  });
});
