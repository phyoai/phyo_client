'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">@{user.username || 'username'}</p>
              <p className="text-gray-700 mb-6">{user.email}</p>

              {user.type && (
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <Link href="/profile/edit">
                  <Button>Edit Profile</Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline">Settings</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio Section */}
          {user.bio && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700">{user.bio}</p>
            </Card>
          )}

          {/* Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {user.followers !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-medium text-gray-900">{user.followers}</span>
                </div>
              )}
              {user.rating !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium text-yellow-600">★ {user.rating}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Portfolio */}
          {(user.type === 'influencer' || user.type === 'service-provider') && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
              <p className="text-gray-600 mb-4">Showcase your best work</p>
              <Link href="/profile/portfolio">
                <Button variant="outline" className="w-full">
                  Manage Portfolio
                </Button>
              </Link>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link
                href="/messages"
                className="block p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/notifications"
                className="block p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Notifications
              </Link>
              <Link
                href="/favorites"
                className="block p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Favorites
              </Link>
              <Link
                href="/settings"
                className="block p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Account Settings
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
