"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Activity,
  Edit,
  Camera,
  Shield,
  AlertCircle,
  CheckCircle,
  Pill,
  Stethoscope
} from 'lucide-react';

export default function ProfilePage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch from MongoDB via API
        const response = await fetch(`/api/users/email/${encodeURIComponent(user.email)}`);

        if (response.status === 404) {
          // User profile not found, redirect to onboarding
          router.push('/onboarding');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fall back to localStorage
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          setUserData(JSON.parse(storedProfile));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, router]);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || loading) return <Loading />;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please complete your profile setup
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  const age = calculateAge(userData.dob);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            View and manage your personal information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors group-hover:scale-110 transform duration-200">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.fullName || 'User'}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-600 dark:text-gray-400">
                  {age && (
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {age} years old
                    </span>
                  )}
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {userData.gender || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">42</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Readings</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">38</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Normal</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">72</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg BPM</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Low</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {userData.email || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {userData.phone_no || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {userData.address || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatDate(userData.dob)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-600" />
              Health Information
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Stethoscope className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Medical Conditions</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.medical_conditions && userData.medical_conditions.length > 0 ? (
                    userData.medical_conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Pill className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Current Medications</div>
                </div>
                <div className="text-gray-900 dark:text-white">
                  {userData.current_medications || 'None reported'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Allergies</div>
                </div>
                <div className="text-gray-900 dark:text-white">
                  {userData.allergies || 'None reported'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Previous Heart Issues</div>
                </div>
                <div className="text-gray-900 dark:text-white">
                  {userData.previous_heart_issues || 'None reported'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}