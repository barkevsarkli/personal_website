// Full UI + content translations. English is the default language.
// Visual-only fields (icon, pct) are kept here so each item is self-contained.

export const LANGS = [
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
  { code: "de", label: "DE" },
];

export const translations = {
  en: {
    nav: {
      about: "About",
      certificates: "Certificates",
      arsenal: "Arsenal",
      experience: "Experience",
      publications: "Publications",
      projects: "Projects",
      leadership: "Leadership",
      contact: "Contact",
      connect: "Connect",
    },
    hero: {
      eyebrow: "Available for MSc & research",
      title: "Computer, AI & Mechatronics Engineer",
      tagline: "A fan of reinventing the wheel.",
      ctaPrimary: "Explore My Work",
      ctaSecondary: "Get in touch",
    },
    about: {
      label: "01 — About",
      title: "From first principles, across disciplines.",
      disciplines: ["Computer Engineering", "Mechatronics Engineering"],
      intro:
        "I'm an engineer who's happiest taking something apart to see how it really works, then rebuilding it from scratch. My days move between software, AI, and hardware — a compiler one morning, a training loop in the afternoon, a CAD assembly the next.",
      cards: [
        {
          icon: "cap",
          title: "Education",
          body: "Double major at Kadir Has University: B.S. Computer Engineering (2022 – 2027, expected; GPA 3.97/4.00) and B.S. Mechatronics Engineering (2024 – 2027, expected; GPA 4.00/4.00).",
        },
        {
          icon: "globe",
          title: "Global Experience",
          body: "ERASMUS+ exchange at Hochschule Ravensburg-Weingarten (RWU) in Germany, Mar–Sep 2025.",
        },
        {
          icon: "planet",
          title: "Astronomy & Space",
          body: "A lifelong fascination with the night sky — stargazing, tracking planets, and following the science and missions out there.",
        },
      ],
      languagesTitle: "Languages",
    },
    education: {
      label: "02 — Education",
      title: "A short walk across Istanbul.",
      intro:
        "Three schools, all on Istanbul's European side and only a few kilometres apart.",
      mapHint: "Istanbul, Türkiye",
      schools: [
        { name: "Sahakyan Nunyan", place: "Samatya, Istanbul", year: "2018", note: "Primary & middle school" },
        { name: "Getronagan", place: "Karaköy, Istanbul", year: "2022", note: "High school" },
        { name: "Kadir Has University", place: "Cibali, Istanbul", year: "2027", note: "B.S. — expected" },
      ],
      istanbulHeading: "In Istanbul",
      abroadHeading: "Abroad — Exchange",
      mapHintAbroad: "Weingarten, Germany",
      abroad: {
        name: "Hochschule Ravensburg-Weingarten (RWU)",
        place: "Weingarten, Germany",
        year: "2025",
        note: "ERASMUS+ Exchange",
        period: "Mar – Sep 2025",
        desc: "A semester abroad on an ERASMUS+ exchange — engineering across borders and curricula.",
      },
    },
    certificates: {
      label: "03 — Certificates",
      title: "Proof of the work.",
      intro:
        "Courses and credentials that back up the engineering — from deep learning and computer vision to C++, CAD and computer science fundamentals.",
      viewCredential: "View credential",
    },
    arsenal: {
      label: "04 — Technical Arsenal",
      title: "The stack behind the systems.",
      intro:
        "Languages and tools I reach for, and the engineering domains where I go deep.",
      groups: {
        ml: "ML & Vision",
        llm: "LLMs & Agents",
        languages: "Programming Languages",
        systems: "Systems & Backend",
        tools: "Tools & Platforms",
      },
      focus: [
        {
          icon: "cpu",
          title: "Low-Level Systems & Networking",
          desc: "Zero-dependency C++ — a from-scratch neural net and a JFIF/BMP decoder — plus a VPN built from scratch on a custom TUN/TAP protocol.",
        },
        {
          icon: "brain",
          title: "Deep Learning & Vision",
          desc: "DINOv2 / ResNet scene classification, multi-task optimization with PCGrad & SAM, and real-time YOLO detection.",
        },
        {
          icon: "bot",
          title: "LLMs & Agents",
          desc: "On-device agentic assistants and local inference with llama.cpp / Ollama, orchestrated with LangChain, crewAI and n8n.",
        },
        {
          icon: "gear",
          title: "Mechanical Design",
          desc: "SOLIDWORKS modelling, kinematic synthesis, and FEA on real mechanisms.",
        },
      ],
    },
    experience: {
      label: "05 — Experience",
      title: "Where the work happened.",
      intro: "Industry, national research, and the classroom.",
      items: [
        {
          role: "Project Researcher",
          org: "TÜBİTAK",
          period: "Sept 2025 — Present",
          desc: "Leading full-stack application design for MotivBot, an AI agent for psychological user support.",
        },
        {
          role: "Long-term Intern — Perception Technologies",
          org: "Ford Otosan",
          period: "Aug 2025 — Feb 2026",
          desc: "Worked on scene classification with DINOv2 / ResNet and multi-task model optimization using PCGrad and SAM; tuned environmental-awareness algorithms for autonomous vehicles to high-accuracy perception metrics.",
        },
        {
          role: "Teaching Assistant",
          org: "Kadir Has University",
          period: "Spring '25 — Present",
          desc: "Assisting undergraduate engineering courses: Programming I (Spring & Fall '25, Spring '26), Computer Networks (Fall '26 — Present) and Natural Language Processing (Fall '26 — Present).",
        },
      ],
    },
    publications: {
      label: "06 — Publications",
      title: "Research in progress.",
      intro: "Manuscripts currently being prepared for submission.",
      items: [
        {
          authors: "Şarklı, B.",
          year: "2026",
          title: "Mixed-activation layers: Robustness first, accuracy at width",
          status: "Manuscript in preparation",
        },
        {
          authors: "Şarklı, B., Dehkharghani, R., Bhat, A. R., & Armah, C.",
          year: "2026",
          title: "MotivBot: A supportive bot for enhancing self-esteem, detecting psychological distress and negative emotions, and providing interventions",
          status: "Manuscript in preparation",
        },
      ],
    },
    projects: {
      label: "07 — Featured Projects",
      title: "Things I've built.",
      intro:
        "From scratch-built ML engines to enterprise systems and physical machines.",
      items: [
        {
          visual: "barkevgpt",
          title: "BarkevGPT",
          tag: "AI · Agents",
          year: "2026",
          desc: "On-device agentic LLM assistant that plans tasks, calls local tools and runs fully offline.",
          highlights: ["Local LLM", "Agentic workflows", "On-device"],
        },
        {
          visual: "vpn",
          title: "Custom VPN (C++)",
          tag: "Systems · Networking",
          year: "2026",
          desc: "Low-latency VPN tunnel built from scratch on a custom TUN/TAP protocol.",
          highlights: ["TUN/TAP", "OpenSSL", "Boost.Asio"],
        },
        {
          visual: "whatsapp-llm",
          title: "WhatsApp LLM (C++)",
          tag: "AI · Systems",
          year: "2026",
          desc: "Edge inference pipeline connecting WhatsApp chats to a locally hosted LLM.",
          highlights: ["Edge inference", "Local LLM", "C++"],
        },
        {
          visual: "library-tracker",
          title: "Library Tracker (YOLO)",
          tag: "Computer Vision",
          year: "2025",
          desc: "Real-time occupancy detection of library seats from live camera feeds.",
          highlights: ["YOLO", "Real-time", "Occupancy detection"],
        },
        {
          visual: "neural-net",
          title: "Neural Network (C++)",
          tag: "Systems · ML",
          year: "2025",
          desc: "Zero-dependency feedforward model trained with hand-written backpropagation.",
          highlights: ["Zero dependencies", "Backpropagation", "C++"],
        },
        {
          visual: "image-decoder",
          title: "Image Decoder (C++)",
          tag: "Low-Level",
          year: "2025",
          desc: "Low-level JFIF/BMP parser decoding file headers and pixels from raw bytes.",
          highlights: ["JFIF/BMP", "Binary parsing", "Zero dependencies"],
        },
        {
          visual: "mech-bird",
          title: "Mechanical Bird (SOLIDWORKS)",
          tag: "Mechatronics",
          year: "2025",
          desc: "Prototype kinematic linkages for a flapping-wing mechanism.",
          highlights: ["Kinematic synthesis", "Gear trains", "Linkages"],
        },
        {
          visual: "aircraft-fea",
          title: "Aircraft Design (SOLIDWORKS)",
          tag: "Mechanical",
          year: "2025",
          desc: "Fuselage FEA analysis of an aircraft model to assess stress under load.",
          highlights: ["FEA", "Assembly", "Stress analysis"],
        },
        {
          visual: "blood-donor",
          title: "Blood Donor System",
          tag: "Databases",
          year: "2023",
          desc: "Normalized 3NF database linking donors, recipients and donations, with SQL views.",
          highlights: ["3NF", "SQL views", "Indexing"],
        },
      ],
    },
    leadership: {
      label: "08 — Leadership & Activities",
      title: "Beyond the coursework.",
      intro: "Building a community for engineering students and giving them a voice.",
      items: [
        {
          role: "President",
          org: "Computer Engineering & AI Club — Kadir Has University",
          period: "Fall '26 — Present",
          desc: "Leading the club and organizing technical workshops, AI talks and project-based events for engineering students.",
        },
        {
          role: "Student Representative",
          org: "Department of Computer Engineering — Kadir Has University",
          period: "Fall '25 — Present",
          desc: "Representing computer engineering students to faculty and administration and relaying student feedback.",
        },
      ],
    },
    hobbies: {
      label: "09 — Off-Screen",
      title: "Away from the keyboard.",
      intro: "Where I reset and recalibrate.",
      items: [
        {
          icon: "wave",
          title: "Underwater Exploration",
          desc: "Swimming & diving — finding calm and focus beneath the surface.",
        },
        {
          icon: "chess",
          title: "Chess",
          desc: "Strategy, patience, and calculation across 64 squares.",
        },
        {
          icon: "telescope",
          title: "Astronomy & Stargazing",
          desc: "Chasing clear skies — stars, planets, and the occasional meteor shower.",
        },
      ],
    },
    footer: {
      label: "10 — Contact",
      titlePre: "Let's build something ",
      titleAccent: "complex",
      titlePost: ".",
      blurb:
        "Open to research collaborations, MSc opportunities, and engineering work.",
      langLine:
        "Languages — Turkish (native) · English (advanced) · German (elementary)",
      rights: "All rights reserved.",
      built: "Built with React · Three.js · GSAP",
    },
    languages: [
      { name: "Turkish", level: "Native", pct: 100 },
      { name: "English", level: "Advanced", pct: 85 },
      { name: "German", level: "Elementary", pct: 30 },
    ],
  },

  tr: {
    nav: {
      about: "Hakkımda",
      certificates: "Sertifikalar",
      arsenal: "Yetenekler",
      experience: "Deneyim",
      publications: "Yayınlar",
      projects: "Projeler",
      leadership: "Liderlik",
      contact: "İletişim",
      connect: "İletişime Geç",
    },
    hero: {
      eyebrow: "Yüksek lisans ve araştırma için müsait",
      title: "Bilgisayar, Yapay Zekâ ve Mekatronik Mühendisi",
      tagline: "Tekerleği yeniden icat etmenin hayranı.",
      ctaPrimary: "Çalışmalarımı Keşfet",
      ctaSecondary: "İletişime geç",
    },
    about: {
      label: "01 — Hakkımda",
      title: "İlk ilkelerden, disiplinler arası.",
      disciplines: ["Bilgisayar Mühendisliği", "Mekatronik Mühendisliği"],
      intro:
        "Bir şeyin gerçekte nasıl çalıştığını görmek için onu parçalarına ayırıp sonra sıfırdan yeniden inşa etmekten en çok keyif alan bir mühendisim. Günlerim yazılım, yapay zekâ ve donanım arasında geçiyor — bir sabah bir derleyici, öğleden sonra bir eğitim döngüsü, ertesi gün bir CAD montajı.",
      cards: [
        {
          icon: "cap",
          title: "Eğitim",
          body: "Kadir Has Üniversitesi'nde çift ana dal: Bilgisayar Mühendisliği lisansı (2022 – 2027, beklenen; GNO 3.97/4.00) ve Mekatronik Mühendisliği lisansı (2024 – 2027, beklenen; GNO 4.00/4.00).",
        },
        {
          icon: "globe",
          title: "Küresel Deneyim",
          body: "Almanya'daki Hochschule Ravensburg-Weingarten (RWU) üniversitesinde ERASMUS+ değişim programı, Mart–Eylül 2025.",
        },
        {
          icon: "planet",
          title: "Astronomi ve Uzay",
          body: "Gece gökyüzüne karşı ömür boyu süren bir merak — yıldız gözlemi, gezegenleri takip etmek ve oradaki bilimi ve görevleri izlemek.",
        },
      ],
      languagesTitle: "Diller",
    },
    education: {
      label: "02 — Eğitim",
      title: "İstanbul'da kısa bir yürüyüş.",
      intro:
        "Üçü de İstanbul'un Avrupa yakasında, birbirine yalnızca birkaç kilometre uzaklıkta üç okul.",
      mapHint: "İstanbul, Türkiye",
      schools: [
        { name: "Sahakyan Nunyan", place: "Samatya, İstanbul", year: "2018", note: "İlk ve ortaokul" },
        { name: "Getronagan", place: "Karaköy, İstanbul", year: "2022", note: "Lise" },
        { name: "Kadir Has Üniversitesi", place: "Cibali, İstanbul", year: "2027", note: "Lisans — beklenen" },
      ],
      istanbulHeading: "İstanbul'da",
      abroadHeading: "Yurt Dışı — Değişim",
      mapHintAbroad: "Weingarten, Almanya",
      abroad: {
        name: "Hochschule Ravensburg-Weingarten (RWU)",
        place: "Weingarten, Almanya",
        year: "2025",
        note: "ERASMUS+ Değişim",
        period: "Mar – Eyl 2025",
        desc: "ERASMUS+ değişim programıyla bir dönem yurt dışında — sınırların ve müfredatların ötesinde mühendislik.",
      },
    },
    certificates: {
      label: "03 — Sertifikalar",
      title: "Çalışmanın kanıtı.",
      intro:
        "Mühendisliği destekleyen kurslar ve sertifikalar — derin öğrenme ve bilgisayarlı görüden C++, CAD ve bilgisayar bilimi temellerine.",
      viewCredential: "Sertifikayı gör",
    },
    arsenal: {
      label: "04 — Teknik Cephanelik",
      title: "Sistemlerin ardındaki yığın.",
      intro:
        "Başvurduğum diller ve araçlar ile derinleştiğim mühendislik alanları.",
      groups: {
        ml: "ML ve Görüntü İşleme",
        llm: "LLM'ler ve Ajanlar",
        languages: "Programlama Dilleri",
        systems: "Sistemler ve Backend",
        tools: "Araçlar ve Platformlar",
      },
      focus: [
        {
          icon: "cpu",
          title: "Düşük Seviye Sistemler ve Ağlar",
          desc: "Sıfır bağımlılıklı C++ — sıfırdan bir sinir ağı ve bir JFIF/BMP çözücü — ve özel bir TUN/TAP protokolü üzerine sıfırdan kurulmuş bir VPN.",
        },
        {
          icon: "brain",
          title: "Derin Öğrenme ve Görüntü İşleme",
          desc: "DINOv2 / ResNet ile sahne sınıflandırması, PCGrad & SAM ile çok görevli optimizasyon ve gerçek zamanlı YOLO nesne tespiti.",
        },
        {
          icon: "bot",
          title: "LLM'ler ve Ajanlar",
          desc: "Cihaz üstü ajan tabanlı asistanlar ve llama.cpp / Ollama ile yerel çıkarım; LangChain, crewAI ve n8n ile orkestrasyon.",
        },
        {
          icon: "gear",
          title: "Mekanik Tasarım",
          desc: "SOLIDWORKS modelleme, kinematik sentez ve gerçek mekanizmalarda FEA.",
        },
      ],
    },
    experience: {
      label: "05 — Deneyim",
      title: "İşin yapıldığı yerler.",
      intro: "Sanayi, ulusal araştırma ve sınıf.",
      items: [
        {
          role: "Proje Araştırmacısı",
          org: "TÜBİTAK",
          period: "Eyl 2025 — Şu an",
          desc: "Psikolojik kullanıcı desteği için geliştirilen yapay zekâ ajanı MotivBot'un tam yığın uygulama tasarımını yönetiyorum.",
        },
        {
          role: "Uzun Dönem Stajyer — Algı Teknolojileri",
          org: "Ford Otosan",
          period: "Ağu 2025 — Şub 2026",
          desc: "DINOv2 / ResNet ile sahne sınıflandırması ve PCGrad ile SAM kullanarak çok görevli model optimizasyonu üzerinde çalıştım; otonom araçlar için çevresel farkındalık algoritmalarını yüksek doğrulukta algı metriklerine ayarladım.",
        },
        {
          role: "Öğretim Asistanı",
          org: "Kadir Has Üniversitesi",
          period: "Bahar '25 — Şu an",
          desc: "Lisans mühendislik derslerinde asistanlık: Programlama I (Bahar ve Güz '25, Bahar '26), Bilgisayar Ağları (Güz '26 — Şu an) ve Doğal Dil İşleme (Güz '26 — Şu an).",
        },
      ],
    },
    publications: {
      label: "06 — Yayınlar",
      title: "Süren araştırmalar.",
      intro: "Yayına hazırlanmakta olan makaleler.",
      items: [
        {
          authors: "Şarklı, B.",
          year: "2026",
          title: "Mixed-activation layers: Robustness first, accuracy at width",
          status: "Hazırlık aşamasında",
        },
        {
          authors: "Şarklı, B., Dehkharghani, R., Bhat, A. R., & Armah, C.",
          year: "2026",
          title: "MotivBot: A supportive bot for enhancing self-esteem, detecting psychological distress and negative emotions, and providing interventions",
          status: "Hazırlık aşamasında",
        },
      ],
    },
    projects: {
      label: "07 — Öne Çıkan Projeler",
      title: "İnşa ettiklerim.",
      intro:
        "Sıfırdan ML motorlarından kurumsal sistemlere ve fiziksel makinelere.",
      items: [
        {
          visual: "barkevgpt",
          title: "BarkevGPT",
          tag: "Yapay Zekâ · Ajanlar",
          year: "2026",
          desc: "Görevleri planlayan, yerel araçları çağıran ve tamamen çevrimdışı çalışan, cihaz üstü ajan tabanlı LLM asistanı.",
          highlights: ["Yerel LLM", "Ajan iş akışları", "Cihaz üstü"],
        },
        {
          visual: "vpn",
          title: "Özel VPN (C++)",
          tag: "Sistemler · Ağlar",
          year: "2026",
          desc: "Özel bir TUN/TAP protokolü üzerine sıfırdan kurulmuş, düşük gecikmeli VPN tüneli.",
          highlights: ["TUN/TAP", "OpenSSL", "Boost.Asio"],
        },
        {
          visual: "whatsapp-llm",
          title: "WhatsApp LLM (C++)",
          tag: "Yapay Zekâ · Sistemler",
          year: "2026",
          desc: "WhatsApp sohbetlerini yerel olarak barındırılan bir LLM'e bağlayan uç çıkarım (edge inference) hattı.",
          highlights: ["Uç çıkarım", "Yerel LLM", "C++"],
        },
        {
          visual: "library-tracker",
          title: "Kütüphane Takipçisi (YOLO)",
          tag: "Bilgisayarlı Görü",
          year: "2025",
          desc: "Canlı kamera görüntülerinden kütüphane koltuklarının gerçek zamanlı doluluk tespiti.",
          highlights: ["YOLO", "Gerçek zamanlı", "Doluluk tespiti"],
        },
        {
          visual: "neural-net",
          title: "Sinir Ağı (C++)",
          tag: "Sistemler · ML",
          year: "2025",
          desc: "Elle yazılmış geri yayılımla eğitilen, sıfır bağımlılıklı ileri beslemeli model.",
          highlights: ["Sıfır bağımlılık", "Geri yayılım", "C++"],
        },
        {
          visual: "image-decoder",
          title: "Görüntü Çözücü (C++)",
          tag: "Düşük Seviye",
          year: "2025",
          desc: "Dosya başlıklarını ve pikselleri ham baytlardan çözen düşük seviyeli JFIF/BMP ayrıştırıcı.",
          highlights: ["JFIF/BMP", "İkili ayrıştırma", "Sıfır bağımlılık"],
        },
        {
          visual: "mech-bird",
          title: "Mekanik Kuş (SOLIDWORKS)",
          tag: "Mekatronik",
          year: "2025",
          desc: "Çırpan kanat mekanizması için prototip kinematik bağlantılar.",
          highlights: ["Kinematik sentez", "Dişli sistemleri", "Bağlantılar"],
        },
        {
          visual: "aircraft-fea",
          title: "Uçak Tasarımı (SOLIDWORKS)",
          tag: "Mekanik",
          year: "2025",
          desc: "Bir uçak modelinin yük altındaki gerilmelerini değerlendirmek için gövde FEA analizi.",
          highlights: ["FEA", "Montaj", "Gerilme analizi"],
        },
        {
          visual: "blood-donor",
          title: "Kan Bağışçısı Sistemi",
          tag: "Veritabanları",
          year: "2023",
          desc: "Bağışçıları, alıcıları ve bağışları birbirine bağlayan, SQL görünümlerine sahip normalize (3NF) veritabanı.",
          highlights: ["3NF", "SQL görünümleri", "İndeksleme"],
        },
      ],
    },
    leadership: {
      label: "08 — Liderlik ve Etkinlikler",
      title: "Derslerin ötesinde.",
      intro: "Mühendislik öğrencileri için bir topluluk oluşturmak ve seslerini duyurmak.",
      items: [
        {
          role: "Başkan",
          org: "Bilgisayar Mühendisliği ve Yapay Zekâ Kulübü — Kadir Has Üniversitesi",
          period: "Güz '26 — Şu an",
          desc: "Kulübü yönetiyor; mühendislik öğrencileri için teknik atölyeler, yapay zekâ söyleşileri ve proje odaklı etkinlikler düzenliyorum.",
        },
        {
          role: "Öğrenci Temsilcisi",
          org: "Bilgisayar Mühendisliği Bölümü — Kadir Has Üniversitesi",
          period: "Güz '25 — Şu an",
          desc: "Bilgisayar mühendisliği öğrencilerini öğretim üyeleri ve yönetim nezdinde temsil ediyor, öğrenci geri bildirimlerini iletiyorum.",
        },
      ],
    },
    hobbies: {
      label: "09 — Ekran Dışı",
      title: "Klavyeden uzakta.",
      intro: "Yeniden şarj olduğum yer.",
      items: [
        {
          icon: "wave",
          title: "Sualtı Keşfi",
          desc: "Yüzme ve dalış — yüzeyin altında huzur ve odak bulmak.",
        },
        {
          icon: "chess",
          title: "Satranç",
          desc: "64 karede strateji, sabır ve hesap.",
        },
        {
          icon: "telescope",
          title: "Astronomi ve Yıldız Gözlemi",
          desc: "Açık gökyüzünün peşinde — yıldızlar, gezegenler ve ara sıra bir meteor yağmuru.",
        },
      ],
    },
    footer: {
      label: "10 — İletişim",
      titlePre: "Hadi ",
      titleAccent: "karmaşık",
      titlePost: " bir şey inşa edelim.",
      blurb:
        "Araştırma iş birliklerine, yüksek lisans fırsatlarına ve mühendislik çalışmalarına açığım.",
      langLine:
        "Diller — Türkçe (anadil) · İngilizce (ileri) · Almanca (başlangıç)",
      rights: "Tüm hakları saklıdır.",
      built: "React · Three.js · GSAP ile yapıldı",
    },
    languages: [
      { name: "Türkçe", level: "Anadil", pct: 100 },
      { name: "İngilizce", level: "İleri", pct: 85 },
      { name: "Almanca", level: "Başlangıç", pct: 30 },
    ],
  },

  de: {
    nav: {
      about: "Über mich",
      certificates: "Zertifikate",
      arsenal: "Fähigkeiten",
      experience: "Erfahrung",
      publications: "Publikationen",
      projects: "Projekte",
      leadership: "Engagement",
      contact: "Kontakt",
      connect: "Kontakt",
    },
    hero: {
      eyebrow: "Verfügbar für Master & Forschung",
      title: "Computer-, KI- & Mechatronik-Ingenieur",
      tagline: "Ein Fan davon, das Rad neu zu erfinden.",
      ctaPrimary: "Meine Arbeit entdecken",
      ctaSecondary: "Kontakt aufnehmen",
    },
    about: {
      label: "01 — Über mich",
      title: "Von Grundprinzipien, über Disziplinen hinweg.",
      disciplines: ["Informatik", "Mechatronik"],
      intro:
        "Ich bin ein Ingenieur, der am liebsten Dinge auseinandernimmt, um zu verstehen, wie sie wirklich funktionieren, und sie dann von Grund auf neu aufbaut. Meine Tage bewegen sich zwischen Software, KI und Hardware — morgens ein Compiler, nachmittags eine Trainingsschleife, am nächsten Tag eine CAD-Baugruppe.",
      cards: [
        {
          icon: "cap",
          title: "Ausbildung",
          body: "Doppelstudium an der Kadir Has Universität: B.Sc. Informatik (2022 – 2027, voraussichtlich; NS 3,97/4,00) und B.Sc. Mechatronik (2024 – 2027, voraussichtlich; NS 4,00/4,00).",
        },
        {
          icon: "globe",
          title: "Internationale Erfahrung",
          body: "ERASMUS+ Austausch an der Hochschule Ravensburg-Weingarten (RWU) in Deutschland, März–Sept 2025.",
        },
        {
          icon: "planet",
          title: "Astronomie & Weltraum",
          body: "Eine lebenslange Faszination für den Nachthimmel — Sternegucken, Planeten verfolgen und die Wissenschaft und Missionen da draußen mitverfolgen.",
        },
      ],
      languagesTitle: "Sprachen",
    },
    education: {
      label: "02 — Ausbildung",
      title: "Ein kurzer Weg durch Istanbul.",
      intro:
        "Drei Schulen, alle auf der europäischen Seite Istanbuls und nur wenige Kilometer voneinander entfernt.",
      mapHint: "Istanbul, Türkei",
      schools: [
        { name: "Sahakyan Nunyan", place: "Samatya, Istanbul", year: "2018", note: "Grund- & Mittelschule" },
        { name: "Getronagan", place: "Karaköy, Istanbul", year: "2022", note: "Gymnasium" },
        { name: "Kadir Has Universität", place: "Cibali, Istanbul", year: "2027", note: "B.Sc. — erwartet" },
      ],
      istanbulHeading: "In Istanbul",
      abroadHeading: "Im Ausland — Austausch",
      mapHintAbroad: "Weingarten, Deutschland",
      abroad: {
        name: "Hochschule Ravensburg-Weingarten (RWU)",
        place: "Weingarten, Deutschland",
        year: "2025",
        note: "ERASMUS+ Austausch",
        period: "März – Sept 2025",
        desc: "Ein Auslandssemester im ERASMUS+ Austausch — Ingenieurwesen über Grenzen und Lehrpläne hinweg.",
      },
    },
    certificates: {
      label: "03 — Zertifikate",
      title: "Beleg für die Arbeit.",
      intro:
        "Kurse und Nachweise, die das Ingenieurwesen untermauern — von Deep Learning und Computer Vision bis zu C++, CAD und den Grundlagen der Informatik.",
      viewCredential: "Zertifikat ansehen",
    },
    arsenal: {
      label: "04 — Technisches Arsenal",
      title: "Der Stack hinter den Systemen.",
      intro:
        "Sprachen und Werkzeuge, zu denen ich greife, und die Bereiche, in die ich eintauche.",
      groups: {
        ml: "ML & Computer Vision",
        llm: "LLMs & Agenten",
        languages: "Programmiersprachen",
        systems: "Systeme & Backend",
        tools: "Werkzeuge & Plattformen",
      },
      focus: [
        {
          icon: "cpu",
          title: "Low-Level-Systeme & Netzwerke",
          desc: "Abhängigkeitsfreies C++ — ein von Grund auf gebautes neuronales Netz und ein JFIF/BMP-Decoder — sowie ein selbstgebautes VPN auf Basis eines eigenen TUN/TAP-Protokolls.",
        },
        {
          icon: "brain",
          title: "Deep Learning & Computer Vision",
          desc: "Szenenklassifikation mit DINOv2 / ResNet, Multi-Task-Optimierung mit PCGrad & SAM und YOLO-Objekterkennung in Echtzeit.",
        },
        {
          icon: "bot",
          title: "LLMs & Agenten",
          desc: "Agentische On-Device-Assistenten und lokale Inferenz mit llama.cpp / Ollama, orchestriert mit LangChain, crewAI und n8n.",
        },
        {
          icon: "gear",
          title: "Mechanische Konstruktion",
          desc: "SOLIDWORKS-Modellierung, kinematische Synthese und FEM an realen Mechanismen.",
        },
      ],
    },
    experience: {
      label: "05 — Erfahrung",
      title: "Wo die Arbeit entstand.",
      intro: "Industrie, nationale Forschung und der Hörsaal.",
      items: [
        {
          role: "Projektforscher",
          org: "TÜBİTAK",
          period: "Sept 2025 — Heute",
          desc: "Leitung des Full-Stack-Anwendungsdesigns für MotivBot, einen KI-Agenten zur psychologischen Nutzerunterstützung.",
        },
        {
          role: "Langzeit-Praktikant — Wahrnehmungstechnologien",
          org: "Ford Otosan",
          period: "Aug 2025 — Feb 2026",
          desc: "Arbeitete an Szenenklassifikation mit DINOv2 / ResNet und Multi-Task-Modelloptimierung mit PCGrad und SAM; stimmte Umgebungswahrnehmungs-Algorithmen für autonome Fahrzeuge auf hochpräzise Wahrnehmungsmetriken ab.",
        },
        {
          role: "Lehrassistent",
          org: "Kadir Has Universität",
          period: "Frühjahr '25 — Heute",
          desc: "Betreuung von Lehrveranstaltungen im Ingenieur-Bachelor: Programmierung I (Frühjahr & Herbst '25, Frühjahr '26), Rechnernetze (Herbst '26 — Heute) und Verarbeitung natürlicher Sprache (Herbst '26 — Heute).",
        },
      ],
    },
    publications: {
      label: "06 — Publikationen",
      title: "Laufende Forschung.",
      intro: "Manuskripte, die derzeit zur Einreichung vorbereitet werden.",
      items: [
        {
          authors: "Şarklı, B.",
          year: "2026",
          title: "Mixed-activation layers: Robustness first, accuracy at width",
          status: "In Vorbereitung",
        },
        {
          authors: "Şarklı, B., Dehkharghani, R., Bhat, A. R., & Armah, C.",
          year: "2026",
          title: "MotivBot: A supportive bot for enhancing self-esteem, detecting psychological distress and negative emotions, and providing interventions",
          status: "In Vorbereitung",
        },
      ],
    },
    projects: {
      label: "07 — Ausgewählte Projekte",
      title: "Was ich gebaut habe.",
      intro:
        "Von selbstgebauten ML-Engines bis zu Unternehmenssystemen und physischen Maschinen.",
      items: [
        {
          visual: "barkevgpt",
          title: "BarkevGPT",
          tag: "KI · Agenten",
          year: "2026",
          desc: "Agentischer On-Device-LLM-Assistent, der Aufgaben plant, lokale Tools aufruft und vollständig offline läuft.",
          highlights: ["Lokales LLM", "Agentische Workflows", "On-Device"],
        },
        {
          visual: "vpn",
          title: "Eigenes VPN (C++)",
          tag: "Systeme · Netzwerke",
          year: "2026",
          desc: "Von Grund auf gebauter VPN-Tunnel mit niedriger Latenz auf Basis eines eigenen TUN/TAP-Protokolls.",
          highlights: ["TUN/TAP", "OpenSSL", "Boost.Asio"],
        },
        {
          visual: "whatsapp-llm",
          title: "WhatsApp LLM (C++)",
          tag: "KI · Systeme",
          year: "2026",
          desc: "Edge-Inferenz-Pipeline, die WhatsApp-Chats mit einem lokal gehosteten LLM verbindet.",
          highlights: ["Edge-Inferenz", "Lokales LLM", "C++"],
        },
        {
          visual: "library-tracker",
          title: "Bibliotheks-Tracker (YOLO)",
          tag: "Computer Vision",
          year: "2025",
          desc: "Echtzeit-Belegungserkennung von Bibliotheksplätzen aus Live-Kamerabildern.",
          highlights: ["YOLO", "Echtzeit", "Belegungserkennung"],
        },
        {
          visual: "neural-net",
          title: "Neuronales Netz (C++)",
          tag: "Systeme · ML",
          year: "2025",
          desc: "Abhängigkeitsfreies Feedforward-Modell, trainiert mit handgeschriebener Backpropagation.",
          highlights: ["Keine Abhängigkeiten", "Backpropagation", "C++"],
        },
        {
          visual: "image-decoder",
          title: "Bilddecoder (C++)",
          tag: "Low-Level",
          year: "2025",
          desc: "Low-Level-JFIF/BMP-Parser, der Dateiheader und Pixel direkt aus Rohbytes dekodiert.",
          highlights: ["JFIF/BMP", "Binär-Parsing", "Keine Abhängigkeiten"],
        },
        {
          visual: "mech-bird",
          title: "Mechanischer Vogel (SOLIDWORKS)",
          tag: "Mechatronik",
          year: "2025",
          desc: "Prototypische kinematische Gestänge für einen Schlagflügelmechanismus.",
          highlights: ["Kinematische Synthese", "Zahnradgetriebe", "Gestänge"],
        },
        {
          visual: "aircraft-fea",
          title: "Flugzeugkonstruktion (SOLIDWORKS)",
          tag: "Mechanik",
          year: "2025",
          desc: "FEM-Analyse des Rumpfes eines Flugzeugmodells zur Bewertung der Spannungen unter Last.",
          highlights: ["FEM", "Baugruppe", "Spannungsanalyse"],
        },
        {
          visual: "blood-donor",
          title: "Blutspender-System",
          tag: "Datenbanken",
          year: "2023",
          desc: "Normalisierte 3NF-Datenbank, die Spender, Empfänger und Spenden verknüpft, mit SQL-Views.",
          highlights: ["3NF", "SQL-Views", "Indizierung"],
        },
      ],
    },
    leadership: {
      label: "08 — Engagement & Aktivitäten",
      title: "Über das Studium hinaus.",
      intro: "Eine Community für Ingenieurstudierende aufbauen und ihnen eine Stimme geben.",
      items: [
        {
          role: "Vorsitzender",
          org: "Computer Engineering & AI Club — Kadir Has Universität",
          period: "Herbst '26 — Heute",
          desc: "Leitung des Clubs sowie Organisation technischer Workshops, KI-Vorträge und projektbasierter Veranstaltungen für Ingenieurstudierende.",
        },
        {
          role: "Studierendenvertreter",
          org: "Fachbereich Computer Engineering — Kadir Has Universität",
          period: "Herbst '25 — Heute",
          desc: "Vertretung der Computer-Engineering-Studierenden gegenüber Lehrenden und Hochschulverwaltung sowie Weitergabe von studentischem Feedback.",
        },
      ],
    },
    hobbies: {
      label: "09 — Abseits des Bildschirms",
      title: "Weg von der Tastatur.",
      intro: "Wo ich auftanke.",
      items: [
        {
          icon: "wave",
          title: "Unterwasser-Erkundung",
          desc: "Schwimmen & Tauchen — Ruhe und Fokus unter der Oberfläche.",
        },
        {
          icon: "chess",
          title: "Schach",
          desc: "Strategie, Geduld und Berechnung auf 64 Feldern.",
        },
        {
          icon: "telescope",
          title: "Astronomie & Sternebeobachtung",
          desc: "Auf der Jagd nach klarem Himmel — Sterne, Planeten und gelegentlich ein Meteorschauer.",
        },
      ],
    },
    footer: {
      label: "10 — Kontakt",
      titlePre: "Lass uns etwas ",
      titleAccent: "Komplexes",
      titlePost: " bauen.",
      blurb:
        "Offen für Forschungskooperationen, Master-Möglichkeiten und Ingenieurarbeit.",
      langLine:
        "Sprachen — Türkisch (Muttersprache) · Englisch (Fortgeschritten) · Deutsch (Grundkenntnisse)",
      rights: "Alle Rechte vorbehalten.",
      built: "Gebaut mit React · Three.js · GSAP",
    },
    languages: [
      { name: "Türkisch", level: "Muttersprache", pct: 100 },
      { name: "Englisch", level: "Fortgeschritten", pct: 85 },
      { name: "Deutsch", level: "Grundkenntnisse", pct: 30 },
    ],
  },
};
