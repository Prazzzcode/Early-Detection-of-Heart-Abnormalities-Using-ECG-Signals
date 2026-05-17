"use client";

import { useState } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  Heart,
  Activity,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Search
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function PastReadingsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for past readings
  // const pastReadings = [
  //   {
  //     id: 1,
  //     date: '2024-01-15',
  //     time: '14:30',
  //     duration: '2:15',
  //     status: 'Normal',
  //     heartRate: 72,
  //     confidence: 98.5,
  //     risk: 'Low',
  //     notes: 'Regular rhythm detected'
  //   },
  //   {
  //     id: 2,
  //     date: '2024-01-14',
  //     time: '09:15',
  //     duration: '1:45',
  //     status: 'Atrial Fibrillation',
  //     heartRate: 95,
  //     confidence: 94.2,
  //     risk: 'High',
  //     notes: 'Irregular rhythm pattern observed'
  //   },
  //   {
  //     id: 3,
  //     date: '2024-01-13',
  //     time: '16:20',
  //     duration: '3:00',
  //     status: 'Bradycardia',
  //     heartRate: 54,
  //     confidence: 89.7,
  //     risk: 'Medium',
  //     notes: 'Slow heart rate detected'
  //   },
  //   {
  //     id: 4,
  //     date: '2024-01-12',
  //     time: '11:45',
  //     duration: '1:30',
  //     status: 'Normal',
  //     heartRate: 68,
  //     confidence: 97.8,
  //     risk: 'Low',
  //     notes: 'Healthy heart rhythm'
  //   },
  //   {
  //     id: 5,
  //     date: '2024-01-11',
  //     time: '08:30',
  //     duration: '2:45',
  //     status: 'PVC Detected',
  //     heartRate: 78,
  //     confidence: 92.1,
  //     risk: 'Low',
  //     notes: 'Occasional premature beats'
  //   },
  //   {
  //     id: 6,
  //     date: '2024-01-10',
  //     time: '19:10',
  //     duration: '2:00',
  //     status: 'Tachycardia',
  //     heartRate: 105,
  //     confidence: 93.6,
  //     risk: 'Medium',
  //     notes: 'Elevated heart rate'
  //   },
  // ];
  const pastReadings = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'Atrial Fibrillation': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'Bradycardia': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Tachycardia': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'PVC Detected': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'Low': return CheckCircle;
      case 'Medium': return AlertTriangle;
      case 'High': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const filteredReadings = pastReadings.filter(reading => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'normal' && reading.status === 'Normal') ||
      (selectedFilter === 'abnormal' && reading.status !== 'Normal') ||
      (selectedFilter === 'high-risk' && reading.risk === 'High');
    
    const matchesSearch = reading.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: pastReadings.length,
    normal: pastReadings.filter(r => r.status === 'Normal').length,
    abnormal: pastReadings.filter(r => r.status !== 'Normal').length,
    avgHeartRate: Math.round(pastReadings.reduce((sum, r) => sum + r.heartRate, 0) / pastReadings.length) ,
  };

  const exportToExcel = () => {
    const exportData = filteredReadings.map(reading => ({
      'Date': new Date(reading.date).toLocaleDateString('en-IN'),
      'Time': reading.time,
      'Status': reading.status,
      'Heart Rate (BPM)': reading.heartRate,
      'Confidence (%)': reading.confidence,
      'Risk Level': reading.risk,
      'Notes': reading.notes
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 8 },  // Time
      { wch: 20 }, // Status
      { wch: 15 }, // Heart Rate
      { wch: 15 }, // Confidence
      { wch: 12 }, // Risk Level
      { wch: 30 }  // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Heart Readings');

    // Generate filename with current date
    const fileName = `heart_readings_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Past Readings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            View and manage your heart rhythm monitoring history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Readings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <History className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Normal</p>
                <p className="text-3xl font-bold text-green-600">{stats.normal}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Abnormal</p>
                <p className="text-3xl font-bold text-red-600">{stats.abnormal}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Heart Rate</p>
                <p className="text-3xl font-bold text-purple-600">{stats.avgHeartRate}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'normal', label: 'Normal' },
                  { key: 'abnormal', label: 'Abnormal' },
                  { key: 'high-risk', label: 'High Risk' },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search readings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={exportToExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Readings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Heart Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReadings.map((reading) => {
                  const RiskIcon = getRiskIcon(reading.risk);
                  return (
                    <tr key={reading.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(reading.date).toLocaleDateString('en-IN')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {reading.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reading.status)}`}>
                          {reading.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {reading.heartRate} BPM
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <RiskIcon className={`h-4 w-4 ${getRiskColor(reading.risk)}`} />
                          <span className={`text-sm font-medium ${getRiskColor(reading.risk)}`}>
                            {reading.risk}
                          </span>
                        </div>
                      </td>
                     
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {reading.notes}
                        </p>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredReadings.length === 0 && (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No readings found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start taking readings to see your history here'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination (if needed) */}
        {filteredReadings.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredReadings.length}</span> of{' '}
              <span className="font-medium">{filteredReadings.length}</span> results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}