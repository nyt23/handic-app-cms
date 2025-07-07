'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Event } from '@/types';
import apiClient from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  FileText, 
  LogOut, 
  Globe, 
  Menu, 
  X,
  User,
  Heart,
  MapPin,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadEvents();
  }, [user, locale]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await apiClient.getEvents(locale);
      setEvents(eventsData);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'concert':
        return <Heart className="h-5 w-5" />;
      case 'workshop':
        return <Users className="h-5 w-5" />;
      case 'exhibition':
        return <FileText className="h-5 w-5" />;
      case 'theater':
        return <Calendar className="h-5 w-5" />;
      case 'festival':
        return <Heart className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold text-gray-900">Handic App</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 w-full"
            >
              <Calendar className="mr-3 h-5 w-5" />
              {t('nav.dashboard')}
            </button>
            {/* <button
              onClick={() => router.push('/dashboard/disability-card')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <FileText className="mr-3 h-5 w-5" />
              {t('dashboard.disabilityCard')}
            </button>
            <button
              onClick={() => router.push('/dashboard/companions')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <Users className="mr-3 h-5 w-5" />
              {t('dashboard.companions')}
            </button> */}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  locale === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('de')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  locale === 'de'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                DE
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-semibold text-gray-900">Handic App</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 w-full"
            >
              <Calendar className="mr-3 h-5 w-5" />
              {t('nav.dashboard')}
            </button>
            {/* <button
              onClick={() => router.push('/dashboard/disability-card')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <FileText className="mr-3 h-5 w-5" />
              {t('dashboard.disabilityCard')}
            </button>
            <button
              onClick={() => router.push('/dashboard/companions')}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <Users className="mr-3 h-5 w-5" />
              {t('dashboard.companions')}
            </button> */}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  locale === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('de')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  locale === 'de'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                DE
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('dashboard.welcome')}, {user.firstName}!
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900">{t('dashboard.events')}</h2>
              <p className="mt-1 text-sm text-gray-500">{t('events.description')}</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('dashboard.noEvents')}</h3>
                <p className="mt-1 text-sm text-gray-500">No events are currently available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                  >
                    {event.media && event.media.length > 0 && (
                      <div className="aspect-w-16 aspect-h-9">
                                                 <img
                           src={`http://localhost:1337${event.media[0].url}`}
                           alt={event.media[0].alternativeText || event.name}
                           className="w-full h-48 object-cover"
                         />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getEventTypeIcon(event.eventType)}
                          <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
                            {event.eventType}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {event.maxCapacity} {t('events.capacity')}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{event.name}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {event.languages}
                        </div>
                        {event.startTime && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(event.startTime).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {event.locations && event.locations.length > 0 && (
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.locations[0].name}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push(`/dashboard/events/${event.id}`)}
                          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          {t('events.viewDetails')}
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                          {t('events.bookTicket')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 