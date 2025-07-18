'use client';

import { useState, useEffect, useRef } from 'react';
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
  Loader2,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface FilterDropdownProps {
  column: string;
  label: string;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  icon: React.ComponentType<{ className?: string }>;
}

function FilterDropdown({ column, label, selectedValues, onSelectionChange, icon: Icon }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchOptions = async (search: string = '') => {
    setLoading(true);
    try {
      const url = `/api/master_table/filters?column=${encodeURIComponent(column)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setOptions(data.values || []);
      }
    } catch (e) {
      console.error('Error fetching options for', column, e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, column]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchOptions(value);
    }, 300);
  };

  const handleOptionToggle = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onSelectionChange(newValues);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full justify-between h-11 px-4 py-2 bg-white border-2 transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
          selectedValues.length > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`h-4 w-4 ${selectedValues.length > 0 ? 'text-blue-600' : 'text-gray-500'}`} />
          <span className={`font-medium ${selectedValues.length > 0 ? 'text-blue-900' : 'text-gray-700'}`}>
            {label}
          </span>
          {selectedValues.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
              {selectedValues.length}
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              {selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading options...</span>
                </div>
              ) : options.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No options found</p>
                </div>
              ) : (
                <div className="py-2">
                  {options.map((option) => (
                    <motion.div
                      key={option}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOptionToggle(option)}
                    >
                      <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-all ${
                        selectedValues.includes(option) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        {selectedValues.includes(option) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`flex-1 ${selectedValues.includes(option) ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                        {option}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ 
  columns, 
  columnLabels = {}, 
  filters, 
  onFilterChange, 
  onClearAllFilters, 
  totalResults 
}: FilterSidebarProps) {
  const getIcon = (column: string) => {
    switch (column) {
      case 'region': return Map;
      case 'industry': return Building;
      case 'job_title': return Briefcase;
      case 'location': return MapPin;
      default: return Globe;
    }
  };

  const totalFiltersApplied = Object.values(filters).reduce((sum, values) => sum + values.length, 0);

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-500">Refine your search</p>
            </div>
          </div>
          {totalFiltersApplied > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {totalFiltersApplied > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([column, values]) =>
              values.map((value) => (
                <Badge
                  key={`${column}-${value}`}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                  onClick={() => onFilterChange(column, values.filter(v => v !== value))}
                >
                  {value}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))
            )}
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {columns.map((column) => (
          <FilterDropdown
            key={column}
            column={column}
            label={columnLabels[column] || column.replace(/_/g, ' ')}
            selectedValues={filters[column] || []}
            onSelectionChange={(values) => onFilterChange(column, values)}
            icon={getIcon(column)}
          />
        ))}
      </div>

      {/* Results Summary */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {totalResults.toLocaleString()} Results
            </p>
            <p className="text-xs text-gray-500">
              {totalFiltersApplied} filter{totalFiltersApplied !== 1 ? 's' : ''} applied
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {totalResults > 999 ? '999+' : totalResults}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}