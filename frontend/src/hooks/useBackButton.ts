import { useEffect } from 'react';
import { registerBackButtonHandler } from '../services/backButtonService';

/**
 * Hook to automatically register and clean up back button handler when a modal/popup/drawer is open
 */
export function useBackButton(
  id: string,
  isOpen: boolean,
  onClose: () => void,
  priority: number = 10
) {
  useEffect(() => {
    if (!isOpen) return;

    const unregister = registerBackButtonHandler(id, () => {
      onClose();
      return true;
    }, priority);

    return () => {
      unregister();
    };
  }, [id, isOpen, onClose, priority]);
}

