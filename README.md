# Recruit Art - Modern AI recruitment platform

Recruit Art is a premium, AI-driven recruitment portal designed to bridge the gap between top talent and world-class companies. Featuring a sleek, minimalist design inspired by modern high-end web aesthetics.

## 🚀 Features

-   **Seamless Job Exploration**: Clean, filterable job listings with real-time "Match Rate" indicators.
-   **One-Click Applications**: Fast application process with support for PDF, Word, and Image-based resumes.
-   **Smart Profile Management**: Personal dashboards with application tracking and real-time status updates (Pending, Shortlisted, Hired, etc.).
-   **Mass Hiring Solutions**: Specialized inquiry portal for corporate clients to request bulk recruitment services.
-   **Omnichannel Notifications**: Real-time in-app notifications and automated WhatsApp updates via Meta API.
-   **Secure Authentication**: Multi-method login including WhatsApp OTP, Google OAuth, and traditional credentials.

## 🛠️ Tech Stack

### Frontend
-   **React** (Vite)
-   **Framer Motion** (Subtle micro-animations)
-   **Lucide React** (Iconography)
-   **Axios** (API Communications)
-   **Vanilla CSS** (Custom high-fidelity styling)

### Backend
-   **Django** (Python 3.12+)
-   **Django REST Framework** (API Layer)
-   **JWT** (Secure Authentication)
-   **PostgreSQL / SQLite** (Database)
-   **Twilio / Meta API** (WhatsApp Integrations)

## 📦 Installation & Setup

### Prerequisites
-   Python 3.12+
-   Node.js 18+
-   PostgreSQL (Optional, defaults to SQLite)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # venv\Scripts\activate   # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```bash
   DEBUG=True
   SECRET_KEY=your_secret_key
   # Add Twilio/Google/Meta keys as needed
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Usage
-   **Admin Access**: Reach the dashboard at `/admin` (Default superuser credentials required).
-   **User Portal**: Access via the root URL. Register a new account or use the provided login options.
-   **Job Management**: Admins can create jobs, set screening questions, and update application statuses which triggers real-time feedback to users.

---

Built with ❤️ by the Recruit Art Team.
