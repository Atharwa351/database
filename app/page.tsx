'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Filter, Download, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {

  const features = [
    {
      icon: Database,
      title: 'Advanced Data Management',
      description: 'Access and filter through comprehensive datasets with intelligent search capabilities.'
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Multiple filter options with autocomplete for company names, job titles, industries, and locations.'
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Download filtered results in CSV format for further analysis and reporting.'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Secure authentication system with personalized dashboard experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Data Explorer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powerful Data Filtering & Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your data analysis workflow with advanced filtering, real-time search, 
            and comprehensive export capabilities. Built for professionals who need precise data insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Data Management
            </h3>
            <p className="text-lg text-gray-600">
              Comprehensive tools designed to make data filtering and analysis effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-xl mb-8 opacity-90">
                Access powerful data filtering and analysis tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    Access Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Database className="h-6 w-6" />
              <span className="text-lg font-semibold">Data Explorer</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2024 Data Explorer. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}