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
    })

    watch(() => route.path, () => {
      nextTick(() => {
        initObserver()
      })
    })
  }
}
