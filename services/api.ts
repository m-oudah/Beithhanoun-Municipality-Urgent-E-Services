import { CitizenRecord, ContactMessage } from '../types';

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
          phone: '0599123456', 
          whatsapp: '0599123456',
          familyMembers: 5, 
          currentLocation: 'Jabalia Camp', 
          originalAddress: 'Al-Sikka St', 
          status: 'verified', 
          submittedAt: new Date().toISOString() 
        },
        { 
          id: '2', 
          fullName: 'Fatima Khalil', 
          phone: '0599987654', 
          whatsapp: '0599987654',
          familyMembers: 3, 
          currentLocation: 'Beit Hanoun - Center', 
          originalAddress: 'Main St', 
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
  }
};