'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Search, 
  ArrowUpDown,
  FileText,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataItem {
  id?: string;
  full_name: string;
  industry: string;
  job_title: string;
  emails: string;
  mobile: string;
  phone_number: string;
  company_name: string;
  company_website: string;
  company_size: string;
  location: string;
  metro: string;
  region: string;
  middle_initial: string;
  middle_name: string;
  linkedin_url: string;
  company_location_region: string;
  company_location_address_line_2: string;
  location_country: string;
  source_state: string;
  row_hash: string;
  created_at: string;
  [key: string]: any;
}

interface DataTableProps {
  data: DataItem[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
  isLoading?: boolean;
}

// Skeleton loader component
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 22 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

export default function DataTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  totalItems,
  totalPages,
  isLoading = false
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DataItem>('company_size');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: keyof DataItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Create CSV content
      const headers = [
        'id', 'full_name', 'industry', 'job_title', 'emails', 'mobile', 'phone_number',
        'company_name', 'company_website', 'company_size', 'location', 'metro', 'region',
        'middle_initial', 'middle_name', 'linkedin_url', 'company_location_region',
        'company_location_address_line_2', 'location_country', 'source_state', 'row_hash', 'created_at'
      ];
      const csvContent = [
        headers.join(','),
        ...sortedData.map(row => [
          row.id || '',
          row.full_name || '',
          row.industry || '',
          row.job_title || '',
          row.emails || '',
          row.mobile || '',
          row.phone_number || '',
          row.company_name || '',
          row.company_website || '',
          row.company_size || '',
          row.location || '',
          row.metro || '',
          row.region || '',
          row.middle_initial || '',
          row.middle_name || '',
          row.linkedin_url || '',
          row.company_location_region || '',
          row.company_location_address_line_2 || '',
          row.location_country || '',
          row.source_state || '',
          row.row_hash || '',
          row.created_at || ''
        ].map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `master_table_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const SortableHeader = ({ field, children }: { field: keyof DataItem; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span className="font-medium">{children}</span>
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
      </div>
    </TableHead>
  );

  const safeTotalItems = typeof totalItems === 'number' && !isNaN(totalItems) ? totalItems : 0;
  const safeCurrentPage = typeof currentPage === 'number' && !isNaN(currentPage) ? currentPage : 1;
  const safeItemsPerPage = typeof itemsPerPage === 'number' && !isNaN(itemsPerPage) ? itemsPerPage : 25;
  const startIndex = (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);
  const safeTotalPages = typeof totalPages === 'number' && !isNaN(totalPages) ? totalPages : 1;

  return (
    <Card className="w-full shadow-2xl rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Master Table Data
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex} to {endIndex} of {safeTotalItems.toLocaleString()} results
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in current results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg"
              />
            </div>
            
            <Button 
              onClick={handleDownload}
              disabled={isDownloading || sortedData.length === 0}
              className="bg-green-600 hover:bg-green-700 transition-transform active:scale-95 focus:ring-2 focus:ring-green-300 rounded-lg shadow-md"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No data found</p>
            <p className="text-sm">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <SortableHeader field="id">ID</SortableHeader>
                    <SortableHeader field="full_name">Full Name</SortableHeader>
                    <SortableHeader field="industry">Industry</SortableHeader>
                    <SortableHeader field="job_title">Job Title</SortableHeader>
                    <SortableHeader field="emails">Emails</SortableHeader>
                    <SortableHeader field="mobile">Mobile</SortableHeader>
                    <SortableHeader field="phone_number">Phone Number</SortableHeader>
                    <SortableHeader field="company_name">Company Name</SortableHeader>
                    <SortableHeader field="company_website">Company Website</SortableHeader>
                    <SortableHeader field="company_size">Company Size</SortableHeader>
                    <SortableHeader field="location">Location</SortableHeader>
                    <SortableHeader field="metro">Metro</SortableHeader>
                    <SortableHeader field="region">Region</SortableHeader>
                    <SortableHeader field="middle_initial">Middle Initial</SortableHeader>
                    <SortableHeader field="middle_name">Middle Name</SortableHeader>
                    <SortableHeader field="linkedin_url">LinkedIn Url</SortableHeader>
                    <SortableHeader field="company_location_region">Company Location Region</SortableHeader>
                    <SortableHeader field="company_location_address_line_2">Company Location Address Line 2</SortableHeader>
                    <SortableHeader field="location_country">Location Country</SortableHeader>
                    <SortableHeader field="source_state">Source State</SortableHeader>
                    <SortableHeader field="row_hash">Row Hash</SortableHeader>
                    <SortableHeader field="created_at">Created At</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {sortedData.map((item, index) => (
                      <motion.tr
                        key={item.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, delay: index * 0.02 }}
                        className="hover:bg-blue-100 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-900">{item.id || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.full_name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.industry || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.job_title || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.emails || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.mobile || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.phone_number || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.company_name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">
                          {item.company_website ? (
                            <a href={item.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                              Visit Site
                            </a>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700">{item.company_size || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.location || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.metro || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.region || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.middle_initial || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.middle_name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">
                          {item.linkedin_url ? (
                            <a href={item.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                              View Profile
                            </a>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-700">{item.company_location_region || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.company_location_address_line_2 || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.location_country || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.source_state || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.row_hash || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{item.created_at || 'N/A'}</TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Pagination Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-b-2xl">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {startIndex} to {endIndex} of {safeTotalItems.toLocaleString()} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className={`px-3 py-1 rounded-lg transition font-medium shadow-sm border border-gray-300
                    ${safeCurrentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-50 text-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-300'}`}
                  aria-label="Previous page"
                >
                  &larr;
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, safeTotalPages))].map((_, i) => {
                    let pageNum;
                    if (safeTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (safeCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (safeCurrentPage >= safeTotalPages - 2) {
                      pageNum = safeTotalPages - 4 + i;
                    } else {
                      pageNum = safeCurrentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg transition font-medium
                          ${safeCurrentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white hover:bg-blue-100 text-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-300'}`}
                        aria-current={safeCurrentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {safeTotalPages > 5 && safeCurrentPage < safeTotalPages - 2 && (
                    <>
                      <span className="text-gray-400 px-1">...</span>
                      <button
                        onClick={() => onPageChange(safeTotalPages)}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-600 transition active:scale-95 focus:ring-2 focus:ring-blue-300"
                      >
                        {safeTotalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => onPageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === safeTotalPages}
                  className={`px-3 py-1 rounded-lg transition font-medium shadow-sm border border-gray-300
                    ${safeCurrentPage === safeTotalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-50 text-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-300'}`}
                  aria-label="Next page"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}