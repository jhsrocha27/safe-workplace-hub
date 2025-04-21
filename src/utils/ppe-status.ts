/**
 * Utilitário para calcular o status de validade dos EPIs
 */

export type PPEValidityStatus = 'valid' | 'expiring' | 'expired';

export interface PPEStatusResult {
  status: PPEValidityStatus;
  color: string;
  label: string;
}

/**
 * Calcula o status de validade de um EPI com base na data de entrega e período de validade
 * @param issueDate Data de entrega do EPI
 * @param validityPeriod Período de validade em meses
 * @returns Objeto contendo status, cor e label
 */
export function calculatePPEStatus(issueDate: string, validityPeriod: number): PPEStatusResult {
  // Converte a data de entrega para um objeto Date
  const issueDateObj = new Date(issueDate);
  
  // Calcula a data de validade adicionando o período de validade em meses
  const expiryDate = new Date(issueDateObj);
  expiryDate.setMonth(expiryDate.getMonth() + validityPeriod);
  
  // Data atual
  const today = new Date();
  
  // Calcula o período de alerta (30 dias antes do vencimento)
  const warningDate = new Date(expiryDate);
  warningDate.setDate(warningDate.getDate() - 30);
  
  // Determina o status com base nas datas
  if (today > expiryDate) {
    // EPI vencido
    return {
      status: 'expired',
      color: 'text-red-600 bg-red-100',
      label: 'Vencido'
    };
  } else if (today >= warningDate) {
    // EPI próximo do vencimento (menos de 30 dias)
    return {
      status: 'expiring',
      color: 'text-amber-600 bg-amber-100',
      label: 'A vencer'
    };
  } else {
    // EPI válido
    return {
      status: 'valid',
      color: 'text-green-600 bg-green-100',
      label: 'Válido'
    };
  }
}

/**
 * Formata a data de validade para exibição
 * @param issueDate Data de entrega do EPI
 * @param validityPeriod Período de validade em meses
 * @returns Data formatada (DD/MM/YYYY)
 */
export function formatExpiryDate(issueDate: string, validityPeriod: number): string {
  const issueDateObj = new Date(issueDate);
  const expiryDate = new Date(issueDateObj);
  expiryDate.setMonth(expiryDate.getMonth() + validityPeriod);
  
  return expiryDate.toLocaleDateString('pt-BR');
}