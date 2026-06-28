export function initShimeji() {
  if (typeof window === 'undefined' || document.getElementById('gojo-shimeji')) return;

  const STATES = {
    FALLING: 'FALLING',
    IDLE: 'IDLE',
    WALKING: 'WALKING',
    DRAGGED: 'DRAGGED',
    CLIMBING_LEFT: 'CLIMBING_LEFT',
    CLIMBING_RIGHT: 'CLIMBING_RIGHT',
    TELEPORTING: 'TELEPORTING'
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

  let frame = 4;
  let frameTimer = 0;
  let actionTimer = 0;

  // Idle sequence trackers
  let currentIdleFrames = [11];
  let idleIndex = 0;

  const shimeji = document.createElement('div');
  shimeji.id = 'gojo-shimeji';
  shimeji.className = 'shimeji-gojo';
  
  const img = document.createElement('img');
  img.src = '/shimeji-gojo/shime4.png';
  img.draggable = false;
  shimeji.appendChild(img);
  document.body.appendChild(shimeji);

  const size = 128;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastMouseX = window.innerWidth / 2;
  let dragVelocityX = 0;

  // Interaction
  shimeji.addEventListener('mousedown', (e) => {
    isDragging = true;
    state = STATES.DRAGGED;
    dragOffsetX = e.clientX - x;
    dragOffsetY = e.clientY - y;
    lastMouseX = e.clientX;
    shimeji.style.cursor = 'grabbing';
    direction = 1; // reset flip for explicit drag frames
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      dragVelocityX = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      
      x = e.clientX - dragOffsetX;
      y = e.clientY - dragOffsetY;
      vy = 0;

      // Determine drag frame based on velocity
      let absVel = Math.abs(dragVelocityX);
      if (dragVelocityX > 0) { // moving right
        if (absVel > 20) frame = 9; // fast
        else if (absVel > 5) frame = 7; // med
        else frame = 5; // slow
      } else { // moving left
        if (absVel > 20) frame = 10;
        else if (absVel > 5) frame = 8;
        else frame = 6;
      }
      
      updatePosition(1); // Force scaleX(1) since we have distinct frames
      img.src = `/shimeji-gojo/shime${frame}.png`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      state = STATES.FALLING;
      frame = 4;
      img.src = `/shimeji-gojo/shime${frame}.png`;
      shimeji.style.cursor = 'grab';
    }
  });
  
  shimeji.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(confirm('Dismiss Gojo?')) {
      shimeji.remove();
    }
  });

  function updatePosition(overrideScaleX?: number) {
    let scaleX = overrideScaleX !== undefined ? overrideScaleX : -direction;
    shimeji.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX})`;
  }

  function pickRandomIdle() {
    let r = Math.random();
    if (r < 0.35) return [11]; // 35% duduk biasa
    if (r < 0.65) return [18, 19, 20, 21]; // 30% tiduran
    if (r < 0.85) return [30, 31, 32, 33]; // 20% siul
    if (r < 0.88) return [15, 16, 17]; // 3% buka mata 1
    if (r < 0.91) return [26, 27, 28, 29]; // 3% buka mata 2
    return [43, 44, 45, 46]; // 9% teleport
  }

  function changeState(newState) {
    state = newState;
    actionTimer = 0;
    frameTimer = 0;
    
    if (state === STATES.IDLE) {
      currentIdleFrames = pickRandomIdle();
      idleIndex = 0;
      frame = currentIdleFrames[0];
      
      if (currentIdleFrames[0] === 43) {
        state = STATES.TELEPORTING;
      }
    } else if (state === STATES.WALKING) {
      frame = 1;
      direction = Math.random() > 0.5 ? 1 : -1;
    } else if (state === STATES.FALLING) {
      frame = 4;
    } else if (state === STATES.CLIMBING_LEFT) {
      frame = 12;
      direction = 1; // specific frames don't need flip
    } else if (state === STATES.CLIMBING_RIGHT) {
      frame = 23;
      direction = 1;
    }
  }

  function animate() {
    if (!document.getElementById('gojo-shimeji')) return;

    if (state === STATES.FALLING) {
      vy += gravity;
      if (vy > maxVy) vy = maxVy;
      y += vy;
      frame = 4;

      if (y >= window.innerHeight - size) {
        y = window.innerHeight - size;
        vy = 0;
        changeState(STATES.IDLE);
      }
    } 
    else if (state === STATES.IDLE) {
      actionTimer++;
      if (actionTimer > 200 + Math.random() * 200) { 
        changeState(STATES.WALKING);
      }
      
      frameTimer++;
      if (frameTimer > 15) { // slower idle animation
        frameTimer = 0;
        idleIndex = (idleIndex + 1) % currentIdleFrames.length;
        frame = currentIdleFrames[idleIndex];
      }
    }
    else if (state === STATES.TELEPORTING) {
      frameTimer++;
      if (frameTimer > 10) {
        frameTimer = 0;
        idleIndex++;
        if (idleIndex < currentIdleFrames.length) {
          frame = currentIdleFrames[idleIndex];
          // On the very last frame (46), teleport across screen
          if (frame === 46) {
            x = Math.random() * (window.innerWidth - size);
            // small opacity flash effect
            shimeji.style.opacity = '0';
            setTimeout(() => { shimeji.style.opacity = '1'; }, 100);
          }
        } else {
          // done teleporting
          changeState(STATES.IDLE);
        }
      }
    }
    else if (state === STATES.WALKING) {
      x += walkSpeed * direction;
      
      if (x <= 0) {
        if (Math.random() > 0.5) {
          x = -32; // offset to touch left wall
          changeState(STATES.CLIMBING_LEFT);
        } else {
          x = 0;
          direction = 1;
        }
      } else if (x >= window.innerWidth - size) {
        if (Math.random() > 0.5) {
          x = window.innerWidth - size + 32; // offset to touch right wall
          changeState(STATES.CLIMBING_RIGHT);
        } else {
          x = window.innerWidth - size;
          direction = -1;
        }
      }

      actionTimer++;
      if (actionTimer > 150 + Math.random() * 150) {
        changeState(STATES.IDLE);
      }

      frameTimer++;
      if (frameTimer > 8) {
        frameTimer = 0;
        frame = frame === 3 ? 1 : frame + 1; // frames 1-3
      }
    }
    else if (state === STATES.CLIMBING_LEFT) {
      y -= walkSpeed; // move up
      
      frameTimer++;
      if (frameTimer > 12) {
        frameTimer = 0;
        frame = frame === 13 ? 12 : 13; // 12-13
      }
      
      if (y <= 0) {
        y = 0;
        x = 0; // reset offset
        changeState(STATES.FALLING); // drop when hits top
      }
    }
    else if (state === STATES.CLIMBING_RIGHT) {
      y -= walkSpeed;
      
      frameTimer++;
      if (frameTimer > 12) {
        frameTimer = 0;
        frame = frame >= 25 ? 23 : frame + 1; // 23-25
      }
      
      if (y <= 0) {
        y = 0;
        x = window.innerWidth - size; // reset offset
        changeState(STATES.FALLING);
      }
    }

    if (!isDragging) {
      // Apply direction scale only if walking or falling or idle
      let overrideScale = (state === STATES.CLIMBING_LEFT || state === STATES.CLIMBING_RIGHT || state === STATES.TELEPORTING) ? 1 : undefined;
      updatePosition(overrideScale);
      img.src = `/shimeji-gojo/shime${frame}.png`;
    }

    requestAnimationFrame(animate);
  }

  updatePosition();
  requestAnimationFrame(animate);
}
