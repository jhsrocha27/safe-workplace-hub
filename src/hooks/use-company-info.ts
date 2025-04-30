import { create } from 'zustand';

interface CompanyInfo {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface CompanyInfoStore {
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
}

export const useCompanyInfo = create<CompanyInfoStore>((set) => ({
  companyInfo: {
    name: 'SafeWork Engenharia',
    cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    phone: '(11) 98765-4321',
    email: 'contato@safework.com.br',
    website: 'www.safework.com.br'
  },
  setCompanyInfo: (info) => set({ companyInfo: info })
}));