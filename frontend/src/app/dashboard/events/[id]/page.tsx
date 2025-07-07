'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Event, Location } from '@/types';
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
  Clock,
  ArrowLeft,
  ExternalLink,
  Tag,
  Building,
  Phone,
  Mail,
  Map,
  Video,
  Image,
  File
} from 'lucide-react';

export default function EventDetailsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (eventId) {
      loadEvent();
    }
  }, [user, eventId, locale]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await apiClient.getEvent(parseInt(eventId), locale);
      setEvent(eventData);
    } catch (error) {
      toast.error('Failed to load event details');
      router.push('/dashboard');
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

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-primary-600 hover:text-primary-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
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
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
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
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 w-full"
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
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('events.backToEvents')}
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">{event.name}</h1>
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
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              {event.media && event.media.length > 0 && (
                <div className="relative h-64 md:h-96">
                  <img
                    src={`http://localhost:1337${event.media[0].url}`}
                    alt={event.media[0].alternativeText || event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center mb-2">
                      {getEventTypeIcon(event.eventType)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {event.eventType}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                                          <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {event.languages}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.maxCapacity} {t('events.capacity')}
                        </div>
                        {event.startTime && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(event.startTime).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {event.description && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('events.descriptionSection')}</h2>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}

                {/* Media Gallery */}
                {event.media && event.media.length > 1 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('events.mediaGallery')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.media.slice(1).map((media, index) => (
                        <div key={index} className="relative group">
                          {media.mime?.startsWith('video/') ? (
                            <video
                              src={`http://localhost:1337${media.url}`}
                              className="w-full h-32 object-cover rounded-lg"
                              controls
                            />
                          ) : (
                            <img
                              src={`http://localhost:1337${media.url}`}
                              alt={media.alternativeText || `${event.name} - Media ${index + 2}`}
                              className="w-full h-32 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                            {getMediaIcon(media.mime?.startsWith('video/') ? 'video' : 'image')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seat Map */}
                {event.seatMap && event.seatMap.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('events.seatMap')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.seatMap.map((seatMap, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`http://localhost:1337${seatMap.url}`}
                            alt={seatMap.alternativeText || `Seat Map ${index + 1}`}
                            className="w-full rounded-lg border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('events.eventDetails')}</h2>
                  <div className="space-y-3">
                    {event.startTime && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">
                          Start: {new Date(event.startTime).toLocaleDateString()} {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    )}
                    {event.endTime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">
                          End: {new Date(event.endTime).toLocaleDateString()} {new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Capacity: {event.maxCapacity}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Language: {event.languages}
                      </span>
                    </div>
                    {event.website && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 text-gray-400 mr-3" />
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-500"
                        >
                          {t('events.visitWebsite')}
                        </a>
                      </div>
                    )}
                    {event.tags && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">{event.tags}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                {event.locations && event.locations.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('events.location')}</h2>
                    {event.locations.map((location) => (
                      <div key={location.id} className="space-y-3">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{location.name}</span>
                        </div>
                        {location.address && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                            <div className="text-sm text-gray-600">
                              <div>{location.address.street}</div>
                              <div>{location.address.city}, {location.address.state} {location.address.zipCode}</div>
                              <div>{location.address.country}</div>
                            </div>
                          </div>
                        )}
                        {location.website && (
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 text-gray-400 mr-3" />
                            <a
                              href={location.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              {t('events.visitWebsite')}
                            </a>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedLocation(location)}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 mt-2"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          {t('events.viewLocationDetails')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="space-y-3">
                    <button className="w-full bg-primary-600 text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      {t('events.bookTicket')}
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      {t('events.addToFavorites')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedLocation(null)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary-600" />
                    {selectedLocation.name}
                  </h3>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  {selectedLocation.description && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">{t('events.description')}</h4>
                      <p className="text-gray-600">{selectedLocation.description}</p>
                    </div>
                  )}

                  {/* Location Overview */}
                  {selectedLocation.locationOverview && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">{t('events.locationOverview')}</h4>
                      <p className="text-gray-600">{selectedLocation.locationOverview}</p>
                    </div>
                  )}

                  {/* Address */}
                  {selectedLocation.address && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {t('events.address')}
                      </h4>
                      <div className="text-gray-600 space-y-1">
                        <div>{selectedLocation.address.street}</div>
                        <div>{selectedLocation.address.city}, {selectedLocation.address.state} {selectedLocation.address.zipCode}</div>
                        <div>{selectedLocation.address.country}</div>
                      </div>
                    </div>
                  )}

                  {/* Venue Info */}
                  {(selectedLocation.capacity || selectedLocation.size) && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {t('events.venueInfo')}
                      </h4>
                      <div className="text-gray-600 space-y-2">
                        {selectedLocation.capacity && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{t('events.capacity')}:</span>
                            <span>{selectedLocation.capacity}</span>
                          </div>
                        )}
                        {selectedLocation.size && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{t('events.size')}:</span>
                            <span>{selectedLocation.size}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Opening Hours */}
                  {selectedLocation.openingHours && selectedLocation.openingHours.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {t('events.openingHours')}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedLocation.openingHours.map((hours, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">{hours.day}</span>
                            <span className="text-gray-600">
                              {hours.start && hours.close ? `${hours.start} - ${hours.close}` : t('events.closed')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accessibility Features */}
                  {selectedLocation.accessibilityFeatures && selectedLocation.accessibilityFeatures.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        {t('events.accessibilityFeatures')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLocation.accessibilityFeatures.map((feature) => (
                          <span
                            key={feature.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {feature.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {selectedLocation.website && (
                      <a
                        href={selectedLocation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('events.visitWebsite')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}