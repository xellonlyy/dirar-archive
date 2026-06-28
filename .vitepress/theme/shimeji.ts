export function initShimeji() {
  if (typeof window === 'undefined' || document.getElementById('gojo-shimeji')) return;

  const STATES = {
    FALLING: 'FALLING',
    IDLE: 'IDLE',
    WALKING: 'WALKING',
    DRAGGED: 'DRAGGED'
  };

  let state = STATES.FALLING;
  let x = window.innerWidth / 2;
  let y = -100;
  let vx = 0;
  let vy = 0;
  const gravity = 0.5;
  const maxVy = 15;
  const walkSpeed = 2;
  let direction = Math.random() > 0.5 ? 1 : -1; // 1 = right, -1 = left

  let frame = 1;
  let frameTimer = 0;
  let actionTimer = 0;

  const shimeji = document.createElement('div');
  shimeji.id = 'gojo-shimeji';
  shimeji.className = 'shimeji-gojo';
  
  const img = document.createElement('img');
  img.src = '/shimeji-gojo/shime7.png'; // initial falling frame
  img.draggable = false;
  shimeji.appendChild(img);
  document.body.appendChild(shimeji);

  const size = 128; // standard shimeji size
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Interaction
  shimeji.addEventListener('mousedown', (e) => {
    isDragging = true;
    state = STATES.DRAGGED;
    dragOffsetX = e.clientX - x;
    dragOffsetY = e.clientY - y;
    img.src = '/shimeji-gojo/shime7.png'; // holding frame
    shimeji.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      x = e.clientX - dragOffsetX;
      y = e.clientY - dragOffsetY;
      vy = 0;
      updatePosition();
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      state = STATES.FALLING;
      shimeji.style.cursor = 'grab';
    }
  });
  
  // Also add close functionality on double click or right click
  shimeji.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(confirm('Dismiss Gojo?')) {
      shimeji.remove();
    }
  });

  function updatePosition() {
    shimeji.style.transform = `translate(${x}px, ${y}px) scaleX(${direction})`;
  }

  function changeState(newState) {
    state = newState;
    actionTimer = 0;
    frameTimer = 0;
    
    if (state === STATES.IDLE) {
      frame = Math.random() > 0.5 ? 1 : 11; // 1 = stand, 11 = sit
    } else if (state === STATES.WALKING) {
      frame = 4; // start walking
      direction = Math.random() > 0.5 ? 1 : -1;
    } else if (state === STATES.FALLING) {
      frame = 7;
    }
  }

  function animate() {
    if (!document.getElementById('gojo-shimeji')) return; // if removed

    // Physics & State Logic
    if (state === STATES.FALLING) {
      vy += gravity;
      if (vy > maxVy) vy = maxVy;
      y += vy;

      if (y >= window.innerHeight - size) {
        y = window.innerHeight - size;
        vy = 0;
        changeState(STATES.IDLE);
      }
      
      // Falling animation frames 7,8,9
      frameTimer++;
      if (frameTimer > 10) {
        frameTimer = 0;
        frame = frame === 7 ? 8 : (frame === 8 ? 9 : 7);
      }
    } 
    else if (state === STATES.IDLE) {
      actionTimer++;
      if (actionTimer > 120 + Math.random() * 120) { // 2-4 seconds
        changeState(STATES.WALKING);
      }
      
      // Idle animation (1,2,3 or 11,12,13)
      frameTimer++;
      if (frameTimer > 15) {
        frameTimer = 0;
        if (frame >= 1 && frame <= 3) {
          frame = frame === 3 ? 1 : frame + 1;
        } else if (frame >= 11 && frame <= 13) {
          frame = frame === 13 ? 11 : frame + 1;
        }
      }
    }
    else if (state === STATES.WALKING) {
      x += walkSpeed * direction;
      
      // Screen bounds
      if (x <= 0) {
        x = 0;
        direction = 1;
      } else if (x >= window.innerWidth - size) {
        x = window.innerWidth - size;
        direction = -1;
      }

      actionTimer++;
      if (actionTimer > 100 + Math.random() * 100) {
        changeState(STATES.IDLE);
      }

      // Walking animation frames 4,5,6
      frameTimer++;
      if (frameTimer > 8) {
        frameTimer = 0;
        frame = frame === 6 ? 4 : frame + 1;
      }
    }

    if (!isDragging) {
      updatePosition();
      img.src = `/shimeji-gojo/shime${frame}.png`;
    }

    requestAnimationFrame(animate);
  }

  // Start the loop
  updatePosition();
  requestAnimationFrame(animate);
}
