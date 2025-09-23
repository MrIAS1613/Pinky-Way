# Pinky-Way-
A community of pookies

Website
│
├── Frontend (User Side)
│   │
│   ├── index.html
│   │   ├── CSS (styling, themes, responsive)
│   │   └── JavaScript (main.js)
│   │       ├── Birthday logic
│   │       ├── Community messages logic
│   │       └── UI interactions (dark mode, cards, etc.)
│   │
│   └── Visible Components
│       ├── Homepage
│       │   ├── Member Cards
│       │   ├── Birthday Section
│       │   └── Upcoming Birthday
│       └── Social Links & Navigation
│
├── Backend (Server Side)
│   │
│   ├── API Endpoints
│   │   ├── /api/messages.js   (handles community messages)
│   │   └── /api/birthdays.js (handles birthday data)
│   │
│   └── Responsibilities
│       ├── Validate requests
│       ├── Fetch data (JSON / Google Sheets)
│       ├── Process dates (Bangladesh Time - UTC+6)
│       └── Send response to frontend
│
└── Data Storage
    │
    ├── JSON File
    │   ├── Member birthdays
    │   └── Member bios / avatars
    │
    └── Google Sheets
        ├── Community posts
        └── Other stored data
