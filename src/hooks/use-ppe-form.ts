import { useReducer } from 'react';

// Função auxiliar para obter o período de validade do EPI
function getValidityPeriod(ppeName: string): number {
  // Normaliza o nome do EPI removendo acentos e convertendo para minúsculas
  const normalizedPPEName = ppeName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Lista de EPIs com suas variações de nome e períodos de validade
  const ppeData = [
    {
      variations: ['capacete de seguranca', 'capacete', 'capacete de protecao'],
      validityPeriod: 12
    },
    {
      variations: ['protetor auricular', 'protetor de ouvido', 'abafador'],
      validityPeriod: 6
    },
    {
      variations: ['oculos de protecao', 'oculos de seguranca', 'oculos'],
      validityPeriod: 6
    },
    {
      variations: ['luvas de seguranca', 'luvas', 'luva de protecao'],
      validityPeriod: 3
    },
    {
      variations: ['mascara pff2', 'respirador pff2', 'pff2'],
      validityPeriod: 1
    }
  ];

  // Busca o EPI que corresponde ao nome fornecido
  const ppe = ppeData.find(item =>
    item.variations.some(variation => normalizedPPEName.includes(variation))
  );

  if (!ppe) {
    console.warn(`EPI não encontrado: ${ppeName}`);
    return 0;
  }

  return ppe.validityPeriod;
}

interface PPEFormState {
  description: string;
  name: string;
  ca: string;
  type: string;
  validity_period: number;
  employeeName: string;
  ppeName: string;
  delivery_date: string;
  expiryDate: string;
  observations: string;
  isValid: boolean;
  errors: {
    employeeName?: string;
    ppeName?: string;
    delivery_date?: string;
    expiryDate?: string;
    name?: string;
    ca?: string;
    type?: string;
    validity_period?: string;
    description?: string;
  };
}

type PPEFormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<PPEFormState, 'isValid' | 'errors'>; value: string; errors?: PPEFormState['errors'] }
  | { type: 'RESET_FORM' }
  | { type: 'VALIDATE_FORM' };

const initialState: PPEFormState = {
  employeeName: '',
  ppeName: '',
  delivery_date: '',
  expiryDate: '',
  observations: '',
  description: '',
  name: '',
  ca: '',
  type: '',
  validity_period: 0,
  isValid: false,
  errors: {}
};

function formReducer(state: PPEFormState, action: PPEFormAction): PPEFormState {
  switch (action.type) {
    case 'SET_FIELD':
      const newState = {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined,
          ...(action.errors || {})
        }
      };
      
      // Validação imediata do campo alterado
      const fieldErrors: PPEFormState['errors'] = {};
      
      if (action.field === 'employeeName' && !action.value.trim()) {
        fieldErrors.employeeName = 'Nome do funcionário é obrigatório';
      }
      
      if (action.field === 'ppeName' && !action.value.trim()) {
        fieldErrors.ppeName = 'EPI é obrigatório';
      }
      
      if (action.field === 'delivery_date') { // Changed from issueDate to delivery_date
        if (!action.value.trim()) {
          fieldErrors.delivery_date = 'Data de entrega é obrigatória';
        } else {
          const date = new Date(action.value);
          if (isNaN(date.getTime())) {
            fieldErrors.delivery_date = 'Data de entrega inválida';
          }
        }
      }
      
      return {
        ...newState,
        errors: { ...newState.errors, ...fieldErrors, ...(action.errors || {}) },
        isValid: Object.keys(fieldErrors).length === 0 && Object.keys(action.errors || {}).length === 0
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
      
      if (!state.delivery_date.trim()) { // Changed from issueDate to delivery_date
        errors.delivery_date = 'Data de entrega é obrigatória';
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
    let additionalUpdates = {};
    let fieldErrors: PPEFormState['errors'] = {};
    
    if (field === 'ppeName') {
      // Quando um EPI é selecionado, calcula a data de validade se houver uma data de entrega
      if (state.delivery_date) { // Changed from issueDate to delivery_date
        try {
          const validityPeriod = getValidityPeriod(value);
          if (validityPeriod > 0) {
            const deliveryDate = new Date(state.delivery_date); // Changed from issueDate to delivery_date
            
            // Valida se a data de entrega é válida
            if (isNaN(deliveryDate.getTime())) {
              fieldErrors.delivery_date = 'Data de entrega inválida'; // Changed from issueDate to delivery_date
              fieldErrors.expiryDate = 'Não é possível calcular a data de validade';
            } else {
              const expiryDate = new Date(deliveryDate);
              expiryDate.setMonth(expiryDate.getMonth() + validityPeriod);
              
              // Garante que a data de validade seja válida
              if (isNaN(expiryDate.getTime())) {
                fieldErrors.expiryDate = 'Erro ao calcular a data de validade';
                console.error('Erro ao calcular data de validade:', {
                  deliveryDate: state.delivery_date,
                  validityPeriod,
                  ppeName: value
                });
              } else {
                additionalUpdates = {
                  expiryDate: expiryDate.toISOString().split('T')[0]
                };
              }
            }
          } else {
            fieldErrors.expiryDate = 'Período de validade não encontrado para este EPI';
          }
        } catch (error) {
          console.error('Erro ao processar data de validade:', error);
          fieldErrors.expiryDate = 'Erro ao calcular a data de validade';
        }
      }
    } else if (field === 'delivery_date') { // Changed from issueDate to delivery_date
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          fieldErrors.delivery_date = 'Data de entrega inválida'; // Changed from issueDate to delivery_date
          fieldErrors.expiryDate = 'Não é possível calcular a data de validade';
        } else {
          formattedValue = date.toISOString().split('T')[0];
          
          // Se já houver um EPI selecionado, calcula a data de validade
          if (state.ppeName) {
            const validityPeriod = getValidityPeriod(state.ppeName);
            if (validityPeriod > 0) {
              const expiryDate = new Date(date);
              expiryDate.setMonth(expiryDate.getMonth() + validityPeriod);
              
              // Garante que a data de validade seja válida
              if (isNaN(expiryDate.getTime())) {
                fieldErrors.expiryDate = 'Erro ao calcular a data de validade';
                console.error('Erro ao calcular data de validade:', {
                  deliveryDate: value,
                  validityPeriod,
                  ppeName: state.ppeName
                });
              } else {
                additionalUpdates = {
                  expiryDate: expiryDate.toISOString().split('T')[0]
                };
              }
            } else {
              fieldErrors.expiryDate = 'Período de validade não encontrado para este EPI';
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar data:', error);
        fieldErrors.delivery_date = 'Data de entrega inválida'; // Changed from issueDate to delivery_date
        fieldErrors.expiryDate = 'Não é possível calcular a data de validade';
      }
    }
    
    dispatch({ type: 'SET_FIELD', field, value: formattedValue, errors: fieldErrors });
    
    // Atualiza a data de validade se necessário
    if (Object.keys(additionalUpdates).length > 0) {
      Object.entries(additionalUpdates).forEach(([field, value]) => {
        if (field === 'expiryDate' && typeof value === 'string') {
          dispatch({ type: 'SET_FIELD', field: 'expiryDate', value });
        }
      });
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const validateForm = () => {
    dispatch({ type: 'VALIDATE_FORM' });
    return Object.keys(state.errors).length === 0;
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
