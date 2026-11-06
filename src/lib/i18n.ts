/**
 * Interface strings for the site chrome (navigation, footer, shared UI).
 *
 * Article content has its own translations in the library files; this covers
 * the frame around it, so a Hindi reader on a Hindi page is not handed English
 * menus, buttons and helpline copy.
 */

export type Lang = "en" | "hi";

export const ui = {
  en: {
    nav: {
      home: "Home",
      briefings: "Briefings",
      infographics: "Infographics",
      comics: "Comics",
      about: "About",
      sponsors: "Sponsors",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primary: "Primary",
    },
    search: {
      open: "Search",
      label: "Search articles",
      title: "Search",
      placeholder: "Search scams, guides, briefings…",
      close: "Close",
      suggested: "Suggested articles",
      resultsFor: (query: string) => `Results for "${query}"`,
      shown: (count: number) => `${count} shown`,
      emptyTitle: "No articles matched that search.",
      emptyHint: "Try terms like digital arrest, OTP, UPI, e-challan or WhatsApp.",
      loading: "Loading…",
    },
    language: {
      group: "Language",
      machine: "Machine translation by Google",
    },
    footer: {
      read: "Read",
      publication: "Publication",
      weeklyBriefings: "Weekly Briefings",
      comicsKona: "Comics Kona",
      aboutUs: "About Us",
      contactUs: "Contact Us",
      editorialPolicy: "Editorial Policy",
      privacy: "Privacy",
      rss: "RSS Feed",
      victimKicker: "Victim of cyber fraud?",
      victimBody: "Report it immediately — the first few hours matter most for recovering money.",
      call: "Call 1930",
      blurb:
        "Weekly cyber fraud alerts and a free Hindi and English awareness library for readers across Uttar Pradesh and India — the scams doing the rounds, and the practical steps that protect you.",
      independence:
        "Cyber Vani is an editorially independent publication. Sponsorship never influences what we cover or how we cover it.",
      rights: "All rights reserved.",
      upCell: "UP Police Cyber Cell",
    },
    breadcrumbHome: "Home",
  },
  hi: {
    nav: {
      home: "होम",
      briefings: "साप्ताहिक ब्रीफ़िंग",
      infographics: "इन्फोग्राफिक्स",
      comics: "कॉमिक्स",
      about: "हमारे बारे में",
      sponsors: "प्रायोजक",
      contact: "संपर्क",
      openMenu: "मेनू खोलें",
      closeMenu: "मेनू बंद करें",
      primary: "मुख्य",
    },
    search: {
      open: "खोजें",
      label: "लेख खोजें",
      title: "खोजें",
      placeholder: "ठगी, गाइड, ब्रीफ़िंग खोजें…",
      close: "बंद करें",
      suggested: "सुझाए गए लेख",
      resultsFor: (query: string) => `"${query}" के परिणाम`,
      shown: (count: number) => `${count} परिणाम`,
      emptyTitle: "इस खोज से कोई लेख नहीं मिला।",
      emptyHint: "डिजिटल अरेस्ट, OTP, UPI, ई-चालान या WhatsApp जैसे शब्द आज़माएँ।",
      loading: "लोड हो रहा है…",
    },
    language: {
      group: "भाषा",
      machine: "Google द्वारा मशीन अनुवाद",
    },
    footer: {
      read: "पढ़ें",
      publication: "प्रकाशन",
      weeklyBriefings: "साप्ताहिक ब्रीफ़िंग",
      comicsKona: "कॉमिक्स कोना",
      aboutUs: "हमारे बारे में",
      contactUs: "संपर्क करें",
      editorialPolicy: "संपादकीय नीति",
      privacy: "गोपनीयता",
      rss: "RSS फ़ीड",
      victimKicker: "साइबर ठगी के शिकार हुए?",
      victimBody: "तुरंत शिकायत करें — पैसा वापस पाने के लिए शुरुआती कुछ घंटे सबसे अहम होते हैं।",
      call: "1930 पर कॉल करें",
      blurb:
        "उत्तर प्रदेश और पूरे भारत के पाठकों के लिए साप्ताहिक साइबर ठगी अलर्ट और मुफ़्त हिंदी-अंग्रेज़ी जागरूकता लाइब्रेरी — आजकल चल रही ठगी, और उनसे बचने के व्यावहारिक कदम।",
      independence:
        "साइबर वाणी एक संपादकीय रूप से स्वतंत्र प्रकाशन है। प्रायोजन कभी तय नहीं करता कि हम क्या और कैसे लिखते हैं।",
      rights: "सर्वाधिकार सुरक्षित।",
      upCell: "यूपी पुलिस साइबर सेल",
    },
    breadcrumbHome: "होम",
  },
} as const;

export type UiStrings = (typeof ui)[Lang];
