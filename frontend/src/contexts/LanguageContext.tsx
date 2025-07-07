'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/types';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.events': 'Events',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.language': 'Language',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.birthDate': 'Birth Date',
    'auth.language': 'Language',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Registration successful!',
    'auth.loginError': 'Login failed. Please check your credentials.',
    'auth.registerError': 'Registration failed. Please try again.',

    // Dashboard
    'dashboard.welcome': 'Welcome to your dashboard',
    'dashboard.events': 'Available Events',
    'dashboard.disabilityCard': 'Disability Card',
    'dashboard.companions': 'Companions',
    'dashboard.noEvents': 'No events available',
    'dashboard.loading': 'Loading events...',

    // Events
    'events.title': 'Events',
    'events.description': 'Find accessible events near you',
    'events.capacity': 'Capacity',
    'events.type': 'Type',
    'events.languages': 'Languages',
    'events.website': 'Website',
    'events.tags': 'Tags',
    'events.viewDetails': 'View Details',
    'events.bookTicket': 'Book Ticket',
    'events.backToEvents': 'Back to Events',
    'events.descriptionSection': 'Description',
    'events.mediaGallery': 'Media Gallery',
    'events.seatMap': 'Seat Map',
    'events.eventDetails': 'Event Details',
    'events.location': 'Location',
    'events.locationDetails': 'Location Details',
    'events.locationPhotos': 'Location Photos',
    'events.locationOverview': 'Location Overview',
    'events.address': 'Address',
    'events.venueInfo': 'Venue Information',
    'events.size': 'Size',
    'events.openingHours': 'Opening Hours',
    'events.closed': 'Closed',
    'events.accessibilityFeatures': 'Accessibility Features',
    'events.viewLocationDetails': 'View Location Details',
    'events.visitWebsite': 'Visit Website',
    'events.viewOnMap': 'View on Map',
    'events.addToFavorites': 'Add to Favorites',

    // Disability Card
    'disabilityCard.title': 'Disability Card',
    'disabilityCard.number': 'Card Number',
    'disabilityCard.proof': 'Proof Document',
    'disabilityCard.expiry': 'Expiry Date',
    'disabilityCard.issueDate': 'Issue Date',
    'disabilityCard.status': 'Status',
    'disabilityCard.upload': 'Upload Disability Card',
    'disabilityCard.update': 'Update Disability Card',
    'disabilityCard.uploadSuccess': 'Disability card uploaded successfully!',
    'disabilityCard.uploadError': 'Failed to upload disability card.',
    'disabilityCard.noCard': 'No disability card uploaded yet.',

    // Companions
    'companions.title': 'Companions',
    'companions.add': 'Add Companion',
    'companions.edit': 'Edit Companion',
    'companions.delete': 'Delete Companion',
    'companions.firstName': 'First Name',
    'companions.lastName': 'Last Name',
    'companions.addSuccess': 'Companion added successfully!',
    'companions.updateSuccess': 'Companion updated successfully!',
    'companions.deleteSuccess': 'Companion deleted successfully!',
    'companions.error': 'An error occurred while managing companions.',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.required': 'This field is required',
    'common.invalid': 'Invalid input',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.events': 'Veranstaltungen',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    'nav.language': 'Sprache',

    // Auth
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.logout': 'Abmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.username': 'Benutzername',
    'auth.firstName': 'Vorname',
    'auth.lastName': 'Nachname',
    'auth.birthDate': 'Geburtsdatum',
    'auth.language': 'Sprache',
    'auth.loginSuccess': 'Anmeldung erfolgreich!',
    'auth.registerSuccess': 'Registrierung erfolgreich!',
    'auth.loginError': 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.',
    'auth.registerError': 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',

    // Dashboard
    'dashboard.welcome': 'Willkommen in Ihrem Dashboard',
    'dashboard.events': 'Verfügbare Veranstaltungen',
    'dashboard.disabilityCard': 'Schwerbehindertenausweis',
    'dashboard.companions': 'Begleitpersonen',
    'dashboard.noEvents': 'Keine Veranstaltungen verfügbar',
    'dashboard.loading': 'Veranstaltungen werden geladen...',

    // Events
    'events.title': 'Veranstaltungen',
    'events.description': 'Finden Sie barrierefreie Veranstaltungen in Ihrer Nähe',
    'events.capacity': 'Kapazität',
    'events.type': 'Typ',
    'events.languages': 'Sprachen',
    'events.website': 'Website',
    'events.tags': 'Tags',
    'events.viewDetails': 'Details anzeigen',
    'events.bookTicket': 'Ticket buchen',
    'events.backToEvents': 'Zurück zu Veranstaltungen',
    'events.descriptionSection': 'Beschreibung',
    'events.mediaGallery': 'Mediengalerie',
    'events.seatMap': 'Sitzplan',
    'events.eventDetails': 'Veranstaltungsdetails',
    'events.location': 'Standort',
    'events.locationDetails': 'Standortdetails',
    'events.locationPhotos': 'Standortfotos',
    'events.locationOverview': 'Standortübersicht',
    'events.address': 'Adresse',
    'events.venueInfo': 'Veranstaltungsort-Informationen',
    'events.size': 'Größe',
    'events.openingHours': 'Öffnungszeiten',
    'events.closed': 'Geschlossen',
    'events.accessibilityFeatures': 'Barrierefreiheit',
    'events.viewLocationDetails': 'Standortdetails anzeigen',
    'events.visitWebsite': 'Website besuchen',
    'events.viewOnMap': 'Auf Karte anzeigen',
    'events.addToFavorites': 'Zu Favoriten hinzufügen',

    // Disability Card
    'disabilityCard.title': 'Schwerbehindertenausweis',
    'disabilityCard.number': 'Ausweisnummer',
    'disabilityCard.proof': 'Nachweisdokument',
    'disabilityCard.expiry': 'Ablaufdatum',
    'disabilityCard.issueDate': 'Ausstellungsdatum',
    'disabilityCard.status': 'Status',
    'disabilityCard.upload': 'Schwerbehindertenausweis hochladen',
    'disabilityCard.update': 'Schwerbehindertenausweis aktualisieren',
    'disabilityCard.uploadSuccess': 'Schwerbehindertenausweis erfolgreich hochgeladen!',
    'disabilityCard.uploadError': 'Hochladen des Schwerbehindertenausweises fehlgeschlagen.',
    'disabilityCard.noCard': 'Noch kein Schwerbehindertenausweis hochgeladen.',

    // Companions
    'companions.title': 'Begleitpersonen',
    'companions.add': 'Begleitperson hinzufügen',
    'companions.edit': 'Begleitperson bearbeiten',
    'companions.delete': 'Begleitperson löschen',
    'companions.firstName': 'Vorname',
    'companions.lastName': 'Nachname',
    'companions.addSuccess': 'Begleitperson erfolgreich hinzugefügt!',
    'companions.updateSuccess': 'Begleitperson erfolgreich aktualisiert!',
    'companions.deleteSuccess': 'Begleitperson erfolgreich gelöscht!',
    'companions.error': 'Beim Verwalten der Begleitpersonen ist ein Fehler aufgetreten.',

    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolgreich!',
    'common.confirm': 'Bestätigen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.submit': 'Absenden',
    'common.required': 'Dieses Feld ist erforderlich',
    'common.invalid': 'Ungültige Eingabe',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'de')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    return (translations[locale] as Record<string, string>)[key] || key;
  };

  const value = {
    locale,
    setLocale,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 