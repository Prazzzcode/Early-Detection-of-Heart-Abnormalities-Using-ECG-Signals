"use client";

import { 
  Shield, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Calendar,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

export default function HealthStatusPage() {
  // Dummy health data
  const healthStatus = {
    overall: 'Medium Risk',
    overallColor: 'text-yellow-600',
    overallBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    score: 72,
    lastUpdate: '2024-01-15T14:30:00Z',
  };

  const statusCategories = [
    {
      id: 'healthy',
      title: 'Healthy',
      description: 'Normal heart rhythm with no abnormalities detected',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
      count: 15,
      percentage: 68,
      trend: 'up',
      lastReading: '2024-01-15',
    },
    {
      id: 'low-risk',
      title: 'Low Risk',
      description: 'Minor irregularities that typically dont require immediate attention',
      icon: Shield,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      count: 4,
      percentage: 18,
      trend: 'stable',
      lastReading: '2024-01-12',
    },
    {
      id: 'medium-risk',
      title: 'Medium Risk',
      description: 'Moderate abnormalities that should be monitored regularly',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      count: 2,
      percentage: 9,
      trend: 'down',
      lastReading: '2024-01-13',
    },
    {
      id: 'high-risk',
      title: 'High Risk',
      description: 'Significant abnormalities requiring medical attention',
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/20',
      count: 1,
      percentage: 5,
      trend: 'stable',
      lastReading: '2024-01-14',
    },
  ];

  const recentMetrics = [
    {
      label: 'Average Heart Rate',
      value: '74 BPM',
      change: '+2',
      trend: 'up',
      color: 'text-blue-600',
    },
    {
      label: 'Readings This Week',
      value: '12',
      change: '+3',
      trend: 'up',
      color: 'text-green-600',
    },
    {
      label: 'Normal Readings',
      value: '83%',
      change: '+5%',
      trend: 'up',
      color: 'text-green-600',
    },
    {
      label: 'Risk Score',
      value: '72/100',
      change: '-3',
      trend: 'down',
      color: 'text-yellow-600',
    },
  ];

  const recommendations = [
    {
      title: 'Schedule Regular Checkups',
      description: 'Consider consulting with a cardiologist for your recent readings',
      priority: 'high',
      icon: Calendar,
    },
    {
      title: 'Monitor Daily Activity',
      description: 'Track your exercise and stress levels to identify patterns',
      priority: 'medium',
      icon: Activity,
    },
    {
      title: 'Maintain Reading Schedule',
      description: 'Continue taking readings twice daily for consistent monitoring',
      priority: 'low',
      icon: Clock,
    },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Health Status Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive overview of your heart health metrics and trends
          </p>
        </div>

        {/* Overall Health Score */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Overall Health Score</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl font-bold">{healthStatus.score}</div>
                  <div>
                    <div className="text-xl font-semibold">{healthStatus.overall}</div>
                    <div className="text-blue-100">
                      Last updated: {new Date(healthStatus.lastUpdate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="white"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${healthStatus.score * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{healthStatus.score}%</div>
                      <div className="text-sm">Health Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statusCategories.map((status) => {
            const Icon = status.icon;
            const TrendIcon = getTrendIcon(status.trend);
            
            return (
              <div
                key={status.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${status.bg}`}>
                    <Icon className={`h-8 w-8 ${status.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {status.count}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {status.percentage}%
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {status.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {status.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last: {new Date(status.lastReading).toLocaleDateString('en-IN')}
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(status.trend)}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-xs font-medium capitalize">{status.trend}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Recent Metrics
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentMetrics.map((metric, index) => {
              const TrendIcon = getTrendIcon(metric.trend);
              
              return (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {metric.label}
                  </div>
                  <div className={`flex items-center justify-center space-x-1 ${metric.color}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-600" />
            Health Recommendations
          </h2>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              
              return (
                <div
                  key={index}
                  className={`border-l-4 pl-6 py-4 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {rec.description}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            <Activity className="h-5 w-5 mr-2" />
            Take New Reading
          </button>
          
          <button className="flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200">
            <Award className="h-5 w-5 mr-2" />
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
}