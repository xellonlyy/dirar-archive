import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import FloatingLogos from './components/FloatingLogos.vue'
import { initShimeji } from './shimeji'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(FloatingLogos)
    })
  },
  setup() {
    const route = useRoute()

    const initObserver = () => {
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
    })

    watch(() => route.path, () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('warp-active');
        void document.body.offsetWidth; // Force reflow
        document.body.classList.add('warp-active');
      }
      
      nextTick(() => {
        initObserver()
      })
    })
  }
}
