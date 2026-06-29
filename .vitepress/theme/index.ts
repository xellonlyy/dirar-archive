import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import FloatingLogos from './components/FloatingLogos.vue'
import { initShimeji } from './shimeji'
import { inject } from '@vercel/analytics'

let dustAnimFrame: number;
function initDustParticles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('dust-canvas')) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'dust-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.style.opacity = '0.6';
  canvas.style.transition = 'opacity 1s ease';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles: any[] = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4 - 0.2, // slight upward drift
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx!.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(220, 200, 150, ${p.opacity})`;
      ctx!.fill();
    });
    dustAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

function destroyDustParticles() {
  if (typeof document === 'undefined') return;
  const canvas = document.getElementById('dust-canvas');
  if (canvas) {
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.remove();
      cancelAnimationFrame(dustAnimFrame);
    }, 1000);
  }
}

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(FloatingLogos)
    })
  },
  setup() {
    const route = useRoute()

    // Initialize Vercel Analytics
    if (typeof window !== 'undefined') {
      inject()
    }

    const initObserver = () => {
      if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
          }
        })
      }, { threshold: 0.1 })

      // Select elements to animate, avoiding headings so anchor links work perfectly
      // Added .faq-card and .glass-card for the new beautiful UI!
      document.querySelectorAll('.VPFeature, .vp-doc p, .vp-doc img, .vp-doc ul, .vp-doc ol, .faq-card, .glass-card').forEach((el) => {
        el.classList.add('scroll-hidden')
        observer.observe(el)
      })
    }

    onMounted(() => {
      initObserver()

      if (typeof window !== 'undefined') {
        // --- Shimeji Gojo ---
        initShimeji()

        // --- Custom Navbar Button (Toggle Gojo) ---
        const setupGojoToggle = () => {
          if (document.getElementById('gojo-toggle-btn')) return;
          const navMenu = document.querySelector('.VPNavBarMenu');
          if (navMenu) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'gojo-toggle-btn';
            toggleBtn.textContent = 'Remove Gojo';
            toggleBtn.className = 'gojo-toggle-btn';
            
            toggleBtn.onclick = () => {
              const shimeji = document.getElementById('gojo-shimeji');
              if (shimeji) {
                shimeji.remove();
                toggleBtn.textContent = 'Deploy Gojo';
                toggleBtn.style.color = 'var(--vp-c-brand-1)';
              } else {
                initShimeji();
                toggleBtn.textContent = 'Remove Gojo';
                toggleBtn.style.color = 'var(--vp-c-text-1)';
              }
            };
            
            navMenu.insertBefore(toggleBtn, navMenu.firstChild);
          } else {
            setTimeout(setupGojoToggle, 100);
          }
        };
        setTimeout(setupGojoToggle, 100);

        // --- Custom Desktop Sidebar Toggle ---
        const setupSidebarToggle = () => {
          if (document.getElementById('sidebar-toggle-btn')) return;
          const navTitle = document.querySelector('.VPNavBarTitle');
          if (navTitle) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'sidebar-toggle-btn';
            toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            toggleBtn.className = 'sidebar-toggle-btn';
            
            toggleBtn.onclick = () => {
              document.body.classList.toggle('desktop-sidebar-closed');
            };
            
            navTitle.parentElement.insertBefore(toggleBtn, navTitle);
          } else {
            setTimeout(setupSidebarToggle, 100);
          }
        };
        setTimeout(setupSidebarToggle, 100);

        // --- 1. Floating Orbs ---
        if (!document.getElementById('orbs-bg')) {
          const orbs = document.createElement('div')
          orbs.id = 'orbs-bg'
          orbs.className = 'bg-orbs-container'
          orbs.innerHTML = `
            <div class="bg-orb bg-orb-1"></div>
            <div class="bg-orb bg-orb-2"></div>
            <div class="bg-orb bg-orb-3"></div>
          `
          document.body.appendChild(orbs)
        }

        // --- 2. Mouse Spotlight ---
        document.addEventListener('mousemove', (e) => {
          const cards = document.querySelectorAll('.glass-card')
          cards.forEach((card) => {
            const htmlCard = card as HTMLElement
            const rect = htmlCard.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            htmlCard.style.setProperty('--mouse-x', `${x}px`)
            htmlCard.style.setProperty('--mouse-y', `${y}px`)
          })
        })

        // --- 3. Custom Cursor (Existing) ---
        if (!window.matchMedia('(pointer: coarse)').matches) {
          const cursor = document.createElement('div')
          cursor.id = 'custom-cursor'
          document.body.appendChild(cursor)

          document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block'
            cursor.style.left = e.clientX + 'px'
            cursor.style.top = e.clientY + 'px'
          })
          
          document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none'
          })
          
          document.addEventListener('mouseover', (e) => {
            const target = e.target as HTMLElement
            if (target && typeof target.closest === 'function') {
              const isClickable = target.closest('a, button, [role="button"], input, select, textarea, .vp-doc img, summary')
              if (isClickable) {
                cursor.classList.add('pointer')
              } else {
                cursor.classList.remove('pointer')
              }
            }
          })

          const style = document.createElement('style')
          style.innerHTML = '* { cursor: none !important; }'
          document.head.appendChild(style)
        }
      }
      
      // Global Click Listener
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // Mahoraga Button Logic
        const linkElem = target.closest('a') as HTMLAnchorElement;
        const isMahoraga = linkElem && linkElem.href && (linkElem.classList.contains('mahoraga-btn') || linkElem.href.includes('pixeldrain.com'));
        
        if (isMahoraga) {
          e.preventDefault();
          
          const overlay = document.createElement("div");
          overlay.className = "mahoraga-overlay";
          
          const wheel = document.createElement("img");
          wheel.src = withBase("/icons/mahoraga-wheel.png");
          wheel.className = "mahoraga-wheel-fullscreen";
          wheel.alt = "Adapting...";
          
          overlay.appendChild(wheel);
          document.body.appendChild(overlay);
          
          setTimeout(() => {
            overlay.remove();
            window.open(linkElem.href, '_blank');
          }, 1500);
        }
      });
    })

    watch(() => route.path, () => {
      if (typeof document !== 'undefined') {
        const isBeginner = route.path.includes('/beginnersguide');
        if (isBeginner) {
          document.body.classList.add('is-ancient-scroll');
          initDustParticles();
        } else {
          document.body.classList.remove('is-ancient-scroll');
          destroyDustParticles();
        }
      }
      
      nextTick(() => {
        initObserver()
      })
    }, { immediate: true })
  }
}
