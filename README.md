# Recruit Art

**Live Frontend Application:** [https://recruit-art.web.app](https://recruit-art.web.app)
**Live Backend API & Admin:** [https://recruit-art-backend.onrender.com/admin](https://recruit-art-backend.onrender.com/admin)

---

# 🚀 Features

- **Seamless Job Exploration**: Clean, filterable job listings with real-time "Match Rate" indicators from the live backend.
- **One-Click Applications**: Fast application process with support for PDF, Word, and Image-based resumes.
- **Dynamic Applicant Dashboard**: Personal dashboards with real-time application tracking and verified metrics (Open Positions, Applications Sent).
- **Mass Hiring Solutions**: Specialized inquiry portal for corporate clients to request bulk recruitment services.
- **Secure Authentication**: Multi-method login including JWT-based email/password and automated account activation.
- **Premium UI/UX**: High-fidelity design with Sage Green & Dark Minimalist aesthetic, fully responsive across all devices.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite-powered)
- **Framer Motion** (Subtle micro-animations for premium feel)
- **Lucide React** (Modern iconography)
- **Axios** (Centralized API service with JWT interceptors)
- **Vanilla CSS** (Custom high-fidelity modern styling)

### Backend
- **Django 6.0+** (Python 3.12+)
- **Django REST Framework** (Robust API Layer)
- **PostgreSQL** (Production-ready relational database)
- **SimpleJWT** (Secure stateless authentication)
- **WhiteNoise** (Efficient static file serving in production)

## 📦 Installation & Setup

### Prerequisites
-   Python 3.12+
-   Node.js 18+
-   Git

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file based on `.env.example`.
5. Run migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Start the development server: `npm run dev`

## 🌐 Production Deployment

### Production Considerations
- **Environment Variables**: Always set `DEBUG=False` and a unique `SECRET_KEY` in production.
- **Allowed Hosts**: Ensure `ALLOWED_HOSTS` includes your production domains.
- **Static Files**: Run `python manage.py collectstatic` (automated on platforms like Render).

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or Firebase Hosting.
- **Backend**: Render, Railway, or Heroku (using the included `render.yaml` if applicable).

---

Built with ❤️ by the Recruit Art Team.
