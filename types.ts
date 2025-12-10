import React from 'react';

export type Language = 'en' | 'ar';

export interface CitizenRecord {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  familyMembers: number;
  currentLocation: string;
  originalAddress: string;
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