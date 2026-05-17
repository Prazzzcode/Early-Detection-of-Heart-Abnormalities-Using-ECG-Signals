"use client";

import { 
  Heart, 
  Activity, 
  Shield, 
  Smartphone,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const steps = [
    {
      icon: Smartphone,
      title: 'Connect Your Device',
      description: 'Simply connect your ECG device or use our mobile app to start monitoring.',
    },
    {
      icon: Activity,
      title: 'Take a Reading',
      description: 'Our AI analyzes your heart rhythm in real-time using advanced algorithms.',
    },
    {
      icon: Shield,
      title: 'Get Instant Results',
      description: 'Receive immediate feedback and personalized health recommendations.',
    },
    {
      icon: Users,
      title: 'Professional Support',
      description: 'Connect with healthcare professionals when needed for expert guidance.',
    },
  ];

  const benefits = [
    'Early detection of heart abnormalities',
    '99.8% accuracy rate with medical-grade precision',
    'Real-time monitoring and instant alerts',
    'Secure data encryption and privacy protection',
    'Integration with healthcare providers',
    '24/7 customer support and monitoring',
  ];

  const conditions = [
    { name: 'Atrial Fibrillation', risk: 'High', color: 'text-red-500' },
    { name: 'Bradycardia', risk: 'Medium', color: 'text-yellow-500' },
    { name: 'Tachycardia', risk: 'Medium', color: 'text-yellow-500' },
    { name: 'PVC/PAC', risk: 'Low', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Welcome to HeartGuard
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How HeartGuard{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
              Protects You
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn how our AI-powered heart monitoring system works to keep you healthy and protected.
          </p>
        </div>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow for non-last items */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-blue-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* What We Detect */}
        <section className="mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Heart Conditions We Detect
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Common Abnormalities
                </h3>
                <div className="space-y-4">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {condition.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${condition.color}`}>
                          {condition.risk} Risk
                        </span>
                        <AlertTriangle className={`h-4 w-4 ${condition.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  AI Analysis Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-900 dark:text-white">Real-time waveform analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-900 dark:text-white">Continuous monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-gray-900 dark:text-white">Pattern recognition</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Activity className="h-5 w-5 text-red-500" />
                    <span className="text-gray-900 dark:text-white">Rhythm classification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose HeartGuard?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Monitoring?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take control of your heart health today with our advanced AI monitoring system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/take-reading"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
              >
                <Activity className="h-5 w-5 mr-2" />
                Start Your First Reading
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}