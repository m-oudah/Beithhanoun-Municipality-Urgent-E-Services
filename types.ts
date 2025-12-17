
import React from 'react';

export type Language = 'en' | 'ar';

export interface HousingUnit {
  id: string;
  ownerName: string;
  ownerId: string;
  dob: string;
  idIssueDate: string;
  address: string;
  floors: number;
  area: number;
  condition: 'total_destruction' | 'habitable' | 'uninhabitable';
  lastUpdated: string;
}

export interface CitizenRecord {
  id: string;
  fullName: string;
  idNumber: string;
  phone: string;
  whatsapp?: string;
  originalArea: string;
  originalStreet: string;
  originalAddressDetails?: string;
  currentEvacuationState: string;
  evacuationType: string;
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
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'read' | 'unread';
  responded?: boolean;
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
  hidden?: boolean;
}
