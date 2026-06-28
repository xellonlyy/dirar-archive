<script setup>
import { useData } from 'vitepress'
import { ref, onMounted, onUnmounted } from 'vue'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'

const { frontmatter } = useData()

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20 // -10 to 10
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20 // -10 to 10
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="floating-logos-wrapper" :style="{
    transform: `perspective(1000px) rotateY(${mouseX}deg) rotateX(${-mouseY}deg)`
  }">
    <!-- The central image from frontmatter -->
    <div class="image-bg"></div>
    <VPImage v-if="frontmatter.hero?.image" class="image-src" :image="frontmatter.hero.image" />
    
    <!-- Floating Logos -->
    <div class="icon icon-ae">
      <img src="/icons/Adobe_After_Effects_CC_icon.svg.png" alt="Adobe After Effects" />
    </div>
    
    <div class="icon icon-pr">
      <img src="/icons/Adobe_Premiere_Pro_CC_icon.svg.png" alt="Adobe Premiere Pro" />
    </div>
    
    <div class="icon icon-ps">
      <img src="/icons/Adobe_Photoshop_CC_icon.svg.png" alt="Adobe Photoshop" />
    </div>
    
    <div class="icon icon-davinci">
      <img src="/icons/DaVinci_Resolve_Studio.png" alt="DaVinci Resolve" />
    </div>
    
    <div class="icon icon-capcut">
      <img src="/icons/logo-capcut.png" alt="CapCut" />
    </div>
  </div>
</template>

<style scoped>
.floating-logos-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.image-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  transform: translate(-50%, -50%) translateZ(-50px);
  filter: blur(60px);
  z-index: 1;
}

.image-src {
  position: relative;
  z-index: 2;
  border-radius: 24px;
  transform: translateZ(20px);
  object-fit: cover;
  pointer-events: none;
}

/* Floating Animations */
@keyframes float1 {
  0%, 100% { transform: translateZ(80px) translateY(0px) rotate(-10deg); }
  50% { transform: translateZ(80px) translateY(-20px) rotate(-5deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateZ(100px) translateY(0px) rotate(15deg); }
  50% { transform: translateZ(100px) translateY(25px) rotate(10deg); }
}

@keyframes float3 {
  0%, 100% { transform: translateZ(120px) translateY(0px) rotate(-5deg); }
  50% { transform: translateZ(120px) translateY(-15px) rotate(-15deg); }
}

@keyframes float4 {
  0%, 100% { transform: translateZ(60px) translateY(0px) rotate(10deg); }
  50% { transform: translateZ(60px) translateY(20px) rotate(15deg); }
}

@keyframes float5 {
  0%, 100% { transform: translateZ(90px) translateY(0px) rotate(5deg); }
  50% { transform: translateZ(90px) translateY(-20px) rotate(-10deg); }
}

.icon {
  position: absolute;
  width: 64px;
  height: 64px;
  z-index: 3;
  border-radius: 16px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid var(--vp-c-border);
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-ae {
  top: 10%;
  left: -5%;
  animation: float1 4s ease-in-out infinite;
}

.icon-pr {
  top: 15%;
  right: -5%;
  animation: float2 5s ease-in-out infinite;
  animation-delay: 1s;
}

.icon-ps {
  bottom: 15%;
  left: 5%;
  animation: float3 6s ease-in-out infinite;
  animation-delay: 2s;
}

.icon-davinci {
  bottom: 10%;
  right: -5%;
  animation: float4 4.5s ease-in-out infinite;
  animation-delay: 0.5s;
}

.icon-capcut {
  top: 40%;
  left: -8%;
  animation: float5 5.5s ease-in-out infinite;
  animation-delay: 1.5s;
}

@media (max-width: 768px) {
  .icon {
    width: 48px;
    height: 48px;
  }
  .icon-ae { top: 0%; left: 0%; }
  .icon-pr { top: 5%; right: 0%; }
  .icon-ps { bottom: 0%; left: 5%; }
  .icon-davinci { bottom: 5%; right: 5%; }
  .icon-capcut { top: 40%; left: 0%; }
  .floating-logos-wrapper {
    transform: none !important;
  }
}
</style>
