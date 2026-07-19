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
      projects: "Projects",
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
          body: "Double major in Computer Engineering (GPA 3.97/4.00) and Mechatronics Engineering (GPA 4.00/4.00) at Kadir Has University.",
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
      label: "Education",
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
      label: "Certificates",
      title: "Proof of the work.",
      intro:
        "Courses and credentials that back up the engineering — from deep learning to computer science fundamentals.",
      viewCredential: "View credential",
    },
    arsenal: {
      label: "02 — Technical Arsenal",
      title: "The stack behind the systems.",
      intro:
        "Languages and tools I reach for, and the engineering domains where I go deep.",
      focus: [
        {
          icon: "cpu",
          title: "Low-Level Systems & Compilers",
          desc: "Zero-dependency C++ — a from-scratch neural net and a JPEG/BMP binary decoder feeding CNNs.",
        },
        {
          icon: "brain",
          title: "Deep Learning",
          desc: "DINOv2 / ResNet scene classification and multi-task optimization with PCGrad & SAM.",
        },
        {
          icon: "gear",
          title: "Mechanical Design",
          desc: "SOLIDWORKS modelling, kinematic synthesis, and FEA on real mechanisms.",
        },
      ],
    },
    experience: {
      label: "03 — Experience",
      title: "Where the work happened.",
      intro: "Industry, national research, and the classroom.",
      items: [
        {
          role: "Long-term Intern — Perception Technologies",
          org: "Ford Otosan",
          period: "Aug 2025 — Feb 2026",
          desc: "Scene classification with DINOv2 / ResNet and multi-task model optimization using PCGrad and SAM; tuned environmental-awareness algorithms for autonomous vehicles to high-accuracy perception metrics.",
        },
        {
          role: "Project Researcher",
          org: "TÜBİTAK",
          period: "Sept 2025 — Present",
          desc: "Leading full-stack application design for Motivbot, an AI agent for psychological user support.",
        },
        {
          role: "Teaching Assistant — Programming I",
          org: "Kadir Has University",
          period: "Spring '25 — Spring '26",
          desc: "Lectures and technical tutorials on C programming for undergraduate engineering students.",
        },
      ],
    },
    projects: {
      label: "04 — Featured Projects",
      title: "Things I've built.",
      intro:
        "From scratch-built ML engines to enterprise systems and physical machines.",
      items: [
        {
          title: "BarkevGPT — Custom LLM Integration",
          tag: "AI · Mobile",
          desc: "A locally-hosted LLM agent on mobile with agentic workflows that automate task management.",
          highlights: ["Local LLM", "Agentic workflows", "On-device"],
        },
        {
          title: "From-Scratch C++ Neural Network",
          tag: "Systems · ML",
          desc: "A zero-dependency neural network in C++ using only fstream and iostream, for image classification.",
          highlights: ["Zero dependencies", "C++", "Image classification"],
        },
        {
          title: "Low-Level C++ JPEG & Bitmap Decoder",
          tag: "Low-Level",
          desc: "A zero-dependency C++ decoder for JFIF/BMP binary streams, optimizing data ingestion for CNNs.",
          highlights: ["JFIF/BMP", "Binary streams", "CNN ingestion"],
        },
        {
          title: "Mechanical Bird (SOLIDWORKS)",
          tag: "Mechatronics",
          desc: "Kinematic synthesis of a kinetic prototype using gear trains and multi-bar linkages to simulate flight motion.",
          highlights: ["Kinematic synthesis", "Gear trains", "Linkages"],
        },
        {
          title: "Aircraft Model (SOLIDWORKS)",
          tag: "Mechanical",
          desc: "FEA analysis and assembly mating to optimize fuselage integrity under simulated aerodynamic stress.",
          highlights: ["FEA", "Assembly", "Aerodynamics"],
        },
        {
          title: "Blood Donor Database System",
          tag: "Systems",
          desc: "A normalized (3NF) relational database with optimized indexing for location-based compatibility matching.",
          highlights: ["3NF", "Indexing", "Matching"],
        },
      ],
    },
    hobbies: {
      label: "05 — Off-Screen",
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
      label: "06 — Contact",
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
      projects: "Projeler",
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
          body: "Kadir Has Üniversitesi'nde Bilgisayar Mühendisliği (GNO 3.96/4.00) ve Mekatronik Mühendisliği (GNO 4.00/4.00) çift ana dal — 2027 mezuniyeti.",
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
      label: "Eğitim",
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
      label: "Sertifikalar",
      title: "Çalışmanın kanıtı.",
      intro:
        "Mühendisliği destekleyen kurslar ve sertifikalar — derin öğrenmeden bilgisayar bilimi temellerine.",
      viewCredential: "Sertifikayı gör",
    },
    arsenal: {
      label: "02 — Teknik Cephanelik",
      title: "Sistemlerin ardındaki yığın.",
      intro:
        "Başvurduğum diller ve araçlar ile derinleştiğim mühendislik alanları.",
      focus: [
        {
          icon: "cpu",
          title: "Düşük Seviye Sistemler ve Derleyiciler",
          desc: "Sıfır bağımlılıklı C++ — sıfırdan bir sinir ağı ve CNN'leri besleyen bir JPEG/BMP ikili çözücü.",
        },
        {
          icon: "brain",
          title: "Derin Öğrenme",
          desc: "DINOv2 / ResNet ile sahne sınıflandırması ve PCGrad & SAM ile çok görevli optimizasyon.",
        },
        {
          icon: "gear",
          title: "Mekanik Tasarım",
          desc: "SOLIDWORKS modelleme, kinematik sentez ve gerçek mekanizmalarda FEA.",
        },
      ],
    },
    experience: {
      label: "03 — Deneyim",
      title: "İşin yapıldığı yerler.",
      intro: "Sanayi, ulusal araştırma ve sınıf.",
      items: [
        {
          role: "Uzun Dönem Stajyer — Algı Teknolojileri",
          org: "Ford Otosan",
          period: "Ağu 2025 — Şub 2026",
          desc: "DINOv2 / ResNet ile sahne sınıflandırması ve PCGrad ile SAM kullanarak çok görevli model optimizasyonu; otonom araçlar için çevresel farkındalık algoritmalarını yüksek doğrulukta algı metriklerine ayarladım.",
        },
        {
          role: "Proje Araştırmacısı",
          org: "TÜBİTAK",
          period: "Eyl 2025 — Şu an",
          desc: "Psikolojik kullanıcı desteği için geliştirilen yapay zekâ ajanı Motivbot'un tam yığın uygulama tasarımını yönetiyorum.",
        },
        {
          role: "Araştırma Görevlisi — Programlama I",
          org: "Kadir Has Üniversitesi",
          period: "Bahar '25 — Bahar '26",
          desc: "Lisans mühendislik öğrencilerine C programlama üzerine dersler ve teknik eğitimler.",
        },
      ],
    },
    projects: {
      label: "04 — Öne Çıkan Projeler",
      title: "İnşa ettiklerim.",
      intro:
        "Sıfırdan ML motorlarından kurumsal sistemlere ve fiziksel makinelere.",
      items: [
        {
          title: "BarkevGPT — Özel LLM Entegrasyonu",
          tag: "Yapay Zekâ · Mobil",
          desc: "Görev yönetimini otomatikleştiren, mobilde yerel olarak barındırılan, ajan tabanlı iş akışlarına sahip bir LLM ajanı.",
          highlights: ["Yerel LLM", "Ajan iş akışları", "Cihaz üstü"],
        },
        {
          title: "Sıfırdan C++ Sinir Ağı",
          tag: "Sistemler · ML",
          desc: "Görüntü sınıflandırması için yalnızca fstream ve iostream kullanan, sıfır bağımlılıklı bir C++ sinir ağı.",
          highlights: ["Sıfır bağımlılık", "C++", "Görüntü sınıflandırma"],
        },
        {
          title: "Düşük Seviye C++ JPEG ve Bitmap Çözücü",
          tag: "Düşük Seviye",
          desc: "JFIF/BMP ikili akışları için sıfır bağımlılıklı C++ çözücü; CNN'ler için veri alımını optimize eder.",
          highlights: ["JFIF/BMP", "İkili akışlar", "CNN beslemesi"],
        },
        {
          title: "Mekanik Kuş (SOLIDWORKS)",
          tag: "Mekatronik",
          desc: "Uçuş hareketini taklit etmek için dişli sistemleri ve çok kollu bağlantılarla kinetik bir prototipin kinematik sentezi.",
          highlights: ["Kinematik sentez", "Dişli sistemleri", "Bağlantılar"],
        },
        {
          title: "Uçak Modeli (SOLIDWORKS)",
          tag: "Mekanik",
          desc: "Simüle edilmiş aerodinamik yük altında gövde bütünlüğünü optimize etmek için FEA analizi ve montaj eşleştirme.",
          highlights: ["FEA", "Montaj", "Aerodinamik"],
        },
        {
          title: "Kan Bağışçısı Veritabanı Sistemi",
          tag: "Sistemler",
          desc: "Konum tabanlı uyumluluk eşleştirmesi için optimize indekslemeye sahip normalize (3NF) ilişkisel veritabanı.",
          highlights: ["3NF", "İndeksleme", "Eşleştirme"],
        },
      ],
    },
    hobbies: {
      label: "05 — Ekran Dışı",
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
      label: "06 — İletişim",
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
      projects: "Projekte",
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
          body: "Doppelstudium Informatik (NS 3,96/4,00) und Mechatronik (NS 4,00/4,00) an der Kadir Has Universität — Abschluss 2027.",
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
      label: "Ausbildung",
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
      label: "Zertifikate",
      title: "Beleg für die Arbeit.",
      intro:
        "Kurse und Nachweise, die das Ingenieurwesen untermauern — von Deep Learning bis zu den Grundlagen der Informatik.",
      viewCredential: "Zertifikat ansehen",
    },
    arsenal: {
      label: "02 — Technisches Arsenal",
      title: "Der Stack hinter den Systemen.",
      intro:
        "Sprachen und Werkzeuge, zu denen ich greife, und die Bereiche, in die ich eintauche.",
      focus: [
        {
          icon: "cpu",
          title: "Low-Level-Systeme & Compiler",
          desc: "Abhängigkeitsfreies C++ — ein von Grund auf gebautes neuronales Netz und ein JPEG/BMP-Binärdecoder für CNNs.",
        },
        {
          icon: "brain",
          title: "Deep Learning",
          desc: "Szenenklassifikation mit DINOv2 / ResNet und Multi-Task-Optimierung mit PCGrad & SAM.",
        },
        {
          icon: "gear",
          title: "Mechanische Konstruktion",
          desc: "SOLIDWORKS-Modellierung, kinematische Synthese und FEM an realen Mechanismen.",
        },
      ],
    },
    experience: {
      label: "03 — Erfahrung",
      title: "Wo die Arbeit entstand.",
      intro: "Industrie, nationale Forschung und der Hörsaal.",
      items: [
        {
          role: "Langzeit-Praktikant — Wahrnehmungstechnologien",
          org: "Ford Otosan",
          period: "Aug 2025 — Feb 2026",
          desc: "Szenenklassifikation mit DINOv2 / ResNet und Multi-Task-Modelloptimierung mit PCGrad und SAM; Abstimmung von Umgebungswahrnehmungs-Algorithmen für autonome Fahrzeuge auf hochpräzise Metriken.",
        },
        {
          role: "Projektforscher",
          org: "TÜBİTAK",
          period: "Sept 2025 — Heute",
          desc: "Leitung des Full-Stack-Anwendungsdesigns für Motivbot, einen KI-Agenten zur psychologischen Nutzerunterstützung.",
        },
        {
          role: "Tutor — Programmierung I",
          org: "Kadir Has Universität",
          period: "Frühjahr '25 — Frühjahr '26",
          desc: "Vorlesungen und technische Tutorien zur C-Programmierung für Ingenieurstudierende.",
        },
      ],
    },
    projects: {
      label: "04 — Ausgewählte Projekte",
      title: "Was ich gebaut habe.",
      intro:
        "Von selbstgebauten ML-Engines bis zu Unternehmenssystemen und physischen Maschinen.",
      items: [
        {
          title: "BarkevGPT — Eigene LLM-Integration",
          tag: "KI · Mobil",
          desc: "Ein lokal gehosteter LLM-Agent auf dem Smartphone mit agentischen Workflows zur Automatisierung des Aufgabenmanagements.",
          highlights: ["Lokales LLM", "Agentische Workflows", "On-Device"],
        },
        {
          title: "Neuronales Netz in C++ von Grund auf",
          tag: "Systeme · ML",
          desc: "Ein abhängigkeitsfreies neuronales Netz in C++, das nur fstream und iostream nutzt, zur Bildklassifikation.",
          highlights: ["Keine Abhängigkeiten", "C++", "Bildklassifikation"],
        },
        {
          title: "Low-Level C++ JPEG- & Bitmap-Decoder",
          tag: "Low-Level",
          desc: "Ein abhängigkeitsfreier C++-Decoder für JFIF/BMP-Binärströme, optimiert die Datenaufnahme für CNNs.",
          highlights: ["JFIF/BMP", "Binärströme", "CNN-Aufnahme"],
        },
        {
          title: "Mechanischer Vogel (SOLIDWORKS)",
          tag: "Mechatronik",
          desc: "Kinematische Synthese eines kinetischen Prototyps mit Zahnradgetrieben und Mehrgelenk-Gestängen zur Nachbildung der Flugbewegung.",
          highlights: ["Kinematische Synthese", "Zahnradgetriebe", "Gestänge"],
        },
        {
          title: "Flugzeugmodell (SOLIDWORKS)",
          tag: "Mechanik",
          desc: "FEM-Analyse und Baugruppenverknüpfung zur Optimierung der Rumpfintegrität unter simulierter aerodynamischer Last.",
          highlights: ["FEM", "Baugruppe", "Aerodynamik"],
        },
        {
          title: "Blutspender-Datenbanksystem",
          tag: "Systeme",
          desc: "Eine normalisierte (3NF) relationale Datenbank mit optimierter Indizierung für standortbasiertes Kompatibilitäts-Matching.",
          highlights: ["3NF", "Indizierung", "Matching"],
        },
      ],
    },
    hobbies: {
      label: "05 — Abseits des Bildschirms",
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
      label: "06 — Kontakt",
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
