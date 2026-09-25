export const PROFILE = {
  name: "Barkev Şarklı",
  email: "sarklibarkev@gmail.com",
  github: "https://github.com/barkevsarkli",
  linkedin: "https://linkedin.com/in/barkev-sarkli",
  location: "Istanbul, Turkey",
};

// Certificates & credentials. Kept language-neutral here (proper nouns aren't
// translated); only the section's heading/labels live in translations.js.
//
//   title    : the certificate / course name
//   issuer   : the organisation that awarded it
//   date     : year or "Mon YYYY"
//   category : short tag shown on the card ("AI / ML", "Data Science", ...)
//   url      : optional public credential link ("" hides the button)
//
// Ordered most-recent first.
export const CERTIFICATES = [
  {
    title: "Deep Learning with PyTorch",
    issuer: "IBM — Coursera",
    date: "Oct 2025",
    category: "AI / ML",
    url: "https://coursera.org/verify/69XG273IBXHX",
  },
  {
    title: "Introduction to Computer Vision and Image Processing",
    issuer: "IBM — Coursera",
    date: "2025",
    category: "Computer Vision",
    url: "",
  },
  {
    title: "Space Exploration",
    issuer: "Technical University of Munich (TUM) — Coursera",
    date: "Feb 2025",
    category: "Aerospace",
    url: "https://coursera.org/verify/VWZNYEEHQFCH",
  },
  {
    title: "SOLIDWORKS Professional Training",
    issuer: "TEKYAZ Yazılım",
    date: "Oct 2024",
    category: "CAD / Design",
    url: "",
  },
  {
    title: "Learn C++ Programming: Beginner to Advance – Deep Dive in C++",
    issuer: "Udemy",
    date: "2024",
    category: "Programming",
    url: "",
  },
  {
    title: "CS50's Introduction to Programming with R",
    issuer: "Harvard University — CS50",
    date: "2024",
    category: "Programming",
    url: "https://cs50.harvard.edu/certificates/95a45f20-26bf-4f01-8d47-339e929a0cb4",
  },
  {
    title: "Computer Science for Data Science",
    issuer: "HarvardX — edX (Professional Certificate)",
    date: "Sep 2024",
    category: "Data Science",
    url: "https://credentials.edx.org/credentials/7e3510c7a61344bdbd9f2a15a98407de/",
  },
  {
    title: "Data Science: Visualization (PH125.2x)",
    issuer: "HarvardX — edX",
    date: "May 2024",
    category: "Data Science",
    url: "https://courses.edx.org/certificates/497a87d8a584421e9de976b9b8f6040e",
  },
  {
    title: "Data Science: R Basics (PH125.1x)",
    issuer: "HarvardX — edX",
    date: "Feb 2024",
    category: "Data Science",
    url: "https://courses.edx.org/certificates/e842cb15617540aaabec544ec956c6cd",
  },
  {
    title: "CS50x: Introduction to Computer Science",
    issuer: "Harvard University — CS50",
    date: "2023",
    category: "Computer Science",
    url: "https://cs50.harvard.edu/certificates/7f185e4f-311e-44fe-ab9f-a860d3171326",
  },
  {
    title: "CS50's Introduction to Databases with SQL",
    issuer: "Harvard University — CS50",
    date: "2023",
    category: "Databases",
    url: "https://cs50.harvard.edu/certificates/082c5cfc-e6ad-4023-a51e-2d5e78de7bfa",
  },
];

// Grouped by domain. `key` maps to the translated group title in
// translations.js (arsenal.groups); the tool names themselves aren't translated.
export const STACK = [
  {
    key: "ml",
    items: ["PyTorch", "Hugging Face Transformers", "scikit-learn", "Ultralytics YOLO", "OpenCV", "NumPy", "Pandas"],
  },
  {
    key: "llm",
    items: ["OpenAI API", "Ollama", "llama.cpp / ggml", "LangChain", "crewAI", "n8n"],
  },
  {
    key: "languages",
    items: ["C", "C++", "Python", "Java", "Kotlin", "Swift", "R", "SQL", "Shell Scripting"],
  },
  {
    key: "systems",
    items: ["Boost (Asio / Beast)", "OpenSSL", "CUDA", "FastAPI / Flask", "Docker", "Git", "Linux (Ubuntu)"],
  },
  {
    key: "tools",
    items: ["SOLIDWORKS & Simulation (FEA)", "MATLAB / Simulink", "Azure", "MySQL", "Wireshark", "VS Code"],
  },
];
