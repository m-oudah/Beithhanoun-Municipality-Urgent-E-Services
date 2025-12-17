
import { Language, Announcement, HousingUnit } from './types';

// Mock data for housing units
export const MOCK_HOUSING_UNITS: HousingUnit[] = [
  {
    id: 'u1',
    ownerName: 'أحمد محمد علي المصري',
    ownerId: '901234567',
    dob: '1985-05-10',
    idIssueDate: '2020-01-15',
    address: 'شارع السكة - وسط البلد',
    floors: 3,
    area: 150,
    condition: 'total_destruction',
    lastUpdated: '2024-12-01'
  },
  {
    id: 'u2',
    ownerName: 'خليل ابراهيم حسن',
    ownerId: '909876543',
    dob: '1978-11-20',
    idIssueDate: '2019-06-22',
    address: 'منطقة الكرامة - القرب من المسجد',
    floors: 2,
    area: 120,
    condition: 'uninhabitable',
    lastUpdated: '2024-11-15'
  },
  {
    id: 'u3',
    ownerName: 'سارة محمود عبدالله',
    ownerId: '401223344',
    dob: '1992-03-05',
    idIssueDate: '2021-08-10',
    address: 'حي الأمل - بلوك ج',
    floors: 1,
    area: 100,
    condition: 'habitable',
    lastUpdated: '2025-01-10'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    date: '2024-12-28',
    category: 'emergency',
    title: {
      en: 'Urgent: Water Distribution Schedule',
      ar: 'عاجل: جدول توزيع المياه'
    },
    content: {
      en: 'Water will be available in the Central District starting from 8 AM tomorrow.',
      ar: 'سيتم توفير المياه في منطقة المركز ابتداءً من الساعة 8 صباحاً غداً.'
    },
    hidden: false
  },
  {
    id: 'a2',
    date: '2025-01-02',
    category: 'service',
    title: {
      en: 'Maintenance of Main Power Line',
      ar: 'صيانة خط الكهرباء الرئيسي'
    },
    content: {
      en: 'Technical teams are working to restore power to the Sikka Street area.',
      ar: 'تعمل الفرق الفنية على إعادة التيار الكهربائي لمنطقة شارع السكة.'
    },
    hidden: false
  }
];

export const RELIEF_ORGANIZATIONS = [
  {
    id: 'org1',
    name: { en: 'UNRWA', ar: 'الأونروا' },
    desc: { 
      en: 'Providing food aid, education, and healthcare to Palestinian refugees.',
      ar: 'تقديم المساعدات الغذائية والتعليم والرعاية الصحية للاجئين الفلسطينيين.'
    },
    url: 'https://www.unrwa.org',
    color: 'text-blue-600'
  },
  {
    id: 'org2',
    name: { en: 'Palestine Red Crescent', ar: 'الهلال الأحمر الفلسطيني' },
    desc: { 
      en: 'Emergency medical services and humanitarian aid across the Gaza Strip.',
      ar: 'خدمات الطوارئ الطبية والمساعدات الإنسانية في جميع أنحاء قطاع غزة.'
    },
    url: 'https://www.palestinercs.org',
    color: 'text-red-600'
  }
];

export const WAR_STATS = {
  overview: {
    en: 'Beit Hanoun has faced unprecedented destruction since October 2023, affecting over 90% of its infrastructure and residential areas.',
    ar: 'واجهت بيت حانون دماراً غير مسبوق منذ أكتوبر 2023، مما أثر على أكثر من 90% من بنيتها التحتية ومناطقها السكنية.'
  },
  stats: [
    { key: 'martyrs', value: '1,200+', en: 'Martyrs', ar: 'شهداء' },
    { key: 'injured', value: '3,500+', en: 'Injured', ar: 'جرحى' },
    { key: 'destroyed_homes', value: '8,500+', en: 'Total Destroyed Homes', ar: 'منازل مدمرة كلياً' },
    { key: 'damaged_homes', value: '12,000+', en: 'Damaged Homes', ar: 'منازل متضررة جزئياً' },
    { key: 'schools', value: '18', en: 'Schools Targeted', ar: 'مدارس مستهدفة' },
    { key: 'mosques', value: '25', en: 'Mosques Damaged', ar: 'مساجد متضررة' },
    { key: 'displaced', value: '55,000+', en: 'Displaced Persons', ar: 'نازحين' },
    { key: 'infra', value: '95%', en: 'Infrastructure Damage', ar: 'دمار البنية التحتية' }
  ],
  sources: [
    { en: 'Beit Hanoun Municipality Technical Office', ar: 'المكتب الفني لبلدية بيت حانون' },
    { en: 'Ministry of Public Works and Housing', ar: 'وزارة الأشغال العامة والإسكان' },
    { en: 'OCHA - United Nations', ar: 'مكتب تنسيق الشؤون الإنسانية (أوتشا)' }
  ]
};

export const TRANSLATIONS = {
  en: {
    title: "Beit Hanoun Municipality",
    subtitle: "Emergency Services Portal",
    home: "Home",
    register: "Citizen Registration",
    housingInquiry: "Housing Inquiry",
    contact: "Contact Us",
    admin: "Admin Portal",
    ads: "Announcements",
    relief: "Relief Organizations",
    war2023: "War 2023 Statistics",
    visitWebsite: "Visit Website",
    welcome: "Beit Hanoun Municipality Emergency Services Portal",
    welcomeDesc: "We strive to serve you by assessing damages, updating displacement records, and receiving urgent appeals during these critical times.",
    btnRegister: "Citizen Registration",
    btnContact: "Contact Us",
    btnInquiry: "Housing Inquiry",
    latestAds: "Latest Municipality Announcements",
    viewAllAds: "View All Announcements",
    noAds: "No announcements available at the moment.",
    readMore: "Read More",
    footer: "Developed by IT Unit at Beit Hanoun Municipality - 2025",
    housing: {
      title: "Housing Unit Inquiry",
      desc: "Inquire about the technical status and details of your residential unit registered with the municipality.",
      searchPlaceholder: "Search by Owner Name...",
      verifyTitle: "Identity Verification",
      verifyDesc: "Please provide the following details to access unit information.",
      idNumber: "ID Number",
      unitAddress: "Registered Unit Address",
      btnVerify: "Verify & Search",
      notFound: "No matching record found with these credentials.",
      detailsTitle: "Unit Details",
      owner: "Owner Name",
      floors: "Number of Floors",
      area: "Unit Area (sqm)",
      condition: "Technical Condition",
      lastUpdate: "Last Assessment Date",
      conditions: {
        total_destruction: "Total Destruction",
        uninhabitable: "Uninhabitable (Severe Damage)",
        habitable: "Habitable (Safe)"
      }
    },
    formTitle: "Displacement Registration",
    formDesc: "Please provide accurate information to help us track and serve displaced families.",
    steps: { 1: "Identity", 2: "Location", 3: "Family" },
    contactForm: {
      title: "Direct Communication",
      desc: "Send your inquiries or emergency appeals directly to the municipality administration.",
      name: "Full Name",
      email: "Email Address",
      whatsapp: "WhatsApp Number",
      subject: "Subject",
      message: "Message Content",
      send: "Send Message",
      emergencyContacts: "Emergency Contacts",
      contacts: [
        { label: "Emergency Center", number: "115" },
        { label: "Ambulance", number: "101" },
        { label: "Civil Defense", number: "102" }
      ]
    },
    stats: { title: "War Impact Statistics", subtitle: "Data of destruction", martyrs: "Martyrs", buildings: "Buildings", hospitals: "Hospitals", schools: "Schools", green: "Green Lands", infra: "Infrastructure" },
    adminPanel: { 
      title: "Admin Panel", 
      tabs: { registry: "Registry", messages: "Messages", announcements: "Announcements" }, 
      totalCitizens: "Total", 
      exportExcel: "Export Excel",
      printPdf: "Print PDF",
      table: { name: "Name", idNumber: "ID", phone: "Phone", family: "Family", responded: "Responded", actions: "Actions", date: "Date", subject: "Subject" }, 
      announcements: { add: "Add", edit: "Edit", delete: "Delete", hide: "Hide", show: "Show", date: "Date", category: "Category", titleAr: "Title (Ar)", contentAr: "Content (Ar)", titleEn: "Title (En)", contentEn: "Content (En)", save: "Save", categories: { general: "General", emergency: "Emergency", service: "Service" } }, 
      modal: { updateStatus: "Update Status", feedback: "Feedback", feedbackPlaceholder: "Enter admin feedback...", sendFeedback: "Send", close: "Close", statusUpdated: "Updated", messageDetails: "Message Details" } 
    },
    login: { title: "Login", username: "Username", password: "Password", submit: "Login", error: "Invalid credentials", logout: "Logout" },
    chatbot: { title: "Assistant", welcome: "Hello, how can I help you today?", placeholder: "Ask me anything...", clickToGo: "Go to Page", responses: { register: "You can register your displacement data through our registration portal.", contact: "You can contact us via the contact form or emergency numbers.", admin: "The admin panel is restricted to authorized personnel only.", default: "I am here to help. You can ask about registration, contact info, or housing inquiries." } },
    fields: { fullName: "Full Name", idNumber: "ID Number", phone: "Phone", whatsapp: "WhatsApp", originalArea: "Original Area", originalStreet: "Original Street", originalAddressDetails: "Additional Address Info", currentEvacuationState: "Current Location", evacuationType: "Shelter Type", wifeName: "Wife Name", wifeIdNumber: "Wife ID", familyMembers: "Family Size", familyCount: "Family Size", males: "Males", females: "Females", notes: "Notes", currentLoc: "Current Location", next: "Next", back: "Back", submit: "Submit", sending: "Sending..." },
    validation: { required: "This field is required", invalidEmail: "Invalid Email", invalidPhone: "Invalid Phone", invalidID: "ID must be 9 digits", idExists: "ID already registered", nameTooShort: "Name is too short", feedbackRequired: "Feedback Required" }
  },
  ar: {
    title: "بلدية بيت حانون",
    subtitle: "بوابة الخدمات الطارئة",
    home: "الرئيسية",
    register: "تسجيل المواطنين",
    housingInquiry: "استعلام الوحدات السكنية",
    contact: "اتصل بنا",
    admin: "لوحة الإدارة",
    ads: "التعاميم والإعلانات",
    relief: "مؤسسات إغاثية",
    war2023: "إحصائيات حرب 2023",
    visitWebsite: "زيارة الموقع",
    welcome: "بوابة الخدمات الطارئة لبلدية بيت حانون",
    welcomeDesc: "نسعى لخدمتكم والتخفيف عنكم من خلال حصر الأضرار وتحديث بيانات النزوح واستقبال مناشداتكم العاجلة.",
    btnRegister: "تسجيل بيانات المواطنين",
    btnContact: "تواصل معنا",
    btnInquiry: "استعلام الوحدات السكنية",
    latestAds: "آخر إعلانات البلدية",
    viewAllAds: "عرض جميع التعاميم",
    noAds: "لا توجد إعلانات متاحة حالياً.",
    readMore: "اقرأ المزيد",
    footer: "تم تطويره بواسطة وحدة تكنولوجيا المعلومات في بلدية بيت حانون - 2025",
    housing: {
      title: "استعلام عن بيانات الوحدة السكنية",
      desc: "استعلم عن الحالة الفنية وتفاصيل وحدتك السكنية المسجلة لدى البلدية.",
      searchPlaceholder: "ابحث باسم صاحب الوحدة الرباعي...",
      verifyTitle: "خطوة التأكد من البيانات",
      verifyDesc: "يرجى تقديم البيانات التالية للوصول إلى تفاصيل الوحدة بشكل آمن.",
      idNumber: "رقم الهوية",
      unitAddress: "عنوان الوحدة المسجل",
      btnVerify: "تأكيد البيانات والاستعلام",
      notFound: "عذراً، لم يتم العثور على سجل مطابق لهذه البيانات.",
      detailsTitle: "تفاصيل الوحدة السكنية",
      owner: "اسم صاحب الوحدة",
      floors: "عدد الطوابق",
      area: "مساحة الوحدة (م²)",
      condition: "الحالة الفنية للوحدة",
      lastUpdate: "تاريخ آخر تحديث للبيانات",
      conditions: {
        total_destruction: "هدم كلي",
        uninhabitable: "غير صالحة للسكن (أضرار جسيمة)",
        habitable: "صالح للسكن"
      }
    },
    formTitle: "تسجيل بيانات النازحين",
    formDesc: "يرجى تقديم معلومات دقيقة لمساعدتنا في تتبع وخدمة العائلات النازحة.",
    steps: { 1: "الهوية", 2: "المكان", 3: "العائلة" },
    contactForm: {
      title: "تواصل مباشر",
      desc: "أرسل استفساراتك أو مناشداتك الطارئة مباشرة إلى إدارة البلدية.",
      name: "الاسم الرباعي",
      email: "البريد الإلكتروني",
      whatsapp: "رقم الواتساب",
      subject: "الموضوع",
      message: "محتوى الرسالة",
      send: "إرسال الرسالة",
      emergencyContacts: "أرقام الطوارئ",
      contacts: [
        { label: "مركز الطوارئ", number: "115" },
        { label: "الإسعاف", number: "101" },
        { label: "الدفاع المدني", number: "102" }
      ]
    },
    stats: { title: "إحصائيات أضرار العدوان", subtitle: "حجم الدمار في المدينة", martyrs: "الشهداء والجرحى", buildings: "وحدات مدمرة", hospitals: "مرافق صحية", schools: "مدارس", green: "تجريف أراضي", infra: "دمار البنية التحتية" },
    adminPanel: { 
      title: "لوحة التحكم الإدارية", 
      tabs: { registry: "سجل النازحين", messages: "طلبات المواطنين", announcements: "إدارة الإعلانات" }, 
      totalCitizens: "المسجلين", 
      exportExcel: "تصدير Excel",
      printPdf: "طباعة PDF",
      table: { name: "الاسم", idNumber: "رقم الهوية", phone: "الهاتف", family: "العائلة", responded: "تم الرد", actions: "إجراءات", date: "التاريخ", subject: "الموضوع" }, 
      announcements: { add: "إضافة", edit: "تعديل", delete: "حذف", hide: "إخفاء", show: "إظهار", date: "التاريخ", category: "التصنيف", titleAr: "العنوان (عربي)", contentAr: "المحتوى (عربي)", titleEn: "العنوان (إنجليزي)", contentEn: "المحتوى (إنجليزي)", save: "حفظ", categories: { general: "عام", emergency: "طوارئ", service: "خدماتي" } }, 
      modal: { updateStatus: "تحديث الحالة", feedback: "ملاحظات", feedbackPlaceholder: "أدخل ملاحظات الإدارة...", sendFeedback: "إرسال", close: "إغلاق", statusUpdated: "تم التحديث", messageDetails: "تفاصيل الرسالة" } 
    },
    login: { title: "دخول المشرفين", username: "اسم المستخدم", password: "كلمة المرور", submit: "دخول", error: "بيانات الدخول غير صحيحة", logout: "خروج" },
    chatbot: { title: "المساعد الآلي", welcome: "أهلاً بك، كيف يمكنني مساعدتك اليوم؟", placeholder: "اسأل عن أي شيء...", clickToGo: "انتقل للصفحة", responses: { register: "يمكنك تسجيل بيانات النزوح الخاصة بك من خلال بوابة التسجيل لدينا.", contact: "يمكنك التواصل معنا عبر نموذج الاتصال أو أرقام الطوارئ.", admin: "لوحة الإدارة مخصصة للموظفين المخولين فقط.", default: "أنا هنا للمساعدة. يمكنك السؤال عن التسجيل، معلومات التواصل، أو استعلامات السكن." } },
    fields: { fullName: "الاسم الرباعي", idNumber: "رقم الهوية", phone: "رقم الجوال", whatsapp: "رقم الواتساب", originalArea: "المنطقة الأصلية", originalStreet: "الشارع الأصلي", originalAddressDetails: "تفاصيل العنوان الإضافية", currentEvacuationState: "مكان النزوح الحالي", evacuationType: "نوع مأوى النزوح", wifeName: "اسم الزوجة", wifeIdNumber: "هوية الزوجة", familyMembers: "عدد أفراد العائلة", familyCount: "عدد أفراد العائلة", males: "عدد الذكور", females: "عدد الإناث", notes: "ملاحظات إضافية", currentLoc: "المكان الحالي", next: "التالي", back: "السابق", submit: "إرسال", sending: "جاري..." },
    validation: { required: "هذا الحقل مطلوب", invalidEmail: "بريد إلكتروني غير صحيح", invalidPhone: "رقم هاتف غير صحيح", invalidID: "يجب أن يتكون رقم الهوية من 9 أرقام", idExists: "رقم الهوية مسجل مسبقاً", nameTooShort: "الاسم قصير جداً", feedbackRequired: "الملاحظات مطلوبة" }
  }
};

export const LOCATIONS = [
  { value: "Beit Hanoun - Center", en: "Beit Hanoun - Center", ar: "بيت حانون - البلد / المركز" },
  { value: "Beit Hanoun - Izbat Beit Hanoun", en: "Beit Hanoun - Izbat Beit Hanoun", ar: "بيت حانون - عزبة بيت حانون" },
  { value: "Beit Hanoun - Al-Karama", en: "Beit Hanoun - Al-Karama", ar: "بيت حانون - منطقة الكرامة" },
  { value: "Beit Hanoun - Al-Sikka", en: "Beit Hanoun - Al-Sikka", ar: "بيت حانون - شارع السكة" },
  { value: "Beit Hanoun - Towers", en: "Beit Hanoun - Towers", ar: "بيت حانون - الأبراج (الندى/العودة)" },
  { value: "Beit Hanoun - Al-Amal", en: "Beit Hanoun - Al-Amal", ar: "بيت حانون - حي الأمل" },
  { value: "Beit Hanoun - Al-Zaytun", en: "Beit Hanoun - Al-Zaytun", ar: "بيت حانون - حي الزيتون" }
];

export const EVACUATION_TYPES = [
  { id: 'camp', en: 'Displacement Camp', ar: 'مخيم نزوح' },
  { id: 'tent', en: 'Private Tent', ar: 'خيمة خاصة' },
  { id: 'school', en: 'UNRWA/Gov School', ar: 'مدرسة (إيواء)' },
  { id: 'relative', en: 'With Relatives', ar: 'عند أقارب' },
  { id: 'rent', en: 'Rented Apartment', ar: 'شقة مستأجرة' },
  { id: 'other', en: 'Other', ar: 'أخرى' }
];

export const EVACUATION_STATES = [
  { id: 'north', en: 'North Gaza', ar: 'شمال غزة' },
  { id: 'gaza', en: 'Gaza City', ar: 'مدينة غزة' },
  { id: 'middle', en: 'Middle Area', ar: 'الوسطى' },
  { id: 'khan', en: 'Khan Yunis', ar: 'خانيونس' },
  { id: 'rafah', en: 'Rafah', ar: 'رفح' },
  { id: 'outside', en: 'Outside Gaza', ar: 'خارج القطاع' }
];

export const STATISTICS_DATA = [
  { key: 'martyrs', value: '1,200+ / 3,500+' },
  { key: 'buildings', value: '11,000+' },
  { key: 'hospitals', value: '6' },
  { key: 'schools', value: '18' },
  { key: 'green', value: '3,500,000' },
  { key: 'infra', value: '95%' }
];
