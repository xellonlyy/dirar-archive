import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
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
      document.querySelectorAll('.VPFeature, .vp-doc p, .vp-doc img, .vp-doc ul, .vp-doc ol').forEach((el) => {
        el.classList.add('scroll-hidden')
        observer.observe(el)
      })
    }

    onMounted(() => {
      initObserver()

      if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
        const cursor = document.createElement('div')
        cursor.id = 'custom-cursor'
        document.body.appendChild(cursor)

        document.addEventListener('mousemove', (e) => {
          cursor.style.display = 'block'
          cursor.style.left = e.clientX + 'px'
          cursor.style.top = e.clientY + 'px'
        })

        const style = document.createElement('style')
        style.innerHTML = '* { cursor: none !important; }'
        document.head.appendChild(style)
      }
    })

    watch(() => route.path, () => {
      nextTick(() => {
        initObserver()
      })
    })
  }
}
