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
  Loader2,
  ExternalLink,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin
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

// Enhanced skeleton loader with Apollo-style shimmer
const SkeletonRow = ({ index }: { index: number }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-gray-100"
  >
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      </td>
    ))}
  </motion.tr>
);

// Apollo-style data cell component
const DataCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <TableCell className={`px-6 py-4 text-sm ${className}`}>
    {children}
  </TableCell>
);

// Contact info component
const ContactInfo = ({ email, phone, mobile }: { email?: string; phone?: string; mobile?: string }) => (
  <div className="space-y-1">
    {email && (
      <div className="flex items-center space-x-2 text-blue-600">
        <Mail className="h-3 w-3" />
        <a href={`mailto:${email}`} className="hover:underline text-xs">
          {email}
        </a>
      </div>
    )}
    {(phone || mobile) && (
      <div className="flex items-center space-x-2 text-green-600">
        <Phone className="h-3 w-3" />
        <span className="text-xs">{phone || mobile}</span>
      </div>
    )}
  </div>
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
  const [sortField, setSortField] = useState<keyof DataItem>('company_name');
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
      const headers = [
        'id', 'full_name', 'industry', 'job_title', 'emails', 'mobile', 'phone_number',
        'company_name', 'company_website', 'company_size', 'location', 'metro', 'region',
        'linkedin_url'
      ];
      const csvContent = [
        headers.join(','),
        ...sortedData.map(row => headers.map(field => 
          `"${(row[field] || '').toString().replace(/"/g, '""')}"`
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_data_${new Date().toISOString().split('T')[0]}.csv`;
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

  const SortableHeader = ({ field, children, className = "" }: { 
    field: keyof DataItem; 
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-50 transition-colors select-none px-6 py-4 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-900">{children}</span>
        <ArrowUpDown className={`h-4 w-4 transition-colors ${
          sortField === field ? 'text-blue-600' : 'text-gray-400'
        }`} />
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
    <div className="flex flex-col h-full bg-white">
      {/* Apollo-style header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Database</h1>
              <p className="text-gray-600">
                {safeTotalItems.toLocaleString()} total leads • Showing {startIndex}-{endIndex}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search current results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full sm:w-80 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
              />
            </div>
            
            <Button 
              onClick={handleDownload}
              disabled={isDownloading || sortedData.length === 0}
              className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Table content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Contact</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Position</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Company</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Industry</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Location</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Contact Info</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">LinkedIn</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Company Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} index={i} />)}
              </TableBody>
            </Table>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText className="h-16 w-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No leads found</h3>
            <p className="text-gray-400">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow className="border-b border-gray-200">
                  <SortableHeader field="full_name">Contact</SortableHeader>
                  <SortableHeader field="job_title">Position</SortableHeader>
                  <SortableHeader field="company_name">Company</SortableHeader>
                  <SortableHeader field="industry">Industry</SortableHeader>
                  <SortableHeader field="location">Location</SortableHeader>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">Contact Info</TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900">LinkedIn</TableHead>
                  <SortableHeader field="company_size">Company Size</SortableHeader>
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
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <DataCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.full_name || 'N/A'}</p>
                            {item.middle_name && (
                              <p className="text-xs text-gray-500">{item.middle_name}</p>
                            )}
                          </div>
                        </div>
                      </DataCell>
                      
                      <DataCell>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{item.job_title || 'N/A'}</span>
                        </div>
                      </DataCell>
                      
                      <DataCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{item.company_name || 'N/A'}</span>
                          </div>
                          {item.company_website && (
                            <a 
                              href={item.company_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs"
                            >
                              <Globe className="h-3 w-3" />
                              <span>Visit website</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </DataCell>
                      
                      <DataCell>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {item.industry || 'N/A'}
                        </Badge>
                      </DataCell>
                      
                      <DataCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{item.location || 'N/A'}</p>
                            <p className="text-gray-500">{item.region || 'N/A'}</p>
                          </div>
                        </div>
                      </DataCell>
                      
                      <DataCell>
                        <ContactInfo 
                          email={item.emails} 
                          phone={item.phone_number} 
                          mobile={item.mobile} 
                        />
                      </DataCell>
                      
                      <DataCell>
                        {item.linkedin_url ? (
                          <a 
                            href={item.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <span>View Profile</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </DataCell>
                      
                      <DataCell>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {item.company_size || 'N/A'}
                        </Badge>
                      </DataCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Apollo-style pagination */}
      {!isLoading && sortedData.length > 0 && (
        <div className="px-8 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex}</span> to{' '}
              <span className="font-semibold">{endIndex}</span> of{' '}
              <span className="font-semibold">{safeTotalItems.toLocaleString()}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="h-10 px-4 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
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
                    <Button
                      key={pageNum}
                      variant={safeCurrentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={`h-10 w-10 ${
                        safeCurrentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'border-gray-300 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === safeTotalPages}
                className="h-10 px-4 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}