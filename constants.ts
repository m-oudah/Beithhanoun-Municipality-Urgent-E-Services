
import { Language } from './types';

export const LOCATIONS = [
  "Beit Hanoun - Center",
  "Beit Hanoun - Izbat Beit Hanoun",
  "Beit Hanoun - Al-Karama",
  "Jabalia Camp (Temporary)",
  "Gaza City (Temporary)",
  "South Gaza (Temporary)",
  "Other"
];

export const TRANSLATIONS = {
  en: {
    title: "Beit Hanoun Municipality",
    subtitle: "Electronic Services Portal",
    home: "Home",
    register: "Citizen Registration",
    contact: "Contact Us",
    admin: "Admin Portal",
    welcome: "Welcome to Beit Hanoun Emergency Services Portal",
    welcomeDesc: "We strive to serve you by assessing damages, updating displacement records, and receiving urgent appeals during these critical times.",
    btnRegister: "Register Data",
    btnContact: "Contact Support",
    formTitle: "Citizen Displacement & Status Form",
    formDesc: "Please fill in accurate details regarding your current residence and family status.",
    fields: {
      fullName: "Full Name",
      phone: "Phone Number",
      whatsapp: "WhatsApp Number",
      familyCount: "Number of Family Members",
      currentLoc: "Current Place of Stay",
      origAddress: "Original Address in Beit Hanoun",
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
    },
    adminPanel: {
      title: "Administration Dashboard",
      totalCitizens: "Total Registered",
      pending: "Pending Review",
      recent: "Recent Submissions",
      table: {
        name: "Name",
        location: "Location",
        family: "Family Size",
        status: "Status",
        actions: "Actions",
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
        requestInfo: "Request Information"
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
      nameTooShort: "Name must be at least 3 characters",
      feedbackRequired: "Feedback cannot be empty if you wish to send it"
    },
    footer: "© 2024 Beit Hanoun Municipality. All Rights Reserved.",
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
    subtitle: "بوابة الخدمات الإلكترونية",
    home: "الرئيسية",
    register: "تسجيل المواطنين",
    contact: "اتصل بنا",
    admin: "لوحة الإدارة",
    welcome: "مرحباً بكم في بوابة الخدمات الطارئة لبلدية بيت حانون",
    welcomeDesc: "نسعى لخدمتكم والتخفيف عنكم من خلال حصر الأضرار وتحديث بيانات النزوح واستقبال مناشداتكم العاجلة.",
    btnRegister: "تسجيل البيانات",
    btnContact: "الدعم الفني",
    formTitle: "نموذج بيانات المواطنين والنزوح",
    formDesc: "يرجى تعبئة بيانات دقيقة بخصوص مكان الإقامة الحالي ووضع العائلة.",
    fields: {
      fullName: "الاسم الرباعي",
      phone: "رقم الهاتف / الجوال",
      whatsapp: "رقم الواتساب",
      familyCount: "عدد أفراد الأسرة",
      currentLoc: "مكان الإقامة الحالي",
      origAddress: "العنوان الأصلي في بيت حانون",
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
    },
    adminPanel: {
      title: "لوحة التحكم الإدارية",
      totalCitizens: "المسجلين",
      pending: "قيد المراجعة",
      recent: "أحدث الطلبات",
      table: {
        name: "الاسم",
        location: "الموقع",
        family: "الأفراد",
        status: "الحالة",
        actions: "إجراءات",
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
        requestInfo: "معلومات الطلب"
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
      nameTooShort: "الاسم يجب أن يكون 3 أحرف على الأقل",
      feedbackRequired: "الملاحظات لا يمكن أن تكون فارغة"
    },
    footer: "© 2024 بلدية بيت حانون. جميع الحقوق محفوظة.",
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