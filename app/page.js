"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import Loading from '../components/ui/Loading.js';
import Link from 'next/link';
import {Heart,Shield,Activity,Users,ArrowRight,Zap,Clock,Star} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Check if user has a profile in MongoDB
        const response = await fetch(`/api/users/email/${encodeURIComponent(user.email)}`);

        if (response.status === 404) {
          // No profile found, redirect to onboarding
          router.push('/onboarding');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to check profile');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }

      setLoading(false);
    };

    checkUserProfile();
  }, [user, router]) 

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '99.5%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Monitoring' },
    { number: '5M+', label: 'Readings Analyzed' },
  ];

  const features = [
    {
      icon: Activity,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms detect heart abnormalities with medical-grade accuracy.'
    },
    {
      icon: Shield,
      title: 'Real-Time Monitoring',
      description: 'Continuous heart rhythm analysis provides instant alerts for any irregularities.'
    },
    {
      icon: Heart,
      title: 'Early Detection',
      description: 'Catch potential issues before they become serious with proactive health monitoring.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Connect with healthcare professionals and get personalized recommendations.'
    },
  ];

  const quickStats = [
    {
      icon: Heart,
      label: 'Avg Heart Rate',
      value: '72 BPM',
      change: '+2',
      trend: 'up',
      color: 'text-red-500'
    },
    {
      icon: Activity,
      label: 'Last Reading',
      value: 'Normal',
      change: '2h ago',
      trend: 'neutral',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      label: 'Risk Level',
      value: 'Low',
      change: 'Stable',
      trend: 'stable',
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      label: 'Weekly Checks',
      value: '5/7',
      change: '2 left',
      trend: 'neutral',
      color: 'text-purple-500'
    },
  ];

  const recentReadings = [
    { date: 'Today, 2:30 PM', status: 'Normal', heartRate: 75, duration: '30s' },
    { date: 'Yesterday, 8:15 AM', status: 'Normal', heartRate: 72, duration: '32s' },
    { date: 'Oct 12, 6:45 PM', status: 'Normal', heartRate: 78, duration: '28s' },
  ];

  const healthTips = [
    "Stay hydrated - proper hydration helps maintain healthy blood pressure",
    "Regular exercise strengthens your heart and improves circulation",
    "Monitor your stress levels - chronic stress can affect heart health",
    "Get enough sleep - aim for 7-9 hours of quality sleep per night"
  ];

  if (authLoading || loading) return <Loading />

  return (!user ? (<>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-8">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              AI-Powered Heart Protection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Protect Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
              Heart Health
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered heart abnormality detection system that provides real-time analysis,
            early warning signs, and personalized health insights to keep your heart beating strong.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Activity className="h-5 w-5 mr-2" />
              Login to get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              href="/instructions"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
            >
              Learn How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 mt-14 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose HeartGuard?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our advanced technology combines medical expertise with AI precision to provide
              unmatched heart health monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
            <Heart className="h-16 w-16 mx-auto mb-6 text-pink-200" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Protect Your Heart?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust HeartGuard for their heart health monitoring.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>) : (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Header */}
          <div className="text-center mb-12 slide-up mt-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 float-animation">
              <Heart className="h-10 w-10 text-white heart-beat" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your heart health dashboard is ready. Let's keep your heart beating strong and healthy.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6">

              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Shield className="h-4 w-4" />
                <span>Protected 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/take-reading"
              className="group glass-effect rounded-2xl p-6 card-hover text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Take Reading</h3>
              <p className="text-gray-600 dark:text-gray-400">Start a new heart rhythm analysis</p>
            </Link>

            <Link
              href="/past-readings"
              className="group glass-effect rounded-2xl p-6 card-hover text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">View History</h3>
              <p className="text-gray-600 dark:text-gray-400">Review your past readings</p>
            </Link>

            <Link
              href="/health-status"
              className="group glass-effect rounded-2xl p-6 card-hover text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Health Status</h3>
              <p className="text-gray-600 dark:text-gray-400">Detailed health insights</p>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-20">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' :
                      stat.trend === 'down' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Readings */}
            <div className="lg:col-span-2 mt-100">
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Readings</h2>
                  <Link href="/past-readings" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    View all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentReadings.map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${reading.status === 'Normal' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{reading.status}</div>
                          <div className="text-sm text-gray-500">{reading.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">{reading.heartRate} BPM</div>
                        <div className="text-sm text-gray-500">{reading.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="space-y-6">
              <div className="glass-effect rounded-2xl p-6 card-hover">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Daily Health Tip
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {healthTips[Math.floor(Math.random() * healthTips.length)]}
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  💙 Keep your heart healthy!
                </div>
              </div>

              {/* Motivational Card */}
              <div className="glass-effect rounded-2xl p-6 card-hover bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    You're Doing Great!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your heart health is in excellent condition. Keep up the good work!
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  );
}