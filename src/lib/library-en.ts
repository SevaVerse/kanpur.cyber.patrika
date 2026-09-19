import type { LibraryItem } from "@/lib/library-types";

/** English-language items in the awareness library. */
export const englishItems: LibraryItem[] = [
  // ───────────────────────── English ─────────────────────────
  {
    slug: "digital-arrest",
    lang: "en",
    kind: "infographic",
    title: "Digital Arrest — Prevention Is Protection",
    headline: "Digital arrest scam: how it works and how to stop it",
    description:
      "No government agency arrests anyone over a phone or video call. Learn how the digital arrest scam works, the six steps that protect you, and how to report it on 1930.",
    category: "Social Engineering",
    tags: ["digital arrest", "scam", "impersonation", "police fraud", "India"],
    publishedAt: "2024-05-01",
    assets: [
      {
        src: "/infographics/infographics_5.jpeg",
        alt: "Digital Arrest awareness poster: a worried woman on a phone call, a fake police video call stamped FAKE, and six prevention steps.",
        caption: "Cyber Vani special awareness edition, May 2024.",
      },
    ],
    blocks: [
      { kind: "para", text: "Be aware. Be alert. Be safe." },
      {
        kind: "para",
        text: "Digital arrest is a new-age scam with real consequences. Scammers impersonate government officials, police or agencies and threaten you with digital arrest claims, legal action and penalties, in order to steal your money and personal data.",
      },
      {
        kind: "callout",
        tone: "warn",
        text: "No government agency arrests anyone over a phone or video call. There is no such legal process as a digital arrest.",
      },
      { kind: "heading", text: "Recent cases across India" },
      {
        kind: "para",
        text: "Many people have lost lakhs of rupees after being threatened with digital arrest. The fraud works by manufacturing panic and then keeping the victim isolated on a video call so they cannot consult anyone who would recognise it.",
      },
      { kind: "heading", text: "Prevention is protection" },
      {
        kind: "para",
        text: "Think. Verify. Do not be their next victim. These six habits stop the scam before it starts.",
      },
    ],
    howTo: {
      name: "How to protect yourself from a digital arrest scam",
      steps: [
        {
          title: "Do not trust unknown calls",
          text: "Avoid answering calls from unknown numbers, especially video calls from people claiming to be officials.",
        },
        {
          title: "Government agencies will not call you",
          text: "No agency will threaten you with arrest or ask for money over a call.",
        },
        {
          title: "Do not share personal information",
          text: "Never share OTPs, bank details, identity documents or passwords with a caller.",
        },
        {
          title: "Do not transfer money",
          text: "Never send money to resolve a legal issue or to avoid an arrest. Any such demand is a fraud.",
        },
        {
          title: "Verify, then trust",
          text: "Verify the caller identity independently by calling the official helpline number of the agency they claim to represent.",
        },
        {
          title: "Report and share",
          text: "Report the incident on 1930 or at cybercrime.gov.in, and tell others so they recognise the pattern.",
        },
      ],
    },
    altLangSlug: "digital-arrest",
    related: ["mole-account", "cyberbullying-and-data-breaches"],
  },
  {
    slug: "mole-account",
    lang: "en",
    kind: "infographic",
    title: "Mole Account — A Hidden Threat",
    headline: "What is a mole account, and how do you stay safe from one?",
    description:
      "A mole account is a fake online identity used to deceive, steal information, damage reputation or commit fraud anonymously. Learn what they are used for and six ways to protect yourself.",
    category: "Social Engineering",
    tags: ["mole account", "fake identity", "impersonation", "social media", "awareness"],
    publishedAt: "2026-05-13",
    assets: [
      {
        src: "/infographics/infographics_8.jpeg",
        alt: "Mole Account awareness poster showing a fake social media profile stamped FAKE alongside six prevention measures.",
      },
    ],
    blocks: [
      { kind: "para", text: "Fake identity. Real damage. Do not be blinded — stay alert, stay safe." },
      { kind: "heading", text: "What is a mole account?" },
      {
        kind: "para",
        text: "A mole account is a fake or fake-looking account created to deceive, steal information, harm reputation, spread propaganda or commit fraud anonymously. It is a deceptive online identity used to gain trust, collect sensitive information, manipulate people, damage reputation, or carry out illegal activities.",
      },
      { kind: "heading", text: "What mole accounts are used for" },
      {
        kind: "list",
        items: [
          "Impersonation and identity theft",
          "Scams and financial fraud",
          "Spreading misinformation and hate",
          "Phishing and data collection",
          "Stalking, harassment and blackmailing",
        ],
      },
      { kind: "heading", text: "Prevention: how to stay safe" },
      {
        kind: "callout",
        tone: "info",
        text: "Think. Verify. Then trust. Do not let a mole account steal your safety and peace.",
      },
    ],
    howTo: {
      name: "How to protect yourself from mole accounts",
      steps: [
        {
          title: "Verify before you trust",
          text: "Always verify the identity of people online before sharing any information.",
        },
        {
          title: "Keep personal information private",
          text: "Do not share personal details, photos, documents or your location online.",
        },
        {
          title: "Use strong privacy settings",
          text: "Adjust privacy settings on social media to limit who can see and contact you.",
        },
        {
          title: "Report suspicious accounts",
          text: "Report and block fake or suspicious accounts immediately.",
        },
        {
          title: "Enable two-factor authentication",
          text: "Add an extra layer of security to protect your accounts.",
        },
        {
          title: "Be aware, be alert",
          text: "Think before you accept, click or share. Awareness is your best defence.",
        },
      ],
    },
    related: ["digital-arrest", "cyberbullying-and-data-breaches"],
  },
  {
    slug: "cyberbullying-and-data-breaches",
    lang: "en",
    kind: "infographic",
    title: "Cyberbullying & Data Breaches",
    headline: "Cyberbullying and data breaches: how to recognise them and protect yourself",
    description:
      "Words online can hurt real lives, and a single breach can expose everything about you. A two-part guide to recognising cyberbullying, supporting others, and protecting your personal data.",
    category: "Awareness",
    tags: ["cyberbullying", "data breach", "online safety", "privacy", "awareness"],
    publishedAt: "2026-05-06",
    assets: [
      {
        src: "/infographics/infographics_7.jpeg",
        alt: "Two-part awareness poster: the upper half covers cyberbullying prevention, the lower half covers data breach causes and protection.",
      },
    ],
    blocks: [
      { kind: "heading", text: "Cyberbullying: words online can hurt real lives" },
      {
        kind: "para",
        text: "Cyberbullying is bullying that happens using digital technology. It can happen 24/7, it can reach anyone anywhere, and it can leave a lasting emotional impact.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Be an upstander, not a bystander. Your support can make a difference.",
      },
      { kind: "heading", text: "How to prevent cyberbullying" },
      {
        kind: "list",
        items: [
          "Think before you post — be respectful and kind with your words. What you post can last forever.",
          "Respect others — everyone deserves respect online and offline.",
          "Keep personal info private — do not share your personal details, photos or location with others.",
          "Do not engage — do not reply to bullies. Block, report and move forward.",
          "Report and seek help — report cyberbullying and talk to a trusted adult or someone you trust.",
          "Support others — stand up for others. A kind message can change someone's day.",
        ],
      },
      { kind: "heading", text: "Data breaches: protect your information, protect your future" },
      {
        kind: "para",
        text: "A data breach occurs when unauthorised people access, steal or expose sensitive information. It can lead to identity theft, financial loss, privacy violations and reputational damage.",
      },
      { kind: "heading", text: "Common causes of a data breach" },
      {
        kind: "list",
        items: [
          "Weak or reused passwords",
          "Phishing scams",
          "Unsecured Wi-Fi networks",
          "Outdated software",
          "Sharing too much information",
        ],
      },
      { kind: "heading", text: "How to protect your data" },
      {
        kind: "list",
        items: [
          "Use strong passwords — long, unique, and changed regularly.",
          "Enable two-step verification to add an extra layer of security.",
          "Keep software updated, because updates fix security vulnerabilities.",
          "Use secure networks and avoid public Wi-Fi for sensitive activities.",
          "Beware of phishing — do not click suspicious links or share personal information.",
          "Limit what you share. Your data is valuable.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        text: "Stay aware. Stay safe. Stay respectful. A safer internet starts with all of us.",
      },
    ],
    related: ["mole-account", "safe-digital-banking"],
  },
  {
    slug: "safe-digital-banking",
    lang: "en",
    kind: "infographic",
    title: "Digital Banking — Safe Banking, Secure India",
    headline: "Safe digital banking: the dos, the don'ts, and how to report fraud",
    description:
      "Digital banking is convenient; digital awareness is your protection. The essential dos and don'ts for banking online, and exactly what to do the moment you spot a fraudulent transaction.",
    category: "Financial Security",
    tags: ["digital banking", "UPI", "financial fraud", "2FA", "India"],
    publishedAt: "2026-04-29",
    credit:
      "Public awareness material issued by the Government of India (MyGov / Digital India). Reproduced by Cyber Vani for awareness purposes.",
    assets: [
      {
        src: "/infographics/infographics_6.jpeg",
        alt: "Government of India digital banking safety poster listing dos and don'ts beside a phone showing a secure banking app.",
      },
    ],
    blocks: [
      { kind: "para", text: "Be alert. Be safe. Be secure. Digital banking is convenient — digital awareness is your protection." },
      { kind: "heading", text: "Do" },
      {
        kind: "list",
        items: [
          "Use strong passwords and change them regularly.",
          "Use official bank apps and websites only.",
          "Enable two-factor authentication (2FA).",
          "Use secure Wi-Fi or mobile data. Avoid public Wi-Fi for banking.",
          "Check your account statements regularly.",
          "Report suspicious activity to your bank immediately.",
        ],
      },
      { kind: "heading", text: "Do not" },
      {
        kind: "list",
        items: [
          "Do not click on links or open attachments from unknown sources.",
          "Do not share your OTP, PIN, password or CVV with anyone — not even bank employees.",
          "Do not allow remote access to your phone or computer.",
          "Do not share personal or bank details on calls, SMS or social media.",
          "Do not fall for offers of easy loans, high returns or lottery frauds.",
          "Do not ignore unexpected transactions. Report them immediately.",
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        text: "Think before you click. Check before you trust. A little caution today can save your hard-earned money tomorrow.",
      },
      { kind: "heading", text: "How to report cyber fraud" },
      {
        kind: "list",
        items: [
          "Immediately call your bank customer care.",
          "Report at cybercrime.gov.in.",
          "Call the National Cyber Crime Helpline on 1930, working 24x7.",
        ],
      },
    ],
    related: ["digital-arrest", "cyberbullying-and-data-breaches"],
  },
];
