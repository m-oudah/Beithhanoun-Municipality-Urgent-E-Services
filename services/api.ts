import { CitizenRecord, ContactMessage, Announcement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  async submitCitizenData(data: Omit<CitizenRecord, 'id' | 'status' | 'submittedAt'>): Promise<CitizenRecord> {
    await delay(1000); // Simulate network
    const newRecord: CitizenRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    
    // Store in localStorage for demo purposes
    const existing = JSON.parse(localStorage.getItem('citizens') || '[]');
    localStorage.setItem('citizens', JSON.stringify([newRecord, ...existing]));
    
    return newRecord;
  },

  async sendContactMessage(data: ContactMessage): Promise<boolean> {
    await delay(800);
    console.log("Sending email to info@beithanoun.ps", data);
    return true;
  },

  async getCitizens(): Promise<CitizenRecord[]> {
    await delay(500);
    const existing = JSON.parse(localStorage.getItem('citizens') || '[]');
    // Return some mock data if empty
    if (existing.length === 0) {
      return [
        { 
          id: '1', 
          fullName: 'Ahmed Al-Masri', 
          idNumber: '901234567',
          phone: '0599123456', 
          whatsapp: '0599123456',
          originalArea: 'Beit Hanoun - Center',
          originalStreet: 'Al-Sikka St',
          currentEvacuationState: 'north',
          evacuationType: 'school',
          wifeName: 'Fatima Al-Masri',
          wifeIdNumber: '907654321',
          familyMembers: 5, 
          males: 2,
          females: 3,
          status: 'verified', 
          submittedAt: new Date().toISOString() 
        },
        { 
          id: '2', 
          fullName: 'Khalil Ibrahim', 
          idNumber: '909876543',
          phone: '0599987654', 
          whatsapp: '0599987654',
          originalArea: 'Beit Hanoun - Izbat',
          originalStreet: 'Main St',
          currentEvacuationState: 'gaza',
          evacuationType: 'rent',
          wifeName: 'Suha Ibrahim',
          wifeIdNumber: '905555555',
          familyMembers: 3, 
          males: 1,
          females: 2,
          status: 'urgent', 
          submittedAt: new Date().toISOString() 
        },
      ];
    }
    return existing;
  },

  async updateCitizenRecord(id: string, updates: Partial<CitizenRecord>): Promise<CitizenRecord | null> {
    await delay(800);
    const existing: CitizenRecord[] = JSON.parse(localStorage.getItem('citizens') || '[]');
    const index = existing.findIndex(c => c.id === id);
    
    if (index !== -1) {
      existing[index] = { ...existing[index], ...updates };
      localStorage.setItem('citizens', JSON.stringify(existing));
      
      // Simulate sending notifications
      if (updates.adminFeedback) {
        console.log(`[Notification System] Sending Email to citizen ID ${id}: ${updates.adminFeedback}`);
        console.log(`[Notification System] Sending WhatsApp to ${existing[index].whatsapp}: ${updates.adminFeedback}`);
      }
      
      return existing[index];
    }
    return null;
  },

  async getAnnouncements(): Promise<Announcement[]> {
    await delay(500);
    const existing = localStorage.getItem('announcements');
    if (existing) {
        return JSON.parse(existing);
    }
    // Initial Load of Mock Data
    localStorage.setItem('announcements', JSON.stringify(MOCK_ANNOUNCEMENTS));
    return MOCK_ANNOUNCEMENTS;
  },

  async createAnnouncement(data: Omit<Announcement, 'id'>): Promise<Announcement> {
    await delay(500);
    const newAnnouncement: Announcement = {
        ...data,
        id: Math.random().toString(36).substr(2, 9)
    };
    const existing: Announcement[] = JSON.parse(localStorage.getItem('announcements') || JSON.stringify(MOCK_ANNOUNCEMENTS));
    const updated = [newAnnouncement, ...existing];
    localStorage.setItem('announcements', JSON.stringify(updated));
    return newAnnouncement;
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | null> {
    await delay(500);
    const existing: Announcement[] = JSON.parse(localStorage.getItem('announcements') || JSON.stringify(MOCK_ANNOUNCEMENTS));
    const index = existing.findIndex(a => a.id === id);
    if (index !== -1) {
        existing[index] = { ...existing[index], ...data };
        localStorage.setItem('announcements', JSON.stringify(existing));
        return existing[index];
    }
    return null;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    await delay(500);
    const existing: Announcement[] = JSON.parse(localStorage.getItem('announcements') || JSON.stringify(MOCK_ANNOUNCEMENTS));
    const updated = existing.filter(a => a.id !== id);
    localStorage.setItem('announcements', JSON.stringify(updated));
    return true;
  }
};