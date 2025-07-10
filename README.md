# Studious2025
## Project Structure
studious-project/
│
├── server/                 # Node.js backend
│   ├── controllers/        # Route handler logic
│   ├── models/             # Database models (SQL schema / ORM)
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware (e.g. auth, logger)
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration files (e.g. DB, environment)
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
│
├── public/                 # Static frontend files
│   ├── index.html          # Main HTML page
│   ├── js/                 # Client-side JavaScript
│   ├── css/                # Stylesheets
│   └── assets/             # Images, icons, etc.
│
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
