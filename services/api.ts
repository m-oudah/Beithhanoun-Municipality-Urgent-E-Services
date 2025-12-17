
import { CitizenRecord, ContactMessage, Announcement, HousingUnit } from '../types';
import { MOCK_ANNOUNCEMENTS, MOCK_HOUSING_UNITS } from '../constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  async inquireHousingUnit(params: { ownerName: string, idNumber: string, address: string }): Promise<HousingUnit | null> {
    await delay(1200);
    
    const searchId = params.idNumber.trim();
    const searchName = params.ownerName.trim();
    const searchAddress = params.address.trim();

    // البحث بمطابقة دقيقة للهوية، ومطابقة جزئية مرنة للاسم والعنوان
    const unit = MOCK_HOUSING_UNITS.find(u => {
      const matchId = u.ownerId === searchId;
      // البحث عن جزء من الاسم وجزء من العنوان (Partial Match)
      const matchName = u.ownerName.includes(searchName) || searchName.includes(u.ownerName);
      const matchAddress = u.address.includes(searchAddress) || searchAddress.includes(u.address);
      
      return matchId && matchName && matchAddress;
    });
    
    return unit || null;
  },

  async submitCitizenData(data: Omit<CitizenRecord, 'id' | 'status' | 'submittedAt'>): Promise<CitizenRecord> {
    await delay(1000);
    const newRecord: CitizenRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('citizens') || '[]');
    localStorage.setItem('citizens', JSON.stringify([newRecord, ...existing]));
    return newRecord;
  },

  async checkCitizenExists(idNumber: string): Promise<boolean> {
    await delay(300);
    const citizens = await ApiService.getCitizens();
    return citizens.some(c => c.idNumber === idNumber);
  },

  async sendContactMessage(data: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>): Promise<boolean> {
    await delay(800);
    const newMessage: ContactMessage = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'unread',
      responded: false
    };
    const existing = JSON.parse(localStorage.getItem('messages') || '[]');
    localStorage.setItem('messages', JSON.stringify([newMessage, ...existing]));
    return true;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    await delay(500);
    const existing = JSON.parse(localStorage.getItem('messages') || '[]');
    if (existing.length === 0) {
        return [
            {
                id: '101',
                name: 'Mahmoud Abbas',
                email: 'mahmoud@example.com',
                whatsapp: '0599111222',
                subject: 'Electricity connection inquiry',
                message: 'We have returned to Al-Sikka street, is the electricity line available?',
                submittedAt: '2024-03-20',
                status: 'unread',
                responded: false
            }
        ];
    }
    return existing;
  },

  async toggleMessageResponded(id: string): Promise<ContactMessage | null> {
    await delay(300);
    const existing: ContactMessage[] = JSON.parse(localStorage.getItem('messages') || '[]');
    const index = existing.findIndex(m => m.id === id);
    if (index !== -1) {
      existing[index].responded = !existing[index].responded;
      localStorage.setItem('messages', JSON.stringify(existing));
      return existing[index];
    }
    return null;
  },

  async getCitizens(): Promise<CitizenRecord[]> {
    await delay(500);
    const existing = JSON.parse(localStorage.getItem('citizens') || '[]');
    if (existing.length === 0) {
      return [
        { 
          id: '1', fullName: 'Ahmed Al-Masri', idNumber: '901234567', phone: '0599123456', originalArea: 'Beit Hanoun - Center', originalStreet: 'Al-Sikka St', currentEvacuationState: 'north', evacuationType: 'school', wifeName: 'Fatima Al-Masri', wifeIdNumber: '907654321', familyMembers: 5, males: 2, females: 3, status: 'verified', submittedAt: new Date().toISOString() 
        }
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
      return existing[index];
    }
    return null;
  },

  async getAnnouncements(): Promise<Announcement[]> {
    await delay(500);
    const existing = localStorage.getItem('announcements');
    if (existing) return JSON.parse(existing);
    localStorage.setItem('announcements', JSON.stringify(MOCK_ANNOUNCEMENTS));
    return MOCK_ANNOUNCEMENTS;
  },

  async createAnnouncement(data: Omit<Announcement, 'id'>): Promise<Announcement> {
    await delay(500);
    const newAnnouncement: Announcement = { ...data, id: Math.random().toString(36).substr(2, 9), hidden: false };
    const existing: Announcement[] = JSON.parse(localStorage.getItem('announcements') || JSON.stringify(MOCK_ANNOUNCEMENTS));
    localStorage.setItem('announcements', JSON.stringify([newAnnouncement, ...existing]));
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

  async toggleAnnouncementVisibility(id: string): Promise<Announcement | null> {
    await delay(300);
    const existing: Announcement[] = JSON.parse(localStorage.getItem('announcements') || '[]');
    const index = existing.findIndex(a => a.id === id);
    if (index !== -1) {
      existing[index].hidden = !existing[index].hidden;
      localStorage.setItem('announcements', JSON.stringify(existing));
      return existing[index];
    }
    return null;
  }
};
