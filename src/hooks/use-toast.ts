
import * as React from "react";
import {
  ToastActionElement,
  ToastProps as RadixToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 5000;
const TOAST_ANIMATION_DURATION = 300;

type BaseToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
};

type ToasterToast = BaseToast & RadixToastProps;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Omit<ToasterToast, "id">;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>[]>();

const clearToastTimeouts = (toastId: string) => {
  const timeouts = toastTimeouts.get(toastId);
  if (timeouts) {
    timeouts.forEach(clearTimeout);
    toastTimeouts.delete(toastId);
  }
};

const addToRemoveQueue = (toastId: string, duration = TOAST_REMOVE_DELAY) => {
  if (duration <= 0) return;

  clearToastTimeouts(toastId);
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const dismissTimeout = setTimeout(() => {
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId: toastId,
    });
  }, duration);

  const removeTimeout = setTimeout(() => {
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    });
    clearToastTimeouts(toastId);
  }, duration + TOAST_ANIMATION_DURATION);

  timeouts.push(dismissTimeout, removeTimeout);
  toastTimeouts.set(toastId, timeouts);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      const newToast = { ...action.toast, id: genId(), open: true };
      return {
        ...state,
        toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    }

    case actionTypes.UPDATE_TOAST: {
      if (!action.toast.id) return state;

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          (t.id === toastId || toastId === undefined) ? { ...t, open: false } : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;
      if (toastId === undefined) {
        state.toasts.forEach((toast) => clearToastTimeouts(toast.id));
        return { ...state, toasts: [] };
      }

      clearToastTimeouts(toastId);
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }

    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInputProps = Omit<ToasterToast, "id">;

function toast(props: ToastInputProps) {
  const id = genId();

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => {
    clearToastTimeouts(id);
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

    setTimeout(() => {
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
    }, TOAST_ANIMATION_DURATION);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) dismiss();
    props.onOpenChange?.(open);
  };

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      open: true,
      onOpenChange,
    },
  });

  if (props.duration !== 0) {
    const duration = props.duration ?? TOAST_REMOVE_DELAY;
    addToRemoveQueue(id, duration);
  }

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      state.toasts.forEach((toast) => {
        clearToastTimeouts(toast.id);
      });
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        clearToastTimeouts(toastId);
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
        }, TOAST_ANIMATION_DURATION);
      } else {
        state.toasts.forEach((toast) => {
          clearToastTimeouts(toast.id);
        });
        dispatch({ type: actionTypes.DISMISS_TOAST });
        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST });
        }, TOAST_ANIMATION_DURATION);
      }
    },
  };
}

export { useToast, toast };
