import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface BackHandler {
  id: string;
  fn: () => boolean | void;
  priority: number;
}

let handlers: BackHandler[] = [];
let isInitialized = false;
let lastBackPressTime = 0;
let exitToastTimeout: ReturnType<typeof setTimeout> | null = null;
let isPoppingHistory = false;

/**
 * Register a modal/drawer/popup close handler.
 * Priority: higher numbers are executed first (e.g. nested modal = 100, drawer = 50).
 */
export function registerBackButtonHandler(
  id: string,
  fn: () => boolean | void,
  priority: number = 10
): () => void {
  handlers = handlers.filter(h => h.id !== id);
  handlers.push({ id, fn, priority });
  handlers.sort((a, b) => b.priority - a.priority);

  // In web browsers, push history state so mobile browser swipe-back works
  if (!Capacitor.isNativePlatform() && typeof window !== 'undefined' && window.history) {
    try {
      window.history.pushState({ prideModalId: id }, '');
    } catch {
      // Ignore history push errors
    }
  }

  return () => {
    unregisterBackButtonHandler(id);
  };
}

export function unregisterBackButtonHandler(id: string): void {
  handlers = handlers.filter(h => h.id !== id);

  // If in web browser and the top history state belongs to this modal, pop it
  if (
    !isPoppingHistory &&
    !Capacitor.isNativePlatform() &&
    typeof window !== 'undefined' &&
    window.history.state?.prideModalId === id
  ) {
    try {
      window.history.back();
    } catch {
      // Ignore
    }
  }
}

/**
 * Executes the highest priority back handler.
 * Returns true if a handler was executed, false otherwise.
 */
export function executeTopHandler(): boolean {
  if (handlers.length > 0) {
    const top = handlers.shift()!;
    try {
      const result = top.fn();
      return result !== false;
    } catch (e) {
      console.error('Error in back button handler:', e);
      return true;
    }
  }
  return false;
}

/**
 * Fallback to close any open DOM modal or dialog
 */
export function closeAnyDomModal(): boolean {
  // 1. Dispatch Escape key to document & window (which triggers existing Escape handlers in modals)
  const escEvent = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    which: 27,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(escEvent);
  window.dispatchEvent(escEvent);

  // 2. Look for open modal overlay containers and trigger their close button
  const modalOverlays = document.querySelectorAll(
    '[role="dialog"], [aria-modal="true"], .fixed.inset-0'
  );

  for (let i = modalOverlays.length - 1; i >= 0; i--) {
    const overlay = modalOverlays[i];
    const rect = overlay.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const closeBtn = overlay.querySelector<HTMLElement>(
        'button[aria-label*="close" i], button[title*="close" i], button[aria-label*="बंद" i], button.close-modal'
      );
      if (closeBtn) {
        closeBtn.click();
        return true;
      }
    }
  }

  return false;
}

export interface BackButtonServiceOptions {
  isAtHome: () => boolean;
  onNavigateHome: () => void;
  showToast: (message: string) => void;
}

export function initializeBackButtonService(options: BackButtonServiceOptions): () => void {
  if (isInitialized) return () => {};
  isInitialized = true;

  // 1. Capacitor Native Android/iOS Back Button Handler
  let capacitorListenerRemove: (() => void) | null = null;
  if (Capacitor.isNativePlatform() || Capacitor.isPluginAvailable('App')) {
    try {
      const listenerPromise = CapApp.addListener('backButton', async () => {
        // Step 1: Try closing registered modal/popup
        if (executeTopHandler()) {
          return;
        }

        // Step 2: Try DOM modal fallback
        if (closeAnyDomModal()) {
          return;
        }

        // Step 3: If user is on a section other than home or scrolled down, navigate to home
        if (!options.isAtHome()) {
          options.onNavigateHome();
          return;
        }

        // Step 4: Already at home with no popups -> Double-tap to exit
        const now = Date.now();
        if (now - lastBackPressTime < 2000) {
          if (exitToastTimeout) clearTimeout(exitToastTimeout);
          CapApp.exitApp();
        } else {
          lastBackPressTime = now;
          options.showToast('बाहेर पडण्यासाठी पुन्हा एकदा मागे दाबा (Press back again to exit)');
          exitToastTimeout = setTimeout(() => {
            lastBackPressTime = 0;
          }, 2000);
        }
      });

      listenerPromise.then(handle => {
        capacitorListenerRemove = () => handle.remove();
      });
    } catch (e) {
      console.warn('Capacitor App backButton listener initialization failed:', e);
    }
  }

  // 2. Mobile Browser PopState Handler (for mobile web & PWA)
  const handlePopState = () => {
    isPoppingHistory = true;
    if (executeTopHandler()) {
      // Handled by registered modal
    } else if (closeAnyDomModal()) {
      // Handled by DOM modal
    } else if (!options.isAtHome()) {
      options.onNavigateHome();
    }
    setTimeout(() => {
      isPoppingHistory = false;
    }, 150);
  };
  window.addEventListener('popstate', handlePopState);

  // 3. Desktop Escape Key Listener
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      executeTopHandler();
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    isInitialized = false;
    if (capacitorListenerRemove) capacitorListenerRemove();
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('keydown', handleKeyDown);
  };
}

