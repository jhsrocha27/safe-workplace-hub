import { useReducer } from 'react';

interface PPEFormState {
  employeeName: string;
  ppeName: string;
  issueDate: string;
  expiryDate: string;
  observations: string;
  isValid: boolean;
  errors: {
    employeeName?: string;
    ppeName?: string;
    issueDate?: string;
    expiryDate?: string;
  };
}

type PPEFormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<PPEFormState, 'isValid' | 'errors'>; value: string }
  | { type: 'RESET_FORM' }
  | { type: 'VALIDATE_FORM' };

const initialState: PPEFormState = {
  employeeName: '',
  ppeName: '',
  issueDate: '',
  expiryDate: '',
  observations: '',
  isValid: false,
  errors: {}
};

function formReducer(state: PPEFormState, action: PPEFormAction): PPEFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined
        }
      };

    case 'RESET_FORM':
      return initialState;

    case 'VALIDATE_FORM': {
      const errors: PPEFormState['errors'] = {};
      
      if (!state.employeeName.trim()) {
        errors.employeeName = 'Nome do funcionário é obrigatório';
      }
      
      if (!state.ppeName.trim()) {
        errors.ppeName = 'EPI é obrigatório';
      }
      
      if (!state.issueDate.trim()) {
        errors.issueDate = 'Data de entrega é obrigatória';
      }
      
      if (!state.expiryDate.trim()) {
        errors.expiryDate = 'Data de validade é obrigatória';
      } else if (new Date(state.expiryDate) <= new Date(state.issueDate)) {
        errors.expiryDate = 'Data de validade deve ser posterior à data de entrega';
      }
      
      return {
        ...state,
        errors,
        isValid: Object.keys(errors).length === 0
      };
    }

    default:
      return state;
  }
}

export function usePPEForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (field: keyof Omit<PPEFormState, 'isValid' | 'errors'>, value: string) => {
    let formattedValue = value;
    
    if (field === 'issueDate' || field === 'expiryDate') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formattedValue = date.toISOString().split('T')[0];
      }
    }
    
    dispatch({ type: 'SET_FIELD', field, value: formattedValue });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const validateForm = async () => {
    dispatch({ type: 'VALIDATE_FORM' });
    return new Promise<boolean>((resolve) => {
      // Aguarda o próximo ciclo de renderização para garantir que o estado foi atualizado
      setTimeout(() => {
        resolve(state.isValid);
      }, 0);
    });
  };

  return {
    formData: state,
    setField,
    resetForm,
    validateForm,
    errors: state.errors,
    isValid: state.isValid
  };
}