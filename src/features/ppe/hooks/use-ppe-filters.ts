import { useMemo, useState } from 'react';
import { PPEDelivery, PPEItem } from '@/services/types';

type FilterState = {
  searchTerm: string;
  currentTab: 'deliveries' | 'inventory';
  filteredDeliveries: PPEDelivery[];
  filteredItems: PPEItem[];
};

type FilterActions = {
  setSearchTerm: (term: string) => void;
  setCurrentTab: (tab: 'deliveries' | 'inventory') => void;
};

export type PPEFilterState = FilterState & FilterActions;

export function usePPEFilters(
  deliveries: PPEDelivery[],
  ppeItems: PPEItem[]
): PPEFilterState {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState<'deliveries' | 'inventory'>('deliveries');

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(delivery => {
      const searchLower = searchTerm.toLowerCase();
      return (
        delivery.employeeName?.toLowerCase().includes(searchLower) ||
        delivery.ppeName?.toLowerCase().includes(searchLower) ||
        delivery.department?.toLowerCase().includes(searchLower)
      );
    });
  }, [deliveries, searchTerm]);

  const filteredItems = useMemo(() => {
    return ppeItems.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower) ||
        item.ca?.toLowerCase().includes(searchLower)
      );
    });
  }, [ppeItems, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    currentTab,
    setCurrentTab,
    filteredDeliveries,
    filteredItems,
  };
}