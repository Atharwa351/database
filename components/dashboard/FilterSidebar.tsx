'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  X, 
  Search, 
  Building, 
  Briefcase, 
  Globe, 
  MapPin, 
  Map,
  Loader2
} from 'lucide-react';

export interface FilterState {
  'Company Name': string[];
  'Job title': string[];
  'Industry': string[];
  'Region': string[];
  'Metro': string[];
  'Location': string[];
}

interface FilterSidebarProps {
  columns: string[];
  columnLabels?: Record<string, string>;
  filters: Record<string, string[]>;
  onFilterChange: (column: string, values: string[]) => void;
  onClearAllFilters: () => void;
  totalResults: number;
}

export default function FilterSidebar({ columns, columnLabels = {}, filters, onFilterChange, onClearAllFilters, totalResults }: FilterSidebarProps) {
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const debounceTimeouts = {} as Record<string, NodeJS.Timeout>;

  const fetchOptions = async (column: string, search: string = '') => {
    setLoading(prev => ({ ...prev, [column]: true }));
    try {
      const url = `/api/master_table/filters?column=${encodeURIComponent(column)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      console.log('Fetching filter options:', url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('Fetched options for', column, ':', data.values);
      if (res.ok) {
        setOptions(prev => ({ ...prev, [column]: data.values }));
      }
    } catch (e) {
      console.error('Error fetching options for', column, e);
      setOptions(prev => ({ ...prev, [column]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [column]: false }));
    }
  };

  // Fetch initial options for all columns
  useEffect(() => {
    columns.forEach(col => fetchOptions(col));
  }, [columns]);

  // Debounced search
  const handleInputChange = (column: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [column]: value }));
    if (debounceTimeouts[column]) clearTimeout(debounceTimeouts[column]);
    debounceTimeouts[column] = setTimeout(() => {
      fetchOptions(column, value);
    }, 300);
  };

  const handleOptionSelect = (column: string, value: string) => {
    if (!filters[column]?.includes(value)) {
      onFilterChange(column, [...(filters[column] || []), value]);
    }
    setSearchTerms(prev => ({ ...prev, [column]: '' }));
    setOptions(prev => ({ ...prev, [column]: [] }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button onClick={onClearAllFilters} className="text-blue-600 hover:underline text-sm">Clear All</button>
      </div>
      <div className="space-y-4">
        {columns.map((column) => (
          <div key={column} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{columnLabels[column] || column.replace(/_/g, ' ')}</label>
            <input
              type="text"
              value={searchTerms[column] || ''}
              onChange={e => handleInputChange(column, e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              placeholder={`Filter by ${column.replace(/_/g, ' ')}`}
              autoComplete="off"
            />
            {loading[column] && (
              <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-blue-400" />
            )}
            {options[column] && options[column].length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
                {options[column].map(option => (
                  <li
                    key={option}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => handleOptionSelect(column, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-600">Total Results: {totalResults}</div>
    </aside>
  );
}