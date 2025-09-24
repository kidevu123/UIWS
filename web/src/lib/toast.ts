interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { type = 'info', duration = 4000 } = options;
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add toast to page
  document.body.appendChild(toast);
  
  // Trigger show animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

export function showErrorToast(message: string) {
  showToast(message, { type: 'error' });
}

export function showSuccessToast(message: string) {
  showToast(message, { type: 'success' });
}