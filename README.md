# Studious2025

An AI-powered educational platform that provides personalized tutoring assistance for high school students across various subjects including Science, Mathematics, and more.

## 🌟 Features

- **AI-Powered Tutoring**: Leverages OpenAI's GPT models to provide intelligent, personalized tutoring responses
- **Multi-Subject Support**: Comprehensive coverage of subjects including:
  - Sciences (Physics, Chemistry, Biology, Environmental Science)
  - Mathematics (Algebra, Geometry, Calculus, Statistics)
  - And more subjects with customized teaching approaches
- **Interactive Learning**: 
  - Step-by-step explanations that build understanding
  - Practice problems with guided solutions
  - Suggested questions to help students get started
- **User Authentication**: Secure login system with session management
- **Responsive Design**: Works seamlessly across devices
- **Topic Organization**: Hierarchical subject structure with subtopics for easy navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ravick/Studious2025.git
cd Studious2025/Studious2025
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_PROJECT_ID=your_openai_project_id_here
PORT=3000
```

4. Start the server:
```bash
npm start
```

For development with environment variables:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
Studious2025/
│
├── server/                 # Node.js backend
│   ├── api/               # Controller logic
│   │   ├── authController.js     # User authentication
│   │   ├── homeController.js     # Home page logic
│   │   ├── simpleAiController.js # AI integration
│   │   └── topicsController.js   # Topics management
│   ├── config/            # Configuration files
│   │   ├── db.js          # SQLite database setup
│   │   ├── topics.json    # Subject topics configuration
│   │   └── users.db       # SQLite database file
│   ├── middleware/        # Custom middleware
│   │   └── authMiddleware.js     # Authentication checks
│   ├── routes/            # Express routes
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── homeRoutes.js         # Home endpoints
│   │   └── topicsRoutes.js       # Topics endpoints
│   └── server.js          # Server entry point
│
├── client/                # Static frontend files
│   ├── index.html         # Landing page
│   ├── home.html          # Main application page
│   ├── signup.html        # Registration/login page
│   ├── about.html         # About page
│   ├── navbar.html        # Navigation component
│   ├── js/                # Client-side JavaScript
│   │   ├── home.js        # Home page functionality
│   │   ├── signup.js      # Auth functionality
│   │   ├── navbar.js      # Navigation logic
│   │   └── common.js      # Shared utilities
│   ├── css/               # Stylesheets
│   │   ├── style.css      # Main styles
│   │   ├── index.css      # Landing page styles
│   │   ├── signup.css     # Auth page styles
│   │   └── navbar.css     # Navigation styles
│   └── assets/            # Images and icons
│
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── CLAUDE.md             # Claude AI development guide
└── README.md             # This file
```

## 🔧 Configuration

### Topics Configuration
The subjects and their teaching approaches are configured in `server/config/topics.json`. Each subject includes:
- Custom prompt prefixes for tailored AI responses
- Suggested questions to help students
- Hierarchical organization (topics → subtopics)

### Database
- Uses SQLite for user authentication
- Database file is automatically created on first run
- User passwords are securely hashed with bcrypt

## 🛡️ Security

- Session-based authentication
- Password hashing with bcrypt
- Protected API endpoints with authentication middleware
- Environment variables for sensitive configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🚀 Deployment

### Azure App Service
The application is configured for deployment on Azure App Service. The PORT environment variable is automatically set by Azure.

### Environment Variables
Required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_PROJECT_ID`: Your OpenAI project ID
- `PORT`: Server port (optional, defaults to 3000)
