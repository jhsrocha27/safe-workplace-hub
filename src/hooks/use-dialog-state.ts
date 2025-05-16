import { useState, useCallback } from 'react';

export type DialogState = Record<string, boolean>;

type UseDialogStateReturn = {
  dialogStates: DialogState;
  setDialogOpen: (dialogKey: string, isOpen: boolean) => void;
  resetDialogs: () => void;
};

export function useDialogState(initialState: DialogState): UseDialogStateReturn {
  const [dialogStates, setDialogStates] = useState<DialogState>(initialState);

  const setDialogOpen = useCallback((dialogKey: string, isOpen: boolean) => {
    setDialogStates(prev => ({
      ...prev,
      [dialogKey]: isOpen
    }));
  }, []);

  const resetDialogs = useCallback(() => {
    setDialogStates(initialState);
  }, [initialState]);

  return {
    dialogStates,
    setDialogOpen,
    resetDialogs
  };
}