import { useReducer } from 'react';

interface PPEFormState {
  employeeName: string;
  ppeName: string;
  issueDate: string;
  expiryDate: string;
  observations: string;
  signature: string;
  isValid: boolean;
  errors: {
    employeeName?: string;
    ppeName?: string;
    issueDate?: string;
    expiryDate?: string;
    signature?: string;
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
  signature: '',
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
      
      if (!state.employeeName) {
        errors.employeeName = 'Nome do funcionário é obrigatório';
      }
      
      if (!state.ppeName) {
        errors.ppeName = 'EPI é obrigatório';
      }
      
      if (!state.issueDate) {
        errors.issueDate = 'Data de entrega é obrigatória';
      }
      
      if (!state.expiryDate) {
        errors.expiryDate = 'Data de validade é obrigatória';
      } else if (new Date(state.expiryDate) <= new Date(state.issueDate)) {
        errors.expiryDate = 'Data de validade deve ser posterior à data de entrega';
      }
      
      if (!state.signature) {
        errors.signature = 'Assinatura é obrigatória';
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
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const validateForm = () => {
    dispatch({ type: 'VALIDATE_FORM' });
    return state.isValid;
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