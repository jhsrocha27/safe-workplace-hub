import { useReducer, useCallback } from 'react';

interface PPEItem {
  id: number;
  name: string;
  type: string;
  ca_number: string;
  validity_date: string;
  quantity: number;
  created_at?: string;
}

export interface PPEDelivery {
  id: number;
  ppe_id: number;
  employee_id: number;
  delivery_date: string;
  quantity: number;
  created_at?: string;
  // Campos estendidos para UI
  employeeName: string;
  position: string;
  department: string;
  ppeName: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring';
  signature: boolean;
}

interface PPEState {
  deliveries: PPEDelivery[];
  selectedDelivery: PPEDelivery | null;
  searchTerm: string;
  currentTab: 'deliveries' | 'inventory' | 'reports';
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
  | { type: 'SET_CURRENT_TAB'; tab: 'deliveries' | 'inventory' | 'reports' }
  | { type: 'SET_DIALOG_STATE'; dialog: keyof PPEState['dialogStates']; isOpen: boolean };

const initialState: PPEState = {
  deliveries: [],
  selectedDelivery: null,
  searchTerm: '',
  currentTab: 'deliveries' as const,
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
    const now = new Date();
    return state.deliveries.filter(delivery => {
      const matchesSearch = 
        delivery.employeeName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        delivery.ppeName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        delivery.department.toLowerCase().includes(state.searchTerm.toLowerCase());
      
      const expiryDate = new Date(delivery.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      delivery.status = daysUntilExpiry <= 0 ? 'expired' :
                       daysUntilExpiry <= 30 ? 'expiring' : 'valid';
      
      return matchesSearch;
    });
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

  const setCurrentTab = useCallback((tab: 'deliveries' | 'inventory' | 'reports') => {
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