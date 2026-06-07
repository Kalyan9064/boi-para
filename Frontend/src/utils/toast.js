// Premium SVG icons for Toast Types
const ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.063 1.063L12 13.501m-2.25-2.25h1.5m3 0H15m-3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
};

function createToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = createToastContainer();

  // Create toast list item
  const toastItem = document.createElement('div');
  toastItem.className = `toast-item toast-${type}`;
  toastItem.setAttribute('role', 'alert');
  toastItem.setAttribute('aria-live', 'assertive');

  // Setup Inner HTML structure
  toastItem.innerHTML = `
    <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close">&times;</button>
    <div class="toast-progress-bar">
      <div class="toast-progress"></div>
    </div>
  `;

  // Append toast
  container.appendChild(toastItem);

  // Trigger entering animation
  requestAnimationFrame(() => {
    toastItem.classList.add('toast-show');
    
    // Scale the progress bar down
    const progress = toastItem.querySelector('.toast-progress');
    if (progress) {
      progress.style.transition = `transform ${duration}ms linear`;
      progress.style.transform = 'scaleX(1)';
      // Let layout trigger before modifying transform
      setTimeout(() => {
        progress.style.transform = 'scaleX(0)';
      }, 50);
    }
  });

  let dismissTimeout;

  const dismiss = () => {
    clearTimeout(dismissTimeout);
    toastItem.classList.remove('toast-show');
    toastItem.classList.add('toast-hide');
    
    // Listen for animation finish
    const handleTransitionEnd = (e) => {
      if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
        toastItem.removeEventListener('transitionend', handleTransitionEnd);
        toastItem.remove();
        
        // Remove container if empty
        if (container.children.length === 0) {
          container.remove();
        }
      }
    };
    toastItem.addEventListener('transitionend', handleTransitionEnd);
  };

  // Setup click handler for close button
  const closeBtn = toastItem.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });
  }

  // Set timeout for auto-dismissal
  dismissTimeout = setTimeout(dismiss, duration);
}

const toast = {
  success: (msg, dur) => showToast(msg, 'success', dur),
  error: (msg, dur) => showToast(msg, 'error', dur),
  warning: (msg, dur) => showToast(msg, 'warning', dur),
  info: (msg, dur) => showToast(msg, 'info', dur),
};

export default toast;
