import { useState, useCallback } from 'react';

type DialogState = {
  [key: string]: boolean;
};

export function useDialogState(initialState: DialogState = {}) {
  const [dialogStates, setDialogStates] = useState<DialogState>(initialState);

  const setDialogOpen = useCallback((dialogKey: string, isOpen: boolean) => {
    setDialogStates(prev => ({
      ...prev,
      [dialogKey]: isOpen
    }));
  }, []);

  const resetDialogs = useCallback(() => {
    setDialogStates({});
  }, []);

  return {
    dialogStates,
    setDialogOpen,
    resetDialogs
  };
}