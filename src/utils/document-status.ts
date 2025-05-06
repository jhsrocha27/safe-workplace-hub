/**
 * Utilitário para calcular o status de validade dos documentos
 */

export type DocumentValidityStatus = 'valid' | 'expiring' | 'expired';

export interface DocumentStatusResult {
  status: DocumentValidityStatus;
}

/**
 * Calcula o status de validade de um documento com base na data de validade
 * @param expiryDate Data de validade do documento
 * @returns Objeto contendo o status do documento
 */
export function calculateDocumentStatus(expiryDate: string): DocumentStatusResult {
  const expiryDateObj = new Date(expiryDate);
  expiryDateObj.setHours(23, 59, 59, 999);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determina o status com base nas datas
  if (today > expiryDateObj) {
    return { status: 'expired' };
  } else {
    // Calcula o período de alerta (30 dias antes do vencimento)
    const warningDate = new Date(expiryDateObj);
    warningDate.setDate(warningDate.getDate() - 30);
    
    if (today >= warningDate) {
      return { status: 'expiring' };
    } else {
      return { status: 'valid' };
    }
  }
}