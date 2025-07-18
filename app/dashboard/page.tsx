'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FilterSidebar, { FilterState } from '@/components/dashboard/FilterSidebar';
import DataTable from '@/components/dashboard/DataTable';

interface DataItem {
  id?: number;
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

interface ApiResponse {
  data: DataItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function DashboardPage() {
  const filterableColumns = [
    "region",
    "industry",
    "job_title",
    "location"
  ];
  const columnLabels: Record<string, string> = {
    region: "Region",
    industry: "Industry",
    job_title: "Job Title",
    location: "Location"
  };
  const [filters, setFilters] = useState<Record<string, string[]>>(
    Object.fromEntries(filterableColumns.map(col => [col, []]))
  );
  const [data, setData] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      });

      // Add filters to params
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.append(key, values.join(','));
        }
      });

      const response = await fetch(`/api/master_table?${params}`);
      if (response.ok) {
        const result: ApiResponse = await response.json();
        setData(result.data);
        setTotalItems(result.totalCount);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      } else {
        console.error('Failed to fetch data');
        setData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filters]);

  const handleFilterChange = (column: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [column]: values
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters(Object.fromEntries(filterableColumns.map(col => [col, []])));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50">
        <FilterSidebar
          columns={filterableColumns}
          columnLabels={columnLabels}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAllFilters={clearAllFilters}
          totalResults={totalItems}
        />
        <div className="flex-1 overflow-hidden">
          <DataTable
            data={data}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            totalPages={totalPages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}