import { useReducer, useCallback } from 'react';

interface PPEItem {
  id: number;
  name: string;
  ca: string;
  type: string;
  validityPeriod: number;
  description: string;
}

interface PPEDelivery {
  id: number;
  employeeId: number;
  employeeName: string;
  position: string;
  department: string;
  ppeId: number;
  ppeName: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring';
  signature: boolean;
}

interface PPEState {
  deliveries: PPEDelivery[];
  selectedDelivery: PPEDelivery | null;
  searchTerm: string;
  currentTab: string;
  dialogStates: {
    detail: boolean;
    renewal: boolean;
    delete: boolean;
    new: boolean;
  };
}

type PPEAction =
  | { type: 'SET_DELIVERIES'; deliveries: PPEDelivery[] }
  | { type: 'ADD_DELIVERY'; delivery: PPEDelivery }
  | { type: 'UPDATE_DELIVERY'; delivery: PPEDelivery }
  | { type: 'DELETE_DELIVERY'; id: number }
  | { type: 'SET_SELECTED_DELIVERY'; delivery: PPEDelivery | null }
  | { type: 'SET_SEARCH_TERM'; term: string }
  | { type: 'SET_CURRENT_TAB'; tab: string }
  | { type: 'SET_DIALOG_STATE'; dialog: keyof PPEState['dialogStates']; isOpen: boolean };

const initialState: PPEState = {
  deliveries: [],
  selectedDelivery: null,
  searchTerm: '',
  currentTab: 'deliveries',
  dialogStates: {
    detail: false,
    renewal: false,
    delete: false,
    new: false
  }
};

function ppeReducer(state: PPEState, action: PPEAction): PPEState {
  switch (action.type) {
    case 'SET_DELIVERIES':
      return { ...state, deliveries: action.deliveries };

    case 'ADD_DELIVERY':
      return {
        ...state,
        deliveries: [...state.deliveries, action.delivery]
      };

    case 'UPDATE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(delivery =>
          delivery.id === action.delivery.id ? action.delivery : delivery
        )
      };

    case 'DELETE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.filter(delivery => delivery.id !== action.id)
      };

    case 'SET_SELECTED_DELIVERY':
      return { ...state, selectedDelivery: action.delivery };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.term };

    case 'SET_CURRENT_TAB':
      return { ...state, currentTab: action.tab };

    case 'SET_DIALOG_STATE':
      return {
        ...state,
        dialogStates: {
          ...state.dialogStates,
          [action.dialog]: action.isOpen
        }
      };

    default:
      return state;
  }
}

export function usePPEManagement(initialDeliveries: PPEDelivery[]) {
  const [state, dispatch] = useReducer(ppeReducer, {
    ...initialState,
    deliveries: initialDeliveries
  });

  const filteredDeliveries = useCallback(() => {
    return state.deliveries.filter(delivery =>
      delivery.employeeName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      delivery.ppeName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      delivery.department.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }, [state.deliveries, state.searchTerm]);

  const addDelivery = useCallback((delivery: PPEDelivery) => {
    dispatch({ type: 'ADD_DELIVERY', delivery });
  }, []);

  const updateDelivery = useCallback((delivery: PPEDelivery) => {
    dispatch({ type: 'UPDATE_DELIVERY', delivery });
  }, []);

  const deleteDelivery = useCallback((id: number) => {
    dispatch({ type: 'DELETE_DELIVERY', id });
  }, []);

  const setSelectedDelivery = useCallback((delivery: PPEDelivery | null) => {
    dispatch({ type: 'SET_SELECTED_DELIVERY', delivery });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', term });
  }, []);

  const setCurrentTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_CURRENT_TAB', tab });
  }, []);

  const setDialogState = useCallback((dialog: keyof PPEState['dialogStates'], isOpen: boolean) => {
    dispatch({ type: 'SET_DIALOG_STATE', dialog, isOpen });
  }, []);

  return {
    state,
    filteredDeliveries: filteredDeliveries(),
    addDelivery,
    updateDelivery,
    deleteDelivery,
    setSelectedDelivery,
    setSearchTerm,
    setCurrentTab,
    setDialogState
  };
}