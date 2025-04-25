// Configurações da aplicação

export const config = {
  // Configurações gerais
  app: {
    name: 'Segurança do Trabalho',
    version: '1.0.0',
  },

  // Configurações de armazenamento
  storage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },

  // Configurações de paginação
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Configurações de data e hora
  dateTime: {
    defaultDateFormat: 'DD/MM/YYYY',
    defaultTimeFormat: 'HH:mm',
    defaultDateTimeFormat: 'DD/MM/YYYY HH:mm',
  },

  // Configurações de validação
  validation: {
    minPasswordLength: 8,
    maxPasswordLength: 32,
    maxFileNameLength: 255,
  },
};