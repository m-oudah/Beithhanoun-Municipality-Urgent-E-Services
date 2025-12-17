

import { Language, Announcement } from './types';

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

export const RELIEF_ORGANIZATIONS = [
  {
    id: 'unrwa',
    name: { en: 'UNRWA', ar: 'وكالة الأونروا' },
    desc: { en: 'The United Nations Relief and Works Agency for Palestine Refugees.', ar: 'وكالة الأمم المتحدة لإغاثة وتشغيل اللاجئين الفلسطينيين.' },
    url: 'https://gazaaid.unrwa.org/Login',
    color: 'text-blue-600'
  },
  {
    id: 'unicef',
    name: { en: 'UNICEF', ar: 'اليونيسيف' },
    desc: { en: 'Working for every child, everywhere, to build a better world.', ar: 'تعمل من أجل كل طفل، في كل مكان، لبناء عالم أفضل.' },
    url: 'https://www.unicef.org/sop/',
    color: 'text-cyan-500'
  },
  {
    id: 'wfp',
    name: { en: 'World Food Programme', ar: 'برنامج الغذاء العالمي' },
    desc: { en: 'The world’s largest humanitarian organization saving lives in emergencies.', ar: 'أكبر منظمة إنسانية في العالم تنقذ الأرواح في حالات الطوارئ.' },
    url: 'https://pal.beneficiaryregistration.cbt.wfp.org/registration',
    color: 'text-blue-700'
  },
  {
    id: 'mosa',
    name: { en: 'Ministry of Social Development', ar: 'وزارة التنمية الاجتماعية' },
    desc: { en: 'Leading the social sector to protect the poor and vulnerable.', ar: 'قيادة القطاع الاجتماعي لحماية الفقراء والفئات المهمشة.' },
    url: 'https://donate.mosd.gov.ps/war-form',
    color: 'text-green-600'
  },
  {
    id: 'save',
    name: { en: 'Save the Children', ar: 'مؤسسة إنقاذ الطفل' },
    desc: { en: 'Championing the rights and interests of children worldwide.', ar: 'الدفاع عن حقوق ومصالح الأطفال في جميع أنحاء العالم.' },
    url: 'https://kobo-ee.savethechildren.net/x/hwIkg8AM',
    color: 'text-red-600'
  },
  {
    id: 'gas',
    name: { en: 'Cooking Gas Registration', ar: 'رابط غاز الطهي' },
    desc: { en: 'Registration for cooking gas distribution in Gaza governorates.', ar: 'رابط التسجيل لتعبئة وتوزيع غاز الطهي في محافظات غزة.' },
    url: 'https://e-gaza.com/login',
    color: 'text-orange-600'
  }
];

export const WAR_STATS = {
  overview: {
    en: "The 2023-2024 aggression on Beit Hanoun resulted in unprecedented destruction, effectively erasing major parts of the city. The municipality estimates indicate that over 90% of the city's infrastructure and residential buildings have been destroyed or severely damaged, rendering the city uninhabitable.",
    ar: "أدى العدوان الإسرائيلي على مدينة بيت حانون في 2023-2024 إلى دمار غير مسبوق، مما أدى فعلياً إلى مسح أجزاء كبيرة من المدينة. تشير تقديرات البلدية إلى أن أكثر من 90% من البنية التحتية والمباني السكنية في المدينة قد دمرت بالكامل أو تضررت بشكل بليغ، مما جعل المدينة غير صالحة للسكن."
  },
  stats: [
    { key: 'martyrs', en: "Martyrs", ar: "الشهداء", value: "1,250+" },
    { key: 'injured', en: "Injured", ar: "الجرحى", value: "3,500+" },
    { key: 'destroyed_homes', en: "Destroyed Homes (Total)", ar: "وحدات سكنية (دمار كلي)", value: "3,800" },
    { key: 'damaged_homes', en: "Damaged Homes (Partial)", ar: "وحدات متضررة (جزئي)", value: "6,500" },
    { key: 'schools', en: "Schools Destroyed/Damaged", ar: "مدارس مدمرة/متضررة", value: "12" },
    { key: 'mosques', en: "Mosques Destroyed", ar: "مساجد مدمرة", value: "15" },
    { key: 'displaced', en: "Displaced Population", ar: "نسبة النزوح", value: "98%" },
    { key: 'infra', en: "Infrastructure Damage", ar: "دمار البنية التحتية", value: "95%" },
  ],
  sources: [
    { en: "Beit Hanoun Municipality - Emergency Committee", ar: "بلدية بيت حانون - لجنة الطوارئ" },
    { en: "Palestinian Ministry of Health", ar: "وزارة الصحة الفلسطينية" },
    { en: "UNRWA Situation Reports", ar: "تقارير تقييم الأونروا" },
    { en: "Euro-Med Human Rights Monitor", ar: "المرصد الأورومتوسطي لحقوق الإنسان" }
  ]
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    date: '2024-03-15',
    category: 'emergency',
    title: {
      en: 'Urgent: Water Distribution Schedule',
      ar: 'عاجل: جدول توزيع المياه للمناطق الشمالية'
    },
    content: {
      en: 'Water tanks will be distributed in the Al-Sikka area starting tomorrow at 8:00 AM. Please bring your containers.',
      ar: 'سيتم توزيع خزانات المياه في منطقة السكة بدءاً من صباح الغد الساعة 8:00 صباحاً. يرجى إحضار الأوعية الخاصة بكم.'
    }
  },
  {
    id: '2',
    date: '2024-03-12',
    category: 'service',
    title: {
      en: 'New Registration Point Opened',
      ar: 'افتتاح نقطة تسجيل جديدة للنازحين'
    },
    content: {
      en: 'A new temporary office has been set up near the UNRWA school to help citizens register their displacement status.',
      ar: 'تم افتتاح مكتب مؤقت بالقرب من مدرسة الوكالة لمساعدة المواطنين في تسجيل بيانات النزوح وتحديث أماكن تواجدهم.'
    }
  },
  {
    id: '3',
    date: '2024-03-10',
    category: 'general',
    title: {
      en: 'Warning Regarding Damaged Structures',
      ar: 'تحذير هام بخصوص المباني الآيلة للسقوط'
    },
    content: {
      en: 'Citizens are advised to stay away from partially destroyed buildings in the city center due to risk of collapse.',
      ar: 'تهيب البلدية بالمواطنين الكرام عدم الاقتراب من المباني المدمرة جزئياً في وسط المدينة نظراً لخطورة انهيارها.'
    }
  },
  {
    id: '4',
    date: '2024-03-08',
    category: 'service',
    title: {
      en: 'Medical Waste Disposal Instructions',
      ar: 'تعليمات التخلص من النفايات الطبية'
    },
    content: {
      en: 'Please separate medical waste from general waste to ensure the safety of sanitation workers.',
      ar: 'يرجى فصل النفايات الطبية عن النفايات العامة لضمان سلامة عمال النظافة ومنع انتشار الأمراض.'
    }
  }
];

export const STATISTICS_DATA = [
  { key: 'martyrs', value: '1,200+ / 3,500+' },
  { key: 'buildings', value: '11,000+' },
  { key: 'hospitals', value: '6' },
  { key: 'schools', value: '18' },
  { key: 'green', value: '3,500,000' },
  { key: 'infra', value: '95%' }
];

export const TRANSLATIONS = {
  en: {
    title: "Beit Hanoun Municipality",
    subtitle: "Emergency Services Portal",
    home: "Home",
    register: "Citizen Registration",
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
    latestAds: "Latest Municipality Announcements",
    viewAllAds: "View All Announcements",
    noAds: "No announcements available at the moment.",
    readMore: "Read More",
    stats: {
      title: "War Impact Statistics (2023-2025)",
      subtitle: "The devastating scale of destruction in Beit Hanoun city and its infrastructure.",
      martyrs: "Martyrs & Injuries",
      buildings: "Destroyed Units",
      hospitals: "Medical Facilities",
      schools: "Destroyed Schools",
      green: "Bulldozed Lands (m²)",
      infra: "Infrastructure Damage"
    },
    formTitle: "Citizen Displacement & Status Form",
    formDesc: "Please follow the steps to register your current status accurately.",
    steps: {
      1: "Personal Info",
      2: "Residence Info",
      3: "Family Info"
    },
    fields: {
      fullName: "Full Name",
      idNumber: "ID Number",
      phone: "Mobile Number",
      whatsapp: "WhatsApp Number (Optional)",
      
      originalArea: "Original Area (Beit Hanoun)",
      originalStreet: "Original Street Name",
      originalAddressDetails: "Address Details",
      currentEvacuationState: "Current Governorate",
      evacuationType: "Type of Shelter",
      originalAddress: "Original Address",
      currentLoc: "Current Location",
      origAddress: "Original Address",

      wifeName: "Wife's Name",
      wifeIdNumber: "Wife's ID Number",
      familyCount: "Total Family Members",
      males: "Number of Males",
      females: "Number of Females",
      notes: "Notes / Needs",

      next: "Next Step",
      back: "Previous",
      submit: "Submit Information",
      sending: "Submitting...",
    },
    contactForm: {
      title: "Contact Municipality",
      desc: "Send your inquiries directly to the administration.",
      name: "Your Name",
      email: "Email Address",
      whatsapp: "WhatsApp Number",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      emergencyContacts: "Emergency Contacts",
      contacts: [
        { label: "Civil Defense", number: "102" },
        { label: "Red Crescent", number: "101" },
        { label: "Police", number: "100" },
        { label: "Municipality Emergency", number: "115" },
      ]
    },
    adminPanel: {
      title: "Administration Dashboard",
      tabs: {
        registry: "Displacement Registry",
        messages: "Inquiries & Messages",
        announcements: "Manage Announcements"
      },
      exportExcel: "Export to Excel",
      printPdf: "Print / Save PDF",
      totalCitizens: "Total Registered",
      pending: "Pending Review",
      recent: "Recent Submissions",
      table: {
        name: "Name",
        location: "Location",
        family: "Family Size",
        status: "Status",
        actions: "Actions",
        phone: "Phone",
        idNumber: "ID Number",
        wifeName: "Wife Name",
        notes: "Notes",
        date: "Date",
        subject: "Subject",
      },
      modal: {
        title: "Request Details",
        updateStatus: "Update Status",
        feedback: "Admin Feedback",
        feedbackPlaceholder: "Write your feedback here to send to the citizen...",
        sendFeedback: "Send Feedback & Update",
        close: "Close",
        statusUpdated: "Status updated and feedback sent!",
        contactInfo: "Contact Information",
        requestInfo: "Request Information",
        messageDetails: "Message Details"
      },
      announcements: {
        add: "Add Announcement",
        edit: "Edit Announcement",
        delete: "Delete",
        titleEn: "Title (English)",
        titleAr: "Title (Arabic)",
        contentEn: "Content (English)",
        contentAr: "Content (Arabic)",
        category: "Category",
        date: "Date",
        save: "Save Announcement",
        confirmDelete: "Are you sure you want to delete this announcement?"
      }
    },
    login: {
      title: "Admin Login",
      username: "Username",
      password: "Password",
      submit: "Login",
      error: "Invalid credentials. Please try again.",
      logout: "Logout"
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number (9-15 digits)",
      invalidID: "Invalid ID Number",
      idExists: "This ID number is already registered",
      nameTooShort: "Name must contain only letters and be at least 3 characters",
      feedbackRequired: "Feedback cannot be empty if you wish to send it"
    },
    footer: "Developed by IT Unit at Beit Hanoun Municipality - 2025",
    chatbot: {
      title: "Municipality Assistant",
      welcome: "Hello! How can I help you today? I can guide you to registration or contact info.",
      placeholder: "Type your message...",
      send: "Send",
      responses: {
        register: "You can register your displacement details on the Registration Page. Shall I take you there?",
        contact: "You can contact us via email, WhatsApp, or the form on the Contact Page.",
        admin: "The Admin Portal is restricted to municipality staff.",
        default: "I'm here to help. You can ask about 'registration', 'contact', or 'location'."
      }
    }
  },
  ar: {
    title: "بلدية بيت حانون",
    subtitle: "بوابة الخدمات الطارئة",
    home: "الرئيسية",
    register: "تسجيل المواطنين",
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
    latestAds: "آخر إعلانات البلدية",
    viewAllAds: "عرض جميع التعاميم",
    noAds: "لا توجد إعلانات متاحة حالياً.",
    readMore: "اقرأ المزيد",
    stats: {
      title: "إحصائيات أضرار العدوان (2023-2025)",
      subtitle: "حجم الدمار الهائل في مدينة بيت حانون والبنية التحتية.",
      martyrs: "الشهداء والجرحى",
      buildings: "وحدات سكنية مدمرة",
      hospitals: "مرافق صحية وعيادات",
      schools: "مدارس ومؤسسات",
      green: "تجريف أراضي زراعية (م²)",
      infra: "دمار البنية التحتية"
    },
    formTitle: "نموذج بيانات المواطنين والنزوح",
    formDesc: "يرجى اتباع الخطوات لتسجيل حالتك الحالية بدقة.",
    steps: {
      1: "البيانات الشخصية",
      2: "بيانات السكن والنزوح",
      3: "البيانات العائلية"
    },
    fields: {
      fullName: "الاسم الرباعي",
      idNumber: "رقم الهوية",
      phone: "رقم الجوال",
      whatsapp: "رقم الواتساب (اختياري)",
      
      originalArea: "المنطقة الأصلية (بيت حانون)",
      originalStreet: "اسم الشارع الأصلي",
      originalAddressDetails: "تفاصيل العنوان",
      currentEvacuationState: "محافظة النزوح الحالية",
      evacuationType: "نوع مكان النزوح",
      originalAddress: "العنوان الأصلي",
      currentLoc: "مكان النزوح",
      origAddress: "العنوان الأصلي",

      wifeName: "اسم الزوجة الرباعي",
      wifeIdNumber: "رقم هوية الزوجة",
      familyCount: "عدد أفراد الأسرة",
      males: "عدد الذكور",
      females: "عدد الإناث",
      notes: "ملاحظات / احتياجات",

      next: "التالي",
      back: "السابق",
      submit: "إرسال البيانات",
      sending: "جاري الإرسال...",
    },
    contactForm: {
      title: "تواصل مع البلدية",
      desc: "أرسل استفساراتك مباشرة إلى الإدارة.",
      name: "اسمك",
      email: "البريد الإلكتروني",
      whatsapp: "رقم الواتساب",
      subject: "الموضوع",
      message: "نص الرسالة",
      send: "إرسال الرسالة",
      emergencyContacts: "أرقام الطوارئ الهامة",
      contacts: [
        { label: "الدفاع المدني", number: "102" },
        { label: "الهلال الأحمر", number: "101" },
        { label: "الشرطة", number: "100" },
        { label: "طوارئ البلدية", number: "115" },
      ]
    },
    adminPanel: {
      title: "لوحة التحكم الإدارية",
      tabs: {
        registry: "سجل النازحين",
        messages: "طلبات المواطنين والمراسلات",
        announcements: "إدارة الإعلانات"
      },
      exportExcel: "تصدير لملف Excel",
      printPdf: "طباعة / حفظ PDF",
      totalCitizens: "المسجلين",
      pending: "قيد المراجعة",
      recent: "أحدث الطلبات",
      table: {
        name: "الاسم",
        location: "الموقع",
        family: "الأفراد",
        status: "الحالة",
        actions: "إجراءات",
        phone: "رقم التواصل",
        idNumber: "رقم الهوية",
        wifeName: "اسم الزوجة",
        notes: "ملاحظات",
        date: "التاريخ",
        subject: "الموضوع",
      },
      modal: {
        title: "تفاصيل الطلب",
        updateStatus: "تحديث الحالة",
        feedback: "ملاحظات الإدارة",
        feedbackPlaceholder: "اكتب ملاحظاتك هنا لإرسالها للمواطن...",
        sendFeedback: "إرسال الملاحظات والتحديث",
        close: "إغلاق",
        statusUpdated: "تم تحديث الحالة وإرسال الملاحظات!",
        contactInfo: "معلومات الاتصال",
        requestInfo: "معلومات الطلب",
        messageDetails: "تفاصيل الرسالة"
      },
      announcements: {
        add: "إضافة إعلان جديد",
        edit: "تعديل الإعلان",
        delete: "حذف",
        titleEn: "العنوان (إنجليزي)",
        titleAr: "العنوان (عربي)",
        contentEn: "المحتوى (إنجليزي)",
        contentAr: "المحتوى (عربي)",
        category: "التصنيف",
        date: "التاريخ",
        save: "حفظ الإعلان",
        confirmDelete: "هل أنت متأكد من حذف هذا الإعلان؟"
      }
    },
    login: {
      title: "دخول المشرفين",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      error: "بيانات الدخول غير صحيحة. حاول مرة أخرى.",
      logout: "تسجيل الخروج"
    },
    validation: {
      required: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
      invalidPhone: "يرجى إدخال رقم هاتف صحيح (9-15 رقم)",
      invalidID: "يرجى إدخال رقم هوية صحيح",
      idExists: "رقم الهوية هذا مسجل مسبقاً",
      nameTooShort: "الاسم يجب أن يحتوي على أحرف فقط (3 أحرف على الأقل)",
      feedbackRequired: "الملاحظات لا يمكن أن تكون فارغة"
    },
    footer: "تم تطويره بواسطة وحدة تكنولوجيا المعلومات في بلدية بيت حانون - 2025",
    chatbot: {
      title: "المساعد الآلي",
      welcome: "أهلاً بك! كيف يمكنني مساعدتك اليوم؟ يمكنني توجيهك للتسجيل أو التواصل.",
      placeholder: "اكتب رسالتك...",
      send: "إرسال",
      responses: {
        register: "يمكنك تسجيل بيانات النزوح من خلال صفحة التسجيل. هل تريد الانتقال لهناك؟",
        contact: "يمكنك التواصل معنا عبر البريد، الواتساب أو نموذج الاتصال.",
        admin: "بوابة الإدارة مخصصة لموظفي البلدية فقط.",
        default: "أنا هنا للمساعدة. يمكنك السؤال عن 'التسجيل'، 'التواصل'، أو 'الموقع'."
      }
    }
  }
};
