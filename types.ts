import React from 'react';

export type Language = 'en' | 'ar';

export interface CitizenRecord {
  id: string;
  // Step 1: Citizen Info
  fullName: string;
  idNumber: string;
  phone: string;
  whatsapp?: string; // Optional
  
  // Step 2: Stay Place
  originalArea: string;
  originalStreet: string;
  originalAddressDetails?: string;
  currentEvacuationState: string;
  evacuationType: string;

  // Step 3: Family Info
  wifeName: string;
  wifeIdNumber: string;
  familyMembers: number;
  males: number;
  females: number;
  notes?: string;

  status: 'pending' | 'verified' | 'urgent' | 'completed';
  submittedAt: string;
  adminFeedback?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  action?: string;
}

export interface Announcement {
  id: string;
  date: string;
  category: 'emergency' | 'service' | 'general';
  title: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
}